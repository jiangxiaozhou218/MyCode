//
//  AssessMemberListViewController.m
//  medical
//
//  Created by Jiangxz on 2018/7/5.
//  Copyright © 2018年 Ruobilin. All rights reserved.
//

#import "M_AssessMemberListViewController.h"
#import "AssessMemberModel.h"
#import "AssessMemberListCell.h"
#import "AssessViewModel.h"

@interface M_AssessMemberListViewController ()
/**  */
@property (nonatomic,strong) NSMutableArray *roomMemberList;
/** id */
@property (nonatomic,copy) NSString *assessId;
@property (nonatomic,copy) NSString *batchId;
@property (nonatomic,assign) NSInteger assessType;

@property (nonatomic,strong)NSMutableArray *sectionTitles;

@end

@implementation M_AssessMemberListViewController

# pragma mark 系统方法
- (void)viewDidLoad {
    [super viewDidLoad];
    [self setup];
}


#pragma mark-界面初始化
- (void)setup{
    [self setupView];
    [self requestData];
}

- (void)setupView{
    self.assessId = self.params[Key_Id];
    self.assessType = [self.params[Key_Type] integerValue];
    self.batchId = self.params[Key_ProjectId];
    self.title = @"人员明细";
    [self setupTableView];
}

- (void)setupTableView{
    self.tableView.mj_header = [self getMJRefreshGifHeader:@selector(refreshData)];
    self.tableView.separatorStyle = UITableViewCellSeparatorStyleSingleLine;
    self.tableView.contentInset = UIEdgeInsetsMake(NAVBAR_HEIGHT, 0, 30, 0);
}



- (void)requestData{
    __weak __typeof(self)weakSelf = self;
    NSMutableDictionary *dict = [[NSMutableDictionary alloc]init];
    [dict setValue:self.assessId forKey:@"AssessId"];
    [dict setValue:@(0) forKey:Key_From];
    [dict setValue:@(1000) forKey:Key_Count];
    [[AssessViewModel sharedAssessViewModel] getAssessUserListByCondition:dict succ:^(id data) {
        [[NSOperationQueue mainQueue]addOperationWithBlock:^{
            weakSelf.tableView.mj_footer.hidden = NO;
            [weakSelf.tableView.mj_header endRefreshing];
            [weakSelf tranformData:data];
            [weakSelf refreshView];
        }] ;
        
    } fail:^(NSString *msg, NSInteger code) {
        [TipsTool showTipsMessage:msg];
        [weakSelf.tableView.mj_header endRefreshing];
        
    }];
}

- (void)tranformData:(NSArray *)arr {
    //建立索引的分组
    NSMutableArray *titleArr = [[NSMutableArray alloc] init];
    for (AssessMemberModel *obj in arr) {
        BOOL ret = NO;
        for (NSString *dateStr in titleArr) {
            if ([dateStr isEqualToString:obj.startDate]) {
                ret = YES;
                break;
            }
        }
        if (!ret) {
            [titleArr addObject:obj.startDate];
        }
    }
    NSArray *sortedTitleArr = [titleArr sortedArrayUsingComparator:^NSComparisonResult(id  _Nonnull obj1, id  _Nonnull obj2) {
        return [obj1 compare:obj2];
    }];
    self.sectionTitles = [sortedTitleArr mutableCopy];
    //
    NSInteger highSection = [self.sectionTitles count];
    NSMutableArray *sortedArray = [NSMutableArray arrayWithCapacity:highSection];
    for (int i = 0; i < highSection; i++) {
        NSMutableArray *sectionArray = [NSMutableArray arrayWithCapacity:1];
        [sortedArray addObject:sectionArray];
    }
    //按首字母分组
    for (AssessMemberModel *member in arr) {
        __block long index = 0;
        [self.sectionTitles enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
            if ([obj isEqualToString:member.startDate]) {
                index = idx;
                *stop = YES;
            }
        }];
        NSMutableArray *array = [sortedArray objectAtIndex:index];
        [array addObject:member];
    }
    //    每个section内的数组排序
    UILocalizedIndexedCollation *indexCollation = [UILocalizedIndexedCollation currentCollation];
    if(self.assessType == 2){
        for (int i = 0; i < [sortedArray count]; i++) {
            NSArray *array = [indexCollation sortedArrayFromArray:[sortedArray objectAtIndex:i] collationStringSelector:@selector(userName)];
            [sortedArray replaceObjectAtIndex:i withObject:[NSMutableArray arrayWithArray:array]];
        }
    }
    self.dataSource = [sortedArray mutableCopy];
}

/**
 下拉刷新方法
 */
- (void)refreshData {
    [self requestData];
}


- (void)refreshView{
    [self.tableView reloadData];
}


/**
 分组数
 */
- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView{
    return self.dataSource.count;
}

/**
 每组行数
 */
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    NSArray *array = self.dataSource[section];
    return array.count;
}

- (NSString *)tableView:(UITableView *)tableView titleForHeaderInSection:(NSInteger)section{
    NSDate *date = [[AssessMemberModel new] secondConvertToNSDate:self.sectionTitles[section]];
    NSString *startDateString = [date DateToString:@"yyyy-MM-dd HH:mm"];
    NSString *titleString = [NSString stringWithFormat:@"  %@",startDateString];
    return titleString;
}

/**
 每组header高度
 */
- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section{
    return 35.f;
}

/**
 每组footer高度
 */

- (CGFloat)tableView:(UITableView *)tableView heightForFooterInSection:(NSInteger)section{
    return 0.1f;
}

/**
 每行的高度
 */
- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    AssessMemberModel *model = self.dataSource[indexPath.section][indexPath.row];
    return model.cellHeight;
}

/**
 设置数据
 */
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    AssessMemberListCell *cell = [tableView dequeueReusableCellWithIdentifier:kAssessMemberListCellReuse];
    if (!cell) {
        cell = [[AssessMemberListCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:kAssessMemberListCellReuse];
    }
    cell.assessType = self.assessType;
    AssessMemberModel *model = self.dataSource[indexPath.section][indexPath.row];
    cell.model = model;
    return cell;
}


/**
 *  选中某行cell
 */
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    AssessMemberModel *model = self.dataSource[indexPath.section][indexPath.row];
    NSMutableDictionary *dict = [[NSMutableDictionary alloc]init];
    if (self.batchId.length > 0) {
        [dict setValue:model.userId forKey:keyM_UserId];
        [dict setValue:self.batchId forKey:key_TraineeId];
        [self pushTableVC:kM_TraineeInfo style:UITableViewStyleGrouped params:dict block:nil];
    }else{
        [dict setValue:model.userId forKey:keyM_UserId];
        [self pushTableVC:kMine_UserInfo style:UITableViewStyleGrouped params:dict block:nil];
    }
}


- (NSMutableArray<RUserModel *> *)roomMemberList {
    if (!_roomMemberList) {
        _roomMemberList = [[NSMutableArray alloc]init];
    }
    return _roomMemberList;
}

@end

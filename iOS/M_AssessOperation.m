//
//  M_AssessOperation.m
//  medical
//
//  Created by Jiangxz on 2018/6/21.
//  Copyright © 2018年 Ruobilin. All rights reserved.
//

#import "M_AssessOperation.h"
#import "M_AssessService.h"
#import "AssessModel.h"
#import "AssessOperationModel.h"
#import "AssessMemberModel.h"
#import "AssessCheckOperationModel.h"

@implementation M_AssessOperation
DEFINE_SINGLETON_FOR_CLASS(M_AssessOperation)

/**
 *  获取考核
 */
- (void)getAssessByCondition:(NSDictionary *)condition succ:(RSuccData)succ fail:(RFail)fail {
    [[M_AssessService shareInstance] getAssessByCondition:condition succ:^(id data) {
        NSMutableArray *mArray = [[NSMutableArray alloc] init];
        for (NSDictionary *dict in data) {
            AssessModel *model = [[AssessModel alloc] initWithDict:dict];
            [mArray addObject:model];
        }
        if (succ) {
            succ(mArray);
        }
    } fail:fail];
}

/**
 *  获取考核分数
 */
- (void)getAssessMemberScoreByCondition:(NSDictionary *)condition succ:(RSuccData)succ fail:(RFail)fail {
    [[M_AssessService shareInstance] getAssessMemberScoreByCondition:condition succ:^(id data) {
        NSMutableArray *mArray = [[NSMutableArray alloc] init];
        for (NSDictionary *dict in data) {
            AssessMemberModel *model = [[AssessMemberModel alloc] initWithDict:dict];
            [mArray addObject:model];
        }
        if (succ) {
            succ(mArray);
        }
    } fail:fail];
}

/**
 *  获取考核项目
 */
- (void)getAssessProjectByCondition:(NSDictionary *)condition succ:(RSuccData)succ fail:(RFail)fail {
    [[M_AssessService shareInstance] getAssessProjectByCondition:condition succ:^(id data) {
        NSMutableArray *mArray = [[NSMutableArray alloc] init];
        for (NSDictionary *dict in data) {
            AssessCheckOperationModel *model = [[AssessCheckOperationModel alloc] initWithDict:dict];
            [mArray addObject:model];
        }
        if (succ) {
            succ(mArray);
        }
    } fail:fail];
}

/**
 *  获取考核项目明细
 */
- (void)getAssessProjectDetail:(NSString *)assessProjectId condition:(NSDictionary *)condition succ:(RSuccData)succ fail:(RFail)fail {
    [[M_AssessService shareInstance] getAssessProjectDetail:assessProjectId condition:condition succ:^(id data) {
        NSMutableArray *mArray = [[NSMutableArray alloc] init];
        for (NSDictionary *dict in data) {
            AssessCheckOperationModel *model = [[AssessCheckOperationModel alloc] initWithDict:dict];
            [mArray addObject:model];
        }
        if (succ) {
            succ(mArray);
        }
    } fail:fail];
}

/**
 *  设置考核结果
 */
- (void)setAssessUserScore:(NSString *)assessId userId:(NSString *)userId assessProjectId:(NSString *)assessProjectId entities:(NSDictionary *)entities succ:(RSuccData)succ fail:(RFail)fail {
    [[M_AssessService shareInstance] setAssessUserScore:assessId userId:userId assessProjectId:assessProjectId entities:entities succ:^(id data) {
        if (succ) {
            succ(data);
        }
    } fail:fail];
}

/**
 *  获取考核信息
 */
- (void)getAssessUserScore:(NSString *)assessId condition:(NSDictionary *)condition succ:(RSuccData)succ fail:(RFail)fail {
    [[M_AssessService shareInstance] getAssessUserScore:assessId condition:condition succ:^(id data) {
        NSMutableArray *mArray = [[NSMutableArray alloc] init];
        for (NSDictionary *dict in data) {
            AssessOperationModel *model = [[AssessOperationModel alloc] initWithDict:dict];
            [mArray addObject:model];
        }
        if (succ) {
            succ(mArray);
        }
    } fail:fail];
}

/**
 获取考核人员明细
 */
- (void)getAssessUserListByCondition:(NSDictionary *)condition succ:(RSuccData)succ fail:(RFail)fail{
    [[M_AssessService shareInstance] getAssessUserListByCondition:condition succ:^(id data) {
        NSMutableArray *mArray = [[NSMutableArray alloc] init];
        for (NSDictionary *dict in data) {
            AssessMemberModel *model = [[AssessMemberModel alloc] initWithDict:dict];
            [mArray addObject:model];
        }
        if (succ) {
            succ(mArray);
        }
    } fail:fail];
}

- (void)getAssessMemberByCondition:(NSDictionary *)condition succ:(RSuccData)succ fail:(RFail)fail{
    [[M_AssessService shareInstance] getAssessMemberByCondition:condition succ:^(id data) {
//        NSMutableArray *mArray = [[NSMutableArray alloc] init];
//        for (NSDictionary *dict in data) {
//            AssessMemberModel *model = [[AssessMemberModel alloc] initWithDict:dict];
//            [mArray addObject:model];
//        }
        NSMutableArray *mArray = [[NSMutableArray alloc] init];
        for (NSDictionary *dict in data) {
            TrainingUserModel *model = [[TrainingUserModel alloc] initWithDict:dict];
            [mArray addObject:model];
        }
        if (succ) {
            succ(mArray);
        }
    } fail:fail];
}

- (void)assessSignUp:(NSDictionary *)condition succ:(RSuccData)succ fail:(RFail)fail{
    [[M_AssessService shareInstance] assessSignUp:condition succ:^(id data) {
        if (succ) {
            succ(data);
        }
    } fail:fail];
}

- (void)cancelAssessSignUp:(NSDictionary *)condition succ:(RSuccData)succ fail:(RFail)fail{
    [[M_AssessService shareInstance] cancelAssessSignUp:condition succ:^(id data) {
        if (succ) {
            succ(data);
        }
    } fail:fail];
}

- (void)deleteAssess:(NSString *)assessId succ:(RSuccData)succ fail:(RFail)fail{
    [[M_AssessService shareInstance] deleteAssess:assessId succ:^(id data) {
        if (succ) {
            succ(data);
        }
    } fail:fail];
}

- (void)addClinicalAssess:(NSDictionary *)row succ:(RSuccData)succ fail:(RFail)fail{
    [[M_AssessService shareInstance] addClinicalAssess:row succ:^(id data) {
        NSMutableArray *mArray = [[NSMutableArray alloc] init];
        for (NSDictionary *dict in data) {
            AssessModel *model = [[AssessModel alloc] initWithDict:dict];
            [mArray addObject:model];
        }
        if (succ) {
            succ(mArray);
        }
    } fail:fail];
}

@end

//
//  AssessMemberListCell.m
//  medical
//
//  Created by Jiangxz on 2018/7/5.
//  Copyright © 2018年 Ruobilin. All rights reserved.
//

#import "AssessMemberListCell.h"

@interface AssessMemberListCell()
/** 名称 */
@property (nonatomic,strong) UILabel *nameLabel;
/** 时间 */
@property (nonatomic,strong) UILabel *addressLabel;
/** 头像 */
@property (nonatomic,strong) UIImageView *headerImageView;
/** 分数 */
@property (nonatomic,strong) UILabel *descLabel;

@end

@implementation AssessMemberListCell
- (void)setup{
    self.backgroundColor = [UIColor whiteColor];
    self.selectionStyle = UITableViewCellSelectionStyleNone;
}

- (void)setAssessType:(NSInteger)assessType{
    _assessType = assessType;
}

- (void)setModel:(AssessMemberModel *)model{
    _model = model;
    NSString *str = model.userName;
    if (model.departmentName.length > 0) {
        str = [RUtils jointNameAndDepartmentName:model.userName departmentName:model.departmentName];;
    }
    self.nameLabel.text = str;
    if ( self.assessType == 1 ) {
        self.addressLabel.text = model.address;
    }else if(self.assessType == 2){
        self.addressLabel.text = [self getTimeString];
    }else if(self.assessType == 3){
        self.addressLabel.text = model.testCenterName;
        if (self.addressLabel.text.length <= 0) {
            self.nameLabel.height = model.cellHeight;
        }else{
            self.nameLabel.height = 40.f;
        }
        if (model.state == 1) {
            NSString *desc = [NSString stringWithFormat:@"%.6g分",model.score];
            self.descLabel.text = desc;
            self.descLabel.height = model.cellHeight;
            self.descLabel.font = [UIFont italicSystemFontOfSize:kMainFont17];
        }else if (model.state == 3) {
            self.descLabel.font = [UIFont italicSystemFontOfSize:kMainFont14];
            self.descLabel.text = @"已打分";
        }else{
            _descLabel.text = @"";
        }
    }
    [self.headerImageView sd_setImageWithURL:[NSURL URLWithString:[model.faceImage thumbFaceImageURL]] placeholderImage:[UIImage imageNamed:@"mine_default_face"]];
}

- (NSString *)getTimeString {
    NSString *str = @"";
    NSDate *startDate = [self.model secondConvertToNSDate:self.model.startDate];
    NSString *startStr = [startDate DateToString:@"yyyy-MM-dd HH:mm"];
    //
    NSDate *endDate = [self.model secondConvertToNSDate:self.model.endDate];
    NSString *endStr = [endDate DateToString:@"HH:mm"];
    str = [NSString stringWithFormat:@"%@ ~ %@",startStr,endStr];
    return str;
}

# pragma mark 懒加载
- (UIImageView *)headerImageView {
    if (!_headerImageView) {
        _headerImageView = [[UIImageView alloc] initWithFrame:CGRectMake(kMainMargin, 25/2, kMainFaceImageHeight, kMainFaceImageHeight)];
        [self.contentView addSubview:_headerImageView];
        _headerImageView.layer.cornerRadius = kMainFaceImageHeight/2;
        _headerImageView.layer.masksToBounds = YES;
    }
    return _headerImageView;
}

- (UILabel *)nameLabel {
    if (!_nameLabel) {
        _nameLabel = [[UILabel alloc] initWithFrame:CGRectMake(60, 5, SCREEN_WIDTH - 60 - 10 - 55, 25)];
        _nameLabel.font = [UIFont systemFontOfSize:kMainFont16];
        _nameLabel.textColor = RGBACOLOR(77, 77, 77, 1);
//        _nameLabel.backgroundColor = [RUtils randomColor];
        [self.contentView addSubview:_nameLabel];
    }
    return _nameLabel;
}

- (UILabel *)addressLabel{
    if (!_addressLabel) {
        _addressLabel = [[UILabel alloc] initWithFrame:CGRectMake(60,self.nameLabel.bottom+5,SCREEN_WIDTH - 60 - 10 - 55, 25)];
        _addressLabel.font = [UIFont systemFontOfSize:kMainContentFontSize];
        _addressLabel.textColor = kMainGrayFontColor;
        [self.contentView addSubview:_addressLabel];
    }
    return _addressLabel;
}

- (UILabel *)descLabel {
    if (!_descLabel) {
        _descLabel = [[UILabel alloc] initWithFrame:CGRectMake(SCREEN_WIDTH - 55-10,0, 55, 65)];
        _descLabel.font = [UIFont italicSystemFontOfSize:kMainFont17];
        _descLabel.textColor = kMainBlueFontColor;
//        _descLabel.backgroundColor = [RUtils randomColor];
        _descLabel.textAlignment = NSTextAlignmentRight;
        [self.contentView addSubview:_descLabel];
    }
    return _descLabel;
}
@end

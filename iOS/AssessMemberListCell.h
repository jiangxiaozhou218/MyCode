//
//  AssessMemberListCell.h
//  medical
//
//  Created by Jiangxz on 2018/7/5.
//  Copyright © 2018年 Ruobilin. All rights reserved.
//

#import "BaseCell.h"
#import "AssessMemberModel.h"

#define kAssessMemberListCellReuse  @"AssessMemberListCellReuse"

@interface AssessMemberListCell : BaseCell

/** 考核人员模型 */
@property (nonatomic,strong) AssessMemberModel *model;

@property (nonatomic,assign) NSInteger assessType;

@end

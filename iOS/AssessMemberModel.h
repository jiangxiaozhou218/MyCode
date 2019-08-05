//
//  AssessMemberModel.h
//  medical
//
//  Created by Jiangxz on 2018/7/5.
//  Copyright © 2018年 Ruobilin. All rights reserved.
//

#import "BaseModel.h"

@interface AssessMemberModel : BaseModel


//头像
@property (nonatomic,copy) NSString *faceImage;
@property (nonatomic,copy) NSString *userId;

@property (nonatomic,copy) NSString *assessId;
//
@property (nonatomic,copy) NSString *departmentId;

@property (nonatomic,assign) float score;
//
@property (nonatomic,assign) NSInteger AssessCount;

@property (nonatomic,copy) NSString *address;

@property (nonatomic,copy) NSString *departmentName;

@property (nonatomic,copy) NSString *startDate;
@property (nonatomic,copy) NSString *endDate;
@property (nonatomic,copy) NSString *userName;

@property (nonatomic,copy) NSString *createDate;

@property (nonatomic,copy) NSString *modelId;

//
@property (nonatomic,copy) NSString *assessProjectId;
@property (nonatomic,copy) NSString *assessProjectName;
@property (nonatomic,copy) NSString *testCenterName;

@property (nonatomic,assign) NSInteger groupItemIndex;//分组顺序号
@property (nonatomic,assign) NSInteger state; //0 未考过，1 考过。
@property (nonatomic,assign) NSInteger itemIndex; //顺序号
@property (nonatomic,assign) NSInteger isScore; //0 不能打分，1 可以打分。


@end

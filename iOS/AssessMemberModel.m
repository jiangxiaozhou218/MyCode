//
//  AssessMemberModel.m
//  medical
//
//  Created by Jiangxz on 2018/7/5.
//  Copyright © 2018年 Ruobilin. All rights reserved.
//

#import "AssessMemberModel.h"

@implementation AssessMemberModel
@synthesize modelId = Id;
@synthesize departmentName;

-(void)setup{
    [super setup];
    //
}
- (float)cellHeight {
    return 65.0f;
}


@end

//
//  AssessViewModel.m
//  medical
//
//  Created by Jiangxz on 2018/6/21.
//  Copyright © 2018年 Ruobilin. All rights reserved.
//

#import "AssessViewModel.h"
#import "M_AssessOperation.h"

@implementation AssessViewModel
DEFINE_SINGLETON_FOR_CLASS(AssessViewModel)

/**
 *  获取考核项目
 */
- (void)getAssessByCondition:(NSDictionary *)condition succ:(RSuccData)succ fail:(RFail)fail {
    [[M_AssessOperation sharedM_AssessOperation] getAssessByCondition:condition succ:^(id data) {
        if (succ) {
            succ(data);
        }
    } fail:fail];
}



/**
 *  获取考核分数
 */
- (void)getAssessMemberScoreByCondition:(NSDictionary *)condition succ:(RSuccData)succ fail:(RFail)fail {
    [[M_AssessOperation sharedM_AssessOperation] getAssessMemberScoreByCondition:condition succ:^(id data) {
        if (succ) {
            succ(data);
        }
    } fail:fail];
}

- (void)getAssessProjectByCondition:(NSDictionary *)condition succ:(RSuccData)succ fail:(RFail)fail{
    [[M_AssessOperation sharedM_AssessOperation]getAssessProjectByCondition:condition succ:^(id data) {
        if (succ) {
            succ(data);
        }
    } fail:fail];
}

/**
 *  获取考核项目明细
 */
- (void)getAssessProjectDetail:(NSString *)assessProjectId condition:(NSDictionary *)condition succ:(RSuccData)succ fail:(RFail)fail {
    [[M_AssessOperation sharedM_AssessOperation] getAssessProjectDetail:assessProjectId condition:condition succ:^(id data) {
        if (succ) {
            succ(data);
        }
    } fail:fail];
}

/**
 *  设置考核结果
 */
- (void)setAssessUserScore:(NSString *)assessId userId:(NSString *)userId assessProjectId:(NSString *)assessProjectId rows:(NSMutableArray *)rows succ:(RSuccData)succ fail:(RFail)fail {
    NSDictionary *entities = [RUtils createEntities:rows entityName:@"AssessOperationEntities"];
    [[M_AssessOperation sharedM_AssessOperation] setAssessUserScore:assessId userId:userId assessProjectId:assessProjectId entities:entities succ:^(id data) {
        if (succ) {
            succ(data);
        }
    } fail:fail];
}

/**
 *  获取考核信息
 */
- (void)getAssessUserScore:(NSString *)assessId condition:(NSDictionary *)condition succ:(RSuccData)succ fail:(RFail)fail {
    [[M_AssessOperation sharedM_AssessOperation] getAssessUserScore:assessId condition:condition succ:^(id data) {
        if (succ) {
            succ(data);
        }
    } fail:fail];
}

/**
 获取考核人员明细
 */
- (void)getAssessUserListByCondition:(NSDictionary *)condition succ:(RSuccData)succ fail:(RFail)fail{
    [[M_AssessOperation sharedM_AssessOperation] getAssessUserListByCondition:condition succ:^(id data) {
        if (succ) {
            succ(data);
        }
    } fail:fail];
}


- (void)getAssessMemberByCondition:(NSDictionary *)condition succ:(RSuccData)succ fail:(RFail)fail{
    [[M_AssessOperation sharedM_AssessOperation] getAssessMemberByCondition:condition succ:^(id data) {
        if (succ) {
            succ(data);
        }
    } fail:fail];
}

- (void)assessSignUp:(NSDictionary *)condition succ:(RSuccData)succ fail:(RFail)fail{
    [[M_AssessOperation sharedM_AssessOperation] assessSignUp:condition succ:^(id data) {
        if (succ) {
            succ(data);
        }
    } fail:fail];
}

- (void)cancelAssessSignUp:(NSDictionary *)condition succ:(RSuccData)succ fail:(RFail)fail{
    [[M_AssessOperation sharedM_AssessOperation] cancelAssessSignUp:condition succ:^(id data) {
        if (succ) {
            succ(data);
        }
    } fail:fail];
}

- (void)deleteAssess:(NSString *)assessId succ:(RSuccData)succ fail:(RFail)fail{
    [[M_AssessOperation sharedM_AssessOperation] deleteAssess:assessId succ:^(id data) {
        if (succ) {
            succ(data);
        }
    } fail:fail];
}

- (void)addClinicalAssess:(NSDictionary *)row succ:(RSuccData)succ fail:(RFail)fail{
    [[M_AssessOperation sharedM_AssessOperation] addClinicalAssess:row succ:^(id data) {
        if (succ) {
            succ(data);
        }
    } fail:fail];
}
@end

//
//  AssessViewModel.h
//  medical
//
//  Created by Jiangxz on 2018/6/21.
//  Copyright © 2018年 Ruobilin. All rights reserved.
//

#import "BaseViewModel.h"

@interface AssessViewModel : BaseViewModel
DEFINE_SINGLETON_FOR_HEADER(AssessViewModel)

/**
 *  获取考核项目
 */
- (void)getAssessByCondition:(NSDictionary *)condition succ:(RSuccData)succ fail:(RFail)fail;

/**
 获取考核分数
 */
- (void)getAssessMemberScoreByCondition:(NSDictionary *)condition succ:(RSuccData)succ fail:(RFail)fail;

/**
 * 删除考核
 */
- (void)deleteAssess:(NSString *)assessId succ:(RSuccData)succ fail:(RFail)fail;

/**
 *  获取考核项目
 */
- (void)getAssessProjectByCondition:(NSDictionary *)condition succ:(RSuccData)succ fail:(RFail)fail;

/**
 *  获取考核项目明细
 */
- (void)getAssessProjectDetail:(NSString *)assessProjectId condition:(NSDictionary *)condition succ:(RSuccData)succ fail:(RFail)fail;

/**
 *  设置考核结果
 */
- (void)setAssessUserScore:(NSString *)assessId userId:(NSString *)userId assessProjectId:(NSString *)assessProjectId rows:(NSMutableArray *)rows succ:(RSuccData)succ fail:(RFail)fail;

/**
 *  获取考核信息
 */
- (void)getAssessUserScore:(NSString *)assessId condition:(NSDictionary *)condition succ:(RSuccData)succ fail:(RFail)fail;


/**
 *  获取考核人员明细
 */
- (void)getAssessUserListByCondition:(NSDictionary *)condition succ:(RSuccData)succ fail:(RFail)fail;

/**
 * 获取可报名人员
 */
- (void)getAssessMemberByCondition:(NSDictionary *)condition succ:(RSuccData)succ fail:(RFail)fail;

/**
 * 报名
 */
- (void)assessSignUp:(NSDictionary *)condition succ:(RSuccData)succ fail:(RFail)fail;

/**
 * 取消报名
 */
- (void)cancelAssessSignUp:(NSDictionary *)condition succ:(RSuccData)succ fail:(RFail)fail;

/**
 *  增加临床考核
 */
- (void)addClinicalAssess:(NSDictionary *)row succ:(RSuccData)succ fail:(RFail)fail;
@end

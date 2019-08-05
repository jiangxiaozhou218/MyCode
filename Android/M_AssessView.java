package com.ruobilin.medical.company.view;

import com.ruobilin.bedrock.common.base.BaseView;
import com.ruobilin.bedrock.common.data.BaseInfo;
import com.ruobilin.medical.common.data.AssessUserScoreInfo;
import com.ruobilin.medical.common.data.M_AssessInfo;
import com.ruobilin.medical.common.data.M_AssessMemberInfo;
import com.ruobilin.medical.common.data.M_AssessProjectDetailInfo;
import com.ruobilin.medical.common.data.M_AssessProjectInfo;
import com.ruobilin.medical.common.data.ScoreInfo;

import java.util.ArrayList;
import java.util.List;

/**
 * 类名 M_AssessView
 * Jiangxz
 * 主要功能：考核
 * 2018/6/21
 * Copyright  2018 Ruobilin. All Rights Reserved
 * 修改者，修改日期，修改内容。
 */


public interface M_AssessView extends BaseView {
    void onGetAssessListSuccess(List<M_AssessInfo> m_assessInfos);

    void onGetAssessProjectDetailInfosSuccess(List<M_AssessProjectDetailInfo> m_assessProjectDetailInfos);

    void onSetAssessUserScoreSuccess();

    void getAssessUserScoreSuccess(List<AssessUserScoreInfo> assessUserScoreInfos);

    void onGetAssessMemberLisSuccess(List<M_AssessMemberInfo> m_assessMemberInfos);

    void onGetAssessMemberScoreLisSuccess(ArrayList<ScoreInfo> scoreInfos);

    void getAssessMemberByConditionList(List<M_AssessMemberInfo> m_assessMemberInfos);

    void assessSignUp();

    void cancelAssessSignUp();

    public void onGetAssessProjectInfosSuccess(List<M_AssessProjectInfo> m_assessProjectDetailInfos) ;
}

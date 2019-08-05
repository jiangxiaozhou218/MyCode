package com.ruobilin.medical.company.presenter;

import com.ruobilin.bedrock.common.base.BasePresenter;
import com.ruobilin.bedrock.common.data.BaseInfo;
import com.ruobilin.medical.common.data.AssessUserScoreInfo;
import com.ruobilin.medical.common.data.M_AssessInfo;
import com.ruobilin.medical.common.data.M_AssessMemberInfo;
import com.ruobilin.medical.common.data.M_AssessProjectDetailInfo;
import com.ruobilin.medical.common.data.M_AssessProjectInfo;
import com.ruobilin.medical.common.data.ScoreInfo;
import com.ruobilin.medical.company.listener.M_AssessListener;
import com.ruobilin.medical.company.model.M_AssessModel;
import com.ruobilin.medical.company.model.M_AssessModelImpl;
import com.ruobilin.medical.company.view.M_AssessView;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * 类名  M_AssessPresenter
 * Jiangxz
 * 主要功能：
 * 2018/6/21
 * Copyright  2018 Ruobilin. All Rights Reserved
 * 修改者，修改日期，修改内容。
 */


public class M_AssessPresenter extends BasePresenter implements M_AssessListener {
    private M_AssessModel m_assessModel;
    private M_AssessView m_assessView;

    public M_AssessPresenter(M_AssessView baseView) {
        super(baseView);
        m_assessModel = new M_AssessModelImpl();
        m_assessView = baseView;
    }

    public void getAssessByCondition(JSONObject condition) {
        m_assessModel.getAssessByCondition(condition, this);
    }

    public void getAssessMemberScoreByCondition(JSONObject condition) {
        m_assessModel.getAssessMemberScoreByCondition(condition, this);
    }

    public void getAssessUserScore(String assessId, JSONObject condition) {
        m_assessModel.getAssessUserScore(assessId, condition, this);
    }
    public void getAssessProjectByCondition(JSONObject condition){
        m_assessModel.getAssessProjectByCondition(condition,this);
    }
    public void getAssessProjectDetail(String assessProjectId, JSONObject condition) {
        m_assessModel.getAssessProjectDetail(assessProjectId, condition, this);
    }

    public void setAssessUserScore(String assessId, String userId, String assessProjectId, JSONObject row) {
        m_assessModel.setAssessUserScore(assessId, userId, assessProjectId, row, this);
    }

    /**
     * 获取可报名人员
     *
     * @param condition
     */
    public void getAssessMemberByCondition(JSONObject condition) {
        m_assessModel.getAssessMemberByCondition(condition, this);
    }

    /**
     * 理论考报名
     *
     * @param condition
     */
    public void assessSignUp(JSONObject condition) {
        m_assessModel.assessSignUp(condition, this);
    }

    /**
     * 理论考取消报名
     *
     * @param condition
     */
    public void cancelAssessSignUp(JSONObject condition) {
        m_assessModel.cancelAssessSignUp(condition, this);
    }

    @Override
    public void onGetAssessListListener(List<M_AssessInfo> m_assessInfos) {
        m_assessView.onGetAssessListSuccess(m_assessInfos);
    }

    @Override
    public void onGetAssessProjectDetailInfosListener(List<M_AssessProjectDetailInfo> m_assessProjectDetailInfos) {
        m_assessView.onGetAssessProjectDetailInfosSuccess(m_assessProjectDetailInfos);
    }

    @Override
    public void onGetAssessProjectInfosListener(List<M_AssessProjectInfo> m_assessProjectDetailInfos) {
        m_assessView.onGetAssessProjectInfosSuccess(m_assessProjectDetailInfos);
    }

    @Override
    public void getAssessUserScoreListener(List<AssessUserScoreInfo> assessUserScoreInfos) {
        m_assessView.getAssessUserScoreSuccess(assessUserScoreInfos);
    }

    @Override
    public void onGetAssessMemberListListener(List<M_AssessMemberInfo> m_assessMemberInfos) {
        m_assessView.onGetAssessMemberLisSuccess(m_assessMemberInfos);
    }

    @Override
    public void onGetAssessMemberByCondition(List<M_AssessMemberInfo> m_assessMemberInfos) {
        m_assessView.getAssessMemberByConditionList(m_assessMemberInfos);
    }

    @Override
    public void cancelAssessSignUp() {
        m_assessView.cancelAssessSignUp();
    }

    @Override
    public void assessSignUp() {
        m_assessView.assessSignUp();
    }

    @Override
    public void onGetAssessMemberScoreListListener(ArrayList<ScoreInfo> scoreInfos) {
        m_assessView.onGetAssessMemberScoreLisSuccess(scoreInfos);
    }

    public void getAssessUserListByCondition(JSONObject condition) {
        m_assessModel.getAssessUserListByCondition(condition, this);
    }

    @Override
    public void onSuccess() {
        m_assessView.onSetAssessUserScoreSuccess();
    }
}

package com.ruobilin.medical.company.model;

import com.ruobilin.medical.company.listener.AddClinicalAssessListener;
import com.ruobilin.medical.company.listener.M_AssessListener;

import org.json.JSONObject;

/**
 * 类名 M_AssessModel
 * Jiangxz
 * 主要功能：考核model
 * 2018/6/21
 * Copyright  2018 Ruobilin. All Rights Reserved
 * 修改者，修改日期，修改内容。
 */


public interface M_AssessModel {
    void getAssessByCondition(JSONObject condition, M_AssessListener listener);

    void getAssessUserScore(String assessId, JSONObject condition, M_AssessListener listener);

    void getAssessProjectDetail(String assessProjectId, JSONObject condition, M_AssessListener listener);

    void setAssessUserScore(String assessId, String userId, String assessProjectId, JSONObject row, M_AssessListener listener);

    void getAssessUserListByCondition(JSONObject condition, M_AssessListener listener);

    void getAssessMemberByCondition(JSONObject condition, M_AssessListener listener);

    void assessSignUp(JSONObject condition, M_AssessListener listener);

    void cancelAssessSignUp(JSONObject condition, M_AssessListener listener);

    void getAssessMemberScoreByCondition(JSONObject condition, M_AssessListener listener);

    public void getAssessProjectByCondition(JSONObject condition,M_AssessListener listener);

    public void addClinicalAssess(JSONObject row,AddClinicalAssessListener listener);

    public void deleteAssess(String assessId,AddClinicalAssessListener listener);
}

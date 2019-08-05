package com.ruobilin.medical.company.model;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.ruobilin.bedrock.common.data.BaseInfo;
import com.ruobilin.bedrock.common.service.ServiceCallback;
import com.ruobilin.bedrock.common.util.RUtils;
import com.ruobilin.medical.common.data.AssessUserScoreInfo;
import com.ruobilin.medical.common.data.M_AssessInfo;
import com.ruobilin.medical.common.data.M_AssessMemberInfo;
import com.ruobilin.medical.common.data.M_AssessProjectDetailInfo;
import com.ruobilin.medical.common.data.M_AssessProjectInfo;
import com.ruobilin.medical.common.data.ScoreInfo;
import com.ruobilin.medical.common.service.m_organizationstructure.RAssessService;
import com.ruobilin.medical.company.listener.AddClinicalAssessListener;
import com.ruobilin.medical.company.listener.M_AssessListener;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

/**
 * 类名  M_AssessModelImpl
 * Jiangxz
 * 主要功能：
 * 2018/6/21
 * Copyright  2018 Ruobilin. All Rights Reserved
 * 修改者，修改日期，修改内容。
 */


public class M_AssessModelImpl implements M_AssessModel {

    @Override
    public void getAssessByCondition(JSONObject condition, final M_AssessListener listener) {
        try {
            RAssessService.getInstance().getAssessByCondition(condition, new ServiceCallback() {
                @Override
                public void onServiceStart() {
                    listener.onStart();
                }

                @Override
                public void onMainSuccess(int statusCode, String data) throws JSONException {
                    Gson gson = new Gson();
                    ArrayList<M_AssessInfo> m_assessInfos = gson.fromJson(data, new TypeToken<ArrayList<M_AssessInfo>>() {
                    }.getType());
                    listener.onGetAssessListListener(m_assessInfos);
                }

                @Override
                public void onServiceError(String serviceMethod, int errorCode, String errorInfo) throws JSONException {
                    listener.onError(errorInfo);
                }

                @Override
                public void onFinish() {
                    listener.onFinish();
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void getAssessUserScore(String assessId, JSONObject condition, final M_AssessListener listener) {
        try {
            RAssessService.getInstance().getAssessUserScore(assessId, condition, new ServiceCallback() {
                @Override
                public void onServiceStart() {
                    listener.onStart();
                }

                @Override
                public void onMainSuccess(int statusCode, String data) throws JSONException {
                    Gson gson = new Gson();
                    ArrayList<AssessUserScoreInfo> m_assessInfos = gson.fromJson(data, new TypeToken<ArrayList<AssessUserScoreInfo>>() {
                    }.getType());
                    listener.getAssessUserScoreListener(m_assessInfos);
                }

                @Override
                public void onServiceError(String serviceMethod, int errorCode, String errorInfo) throws JSONException {
                    listener.onError(errorInfo);
                }

                @Override
                public void onFinish() {
                    listener.onFinish();
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void getAssessProjectDetail(String assessProjectId, JSONObject condition, final M_AssessListener listener) {
        try {
            RAssessService.getInstance().getAssessProjectDetail(assessProjectId, condition, new ServiceCallback() {
                @Override
                public void onServiceStart() {
                    listener.onStart();
                }

                @Override
                public void onMainSuccess(int statusCode, String data) throws JSONException {
                    Gson gson = new Gson();
                    ArrayList<M_AssessProjectDetailInfo> m_assessInfos = gson.fromJson(data, new TypeToken<ArrayList<M_AssessProjectDetailInfo>>() {
                    }.getType());
                    List<M_AssessProjectDetailInfo> parentAssessProjectDetailInfos = new ArrayList<>();
                    for (M_AssessProjectDetailInfo m_assessProjectDetailInfo : m_assessInfos) {
                        if ("-1".equals(m_assessProjectDetailInfo.getParentId()) || RUtils.isEmpty(m_assessProjectDetailInfo.getParentId())) {
                            parentAssessProjectDetailInfos.add(m_assessProjectDetailInfo);
                            for (M_AssessProjectDetailInfo m_assessProjectDetailInfo1 : m_assessInfos) {
                                if (m_assessProjectDetailInfo1.getParentId().equals(m_assessProjectDetailInfo.getId())) {
                                    parentAssessProjectDetailInfos.add(m_assessProjectDetailInfo1);
                                    for (M_AssessProjectDetailInfo m_assessProjectDetailInfo2 : m_assessInfos) {
                                        if (m_assessProjectDetailInfo2.getParentId().equals(m_assessProjectDetailInfo1.getId())) {
                                            parentAssessProjectDetailInfos.add(m_assessProjectDetailInfo2);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    listener.onGetAssessProjectDetailInfosListener(parentAssessProjectDetailInfos);
                }

                @Override
                public void onServiceError(String serviceMethod, int errorCode, String errorInfo) throws JSONException {
                    listener.onError(errorInfo);
                }

                @Override
                public void onFinish() {
                    listener.onFinish();
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void setAssessUserScore(String assessId, String userId, String assessProjectId, JSONObject row, final M_AssessListener listener) {
        try {
            RAssessService.getInstance().setAssessUserScore(assessId, userId, assessProjectId, row, new ServiceCallback() {
                @Override
                public void onServiceStart() {
                    listener.onStart();
                }

                @Override
                public void onMainSuccess(int statusCode, String data) throws JSONException {
//                    Gson gson = new Gson();
//                    ArrayList<M_AssessInfo> m_assessInfos = gson.fromJson(data, new TypeToken<ArrayList<M_AssessInfo>>() {
//                    }.getType());
//                    listener.onGetAssessListListener(m_assessInfos);
                    listener.onSuccess();
                }

                @Override
                public void onServiceError(String serviceMethod, int errorCode, String errorInfo) throws JSONException {
                    listener.onError(errorInfo);
                }

                @Override
                public void onFinish() {
                    listener.onFinish();
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void getAssessUserListByCondition(JSONObject condition, final M_AssessListener listener) {
        try {
            RAssessService.getInstance().getAssessUserListByCondition(condition, new ServiceCallback() {
                @Override
                public void onServiceStart() {
                    listener.onStart();
                }

                @Override
                public void onMainSuccess(int statusCode, String data) throws JSONException {
                    Gson gson = new Gson();
                    ArrayList<M_AssessMemberInfo> m_assessInfos = gson.fromJson(data, new TypeToken<ArrayList<M_AssessMemberInfo>>() {
                    }.getType());
                    listener.onGetAssessMemberListListener(m_assessInfos);
                }

                @Override
                public void onServiceError(String serviceMethod, int errorCode, String errorInfo) throws JSONException {
                    listener.onError(errorInfo);
                }

                @Override
                public void onFinish() {
                    listener.onFinish();
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void getAssessMemberByCondition(JSONObject condition, final M_AssessListener listener) {
        try {
            RAssessService.getInstance().getAssessMemberByCondition(condition, new ServiceCallback() {
                @Override
                public void onServiceStart() {
                    listener.onStart();
                }

                @Override
                public void onMainSuccess(int statusCode, String data) throws JSONException {
                    Gson gson = new Gson();
                    ArrayList<M_AssessMemberInfo> m_assessInfos = gson.fromJson(data, new TypeToken<ArrayList<M_AssessMemberInfo>>() {
                    }.getType());
                    listener.onGetAssessMemberByCondition(m_assessInfos);
                }

                @Override
                public void onServiceError(String serviceMethod, int errorCode, String errorInfo) throws JSONException {
                    listener.onError(errorInfo);
                }

                @Override
                public void onFinish() {
                    listener.onFinish();
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void assessSignUp(JSONObject condition, final M_AssessListener listener) {
        try {
            RAssessService.getInstance().assessSignUp(condition, new ServiceCallback() {
                @Override
                public void onServiceStart() {
                    listener.onStart();
                }

                @Override
                public void onMainSuccess(int statusCode, String data) throws JSONException {
                    listener.assessSignUp();
                }

                @Override
                public void onServiceError(String serviceMethod, int errorCode, String errorInfo) throws JSONException {
                    listener.onError(errorInfo);
                }

                @Override
                public void onFinish() {
                    listener.onFinish();
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void cancelAssessSignUp(JSONObject condition, final M_AssessListener listener) {
        try {
            RAssessService.getInstance().cancelAssessSignUp(condition, new ServiceCallback() {
                @Override
                public void onServiceStart() {
                    listener.onStart();
                }

                @Override
                public void onMainSuccess(int statusCode, String data) throws JSONException {
                    listener.cancelAssessSignUp();
                }

                @Override
                public void onServiceError(String serviceMethod, int errorCode, String errorInfo) throws JSONException {
                    listener.onError(errorInfo);
                }

                @Override
                public void onFinish() {
                    listener.onFinish();
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void getAssessMemberScoreByCondition(JSONObject condition, final M_AssessListener listener) {
        try {
            RAssessService.getInstance().getAssessMemberScoreByCondition(condition, new ServiceCallback() {
                @Override
                public void onServiceStart() {
                    listener.onStart();
                }

                @Override
                public void onMainSuccess(int statusCode, String data) throws JSONException {
                    Gson gson = new Gson();
                    ArrayList<ScoreInfo> scoreInfos = gson.fromJson(data, new TypeToken<ArrayList<ScoreInfo>>() {
                    }.getType());
                    listener.onGetAssessMemberScoreListListener(scoreInfos);
                }

                @Override
                public void onServiceError(String serviceMethod, int errorCode, String errorInfo) throws JSONException {
                    listener.onError(errorInfo);
                }

                @Override
                public void onFinish() {
                    listener.onFinish();
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void getAssessProjectByCondition(JSONObject condition, M_AssessListener listener) {
        try {
            RAssessService.getInstance().getAssessProjectByCondition(condition, new ServiceCallback() {
                @Override
                public void onServiceStart() {
                    listener.onStart();
                }

                @Override
                public void onMainSuccess(int statusCode, String data) throws JSONException {
                    Gson gson = new Gson();
                    ArrayList<M_AssessProjectInfo> scoreInfos = gson.fromJson(data, new TypeToken<ArrayList<M_AssessProjectInfo>>() {
                    }.getType());
                    listener.onGetAssessProjectInfosListener(scoreInfos);
                }

                @Override
                public void onServiceError(String serviceMethod, int errorCode, String errorInfo) throws JSONException {
                    listener.onError(errorInfo);
                }

                @Override
                public void onFinish() {
                    listener.onFinish();
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void addClinicalAssess(JSONObject row, AddClinicalAssessListener listener) {
        try {
            RAssessService.getInstance().addClinicalAssess(row, new ServiceCallback() {
                @Override
                public void onServiceStart() {
                    listener.onStart();
                }

                @Override
                public void onMainSuccess(int statusCode, String data) throws JSONException {
                    Gson gson = new Gson();
                    ArrayList<M_AssessInfo> scoreInfos = gson.fromJson(data, new TypeToken<ArrayList<M_AssessInfo>>() {
                    }.getType());
                    listener.onAddClinicalAssessListener(scoreInfos);
                }

                @Override
                public void onServiceError(String serviceMethod, int errorCode, String errorInfo) throws JSONException {
                    listener.onError(errorInfo);
                }

                @Override
                public void onFinish() {
                    listener.onFinish();
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void deleteAssess(String assessId, AddClinicalAssessListener listener) {
        try {
            RAssessService.getInstance().deleteAssess(assessId, new ServiceCallback() {
                @Override
                public void onServiceStart() {
                    listener.onStart();
                }

                @Override
                public void onMainSuccess(int statusCode, String data) throws JSONException {
//                    Gson gson = new Gson();
//                    ArrayList<M_AssessInfo> scoreInfos = gson.fromJson(data, new TypeToken<ArrayList<M_AssessInfo>>() {
//                    }.getType());
                    listener.onDeleteClinicalAssessListener();
                }

                @Override
                public void onServiceError(String serviceMethod, int errorCode, String errorInfo) throws JSONException {
                    listener.onError(errorInfo);
                }

                @Override
                public void onFinish() {
                    listener.onFinish();
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }
}

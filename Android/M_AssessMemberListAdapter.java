package com.ruobilin.medical.company.adapter;

import android.support.annotation.LayoutRes;
import android.support.annotation.Nullable;
import android.widget.ImageView;

import com.chad.library.adapter.base.BaseQuickAdapter;
import com.chad.library.adapter.base.BaseViewHolder;
import com.ruobilin.bedrock.R;
import com.ruobilin.bedrock.common.util.RUtils;
import com.ruobilin.medical.common.data.M_AssessMemberInfo;
import com.ruobilin.medical.common.global.M_Constant;

import java.util.List;

import static com.ruobilin.bedrock.common.global.Constant.ADAPTER_TYPE_SINGLE;

/**
 * 类名
 * Jiangxz
 * 主要功能：
 * 2018/7/5
 * Copyright  2018 Ruobilin. All Rights Reserved
 * 修改者，修改日期，修改内容。
 */


public class M_AssessMemberListAdapter extends BaseQuickAdapter<M_AssessMemberInfo,BaseViewHolder> {
    private int mAdapterType= ADAPTER_TYPE_SINGLE;
    private int AssessType = 0;
    public M_AssessMemberListAdapter(@LayoutRes int layoutResId, @Nullable List<M_AssessMemberInfo> data) {
        super(layoutResId, data);
    }

    public int getAssessType() {
        return AssessType;
    }

    public void setAssessType(int assessType) {
        AssessType = assessType;
    }

    public int getmAdapterType() {
        return mAdapterType;
    }

    public void setmAdapterType(int mAdapterType) {
        this.mAdapterType = mAdapterType;
    }

    @Override
    protected void convert(BaseViewHolder helper, M_AssessMemberInfo userInfo) {
        if (mAdapterType==ADAPTER_TYPE_SINGLE) {
            helper.setGone(R.id.user_checkbox,false);
        }else {
            helper.setGone(R.id.user_checkbox,true);
        }
        helper .setText(R.id.user_score,"");
        helper .setText(R.id.m_head_title_tv,RUtils.secondToDateTime(userInfo.getStartDate()));
        if (getData().indexOf(userInfo)==0){
            helper .setGone(R.id.m_head_title_tv,true);
        }else {
         if (getData().get(getData().indexOf(userInfo)-1).getStartDate().compareTo(userInfo.getStartDate()) ==0){
             helper .setGone(R.id.m_head_title_tv,false);
         }else {
             helper .setGone(R.id.m_head_title_tv,true);
         }
        }
//        if (userInfo.getState() == Constant.ONE)
//            helper .setText(R.id.user_score,userInfo.getScore()+"分");
        if (AssessType == M_Constant.ASSESS_TYPE_CAOZUOKAO){
            helper .setText(R.id.user_desc, RUtils.secondToDateTime(userInfo.getStartDate())+"～"+RUtils.secondToDate(userInfo.getEndDate()," HH:mm"));
        }else {
            helper.setText(R.id.user_desc,userInfo.getAddress());
        }
        helper.setText(R.id.user_name,RUtils.jointNameAndDepartmentName(userInfo.getUserName(),userInfo.getDepartmentName())).addOnClickListener(R.id.m_select_user_rlt);
        RUtils.setSmallHead(mContext, (ImageView) helper.getView(R.id.user_header),userInfo.getFaceImage());

        if (userInfo.isSelect()) {
            helper.setChecked(R.id.user_checkbox, true);

        }else {
            helper.setChecked(R.id.user_checkbox, false);
        }

    }
}

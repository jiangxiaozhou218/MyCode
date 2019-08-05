package com.ruobilin.medical.company.activity;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.ActivityCompat;
import android.support.v7.widget.DividerItemDecoration;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.HorizontalScrollView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.chad.library.adapter.base.BaseQuickAdapter;
import com.ruobilin.bedrock.R;
import com.ruobilin.bedrock.common.base.BaseActivity;
import com.ruobilin.bedrock.common.data.BaseInfo;
import com.ruobilin.bedrock.common.data.FriendInfo;
import com.ruobilin.bedrock.common.data.UserInfo;
import com.ruobilin.bedrock.common.global.Constant;
import com.ruobilin.bedrock.common.global.ConstantDataBase;
import com.ruobilin.bedrock.common.ui.TemplateTitle;
import com.ruobilin.bedrock.common.util.RUtils;
import com.ruobilin.bedrock.contacts.utils.MyIndexBarDataHelperImpl;
import com.ruobilin.medical.common.data.AssessUserScoreInfo;
import com.ruobilin.medical.common.data.M_AssessInfo;
import com.ruobilin.medical.common.data.M_AssessMemberInfo;
import com.ruobilin.medical.common.data.M_AssessProjectDetailInfo;
import com.ruobilin.medical.common.data.M_AssessProjectInfo;
import com.ruobilin.medical.common.data.ScoreInfo;
import com.ruobilin.medical.common.global.M_Constant;
import com.ruobilin.medical.common.global.M_ConstantDataBase;
import com.ruobilin.medical.company.adapter.M_AssessMemberListAdapter;
import com.ruobilin.medical.company.presenter.M_AssessPresenter;
import com.ruobilin.medical.company.view.M_AssessView;
import com.scwang.smartrefresh.layout.SmartRefreshLayout;
import com.scwang.smartrefresh.layout.api.RefreshLayout;
import com.scwang.smartrefresh.layout.footer.ClassicsFooter;
import com.scwang.smartrefresh.layout.listener.OnLoadmoreListener;
import com.scwang.smartrefresh.layout.listener.OnRefreshListener;
import com.vondear.rxtools.RxDataTool;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import pl.droidsonroids.gif.GifImageView;

import static com.ruobilin.bedrock.common.global.Constant.ADAPTER_TYPE_SINGLE;
import static com.ruobilin.bedrock.common.global.ConstantDataBase.ADAPTER_SELECT_TYPE;

/**
 * 类名  M_AssessMembersActivity
 * Jiangxz
 * 主要功能：考核人员明细
 * 2018/7/5
 * Copyright  2018 Ruobilin. All Rights Reserved
 * 修改者，修改日期，修改内容。
 */


public class M_AssessMembersActivity extends BaseActivity implements M_AssessView {

    @BindView(R.id.m_select_manger_tt)
    TemplateTitle mSelectMangerTt;
    @BindView(R.id.m_select_user_rv)
    RecyclerView mSelectUserRv;
    @BindView(R.id.linearLayoutMenu)
    LinearLayout linearLayoutMenu;
    @BindView(R.id.horizonScrolMenu)
    HorizontalScrollView horizonScrolMenu;
    @BindView(R.id.no_data_tips)
    TextView noDataTips;
    @BindView(R.id.view_line)
    View viewLine;
    @BindView(R.id.share_where_search_llt)
    RelativeLayout shareWhereSearchLlt;
    @BindView(R.id.m_search_llt)
    LinearLayout mSearchLlt;
    @BindView(R.id.m_search_et)
    EditText mSearchEt;
    @BindView(R.id.m_cancel_text)
    TextView mCancelText;
    @BindView(R.id.m_et_search_llt)
    LinearLayout mEtSearchLlt;
    @BindView(R.id.gifview)
    GifImageView gifview;
    @BindView(R.id.m_dock_point_srfl)
    SmartRefreshLayout mDockPointSrfl;
    private int mAdapterType = ADAPTER_TYPE_SINGLE;
    private String titleText = "";
    private M_AssessMemberListAdapter mSelectUserAdapter;
    private ArrayList<M_AssessMemberInfo> userInfos;
    private ArrayList<M_AssessMemberInfo> allUserInfos;
    private LinearLayoutManager layoutManager;
    private String userId = "";//单选修改，穿过来选中的人
    private ArrayList<UserInfo> selectUserList;
    private TextView txt_more;
    private Handler handler = new Handler();
    private M_AssessPresenter m_assessPresenter;
    private int startIndex = 0;
//    private M_AssessInfo m_assessInfo;
    private String AssessId = "";
    private int AssessType;
    private String traineeId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    @Override
    protected void setContentView() {
        setContentView(R.layout.m_activity_select_cadeter_list);
        ButterKnife.bind(this);
    }

    @Override
    protected void setupIntent() {
        userInfos = new ArrayList<>();
        allUserInfos = new ArrayList<>();
        Intent intent = getIntent();
//        m_assessInfo = (M_AssessInfo) intent.getSerializableExtra(ConstantDataBase.FIELDNAME_MODULE_INFO);
        AssessId = intent.getStringExtra(ConstantDataBase.FIELDNAME_LINK_ID);
        mAdapterType = intent.getIntExtra(ADAPTER_SELECT_TYPE, ADAPTER_TYPE_SINGLE);
        AssessType =   intent.getIntExtra(M_ConstantDataBase.FIELDNAME_Type,0);
        traineeId = getIntent().getStringExtra(ConstantDataBase.FIELDNAME_PROJECT_ID);

        if (mAdapterType == Constant.ADAPTER_TYPE_SINGLE) {
            if (intent.hasExtra(ConstantDataBase.USERINFO)) {
                userId = intent.getStringExtra(ConstantDataBase.USERINFO);
            }
        } else if (mAdapterType == Constant.ADAPTER_TYPE_MULTIPLE) {
            if (intent.hasExtra(ConstantDataBase.USERINFO_LIST)) {
                selectUserList = (ArrayList<UserInfo>) intent.getSerializableExtra(ConstantDataBase.USERINFO_LIST);
            }
        }
        if (selectUserList == null)
            selectUserList = new ArrayList<>();
        titleText = "人员明细";
    }

    @Override
    protected void setupPresenter() {
        m_assessPresenter = new M_AssessPresenter(this);
    }

    public UserInfo isContainUser(String id, ArrayList<UserInfo> allUserInfos) {
        for (UserInfo userInfo : allUserInfos) {
            if (userInfo instanceof FriendInfo) {
                if (((FriendInfo) userInfo).getContactId().equals(id)) {
                    return userInfo;
                }
            } else {
                if (userInfo != null) {
                    if (id.equals(userInfo.getId())) {
                        return userInfo;
                    }
                }
            }
        }
        return null;
    }

    @Override
    protected void setupView() {
        mDockPointSrfl.setEnableLoadmore(false);
        mDockPointSrfl.setRefreshFooter(new ClassicsFooter(this));
        mSearchLlt.setVisibility(View.GONE);
        txt_more = (TextView) mSelectMangerTt.findViewById(R.id.txt_more);
        txt_more.setTextColor(ActivityCompat.getColor(getApplicationContext(), R.color.font_light_gray));
        mSelectMangerTt.setTitleText(RUtils.filerEmpty(titleText));
        mSelectMangerTt.setMoreTextContext(getString(R.string.confirm));
        mSelectMangerTt.setMoreTextAction(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent data = new Intent();
                data.putExtra(ConstantDataBase.USERINFO_LIST, selectUserList);
                setResult(RESULT_OK, data);
                finish();
            }
        });
        if (mAdapterType == Constant.ADAPTER_TYPE_SINGLE) {
            mSelectMangerTt.setMoreTextVisible(View.GONE);
            shareWhereSearchLlt.setVisibility(View.GONE);
            mSearchLlt.setVisibility(View.GONE);
            mEtSearchLlt.setVisibility(View.GONE);
        } else {
            for (UserInfo userInfo : selectUserList) {
                showCheckImage(userInfo);
            }
        }
//        new MyIndexBarDataHelperImpl().sortSourceDatas(userInfos);
        mSelectUserAdapter = new M_AssessMemberListAdapter(R.layout.cadet_train_ckeck_member_item, userInfos);
        mSelectUserAdapter.setmAdapterType(mAdapterType);
        mSelectUserAdapter.setAssessType(AssessType);

        layoutManager = new LinearLayoutManager(this);
        mSelectUserRv.setLayoutManager(layoutManager);
        mSelectUserRv.setAdapter(mSelectUserAdapter);
//        SuspensionDecoration mDecoration = new SuspensionDecoration(this, userInfos)
//                .setmTitleHeight((int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 30, getResources().getDisplayMetrics()))
//                .setColorTitleBg(0xffefefef)//0xffefefef,Color.parseColor("#FFff0000")
//                .setTitleFontSize((int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_SP, 14, getResources().getDisplayMetrics()))
//                .setColorTitleFont(ContextCompat.getColor(this, R.color.font_black))
//                .setHeaderViewCount(0);
//        mSelectUserRv.addItemDecoration(mDecoration);
        mSelectUserRv.addItemDecoration(new DividerItemDecoration(this, DividerItemDecoration.VERTICAL));
        updateBtnNum();
        refreshProject();
    }

    /**
     *
     */
    public void refreshProject() {
        JSONObject filter = new JSONObject();
        JSONObject condition = new JSONObject();
        try {
//            filter.put(ConstantDataBase.MEMO_FROM, 0);
//            filter.put(ConstantDataBase.MEMO_COUNT, 1);
//            filter.put("showCollege", 1);
//            filter.put(M_ConstantDataBase.FILTER_FIELDNAME_SHOWUSERLIST, Constant.ONE);
//            condition.put(ConstantDataBase.FIELDNAME_PROJECT_IS_FILTER, filter);
//            condition.put(M_ConstantDataBase.FILTER_FIELDNAME_SHOWEXAMINERUSER,  Constant.ONE);
//            condition.put(ConstantDataBase.FIELDNAME_ID, m_assessInfo.getId());
            condition.put(ConstantDataBase.MEMO_FROM, startIndex);
            condition.put(ConstantDataBase.MEMO_COUNT, 500);
            condition.put(M_ConstantDataBase.FIELDNAME_ASSESSID, AssessId);

        } catch (JSONException e) {
            e.printStackTrace();
        }
        m_assessPresenter.getAssessUserListByCondition(condition);
    }

    @Override
    protected void setupClick() {
        mDockPointSrfl.setOnRefreshListener(new OnRefreshListener() {
            @Override
            public void onRefresh(RefreshLayout refreshlayout) {
                startIndex = 0;
                refreshProject();
            }
        });
        mDockPointSrfl.setOnLoadmoreListener(new OnLoadmoreListener() {
            @Override
            public void onLoadmore(RefreshLayout refreshlayout) {
                startIndex = 0;
                refreshProject();
            }
        });
        mSearchEt.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

            @Override
            public void afterTextChanged(Editable text) {
                String s = mSearchEt.getText().toString().trim().replace("\'", "");
                if (RxDataTool.isNullString(s)) {
                    userInfos.clear();
                    mSelectUserAdapter.notifyDataSetChanged();
                } else {
                    search(s);
                }
            }
        });
        mSearchLlt.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                mDockPointSrfl.setEnableRefresh(false);
                mSearchLlt.setVisibility(View.GONE);
                mEtSearchLlt.setVisibility(View.VISIBLE);
                mSelectMangerTt.setVisibility(View.GONE);
                shareWhereSearchLlt.setVisibility(View.GONE);
                userInfos.clear();
                mSelectUserAdapter.notifyDataSetChanged();
            }
        });
        mCancelText.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                hideMsgInputKeyboard();
                mDockPointSrfl.setEnableRefresh(true);
                mSearchLlt.setVisibility(View.VISIBLE);
                mEtSearchLlt.setVisibility(View.GONE);
                mSelectMangerTt.setVisibility(View.VISIBLE);
                shareWhereSearchLlt.setVisibility(View.GONE);
                userInfos.clear();
                userInfos.addAll(allUserInfos);
                mSelectUserAdapter.notifyDataSetChanged();
            }
        });
        mSelectUserAdapter.setOnItemChildClickListener(new BaseQuickAdapter.OnItemChildClickListener() {
            @Override
            public void onItemChildClick(BaseQuickAdapter adapter, View view, int position) {
                M_AssessMemberInfo userInfo = mSelectUserAdapter.getItem(position);
                switch (view.getId()) {
                    case R.id.m_select_user_rlt:
                        if (mAdapterType == Constant.ADAPTER_TYPE_SINGLE) {
                            Intent intent = new Intent();
                            intent.putExtra(ConstantDataBase.FIELDNAME_USER_USERID, userInfo.getUserId());
                            intent.putExtra(ConstantDataBase.FIELDNAME_PROJECT_ID, traineeId);
                            if (!RUtils.isEmpty(traineeId))
                            switchToActivity(M_Constant.ACTIVITY_KEY_M_CADETER_INFO, intent);
                            else {
                                switchToActivity(Constant.ACTIVITY_KEY_EMPLOYEE_SIMPLE_INFO, intent);
                            }

                        } else if (mAdapterType == Constant.ADAPTER_TYPE_MULTIPLE) {
                            CheckBox checkBox = (CheckBox) adapter.getViewByPosition(mSelectUserRv, position, R.id.user_checkbox);
                            checkBox.setClickable(false);
                            checkBox.setFocusable(false);
                            if (userInfo != null) {
                                UserInfo info = isContainUser(userInfo.getUserId(), selectUserList);
                                if (info == null) {
                                    selectUserList.add(userInfo);
                                    showCheckImage(userInfo);
                                } else {
                                    selectUserList.remove(info);
                                    if (info instanceof FriendInfo)
                                        deleteImage(((FriendInfo) info).getContactId());
                                    else
                                        deleteImage((info).getId());
                                }
                                userInfo.setSelect(!userInfo.isSelect());
                                checkBox.setEnabled(false);
                                checkBox.setChecked(userInfo.isSelect());
                                checkBox.setEnabled(true);
                            }

                            updateBtnNum();
                        }
                        break;
                    default:
                }
            }
        });


    }

    private void search(String s) {
        userInfos.clear();
        for (M_AssessMemberInfo friendInfo : allUserInfos) {
            // if (friendInfo instanceof FriendInfo){
            if (friendInfo.getUserName().contains(s) || friendInfo.getNickName().contains(s) || friendInfo.getRemarkName().contains(s)) {
                userInfos.add(friendInfo);
            }
            // }
        }
        mSelectUserAdapter.notifyDataSetChanged();
    }

    /**
     * 显示头像
     *
     * @param userInfo
     */
    public void showCheckImage(final UserInfo userInfo) {
        if (noDataTips.getVisibility() == View.VISIBLE) {
            noDataTips.setVisibility(View.GONE);
        }
        LinearLayout.LayoutParams menuLinerLayoutParames = new LinearLayout.LayoutParams(108, 108, 1);
        View view1 = LayoutInflater.from(this).inflate(
                R.layout.common_select_header_item, null);
        ImageView headImage = (ImageView) view1.findViewById(R.id.iv_header);
        menuLinerLayoutParames.setMargins(6, 3, 6, 3);

        RUtils.setSmallHead(this, headImage, userInfo.getFaceImage());
        // 设置id，方便后面删除
        if (userInfo instanceof FriendInfo)
            view1.setTag(((FriendInfo) userInfo).getContactId());
        else
            view1.setTag(userInfo.getId());
        linearLayoutMenu.addView(view1, menuLinerLayoutParames);

        view1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String id = (String) v.getTag();
                UserInfo info = isContainUser(id, selectUserList);
                if (info != null) {
                    selectUserList.remove(info);
                    info.setSelect(!info.isSelect());
                    deleteImage(id);
                    mSelectUserAdapter.notifyDataSetChanged();
                }
            }
        });

        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                horizonScrolMenu.fullScroll(HorizontalScrollView.FOCUS_RIGHT);
            }
        }, 100L);
    }

    /**
     * 删除头像
     *
     * @param Id
     */
    public void deleteImage(String Id) {
        View view = linearLayoutMenu.findViewWithTag(Id);
        linearLayoutMenu.removeView(view);
        if (selectUserList.size() == 0) {
            if (noDataTips.getVisibility() == View.GONE) {
                noDataTips.setVisibility(View.VISIBLE);
            }
        }
        updateBtnNum();
//        commonSelectFragment.updateConfirmBtn();
    }

    /**
     * 更新完成数字
     */
    public void updateBtnNum() {
//        if (selectUserList.size() == 0)
//            txt_more.setText(getString(R.string.sure));
//        else
//            txt_more.setText(getString(R.string.sure) + "(" + selectUserList.size() + ")");
//        txt_more.setTextColor(ActivityCompat.getColor(getApplicationContext(), R.color.memo_info_blue));
        if (selectUserList.size() > 0) {
//            btnConfirm.setVisibility(View.VISIBLE);
            txt_more.setEnabled(true);
            txt_more.setClickable(true);
            txt_more.setText(getString(R.string.sure) + "(" + selectUserList.size() + ")");
            txt_more.setTextColor(ActivityCompat.getColor(getApplicationContext(), R.color.memo_info_blue));

        } else if (selectUserList.size() == 0) {
            txt_more.setEnabled(false);
            txt_more.setClickable(false);
            txt_more.setText(getString(R.string.sure));
            txt_more.setTextColor(ActivityCompat.getColor(getApplicationContext(), R.color.font_light_gray));
//            btnConfirm.setVisibility(View.GONE);
        }
    }

    @Override
    protected void setupData() {

    }

    @Override
    public void onGetAssessListSuccess(List<M_AssessInfo> m_assessInfos) {
        if (m_assessInfos.get(0).getRAssessUserList() != null) {
            new MyIndexBarDataHelperImpl().sortSourceDatas(m_assessInfos.get(0).getRAssessUserList().getRows());
            allUserInfos.clear();
            userInfos.clear();
            if (m_assessInfos.size() > 0) {
                allUserInfos.addAll(m_assessInfos.get(0).getRAssessUserList().getRows());
                userInfos.addAll(allUserInfos);
            }
            mSelectUserAdapter.notifyDataSetChanged();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == RESULT_OK) {
            switch (requestCode) {
                case 1:
                    refreshProject();
                    break;
            }
        }
    }

    @Override
    public void onGetAssessProjectDetailInfosSuccess(List<M_AssessProjectDetailInfo> m_assessProjectDetailInfos) {

    }

    @Override
    public void onSetAssessUserScoreSuccess() {

    }

    @Override
    public void getAssessUserScoreSuccess(List<AssessUserScoreInfo> assessUserScoreInfos) {

    }

    @Override
    public void onGetAssessMemberLisSuccess(List<M_AssessMemberInfo> m_assessMemberInfos) {
                new MyIndexBarDataHelperImpl().sortSourceDatas(m_assessMemberInfos);

        Collections.sort(m_assessMemberInfos, new Comparator<M_AssessMemberInfo>() {
            @Override
            public int compare(M_AssessMemberInfo o1, M_AssessMemberInfo o2) {
                return o1.getStartDate().compareTo(o2.getStartDate());
            }
        });
        if (startIndex ==0){
            allUserInfos.clear();
            userInfos.clear();
        }

        if (m_assessMemberInfos.size() > 0) {
            allUserInfos.addAll(m_assessMemberInfos);
            userInfos.addAll(allUserInfos);
        }
        mSelectUserAdapter.notifyDataSetChanged();
    }

    @Override
    public void onGetAssessMemberScoreLisSuccess(ArrayList<ScoreInfo> scoreInfos) {

    }

    @Override
    public void getAssessMemberByConditionList(List<M_AssessMemberInfo> m_assessMemberInfos) {

    }

    @Override
    public void assessSignUp() {

    }

    @Override
    public void cancelAssessSignUp() {

    }

    @Override
    public void onGetAssessProjectInfosSuccess(List<M_AssessProjectInfo> m_assessProjectDetailInfos) {

    }

    @Override
    public void onFinish() {
        mDockPointSrfl.finishRefresh();
        mDockPointSrfl.finishLoadmore();
        super.onFinish();
    }
}

/**
 * 临床操作督导
 * @author Jiangxz
 * @constructor
 */
function FrmOperationSupervise() {
    if (rs.isDefClass(FrmOperationSupervise)) {
        this.mAssessService = new AssessService(CRInternsManageWebApp.mServerUrl);
    }
    if (!rs.isDefClass(FrmOperationSupervise)) {
        rs.inherit(FrmOperationSupervise, rs.RWidget);
        rs.defClass(FrmOperationSupervise);
        FrmOperationSupervise.prototype._setupUI = function (parent) {
            this.mCheckBoxSelectEntities = RHelper.makeEntities();
            this.tblMain = $(parent).find("#tblMain")[0];
            this.cmbYear = $(parent).find("#cmbYear")[0];
            this.cmbMonth = $(parent).find("#cmbMonth")[0];
            this.btnReport = $(parent).find("#btnReport")[0];
            rs.connect(this.btnReport, "onclick", this, this.btnReportClick);
            rs.connect(this.cmbYear, "onchange", this, this.cmbYearChange);
            rs.connect(this.cmbMonth, "onchange", this, this.cmbMonthChange);
            this._setupUIX();
        };
        FrmOperationSupervise.prototype._setupUIX = function () {
            this.mOperationColumn = {
                display: '操作',
                name: "",
                width: 150,
                isClick: true,
                render: this.clmOperationRender.bind(this)
            };
            this.g = $(this.tblMain).ligerGrid({
                height: "100%",
                width: "100%",
                headerRowHeight: 35,
                rowHeight: 30,
                rownumbers: true,
                checkbox: true,
                columns: [
                    {display: '姓名', name: 'UserName', width: 120, minWidth: 60},
                    {display: '部门', name: 'DepartmentName', width: 160, minWidth: 60},
                    {display: '考核项目', name: 'AssessProjectName', width: 150, minWidth: 60},
                    {
                        display: '考试时间',
                        name: 'StartDate',
                        width: 140,
                        minWidth: 60,
                        render: this.clmStartDateRender.bind(this)
                    },
                    {display: '得分', name: 'Score', width: 80, minWidth: 60},
                    this.mOperationColumn
                ],
                onAfterReRender: this.doOnAfterReRender.bind(this),
                onCheckAllRow: this.gradeCheckAll.bind(this),
                onCheckRow: this.gradeCheckRow.bind(this),
                isChecked: this.isRowChecked.bind(this),
                usePager: true,
                inWindow: false,
                record: "SumTotal",
                pageSize: 20,
                pageSizeOptions:
                    [20, 30, 40, 50, 100],
                dataProviderFun:
                    this.queryTraineeBatchData.bind(this)
            });
        };
        FrmOperationSupervise.prototype.isRowChecked = function (rowdata) {
            return this.mIsGradeCheckAll;
        };
        FrmOperationSupervise.prototype.gradeCheckRow = function (checked, data, rowid, rowdata) {
            if (this.mIsGradeCheckAll) {//全选时，记录取消行的员工Id
                if (checked) {//选中行
                    this.mCheckBoxSelectEntities.Rows.push(data);
                } else {
                    var index = this.mCheckBoxSelectEntities.Rows.indexOf(data);
                    this.mCheckBoxSelectEntities.Rows.splice(index, 1);
                }
            } else { //非全选选择选中的员工
                if (checked) {//选中行
                    this.mCheckBoxSelectEntities.Rows.push(data);
                } else {
                    var index = this.mCheckBoxSelectEntities.Rows.indexOf(data);
                    this.mCheckBoxSelectEntities.Rows.splice(index, 1);
                }
            }

        };
        FrmOperationSupervise.prototype.gradeCheckAll = function (checked) {
            this.mIsGradeCheckAll = checked;//是否全选标志,全选之后需要去查询所有数据将所有人放入全选的Entities
            if (this.mIsGradeCheckAll) {//全选
                RUI.showLoading(function () {
                    this.queryTraineeBatchData(null, function (error, result) {
                        RUI.hideLoading();
                        this.mCheckBoxSelectEntities = result;
                    }.bind(this));
                }.bind(this));

            } else {
                this.mCheckBoxSelectEntities = RHelper.makeEntities();
            }
        };
        FrmOperationSupervise.prototype.clmStartDateRender = function (item) {
            return RDateUtils.formatEmptyDatetime("yyyy年MM月dd日", item[CRAC.FieldName_StartDate]);
        };
        FrmOperationSupervise.prototype.clmOperationRender = function (item) {
            var sHtml = "";
            var aOperations = item[CRAC.FieldName_Operations];
            if (!RUtils.isEmptyString(aOperations) && !RUtils.isEmptyData(aOperations)) {
                RHelper.buildEntitesIndexX(aOperations, CRAC.FieldName_Code);
                if (!RUtils.isNullObject(aOperations[CRAC.Operations_Code_SC])) {
                    sHtml += "<a href='#' id='linkDelete' class='rbl-tbl-btn rbl-tbl-btn-warning'>删除</a>";
                }
            }
            return sHtml;
        };
        FrmOperationSupervise.prototype.doOnAfterReRender = function (grid, rowdata, column, cellElement) {
            if (this.mOperationColumn === column) {//判断是不是操作的单元格
                RUtils.bangdingLinkClickAction("#linkDelete", this, this.linkDeleteClick, rowdata, column, cellElement);
            }
        };
        FrmOperationSupervise.prototype.setup = function () {
            var aYearEntities = CRInternsManageConst.REntityHelper.createTransferDepartmentYearEntities();
            RUI.comboxlist(this.cmbYear, {
                data: aYearEntities,
                textField: CRAC.FieldName_Name,
                valueField: CRAC.FieldName_Id,
                hasAll: true,
                allText: "选择年"
            });
            var aMonthEntities = CRInternsManageConst.REntityHelper.createTransferDepartmentMonthEntities();
            RUI.comboxlist(this.cmbMonth, {
                data: aMonthEntities,
                textField: CRAC.FieldName_Name,
                valueField: CRAC.FieldName_Id,
                hasAll: true,
                allText: "选择月"
            });
            $(this.cmbYear).val(new Date().getFullYear());
            this.g.loadData(true);
        };
        FrmOperationSupervise.prototype.queryTraineeBatchData = function (params, callback) {
            RUI.showLoading();
            async.waterfall([
                function (callback) {
                    var oCondition = {
                        _from: params ? (params.page - 1) * params.pagesize : 0,
                        _count: params ? params.pagesize : CRAC.RecordCount_MaxLimit,
                        ShowSumTotal: 1,
                        _filter: {
                            showUserList: 1,
                            showMyCreate: 1
                        }
                    };
                    oCondition[CRAC.FieldName_SourceType] = CRAC.SourceType_User;
                    if (!RUtils.isNullObject(RUI.comboxlist(this.cmbYear).selected())) {
                        oCondition[CRAC.FieldName_Year] = RUI.comboxlist(this.cmbYear).selectedValue();
                    }
                    if (!RUtils.isNullObject(RUI.comboxlist(this.cmbMonth).selected())) {
                        oCondition[CRAC.FieldName_Month] = RUI.comboxlist(this.cmbMonth).selectedValue();
                    }
                    oCondition[CRAC.FieldName_Type] = CRAC.AssessProjectType_Operation;
                    this.mAssessService.getAssessByCondition(oCondition, callback);
                }.bind(this)
            ], function (error, result) {
                RUI.hideLoading();
                if (error) {
                    RUiUtils.warnMessageBox(CRInternsManageConst.STRING_QUERY_FAILED);
                    return;
                }
                if (RUtils.isNullObject(params)) {
                    callback(null, result);
                    return;
                }
                result.Rows.forEach(function (item) {
                    if (!RUtils.isEmptyData(item[CRAC.EntityClass_RAssessUserList])) {
                        var oUser = item[CRAC.EntityClass_RAssessUserList].Rows[0];
                        item[CRAC.FieldName_UserName] = oUser[CRAC.FieldName_UserName];
                        item[CRAC.FieldName_DepartmentName] = oUser[CRAC.FieldName_DepartmentName];
                        item[CRAC.FieldName_AssessProjectName] = oUser[CRAC.FieldName_AssessProjectName];
                        item[CRAC.FieldName_Score] = oUser[CRAC.FieldName_Score];
                    }

                });
                if (params && callback) {
                    callback(null, result);
                }
            }.bind(this));
        };
        FrmOperationSupervise.prototype.linkDeleteClick = function (el) {
            this.mSelectedData = el.mRowData;
            RUiUtils.messageBox(CRInternsManageConst.STRING_DELETE_MESSAGEZTITLE, CRInternsManageConst.STRING_DELETE_MESSAGECONTENT, this, function (ret) {
                if (ret) {
                    this.linkDeleteClick_save();
                }
            }.bind(this));
        };
        FrmOperationSupervise.prototype.linkDeleteClick_save = function () {
            this.mAssessService.deleteAssess(this.mSelectedData[CRAC.FieldName_Id], function (error, result) {
                if (error) {
                    RUiUtils.errorMessageBox(CRInternsManageConst.STRING_DELETE_FAILED);
                    return;
                }
                this.g.remove(this.mSelectedData);
            }.bind(this));
        };
        FrmOperationSupervise.prototype.cmbYearChange = function () {
            this.g.loadData(true);
        };
        FrmOperationSupervise.prototype.cmbMonthChange = function () {
            this.g.loadData(true);
        };

        FrmOperationSupervise.prototype.btnReportClick = function () {
            var aIds = RUtils.getFieldArray(this.mCheckBoxSelectEntities,CRAC.FieldName_Id);
            var sId = aIds.join(";");
            this.mSelectedData = {Title:'临床操作督导',Id:sId};
            this.mInitData = {SourceType:CRAC.SourceType_User};
            if (aIds.length==0){
                this.mSelectedData = null;
            }
            var dlg = new FrmOperationCollectReport();
            dlg.caption = CRInternsManageConst.STRING_DLGOPERATIONTESTBROSE_COLLECTREPORT;
            dlg.initUI();
            RUI.breadCrumbs().forward(dlg.caption, dlg);
            dlg.show(this);
            dlg.setup(this.mSelectedData, this.mInitData);
            dlg = null;
        };
    }
}

rs.registerClass(FrmOperationSupervise);
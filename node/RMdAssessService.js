/* global rs, RHelper, WCT */

var RUtils = require('../../../rbllib/rcommon/RUtils.js').RUtils;
var GBC = require('../../../common/GBC.js');
var RMdToDoListUtils = require('../../../common/RMdToDoListUtils.js');
var OSAC = require('../common/OSAC.js');
var async = require('async');
var getNamespace = require('continuation-local-storage').getNamespace;
var _ = require("lodash");
var RMdTraineeService = require('../servicesaction/RMdTraineeService.js');
var RMdPermissionService = require('../servicesaction/RMdPermissionService.js');

function BaseRMdAssessService() {
    if (rs.isDefClass(BaseRMdAssessService)) {

    } else {
        rs.defClass(BaseRMdAssessService);
        BaseRMdAssessService.prototype.setup = function () {

        };
        BaseRMdAssessService.prototype.getCorporationManager = function (callback) {
            //检查是不是公司管理员
            var obj = {
                permissionContextId: "",
                permissionBusinessKey: this.mCorporationId,
                roles: GBC.Context_Role_CorporationManager
            };
            this.mService.mBrPermissionProxy.excute('PermissionManagerService', "getMemberList", obj, function (error, result) {
                if (error) {
                    callback(error);
                    return;
                }
                if (result[OSAC.FieldName_Code] !== GBC.RESULT_SUCCESS) {
                    callback(result[OSAC.FieldName_Data]);
                    return;
                }
                callback(null, result[OSAC.FieldName_Data]);
            }.bind(this));
        };
        BaseRMdAssessService.prototype.checkOperationAssessManage = function (userId, corporationId, callback) {
            if (RUtils.isEmptyString(userId) || RUtils.isEmptyString(corporationId)) {
                callback(null, false);
                return;
            }
            var oOption = {
                userId: userId,
                contextBusinessKey: corporationId,
                resourceBusinessKey: OSAC.PermissionResource_BusinessKey_OPERATIONAssessManage,
            };
            this.mService.mBrPermissionProxy.excute('PermissionQueryService', 'checkPermission', oOption, function (error, result) {
                if (error) {
                    callback(error);
                    return;
                }
                if (result[OSAC.FieldName_Code] !== GBC.RESULT_SUCCESS) {
                    callback(result[OSAC.FieldName_Data]);
                    return;
                }
                callback(null, result[OSAC.FieldName_Data]);
            }.bind(this));
        };
        BaseRMdAssessService.prototype.checkAssessManage = function (userId, corporationId, callback) {
            if (RUtils.isEmptyString(userId) || RUtils.isEmptyString(corporationId)) {
                callback(null, false);
                return;
            }
            var oOption = {
                userId: userId,
                contextBusinessKey: corporationId,
                resourceBusinessKey: OSAC.PermissionResource_BusinessKey_AssessManage,
            };
            this.mService.mBrPermissionProxy.excute('PermissionQueryService', 'checkPermission', oOption, function (error, result) {
                if (error) {
                    callback(error);
                    return;
                }
                if (result[OSAC.FieldName_Code] !== GBC.RESULT_SUCCESS) {
                    callback(result[OSAC.FieldName_Data]);
                    return;
                }
                callback(null, result[OSAC.FieldName_Data]);
            }.bind(this));
        };
        BaseRMdAssessService.prototype.getUsers = function (userIds, callback) {
            var oOptions = {
                condition: {
                    SourceType: GBC.SourceType_User,
                    SourceId: null,
                    UserIds: userIds
                }
            };
            this.mService.mBrUserProxy.excute('UserNameService', "getUserNameByCondition", oOptions, function (error, result) {
                if (error) {
                    callback(error);
                    return;
                }
                if (result[OSAC.FieldName_Code] !== GBC.RESULT_SUCCESS) {
                    callback(result[OSAC.FieldName_Data]);
                    return;
                }
                callback(null, result[OSAC.FieldName_Data]);
            });
        };
        BaseRMdAssessService.prototype.getUserByCondition = function (userIds, callback) {
            var oOptions = {
                condition: {
                    Ids: userIds
                }
            };
            this.mService.mBrUserProxy.excute('UserService', "getUserByCondition", oOptions, function (error, result) {
                if (error) {
                    callback(error);
                    return;
                }
                if (result[OSAC.FieldName_Code] !== GBC.RESULT_SUCCESS) {
                    callback(result[OSAC.FieldName_Data]);
                    return;
                }
                callback(null, result[OSAC.FieldName_Data]);
            });
        };
        BaseRMdAssessService.prototype.deleteMemo = function (id, callback) {
            var oOption = {
                memoId: id
            };
            this.mService.mProjectProxy.excute('ProjectMemoService', 'bruteForcedeleteProjectMemo', oOption, function (error, result) {
                if (error) {
                    callback(error);
                    return;
                }
                if (result[OSAC.FieldName_Code] !== GBC.RESULT_SUCCESS) {
                    callback(result[OSAC.FieldName_Data]);
                    return;
                }
                callback(null, result[OSAC.FieldName_Data]);
            }.bind(this));
        };
        BaseRMdAssessService.prototype.deleteNotice = function (id, callback) {
            var oOption = {
                noticeId: id
            };
            this.mService.mBrOrganizationStructureProxy.excute('NoticeService', "bruteForceDeleteNotice", oOption, function (error, result) {
                if (error) {
                    callback(error);
                    return;
                }
                if (result[OSAC.FieldName_Code] !== GBC.RESULT_SUCCESS) {
                    callback(result[OSAC.FieldName_Data]);
                    return;
                }
                callback(null, result[OSAC.FieldName_Data]);
            }.bind(this));
        };
        BaseRMdAssessService.prototype.getAssess = function (id, callback) {
            var sSql = "Id=?";
            this.mService.mDataModule.loadEntities(OSAC.EntityClass_RAssess, sSql, [id], function (error, result) {
                if (error) {
                    callback(error);
                    return;
                }
                if (RUtils.isEmptyData(result)) {
                    var oError = rs.makeError(GBC.RESULT_NOTDATABASEDATAMESSAGE, GBC.RESULT_NOTDATABASEDATA);
                    callback(oError);
                    return;
                }
                callback(null, result.Rows[0]);
            });
        };
        BaseRMdAssessService.prototype.addAssessGroup = function (entities, callback) {
            var aGroupIds = [];
            var aUpdateGroupIds = [];
            for (var i = 0; i < entities.Rows.length; i++) {
                var row = entities.Rows[i];
                if (RUtils.isEmptyString(row[OSAC.FieldName_Id])) {
                    row[OSAC.FieldName_AssessId] = this.mRow[OSAC.FieldName_Id];
                    this.mService.mDataModule.initNewRecord(row, this.mUserId);
                }
                if (row[OSAC.FieldName_RecordState] === GBC.RecordState_Delete) {
                    aGroupIds.push(row[OSAC.FieldName_Id]);
                }
                if (row[OSAC.FieldName_RecordState] === GBC.RecordState_Update) {
                    aUpdateGroupIds.push(row[OSAC.FieldName_Id]);
                }
            }
            if (aGroupIds.length > 0) {
                var sSql = "delete from tb_assessuserscore where CONCAT(AssessId,UserId,AssessProjectId) in (select CONCAT(aul.AssessId,aul.UserId,aug.AssessProjectId) from tb_assessuserlist aul left join tb_assessusergroup aug on aul.AssessId=aug.AssessId and aul.assessusergroupid=aug.Id where aug.assessgroupid in (?));\n" +
                    "delete from tb_assessexamineruserscore where CONCAT(AssessId,UserId,AssessProjectId) in (select CONCAT(aul.AssessId,aul.UserId,aug.AssessProjectId) from tb_assessuserlist aul left join tb_assessusergroup aug on aul.AssessId=aug.AssessId and aul.assessusergroupid=aug.Id where aug.assessgroupid in (?));\n" +
                    "delete from tb_assessuserlist where assessusergroupid in (select id from tb_assessusergroup where assessgroupid in (?));\n" +
                    "delete from tb_assessusergroup where assessgroupid in (?);\n" +
                    "delete from tb_assessgroup where id in (?);";
                this.mService.mDataModule.executeSql(sSql, [aGroupIds, aGroupIds, aGroupIds, aGroupIds, aGroupIds], function (error, result) {
                });
            }
            entities[OSAC.FieldName_EntityName] = OSAC.EntityClass_RAssessGroup;
            this.mService.mDataModule.saveOrUpdateEntities(this.mUserId, entities, function (error, result) {
                if (error) {
                    callback(error);
                    return;
                }
                //修改考点后，更新分组信息
                var sSql = "update tb_assessuserlist aul left join tb_assessusergroup aug on aul.AssessId=aug.AssessId and aul.AssessUserGroupId=aug.Id\n" +
                    "left join tb_assessgroup ag on aul.AssessId=ag.AssessId and aug.AssessGroupId=ag.Id set aul.Score=null,aul.State=0 \n" +
                    "where ag.Id in (?) and ag.AssessProjectId<>aug.AssessProjectId;\n" +
                    "update tb_assessusergroup aug left join tb_assessgroup ag on aug.AssessId=ag.AssessId and aug.AssessGroupId=ag.Id\n" +
                    "set aug.AssessProjectId=ag.AssessProjectId,aug.ExaminerUserIds=ag.ExaminerUserIds where ag.Id in (?);";
                this.mService.mDataModule.executeSql(sSql, [aUpdateGroupIds, aUpdateGroupIds], function (error, result) {
                });
                callback(null, entities);
            }.bind(this));
        };
        BaseRMdAssessService.prototype.addAssessUserGroup = function (isDeleteOtherUser, entities, callback) {
            var aGroupIds = [];
            async.auto({
                DeleteGroup: function (callback) {
                    for (var i = 0; i < entities.Rows.length; i++) {
                        var row = entities.Rows[i];
                        if (row[OSAC.FieldName_RecordState] === GBC.RecordState_Delete) {
                            aGroupIds.push(row[OSAC.FieldName_Id]);
                        }
                    }
                    if (aGroupIds.length > 0) {
                        var sSql = "delete from tb_assessuserscore where CONCAT(AssessId,UserId,AssessProjectId) in (select CONCAT(aul.AssessId,aul.UserId,aug.AssessProjectId) from tb_assessuserlist aul left join tb_assessusergroup aug on aul.AssessId=aug.AssessId and aul.assessusergroupid=aug.Id where aug.id in (?));\n" +
                            "delete from tb_assessexamineruserscore where CONCAT(AssessId,UserId,AssessProjectId) in (select CONCAT(aul.AssessId,aul.UserId,aug.AssessProjectId) from tb_assessuserlist aul left join tb_assessusergroup aug on aul.AssessId=aug.AssessId and aul.assessusergroupid=aug.Id where aug.id in (?));\n" +
                            "delete from tb_assessusergroup where id in (?);\n" +
                            "delete from tb_assessuserlist where assessusergroupid in (select id from tb_assessusergroup where id in (?));\n";
                        this.mService.mDataModule.executeSql(sSql, [aGroupIds, aGroupIds, aGroupIds, aGroupIds], callback);
                    } else {
                        callback(null, GBC.RESULT_SUCCESS);
                    }
                }.bind(this),
                SaveAssessUserList: ["DeleteGroup", function (results, callback) {
                    async.mapLimit(entities.Rows, 1, function (item, callback) {
                        if (RUtils.isEmptyString(item[OSAC.FieldName_Id])) {
                            item[OSAC.FieldName_AssessId] = this.mRow[OSAC.FieldName_Id];
                            this.mService.mDataModule.initNewRecord(item, this.mUserId);
                        }
                        if (item[OSAC.FieldName_RecordState] !== GBC.RecordState_Delete &&
                            item[OSAC.FieldName_RecordState] !== GBC.RecordState_Insert) {
                            item[OSAC.FieldName_RecordState] = GBC.RecordState_Update;
                        }
                        var aEntities = item[OSAC.EntityClass_RAssessUserList];
                        if (!RUtils.isEmptyData(aEntities)) {
                            this.addAssessUserList(item[OSAC.FieldName_Id], item[OSAC.FieldName_AssessGroupId], isDeleteOtherUser, aEntities, callback);
                        } else {
                            callback(null, GBC.RESULT_SUCCESS);
                        }
                    }.bind(this), function (error, results) {
                        if (error) {
                            callback(error);
                            return;
                        }
                        callback(null, GBC.RESULT_SUCCESS);
                    });
                }.bind(this)],
                SaveAssessGroup: ["SaveAssessUserList", function (results, callback) {
                    for (var i = 0; i < entities.Rows.length; i++) {
                        var row = entities.Rows[i];
                        if (RUtils.isEmptyString(row[OSAC.FieldName_StartDate])) {
                            row[OSAC.FieldName_StartDate] = this.mRow[OSAC.FieldName_StartDate];
                        }
                        if (RUtils.isEmptyString(row[OSAC.FieldName_EndDate])) {
                            row[OSAC.FieldName_EndDate] = this.mRow[OSAC.FieldName_EndDate];
                        }
                        row[OSAC.FieldName_AssessId] = this.mRow[OSAC.FieldName_Id];
                    }
                    entities[OSAC.FieldName_EntityName] = OSAC.EntityClass_RAssessUserGroup;
                    this.mService.mDataModule.saveOrUpdateEntities(this.mUserId, entities, callback);
                }.bind(this)]
            }, function (error, results) {
                if (error) {
                    callback(error);
                    return;
                }
                callback(null, results.SaveAssessGroup);
            }.bind(this));
        };
        BaseRMdAssessService.prototype.addAssessUser = function (entities, callback) {
            var aUserIds = [];
            for (var i = 0; i < entities.Rows.length; i++) {
                var row = entities.Rows[i];
                if (RUtils.isEmptyString(row[OSAC.FieldName_Id])) {
                    row[OSAC.FieldName_AssessId] = this.mRow[OSAC.FieldName_Id];
                    this.mService.mDataModule.initNewRecord(row, this.mUserId);
                }
                if (row[OSAC.FieldName_RecordState] === GBC.RecordState_Delete) {
                    aUserIds.push(row[OSAC.FieldName_UserId]);
                }
            }
            if (aUserIds.length > 0) {
                var sSql = "delete from tb_assessuserlist where userid in (?);delete from tb_assessuser where userid in (?);";
                this.mService.mDataModule.executeSql(sSql, [aUserIds, aUserIds], function (error, result) {
                    entities[OSAC.FieldName_EntityName] = OSAC.EntityClass_RAssessUser;
                    this.mService.mDataModule.saveOrUpdateEntities(this.mUserId, entities, callback);
                }.bind(this));
            } else {
                entities[OSAC.FieldName_EntityName] = OSAC.EntityClass_RAssessUser;
                this.mService.mDataModule.saveOrUpdateEntities(this.mUserId, entities, callback);
            }
        };
        BaseRMdAssessService.prototype.addAssessUserList = function (userGroupId, assessGroupId, isDeleteOtherUser, entities, callback) {
            var aUserIds = RUtils.getFieldArray(entities, OSAC.FieldName_UserId);
            var aDeleteIds = [];
            async.auto({
                GetUser: function (callback) {
                    this.getUserByCondition(aUserIds, callback);
                }.bind(this),
                DeleteOtherUser: ["GetUser", function (results, callback) {//操作考时，清除同类分组内的数据
                    if (!isDeleteOtherUser) {
                        callback(null, GBC.RESULT_SUCCESS);
                        return;
                    }
                    var aUserEntities = results.GetUser;
                    var aSqls = [];
                    RHelper.buildEntitesIndexX(aUserEntities, OSAC.FieldName_Id);
                    for (var i = 0; i < entities.Rows.length; i++) {
                        var row = entities.Rows[i];
                        delete row.Score;
                        if (RUtils.isEmptyString(row[OSAC.FieldName_Id])) {
                            row[OSAC.FieldName_AssessId] = this.mRow[OSAC.FieldName_Id];
                            row[OSAC.FieldName_AssessUserGroupId] = row[OSAC.FieldName_AssessUserGroupId] || userGroupId;
                            this.mService.mDataModule.initNewRecord(row, this.mUserId);
                        } else {
                            if (RUtils.isEmptyString(row[OSAC.FieldName_RecordState])) {
                                row[OSAC.FieldName_RecordState] = GBC.RecordState_Update;
                            }
                            if (!RUtils.isEmptyString(userGroupId)) {
                                row[OSAC.FieldName_AssessUserGroupId] = userGroupId;
                            }
                        }
                        if (row[OSAC.FieldName_RecordState] === GBC.RecordState_Delete) {
                            aDeleteIds.push(row[OSAC.FieldName_Id]);
                        } else if (row[OSAC.FieldName_RecordState] === GBC.RecordState_Insert && !RUtils.isEmptyString(assessGroupId)) {//清除打分数据和删除原分组人员
                            var sSql = "delete from tb_assessuserscore where AssessId=? and UserId=? and AssessProjectId in (\n" +
                                "select AssessProjectId from tb_assessgroup where AssessId=? and GroupTypeName=(\n" +
                                "select GroupTypeName from tb_assessgroup where AssessId=? and Id=?));\n" +
                                "delete from tb_assessexamineruserscore where AssessId=? and UserId=? and AssessProjectId in (\n" +
                                "select AssessProjectId from tb_assessgroup where AssessId=? and GroupTypeName=(\n" +
                                "select GroupTypeName from tb_assessgroup where AssessId=? and Id=?));\n" +
                                "delete from tb_assessuserlist where assessid=? and userid=? and assessusergroupid in (\n" +
                                "select aug.Id from tb_assessusergroup aug left join tb_assessgroup ag on aug.AssessId=ag.AssessId and aug.AssessGroupId=ag.Id\n" +
                                "where aug.AssessId=? and ag.GroupTypeName=(select ag.GroupTypeName from tb_assessgroup ag\n" +
                                "where ag.AssessId=? and ag.Id=?)) and assessusergroupid<>?;\n";
                            var s = Number(row[OSAC.FieldName_StartDate].substr(6));
                            var sStartDate = RDateUtils.formatEmptyDatetime("yyyy-MM-dd HH:mm", new Date(s));
                            s = Number(row[OSAC.FieldName_EndDate].substr(6));
                            var sEndDate = RDateUtils.formatEmptyDatetime("yyyy-MM-dd HH:mm", new Date(s));
                            var oSql = {
                                qcode: 'UpdateUser',
                                sql: sSql,
                                values: [row[OSAC.FieldName_AssessId], row[OSAC.FieldName_UserId], row[OSAC.FieldName_AssessId],
                                    row[OSAC.FieldName_AssessId], assessGroupId, row[OSAC.FieldName_AssessId], row[OSAC.FieldName_UserId],
                                    row[OSAC.FieldName_AssessId], row[OSAC.FieldName_AssessId], assessGroupId, row[OSAC.FieldName_AssessId],
                                    row[OSAC.FieldName_UserId], row[OSAC.FieldName_AssessId], row[OSAC.FieldName_AssessId], assessGroupId, row[OSAC.FieldName_AssessUserGroupId]]
                            };
                            aSqls.push(oSql);
                        }
                    }
                    if (aDeleteIds.length > 0) {
                        var sSql = "delete from tb_assessuserlist where id in (?);";
                        var oSql = {
                            qcode: 'UpdateUser',
                            sql: sSql,
                            values: [aDeleteIds]
                        };
                        aSqls.push(oSql);
                    }
                    this.mService.mDataModule.executeTransaction(aSqls, callback);
                }.bind(this)],
                SaveAssessUserList: ["GetUser", "DeleteOtherUser", function (results, callback) {
                    var aUserEntities = results.GetUser;
                    RHelper.buildEntitesIndexX(aUserEntities, OSAC.FieldName_Id);
                    for (var i = 0; i < entities.Rows.length; i++) {
                        var row = entities.Rows[i];
                        if (RUtils.isEmptyString(row[OSAC.FieldName_Id])) {
                            row[OSAC.FieldName_AssessId] = this.mRow[OSAC.FieldName_Id];
                            row[OSAC.FieldName_AssessUserGroupId] = userGroupId;
                            this.mService.mDataModule.initNewRecord(row, this.mUserId);
                        } else {
                            if (RUtils.isEmptyString(row[OSAC.FieldName_RecordState])) {
                                row[OSAC.FieldName_RecordState] = GBC.RecordState_Update;
                            }
                            if (!RUtils.isEmptyString(userGroupId)) {
                                row[OSAC.FieldName_AssessUserGroupId] = userGroupId;
                            }
                        }
                        if (RUtils.isEmptyString(row[OSAC.FieldName_StartDate])) {
                            row[OSAC.FieldName_StartDate] = this.mRow[OSAC.FieldName_StartDate];
                        }
                        if (RUtils.isEmptyString(row[OSAC.FieldName_EndDate])) {
                            row[OSAC.FieldName_EndDate] = this.mRow[OSAC.FieldName_EndDate];
                        }
                        var sUserId = row[OSAC.FieldName_UserId];
                        var oUser = aUserEntities[sUserId];
                        if (oUser) {
                            row[OSAC.FieldName_TXUserId] = oUser[OSAC.FieldName_TXUserId];
                        }
                        row[OSAC.FieldName_ItemIndex] = i;
                    }
                    entities[OSAC.FieldName_EntityName] = OSAC.EntityClass_RAssessUserList;
                    this.mService.mDataModule.saveOrUpdateEntities(this.mUserId, entities, callback);
                }.bind(this)]
            }, function (error, results) {
                if (error) {
                    callback(error);
                    return;
                }
                callback(null, results.SaveAssessUserList);
            }.bind(this));

        };
        BaseRMdAssessService.prototype.addAssessTestPaper = function (sourceType, sourceId, title, testPaperSettingEntities, type, callback) {
            var iPaperType = OSAC.PaperType_Formal;
            var obj = {};
            if (type === OSAC.AssessProjectType_TheorySimulation) {//理论考练习
                iPaperType = OSAC.PaperType_Simulation;
                obj[OSAC.FieldName_IsSubmitDisplayResult] = 1;
            }
            obj[OSAC.FieldName_Title] = title;
            obj[OSAC.FieldName_SourceType] = GBC.SourceType_TheoryAssess;
            obj[OSAC.FieldName_SourceId] = sourceId;
            obj[OSAC.FieldName_PaperType] = iPaperType;
            obj[OSAC.FieldName_DisplayMode] = OSAC.DisplayMode_Transverse;
            obj[OSAC.FieldName_State] = OSAC.State_Normal;
            if (testPaperSettingEntities) {
                testPaperSettingEntities[OSAC.FieldName_EntityName] = OSAC.EntityClass_RTestPaperSetting;
                obj[OSAC.EntityClass_RTestPaperSetting] = testPaperSettingEntities;
            }
            var oOption = {
                row: obj
            };
            this.mService.mOrganizationStructureProxy.excute('TestPaperService', 'addTestPaper', oOption, function (error, result) {
                if (error) {
                    callback(error);
                    return;
                }
                if (result[OSAC.FieldName_Code] !== GBC.RESULT_SUCCESS) {
                    callback(result[OSAC.FieldName_Data]);
                    return;
                }
                callback();
            }.bind(this));
        };
        BaseRMdAssessService.prototype.addPublishmTimer = function (assessId, publishStartDate, publishEndDate, callback) {
            async.auto({
                HandleStartDate: function (callback) {
                    var sKey = assessId + "_" + OSAC.AssessTimerType_Publish;
                    if (publishStartDate) {//添加计时器
                        var iTime = this.mService.mDataModule.dataJSONTodatetime(publishStartDate).getTime();
                        var oOption = {
                            scheduleKey: sKey,
                            scheduleStartTime: iTime,
                            type: OSAC.AssessTimerType_Publish,
                            assessId: assessId
                        };
                        this.mService.mSgTimerProxy.excute('TimerService', 'addTheoryTestSchedule', oOption, function (error, result) {
                            if (error) {
                                callback(error);
                                return;
                            }
                            if (result[OSAC.FieldName_Code] !== GBC.RESULT_SUCCESS) {
                                callback(result[OSAC.FieldName_Data]);
                                return;
                            }
                            callback();
                        }.bind(this));
                    } else {//删除计时器
                        var oOption = {
                            scheduleKey: sKey
                        };
                        this.mService.mSgTimerProxy.excute('TimerService', 'deleteSchedule', oOption, function (error, result) {
                            if (error) {
                                callback(error);
                                return;
                            }
                            if (result[OSAC.FieldName_Code] !== GBC.RESULT_SUCCESS) {
                                callback(result[OSAC.FieldName_Data]);
                                return;
                            }
                            callback();
                        }.bind(this));
                    }
                }.bind(this),
                HandleEndDate: function (callback) {
                    var sKey = assessId + "_" + OSAC.AssessTimerType_Revert;
                    if (publishEndDate) {//添加计时器
                        var iTime = this.mService.mDataModule.dataJSONTodatetime(publishEndDate).getTime();
                        var oOption = {
                            scheduleKey: sKey,
                            scheduleStartTime: iTime,
                            type: OSAC.AssessTimerType_Revert,
                            assessId: assessId
                        };
                        this.mService.mSgTimerProxy.excute('TimerService', 'addTheoryTestSchedule', oOption, function (error, result) {
                            if (error) {
                                callback(error);
                                return;
                            }
                            if (result[OSAC.FieldName_Code] !== GBC.RESULT_SUCCESS) {
                                callback(result[OSAC.FieldName_Data]);
                                return;
                            }
                            callback();
                        }.bind(this));
                    } else {//删除计时器
                        var oOption = {
                            scheduleKey: sKey
                        };
                        this.mService.mSgTimerProxy.excute('TimerService', 'deleteSchedule', oOption, function (error, result) {
                            if (error) {
                                callback(error);
                                return;
                            }
                            if (result[OSAC.FieldName_Code] !== GBC.RESULT_SUCCESS) {
                                callback(result[OSAC.FieldName_Data]);
                                return;
                            }
                            callback();
                        }.bind(this));
                    }
                }.bind(this)
            }, function (error, results) {
                if (error) {
                    callback(error);
                    return;
                }
                callback();
            });
        };
    }
}

rs.registerClass(BaseRMdAssessService);

function AddAssessAction(service) {
    if (rs.isDefClass(AddAssessAction)) {
        this.mService = service;
    } else {
        rs.inherit(AddAssessAction, BaseRMdAssessService);
        rs.defClass(AddAssessAction);
        AddAssessAction.prototype.setup = function () {

        };
        AddAssessAction.prototype.addAssess = function (callback) {
            this.mRow[OSAC.FieldName_SourceType] = this.mSourceType;
            this.mRow[OSAC.FieldName_SourceId] = this.mSourceId;
            this.mRow[OSAC.FieldName_State] = OSAC.State_Normal;
            if (RUtils.isEmptyString(this.mRow[OSAC.FieldName_StartDate])) {
                this.mRow[OSAC.FieldName_StartDate] = this.mService.mDataModule.getServerTime();
            }
            this.mService.mDataModule.initNewRecord(this.mRow, this.mUserId);
            var aEntities = RHelper.makeEntities(OSAC.EntityClass_RAssess);
            aEntities.Rows.push(this.mRow);
            this.mService.mDataModule.saveOrUpdateEntities(this.mUserId, aEntities, callback);
        };

        AddAssessAction.prototype.execute = function (sourceType, sourceId, row, callback) {
            var oTokenInfo = getNamespace(WCT.LOCALSTORAGE_NAMESPACE_WEBAPPHANDLER).get(GBC.LOCALSTORAGE_TOKENPAYLOAD);
            this.mUserId = oTokenInfo[OSAC.FieldName_UserId];
            this.mSourceType = sourceType;
            this.mSourceId = sourceId;
            this.mRow = row;
            async.auto({
                AddAssess: function (callback) {
                    this.addAssess(callback);
                }.bind(this),
                AddAssessUser: ["AddAssess", function (results, callback) {
                    var aEntities = this.mRow[OSAC.EntityClass_RAssessUser];
                    if (RUtils.isEmptyData(aEntities)) {
                        callback();
                        return;
                    }
                    this.addAssessUser(aEntities, callback);
                }.bind(this)],
                AddAssessUserGroup: ["AddAssess", function (results, callback) {
                    var aEntities = this.mRow[OSAC.EntityClass_RAssessUserGroup];
                    if (RUtils.isEmptyData(aEntities)) {
                        callback();
                        return;
                    }
                    this.addAssessUserGroup(true, aEntities, callback);
                }.bind(this)],
                addAssessGroup: ["AddAssess", function (results, callback) {
                    var aEntities = this.mRow[OSAC.EntityClass_RAssessGroup];
                    if (RUtils.isEmptyData(aEntities)) {
                        callback();
                        return;
                    }
                    this.addAssessGroup(aEntities, callback);
                }.bind(this)],
                AddAssessUserList: ["AddAssess", function (results, callback) {
                    var aEntities = this.mRow[OSAC.EntityClass_RAssessUserList];
                    if (RUtils.isEmptyData(aEntities)) {
                        callback();
                        return;
                    }
                    this.addAssessUserList("", "", true, aEntities, callback);
                }.bind(this)],
                AddAssessTestPaper: ["AddAssess", function (results, callback) {//添加理论考核的试卷
                    if (this.mRow[OSAC.FieldName_Type] === OSAC.AssessProjectType_Theory ||
                        this.mRow[OSAC.FieldName_Type] === OSAC.AssessProjectType_TheorySimulation
                    ) {//理论考，需要生成试题
                        this.addAssessTestPaper(this.mSourceType, this.mRow[OSAC.FieldName_Id], this.mRow[OSAC.FieldName_Title],
                            this.mRow[OSAC.EntityClass_RTestPaperSetting], this.mRow[OSAC.FieldName_Type], callback);
                    } else {
                        callback();
                    }
                }.bind(this)],
                AddPublishmTimer: ["AddAssess", function (results, callback) {//添加定时发布定时撤回的定时器
                    this.addPublishmTimer(this.mRow[OSAC.FieldName_Id], this.mRow[OSAC.FieldName_PublishStartDate],
                        this.mRow[OSAC.FieldName_PublishEndDate], callback);
                }.bind(this)]
            }, function (error, results) {
                if (error) {
                    callback(error);
                    return;
                }
                if (!RUtils.isEmptyData(results.AddAssess)) {
                    results.AddAssess.Rows[0][OSAC.EntityClass_RAssessUserList] = results.AddAssessUserList;
                }
                callback(null, results.AddAssess);
            });
        };
    }
}

rs.registerClass(AddAssessAction);


function AddClinicalAssessAction(service) {
    if (rs.isDefClass(AddClinicalAssessAction)) {
        this.mService = service;
    } else {
        rs.inherit(AddClinicalAssessAction, BaseRMdAssessService);
        rs.defClass(AddClinicalAssessAction);
        AddClinicalAssessAction.prototype.setup = function () {

        };
        AddClinicalAssessAction.prototype.addAssess = function (callback) {
            this.mRow[OSAC.FieldName_SourceType] = this.mSourceType;
            this.mRow[OSAC.FieldName_SourceId] = this.mSourceId;
            // this.mRow[OSAC.FieldName_State] = OSAC.State_Normal;
            if (RUtils.isEmptyString(this.mRow[OSAC.FieldName_StartDate])) {
                this.mRow[OSAC.FieldName_StartDate] = this.mService.mDataModule.getServerTime();
            }
            this.mService.mDataModule.initNewRecord(this.mRow, this.mUserId);
            var aEntities = RHelper.makeEntities(OSAC.EntityClass_RAssess);
            aEntities.Rows.push(this.mRow);
            this.mService.mDataModule.saveOrUpdateEntities(this.mUserId, aEntities, callback);
        };

        AddClinicalAssessAction.prototype.execute = function (row, callback) {
            var oTokenInfo = getNamespace(WCT.LOCALSTORAGE_NAMESPACE_WEBAPPHANDLER).get(GBC.LOCALSTORAGE_TOKENPAYLOAD);
            this.mUserId = oTokenInfo[OSAC.FieldName_UserId];
            this.mSourceType = GBC.SourceType_User;
            this.mSourceId = this.mUserId;
            this.mDepartmentId = row[OSAC.FieldName_DepartmentId];
            this.mAssessProjectId = row[OSAC.FieldName_AssessProjectId];
            this.mRow = row;
            async.auto({
                GetDepartmentInfo: function (callback) {
                    if (!RUtils.isEmptyString(this.mDepartmentId)){
                        var sSql = "SELECT * from tb_departmentsupply where State!=99 and Id=?";
                        this.mService.mDataModule.querySql(sSql, [this.mDepartmentId], callback);
                    } else {
                        var sSql = "SELECT c.* from tb_departmentmember a,tb_employeesupply b,tb_departmentsupply c where a.EmployeeId = b.Id and a.DepartmentId = c.Id and b.UserId = ?";
                        this.mService.mDataModule.querySql(sSql, [this.mRow[OSAC.FieldName_UserId]], callback);
                    }

                }.bind(this),
                AddAssess: ["GetDepartmentInfo", function (results, callback) {
                    this.mRow[OSAC.FieldName_Title] = "";
                    var aDepartmentEntities = results.GetDepartmentInfo;
                    var sDepartmentName = "";
                    if (!RUtils.isEmptyData(aDepartmentEntities)) {
                        sDepartmentName = aDepartmentEntities.Rows[0][OSAC.FieldName_Name];
                        this.mRow[OSAC.FieldName_DepartmentId] = aDepartmentEntities.Rows[0][OSAC.FieldName_Id];
                        this.mDepartmentId = row[OSAC.FieldName_DepartmentId];
                    }
                    var sCurrentDate = RDateUtils.formatEmptyDatetime("yyyy年MM月dd日", new Date());
                    this.mRow[OSAC.FieldName_Title] = sCurrentDate + "_" + sDepartmentName;
                    this.mRow[OSAC.FieldName_Address] = sDepartmentName;
                    this.mRow[OSAC.FieldName_ResponsibleUserIds] = this.mUserId;
                    this.mRow[OSAC.FieldName_ExaminerUserIds] = JSON.stringify([{ExaminerUserIds: this.mUserId}]);
                    this.mRow[OSAC.FieldName_Params] = JSON.stringify({});
                    this.mRow[OSAC.FieldName_AssessProjectIds] = this.mAssessProjectId;
                    this.mRow[OSAC.FieldName_Type] = OSAC.AssessProjectType_Operation;
                    var now = new Date();
                    this.mRow[OSAC.FieldName_StartDate] = this.mService.mDataModule.datetimeToJSON(now);
                    var time = now.getTime() + 1000 * 60 * 30;
                    var dDate = new Date(time);
                    this.mRow[OSAC.FieldName_EndDate] = RDateUtils.convertToStandFormat(dDate);
                    this.mRow[OSAC.FieldName_PublishDate] = this.mRow[OSAC.FieldName_EndDate];
                    this.mRow[OSAC.FieldName_State] = OSAC.State_Publish;
                    this.mRow[OSAC.FieldName_PublishScore] = OSAC.State_Normal;
                    this.mRow[OSAC.FieldName_PublishScoreDate] = this.mRow[OSAC.FieldName_EndDate];
                    var aAssessUserEntities = RHelper.makeEntities(OSAC.EntityClass_RAssessUser);
                    aAssessUserEntities.Rows.push({
                        UserId: row[OSAC.FieldName_UserId],
                        DepartmentId: this.mDepartmentId
                    });
                    this.mRow[OSAC.EntityClass_RAssessUser] = aAssessUserEntities;

                    var aAssessUserGroupEntities = RHelper.makeEntities(OSAC.EntityClass_RAssessUserGroup);
                    aAssessUserGroupEntities.Rows.push({
                        AssessProjectId: row[OSAC.FieldName_AssessProjectId],
                        ExaminerUserIds: this.mUserId,
                        StartDate: this.mRow[OSAC.FieldName_StartDate],
                        EndDate: this.mRow[OSAC.FieldName_EndDate]
                    });
                    this.mRow[OSAC.EntityClass_RAssessUserGroup] = aAssessUserGroupEntities;

                    var aAssessGroupEntities = RHelper.makeEntities(OSAC.EntityClass_RAssessGroup);
                    aAssessGroupEntities.Rows.push({
                        AssessProjectId: row[OSAC.FieldName_AssessProjectId],
                        ExaminerUserIds: this.mUserId
                    });
                    this.mRow[OSAC.EntityClass_RAssessGroup] = aAssessGroupEntities;
                    var aAssessUserListEntities = RHelper.makeEntities(OSAC.EntityClass_RAssessUserList);
                    aAssessUserListEntities.Rows.push({
                        UserId: row[OSAC.FieldName_UserId],
                        DepartmentId: this.mDepartmentId,
                        Address: row[OSAC.FieldName_Address],
                        StartDate: this.mRow[OSAC.FieldName_StartDate],
                        EndDate: this.mRow[OSAC.FieldName_EndDate]
                    });
                    this.mRow[OSAC.EntityClass_RAssessUserList] = aAssessUserListEntities;

                    this.addAssess(callback);
                }.bind(this)],
                AddAssessUser: ["AddAssess", function (results, callback) {
                    var aEntities = this.mRow[OSAC.EntityClass_RAssessUser];
                    if (RUtils.isEmptyData(aEntities)) {
                        callback();
                        return;
                    }
                    this.addAssessUser(aEntities, callback);
                }.bind(this)],
                AddAssessUserGroup: ["AddAssess", function (results, callback) {
                    var aEntities = this.mRow[OSAC.EntityClass_RAssessUserGroup];
                    if (RUtils.isEmptyData(aEntities)) {
                        callback();
                        return;
                    }
                    this.addAssessUserGroup(true, aEntities, callback);
                }.bind(this)],
                addAssessGroup: ["AddAssess", function (results, callback) {
                    var aEntities = this.mRow[OSAC.EntityClass_RAssessGroup];
                    if (RUtils.isEmptyData(aEntities)) {
                        callback();
                        return;
                    }
                    this.addAssessGroup(aEntities, callback);
                }.bind(this)],
                AddAssessUserList: ["AddAssess", function (results, callback) {
                    var aEntities = this.mRow[OSAC.EntityClass_RAssessUserList];
                    if (RUtils.isEmptyData(aEntities)) {
                        callback();
                        return;
                    }
                    this.addAssessUserList(this.mRow[OSAC.EntityClass_RAssessUserGroup].Rows[0][OSAC.FieldName_Id], this.mRow[OSAC.EntityClass_RAssessGroup].Rows[0][OSAC.FieldName_Id], true, aEntities, callback);
                }.bind(this)],
                GetAssess: ["AddAssessUserList", function (results, callback) {
                    var oCondition = {"_filter": {}};
                    oCondition[OSAC.FieldName_Id] = this.mRow[OSAC.FieldName_Id];
                    oCondition[OSAC.Condition_filter][OSAC.Condition_filter_showUserList] = 1;
                    oCondition[OSAC.Condition_filter][OSAC.Condition_filter_showUser] = 1;
                    oCondition[OSAC.Condition_filter][OSAC.Condition_filter_showExaminerUser] = 1;
                    this.mService.getAssessByCondition(oCondition, callback);
                }.bind(this)]
            }, function (error, results) {
                if (error) {
                    callback(error);
                    return;
                }
                // if (!RUtils.isEmptyData(results.AddAssess)) {
                //     results.AddAssess.Rows[0][OSAC.EntityClass_RAssessUserList] = results.AddAssessUserList;
                // }
                callback(null, results.GetAssess);
            });
        };
    }
}

rs.registerClass(AddClinicalAssessAction);


function ModifyAssessAction(service) {
    if (rs.isDefClass(ModifyAssessAction)) {
        this.mService = service;
    } else {
        rs.inherit(ModifyAssessAction, BaseRMdAssessService);
        rs.defClass(ModifyAssessAction);
        ModifyAssessAction.prototype.setup = function () {

        };
        ModifyAssessAction.prototype.executeAsync = function (oAssess, aAssessUserEntitis) {
            if (RUtils.isNullObject(oAssess) || RUtils.isEmptyData(aAssessUserEntitis)) {
                return;
            }
            if (RUtils.isEmptyString(oAssess[OSAC.FieldName_NoticeId])) {
                return;
            }
            async.auto({
                AddScopeTarget: function (callback) {//添加白名单
                    var aScopeTargetEntities = {Rows: []};
                    aAssessUserEntitis.Rows.forEach(function (row) {
                        var oScopeTarget = {
                            ScopeType: OSAC.ScopeType_PublishWhiteList,
                            TargetType: GBC.TargetType_User,
                            TargetId: row[OSAC.FieldName_UserId]
                        };
                        aScopeTargetEntities.Rows.push(oScopeTarget);
                    });
                    var oOptions = {
                        newsUpdateId: oAssess[OSAC.FieldName_NoticeId],
                        scopeTargetEntities: aScopeTargetEntities
                    };
                    this.mService.mBrNewsupdateProxy.excute('NewsUpdateService', 'addScopeTarget', oOptions, function (error, result) {
                        if (error) {
                            callback(error);
                            return;
                        }
                        if (result[PJAC.FieldName_Code] !== GBC.RESULT_SUCCESS) {
                            callback(error);
                            return;
                        }
                        callback(null);
                    });
                }.bind(this),
                ModifyNoticeSignUserList: function (callback) {
                    var oOptions = {
                        newsUpdateId: oAssess[OSAC.FieldName_NoticeId],
                        newsUpdate: {
                            IsCheckNotExistSignPost: false,
                            SignUserIdList: _.map(aAssessUserEntitis.Rows, OSAC.FieldName_UserId)
                        }
                    };
                    this.mService.mBrNewsupdateProxy.excute('NewsUpdateService', 'updateNewsUpdate', oOptions, function (error, result) {
                        if (error) {
                            callback(error);
                            return;
                        }
                        if (result[PJAC.FieldName_Code] !== GBC.RESULT_SUCCESS) {
                            callback(error);
                            return;
                        }
                        callback();
                    });
                }.bind(this),

            }, function (error, results) {
                if (error) {
                    console.log(error);
                    return;
                }
            });
        };


        ModifyAssessAction.prototype.modifyAssessUserList = function (assess, newEntities, orgEntities, callback) {
            var aDeleteIds = [];
            RHelper.buildEntitesIndexX(orgEntities, OSAC.FieldName_UserId);
            var aEntities = RHelper.makeEntities(OSAC.EntityClass_RAssessUserList);
            for (var i = 0; i < newEntities.Rows.length; i++) {
                var row = newEntities.Rows[i];
                if (row[OSAC.FieldName_RecordState] === GBC.RecordState_Delete) {//是删除的，记录Id删除数据
                    aDeleteIds.push(row[OSAC.FieldName_Id]);
                    continue;
                }
                var sUserId = row[OSAC.FieldName_UserId];
                var obj = orgEntities[sUserId];
                if (obj) {//存在。修改
                    RHelper.setFieldValue(obj, OSAC.FieldName_AssessCount, row[OSAC.FieldName_AssessCount]);
                    RHelper.setFieldValue(obj, OSAC.FieldName_StartDate, row[OSAC.FieldName_StartDate]);
                    RHelper.setFieldValue(obj, OSAC.FieldName_EndDate, row[OSAC.FieldName_EndDate]);
                    RHelper.setFieldValue(obj, OSAC.FieldName_Address, row[OSAC.FieldName_Address]);
                    RHelper.setFieldValue(obj, OSAC.FieldName_GroupTypeName, row[OSAC.FieldName_GroupTypeName]);
                    aEntities.Rows.push(obj);
                } else {//添加
                    this.mService.mDataModule.initNewRecord(row, this.mUserId);
                    row[OSAC.FieldName_AssessId] = this.mAssessId;
                    if (RUtils.isEmptyString(row[OSAC.FieldName_StartDate])) {
                        row[OSAC.FieldName_StartDate] = assess[OSAC.FieldName_StartDate];
                    }
                    if (RUtils.isEmptyString(row[OSAC.FieldName_EndDate])) {
                        row[OSAC.FieldName_EndDate] = assess[OSAC.FieldName_EndDate];
                    }
                    aEntities.Rows.push(row);
                }
            }
            aEntities[OSAC.FieldName_EntityName] = OSAC.EntityClass_RAssessUserList;
            async.waterfall([
                function (callback) {
                    this.mService.mDataModule.saveOrUpdateEntities(this.mUserId, aEntities, callback);
                }.bind(this),
                function (result, callback) {
                    if (aDeleteIds.length === 0) {
                        callback();
                        return;
                    }
                    var sSql = "DELETE from tb_assessuserlist where Id in(?);";
                    this.mService.mDataModule.executeSql(sSql, [aDeleteIds], callback);
                }.bind(this)], callback
            );
        };
        ModifyAssessAction.prototype.mdifyAssess = function (assess, callback) {
            RHelper.setFieldValue(assess, OSAC.FieldName_Title, this.mRow[OSAC.FieldName_Title]);
            RHelper.setFieldValue(assess, OSAC.FieldName_AssessProjectIds, this.mRow[OSAC.FieldName_AssessProjectIds]);
            RHelper.setFieldValue(assess, OSAC.FieldName_Content, this.mRow[OSAC.FieldName_Content]);
            RHelper.setFieldValue(assess, OSAC.FieldName_StartDate, this.mRow[OSAC.FieldName_StartDate]);
            RHelper.setFieldValue(assess, OSAC.FieldName_EndDate, this.mRow[OSAC.FieldName_EndDate]);
            RHelper.setFieldValue(assess, OSAC.FieldName_Address, this.mRow[OSAC.FieldName_Address]);
            RHelper.setFieldValue(assess, OSAC.FieldName_Type, this.mRow[OSAC.FieldName_Type]);
            RHelper.setFieldValue(assess, OSAC.FieldName_State, this.mRow[OSAC.FieldName_State]);
            RHelper.setFieldValue(assess, OSAC.FieldName_ExaminerUserIds, this.mRow[OSAC.FieldName_ExaminerUserIds]);
            RHelper.setFieldValue(assess, OSAC.FieldName_ResponsibleUserIds, this.mRow[OSAC.FieldName_ResponsibleUserIds]);
            RHelper.setFieldValue(assess, OSAC.FieldName_PublishEndDate, this.mRow[OSAC.FieldName_PublishEndDate]);
            RHelper.setFieldValue(assess, OSAC.FieldName_PublishStartDate, this.mRow[OSAC.FieldName_PublishStartDate]);
            RHelper.setFieldValue(assess, OSAC.FieldName_Params, this.mRow[OSAC.FieldName_Params]);
            RHelper.setFieldValue(assess, OSAC.FieldName_OpenSignUp, this.mRow[OSAC.FieldName_OpenSignUp]);
            RHelper.setFieldValue(assess, OSAC.FieldName_SignUpEndDate, this.mRow[OSAC.FieldName_SignUpEndDate]);
            var aEntities = RHelper.makeEntities(OSAC.EntityClass_RAssess);
            aEntities.Rows.push(assess);
            this.mService.mDataModule.saveOrUpdateEntities(this.mUserId, aEntities, function (error, result) {
                if (error) {
                    callback(error);
                    return;
                }
                callback(null, aEntities);
            });
        };

        ModifyAssessAction.prototype.deleteUserScore = function (assess, callback) {
            if (assess[OSAC.FieldName_Type] === OSAC.AssessProjectType_Operation) {
                //处理操作考的打分规则变更后
                var iScoreRole = OSAC.AssessOperation_ScoreRole_Unite;
                var sParams = assess.Params;
                var oParams = JSON.parse(sParams);
                if (!RUtils.isEmptyString(oParams.ScoreRole)) {
                    iScoreRole = oParams.ScoreRole;
                }
                var iNewScoreRole = OSAC.AssessOperation_ScoreRole_Unite;
                var sNewParams = this.mRow[OSAC.FieldName_Params];
                var oNewParams = JSON.parse(sNewParams);
                if (!RUtils.isEmptyString(oNewParams.ScoreRole)) {
                    iNewScoreRole = oNewParams.ScoreRole;
                }
                if (iScoreRole !== iNewScoreRole) {
                    var sSql = "delete from tb_assessuserscore where AssessId=?; \n" +
                        "delete from tb_assessexamineruserscore where AssessId=?;\n" +
                        "update tb_assessuserlist set Score=null,State=0 where AssessId=?;";
                    var aValues = [this.mAssessId, this.mAssessId, this.mAssessId];
                    this.mService.mDataModule.executeSql(sSql, aValues, callback);
                    return;
                }
            }
            callback(null, GBC.RESULT_SUCCESS);
        };

        ModifyAssessAction.prototype.getAssessUserList = function (callback) {
            var sSql = "SELECT * from tb_assessuserlist where AssessId=?";
            var aValues = [this.mAssessId];
            this.mService.mDataModule.querySql(sSql, aValues, callback);
        };
        ModifyAssessAction.prototype.delAssessUserGroup = function (callback) {
            var sSql = "delete from tb_assessusergroup where AssessId=?; \n" +
                "delete from tb_assessuserlist where AssessId=?;";
            var aValues = [this.mAssessId, this.mAssessId];
            this.mService.mDataModule.executeSql(sSql, aValues, callback);
        };
        ModifyAssessAction.prototype.getAssessTestPaperId = function (assessId, callback) {
            var sSql = "SELECT * from tb_testpaper where SourceId=? and SourceType=? and State!=99";
            var aValues = [assessId, GBC.SourceType_TheoryAssess];
            this.mService.mDataModule.querySql(sSql, aValues, function (error, result) {
                if (error) {
                    callback(error);
                    return;
                }
                if (RUtils.isEmptyData(result)) {
                    callback();
                    return;
                }
                callback(null, result.Rows[0][OSAC.FieldName_Id]);
            });
        };
        ModifyAssessAction.prototype.modifyTestPaper = function (assessInfo, testPaperId, callback) {
            if (RUtils.isEmptyString(testPaperId)) {//没有试卷，先创建
                this.addAssessTestPaper(assessInfo[OSAC.FieldName_SourceType], assessInfo[OSAC.FieldName_Id],
                    this.mRow[OSAC.FieldName_Title], this.mRow[OSAC.EntityClass_RTestPaperSetting], assessInfo[OSAC.FieldName_Type], callback);
                return;
            }
            var obj = {};
            this.mRow[OSAC.EntityClass_RTestPaperSetting][OSAC.FieldName_EntityName] = OSAC.EntityClass_RTestPaperSetting;
            obj[OSAC.EntityClass_RTestPaperSetting] = this.mRow[OSAC.EntityClass_RTestPaperSetting];
            obj[OSAC.FieldName_Title] = this.mRow[OSAC.FieldName_Title];
            var oOption = {
                id: testPaperId,
                row: obj
            };
            this.mService.mOrganizationStructureProxy.excute('TestPaperService', 'modifyTestPaper', oOption, function (error, result) {
                if (error) {
                    callback(error);
                    return;
                }
                if (result[OSAC.FieldName_Code] !== GBC.RESULT_SUCCESS) {
                    callback(result[OSAC.FieldName_Data]);
                    return;
                }
                callback();
            }.bind(this));
        };
        ModifyAssessAction.prototype.deleteCache = function (assess, callback) {//清除缓存
            RMdToDoListUtils.deleteTrainingInfo_Cache(this.mService.mDataModule, GBC.ProductCode_Medical, assess[OSAC.FieldName_Id], function () {
            });
            RMdToDoListUtils.deleteTrainingInfo_Cache(this.mService.mDataModule, GBC.ProductCode_Medical, assess[OSAC.FieldName_NoticeId], function () {
            });
            var iSourceType = GBC.SourceType_Notice_Assess;
            if (assess[OSAC.FieldName_SourceType] === GBC.SourceType_Trainee) {
                iSourceType = GBC.SourceType_ProjectMemoAssess;
            }
            RMdToDoListUtils.deletePart_Cache(this.mService.mDataModule, GBC.ProductCode_Medical, iSourceType, function () {
            });
            callback(null, GBC.RESULT_SUCCESS);
        };
        ModifyAssessAction.prototype.execute = function (assessId, row, callback) {
            var oTokenInfo = getNamespace(WCT.LOCALSTORAGE_NAMESPACE_WEBAPPHANDLER).get(GBC.LOCALSTORAGE_TOKENPAYLOAD);
            this.mUserId = oTokenInfo[OSAC.FieldName_UserId];
            this.mAssessId = assessId;
            this.mRow = row;
            if (RUtils.isArray(this.mRow[OSAC.FieldName_ExaminerUserIds])) {
                this.mRow[OSAC.FieldName_ExaminerUserIds] = this.mRow[OSAC.FieldName_ExaminerUserIds].join(";");
            }
            async.auto({
                GetAssess: function (callback) {
                    this.getAssess(this.mAssessId, callback);
                }.bind(this),
                DeleteUserScore: ["GetAssess", function (results, callback) {
                    this.deleteUserScore(results.GetAssess, callback);
                }.bind(this)],
                ModifyAssess: ["GetAssess", function (results, callback) {
                    this.mdifyAssess(results.GetAssess, callback);
                }.bind(this)],
                ModifyAssessGroup: ["GetAssess", function (results, callback) {
                    var aEntities = this.mRow[OSAC.EntityClass_RAssessGroup];
                    if (OSAC.AssessProjectType_Operation !== this.mRow[OSAC.FieldName_Type]
                        || RUtils.isEmptyData(aEntities)) {
                        callback();
                        return;
                    }
                    this.addAssessGroup(aEntities, callback);
                }.bind(this)],
                ModifyAssessUser: ["GetAssess", function (results, callback) {
                    var aEntities = this.mRow[OSAC.EntityClass_RAssessUser];
                    if (OSAC.AssessProjectType_Operation !== this.mRow[OSAC.FieldName_Type]
                        || RUtils.isEmptyData(aEntities)) {
                        callback();
                        return;
                    }
                    this.addAssessUser(aEntities, callback);
                }.bind(this)],
                ModifyAssessUserGroup: ["GetAssess", function (results, callback) {
                    var aEntities = this.mRow[OSAC.EntityClass_RAssessUserGroup];
                    if (RUtils.isEmptyData(aEntities)) {
                        callback();
                        return;
                    }
                    this.addAssessUserGroup(true, aEntities, callback);
                }.bind(this)],
                ModifyAssessUserList: ["GetAssess", function (results, callback) {
                    var aEntities = this.mRow[OSAC.EntityClass_RAssessUserList];
                    if (RUtils.isEmptyData(aEntities)) {
                        callback();
                        return;
                    }
                    this.addAssessUserList("", "", true, aEntities, callback);
                }.bind(this)],
                GetAssessTestPaperId: ["GetAssess", function (results, callback) {//查询考核的试卷
                    if (!RUtils.isEmptyData(this.mRow[OSAC.EntityClass_RTestPaperSetting]) &&
                        (results.GetAssess[OSAC.FieldName_Type] === OSAC.AssessProjectType_Theory ||
                            results.GetAssess[OSAC.FieldName_Type] === OSAC.AssessProjectType_TheorySimulation)) {//不是理论考，或者没有修改设置
                        this.getAssessTestPaperId(this.mAssessId, callback);
                    } else {
                        callback();
                    }
                }.bind(this)],
                ModifyTestPaper: ["GetAssessTestPaperId", function (results, callback) {
                    if (!RUtils.isEmptyData(this.mRow[OSAC.EntityClass_RTestPaperSetting]) &&
                        (results.GetAssess[OSAC.FieldName_Type] === OSAC.AssessProjectType_Theory ||
                            results.GetAssess[OSAC.FieldName_Type] === OSAC.AssessProjectType_TheorySimulation)) {//不是理论考，或者没有修改设置
                        this.modifyTestPaper(results.GetAssess, results.GetAssessTestPaperId, callback);
                    } else {
                        callback();
                    }
                }.bind(this)],
                AddPublishmTimer: ["ModifyAssess", function (results, callback) {//添加定时发布定时撤回的定时器
                    this.addPublishmTimer(this.mRow[OSAC.FieldName_Id], this.mRow[OSAC.FieldName_PublishStartDate],
                        this.mRow[OSAC.FieldName_PublishEndDate], callback);
                }.bind(this)]
            }, function (error, results) {
                if (error) {
                    callback(error);
                    return;
                }
                callback(null, GBC.RESULT_SUCCESS);
                this.deleteCache(results.GetAssess, function () {
                });
                this.executeAsync(results.GetAssess, this.mRow[OSAC.EntityClass_RAssessUserList]);
            }.bind(this));
        };
    }
}
;
rs.registerClass(ModifyAssessAction);


function AutoAssessUserGroupAction(service) {
    if (rs.isDefClass(AutoAssessUserGroupAction)) {
        this.mService = service;
    } else {
        rs.inherit(AutoAssessUserGroupAction, BaseRMdAssessService);
        rs.defClass(AutoAssessUserGroupAction);
        ModifyAssessAction.prototype.setup = function () {

        };
        AutoAssessUserGroupAction.prototype.deleteAssessUserData = function (callback) {
            var aSqls = [];
            var oDeleteAssessUserListSql = {
                qcode: 'DeleteAssessUserListSql',
                sql: 'delete from tb_AssessUserList where AssessId=?',
                values: [this.mAssessId]
            };
            aSqls.push(oDeleteAssessUserListSql);
            var oDeleteAssessUserScoreSql = {
                qcode: 'DeleteAssessUserScoreSql',
                sql: 'delete from tb_AssessUserScore where AssessId=?',
                values: [this.mAssessId]
            };
            aSqls.push(oDeleteAssessUserScoreSql);
            var oDeleteAssessExaminerUserScoreSql = {
                qcode: 'DeleteAssessExaminerUserScoreSql',
                sql: 'delete from tb_AssessExaminerUserScore where AssessId=?',
                values: [this.mAssessId]
            };
            aSqls.push(oDeleteAssessExaminerUserScoreSql);
            this.mService.mDataModule.executeTransaction(aSqls, callback);
        };
        AutoAssessUserGroupAction.prototype.execute = function (assessId, row, callback) {
            var oTokenInfo = getNamespace(WCT.LOCALSTORAGE_NAMESPACE_WEBAPPHANDLER).get(GBC.LOCALSTORAGE_TOKENPAYLOAD);
            this.mUserId = oTokenInfo[OSAC.FieldName_UserId];
            this.mAssessId = assessId;
            this.mRow = row;
            async.auto({
                DeleteAssessUserData: function (callback) {
                    this.deleteAssessUserData(callback);
                }.bind(this),
                ModifyAssessUserGroup: ["DeleteAssessUserData", function (results, callback) {
                    var aEntities = this.mRow[OSAC.EntityClass_RAssessUserGroup];
                    if (OSAC.AssessProjectType_Operation !== this.mRow[OSAC.FieldName_Type]
                        || RUtils.isEmptyData(aEntities)) {
                        callback();
                        return;
                    }
                    this.addAssessUserGroup(false, aEntities, callback);
                }.bind(this)]
            }, function (error, results) {
                if (error) {
                    callback(error);
                    return;
                }
                callback(null, GBC.RESULT_SUCCESS);
            });
        };
    }
}
;
rs.registerClass(AutoAssessUserGroupAction);


function DeleteAssessAction(service) {
    if (rs.isDefClass(DeleteAssessAction)) {
        this.mService = service;
    } else {
        rs.inherit(DeleteAssessAction, BaseRMdAssessService);
        rs.defClass(DeleteAssessAction);
        DeleteAssessAction.prototype.setup = function () {

        };
        DeleteAssessAction.prototype.updateAssessState = function (callback) {
            var sSql = "UPDATE tb_assess SET State=99,NoticeId='' where Id=? ";
            this.mService.mDataModule.executeSql(sSql, [this.mAssessId], callback);
        };
        DeleteAssessAction.prototype.execute = function (assessId, callback) {
            var oTokenInfo = getNamespace(WCT.LOCALSTORAGE_NAMESPACE_WEBAPPHANDLER).get(GBC.LOCALSTORAGE_TOKENPAYLOAD);
            this.mUserId = oTokenInfo[OSAC.FieldName_UserId];
            this.mAssessId = assessId;
            if (!RUtils.isUUID(this.mAssessId)) {
                var oError = rs.makeError(GBC.RESULT_IDILLEGALMESSAGE, GBC.RESULT_IDILLEGAL, "assessId");
                callback(oError);
                return;
            }
            async.auto({
                GetAssess: function (callback) {
                    this.getAssess(this.mAssessId, callback);
                }.bind(this),
                UpdateAssessState: ["GetAssess", function (results, callback) {
                    this.updateAssessState(callback);
                }.bind(this)],
                AddPublishmTimer: ["UpdateAssessState", function (results, callback) {//添加定时发布定时撤回的定时器
                    this.addPublishmTimer(this.mAssessId, "", "", callback);
                }.bind(this)]
            }, function (error, results) {
                if (error) {
                    callback(error);
                    return;
                }
                callback(null, GBC.RESULT_SUCCESS);
                var oAssess = results.GetAssess;
                //后续操作
                async.auto({
                    DeleteMemo: function (callback) {
                        var sNoticeId = oAssess[OSAC.FieldName_NoticeId];
                        if (oAssess[OSAC.FieldName_SourceType] != GBC.SourceType_Trainee || RUtils.isEmptyString(sNoticeId)) {
                            callback(null, RHelper.makeEntities());
                            return;
                        }
                        this.deleteMemo(sNoticeId, callback);
                    }.bind(this),
                    GetAssessUserList: function (callback) {
                        var sSql = "select ScheduleId from tb_assessuserlist where AssessId=?"
                        this.mService.mDataModule.querySql(sSql, [oAssess[OSAC.FieldName_Id]], callback);
                    }.bind(this),
                    DeleteSchedule: ["GetAssessUserList", function (results, callback) {
                        var aAssessUserEntities = results.GetAssessUserList;
                        //获取日程Id;
                        var aScheduleIds = RUtils.getFieldArray(aAssessUserEntities, OSAC.FieldName_ScheduleId);
                        if (aScheduleIds.length === 0) {
                            callback();
                            return;
                        }
                        var oOption = {
                            scheduleIds: aScheduleIds
                        };
                        this.mService.mBrScheduleProxy.excute('ScheduleService', "deleteSchedule", oOption, function (error, result) {
                            if (error) {
                                callback(error);
                                return;
                            }
                            if (result[OSAC.FieldName_Code] !== GBC.RESULT_SUCCESS) {
                                callback(result[OSAC.FieldName_Data]);
                                return;
                            }
                            callback(null, result[OSAC.FieldName_Data]);
                        });
                    }.bind(this)]
                }, function (error, results) {
                    if (error) {
                        console.log("删除考核培训后续操作异常：");
                        console.log(error);
                    }
                }.bind(this));
            }.bind(this));
        };
    }
}

rs.registerClass(DeleteAssessAction);

function GetAssessByConditionAction(service) {
    if (rs.isDefClass(GetAssessByConditionAction)) {
        this.mService = service;
    } else {
        rs.inherit(GetAssessByConditionAction, BaseRMdAssessService);
        rs.defClass(GetAssessByConditionAction);
        GetAssessByConditionAction.prototype.setup = function () {

        };
        GetAssessByConditionAction.prototype.handleProject = function (projectIds, assessProjectEntities, userIds, userEntities) {
            var aAssessProjectIds = projectIds.split(";");
            var aAssessProject = RHelper.makeEntities();
            for (var i = 0; i < aAssessProjectIds.length; i++) {
                var sProjectId = aAssessProjectIds[i];
                var oProject = assessProjectEntities[sProjectId];
                if (!oProject) {
                    continue;
                }
                var obj = {};
                obj[OSAC.FieldName_Id] = oProject[OSAC.FieldName_Id];
                obj[OSAC.FieldName_Name] = oProject[OSAC.FieldName_Name];
                aAssessProject.Rows.push(obj);

                //处理主考官
                if (!userIds) {
                    continue;
                }
                var aUserId = JSON.parse(userIds);
                if (!Array.isArray(aUserId)) {
                    continue;
                }
                var oExaminerUser = aUserId[i];
                var sExaminerUserIds = oExaminerUser[OSAC.FieldName_ExaminerUserIds];
                if (RUtils.isEmptyString(sExaminerUserIds)) {
                    continue;
                }
                obj[OSAC.FieldName_ExaminerUsers] = this.handleExaminerUser(sExaminerUserIds, userEntities);
            }
            ;
            return aAssessProject;
        };
        GetAssessByConditionAction.prototype.handleExaminerUser = function (userIds, userEntities) {
            var aExaminerUserIds = userIds.split(";");
            var aExaminerUserUser = RHelper.makeEntities();
            for (var i = 0; i < aExaminerUserIds.length; i++) {
                var sUserId = aExaminerUserIds[i];
                var oUser = userEntities[sUserId];
                if (!oUser) {
                    continue;
                }
                var obj = {};
                obj[OSAC.FieldName_UserName] = oUser[OSAC.FieldName_UserName];
                obj[OSAC.FieldName_UserId] = oUser[OSAC.FieldName_UserId];
                obj[OSAC.FieldName_FaceImage] = oUser[OSAC.FieldName_FaceImage];
                aExaminerUserUser.Rows.push(obj);
            }
            ;
            return aExaminerUserUser;
        };
        GetAssessByConditionAction.prototype.handleData = function (assessEntities, assessUserGroupEntities, assessUserListEntities,
                                                                    userEntities, traineeMemberEntities, assessProjectEntities,
                                                                    testPaperSettingEntities, assessGroupEntities, assessUserEntities,
                                                                    assessUserHistoryEntities, isManage,assessUserGradeEntities, callback) {
            RHelper.buildEntitesArrayIndexX(assessUserGroupEntities, OSAC.FieldName_AssessId);
            RHelper.buildEntitesArrayIndexX(assessGroupEntities, OSAC.FieldName_AssessId);
            RHelper.buildEntitesArrayIndexX(assessUserEntities, OSAC.FieldName_AssessId);
            RHelper.buildEntitesArrayIndexX(assessUserListEntities, OSAC.FieldName_AssessUserGroupId);
            RHelper.buildEntitesArrayIndexX(assessUserListEntities, OSAC.FieldName_AssessId);
            RHelper.buildEntitesArrayIndexX(testPaperSettingEntities, OSAC.FieldName_TestPaperId);
            RHelper.buildEntitesIndexX(userEntities, OSAC.FieldName_UserId);
            RHelper.buildEntitesIndexX(traineeMemberEntities, OSAC.FieldName_UserId);
            RHelper.buildEntitesIndexX(assessProjectEntities, OSAC.FieldName_Id);
            RHelper.buildEntitesIndexX(assessUserGradeEntities, OSAC.FieldName_UserId);


            //处理培训人员的用户名称和头像
            assessUserListEntities.Rows.forEach(function (item) {
                var sUserId = item[OSAC.FieldName_UserId];
                var oUser = userEntities[sUserId];
                if (oUser) {
                    item[OSAC.FieldName_UserName] = oUser[OSAC.FieldName_UserName];
                    item[OSAC.FieldName_FaceImage] = oUser[OSAC.FieldName_FaceImage];
                }
                //处理院校名称
                var oTraineeMember = traineeMemberEntities[sUserId];
                if (oTraineeMember) {
                    item[OSAC.FieldName_CollegeName] = oTraineeMember[OSAC.FieldName_CollegeName] || "";
                }
                //处理组的考核项目
                var sAssessProjectIds = item[OSAC.FieldName_AssessProjectId];
                if (sAssessProjectIds) {
                    var oAssessProjectEntities = this.handleProject(sAssessProjectIds, assessProjectEntities);
                    if (!RUtils.isEmptyData(oAssessProjectEntities)) {
                        item[OSAC.FieldName_AssessProjectName] = oAssessProjectEntities.Rows[0][OSAC.FieldName_Name];
                    }
                }
            }.bind(this));
            //处理培训人员的用户名称和头像
            assessUserEntities.Rows.forEach(function (item) {
                var sUserId = item[OSAC.FieldName_UserId];
                var oUser = userEntities[sUserId];
                if (oUser) {
                    item[OSAC.FieldName_UserName] = oUser[OSAC.FieldName_UserName];
                    item[OSAC.FieldName_FaceImage] = oUser[OSAC.FieldName_FaceImage];
                }
                oUser = assessUserGradeEntities[sUserId];
                if (oUser) {
                    item[OSAC.FieldName_Grade] = oUser[OSAC.FieldName_Grade];
                }
                //处理院校名称
                var oTraineeMember = traineeMemberEntities[sUserId];
                if (oTraineeMember) {
                    item[OSAC.FieldName_CollegeName] = oTraineeMember[OSAC.FieldName_CollegeName] || "";
                }
                //处理考核历史
                var historyEntities = RHelper.makeEntities();
                assessUserHistoryEntities.Rows.forEach(function (historyItem) {
                    if (historyItem[OSAC.FieldName_UserId] === sUserId && historyItem[OSAC.FieldName_StartDate] < item[OSAC.FieldName_StartDate]) {
                        historyEntities.Rows.push(historyItem);
                    }
                }.bind(this));
                item[OSAC.EntityClass_RAssessHistory] = historyEntities;
            }.bind(this));
            for (var i = 0; i < assessEntities.Rows.length; i++) {
                var row = assessEntities.Rows[i];
                var sId = row[OSAC.FieldName_Id];
                var aEntities = assessGroupEntities[sId];
                if (aEntities) {
                    for (var j = 0; j < aEntities.Rows.length; j++) {
                        var grouprow = aEntities.Rows[j];
                        //处理组的考核项目
                        var sAssessProjectIds = grouprow[OSAC.FieldName_AssessProjectId];
                        if (sAssessProjectIds) {
                            grouprow[OSAC.EntityClass_RAssessProject] = this.handleProject(sAssessProjectIds, assessProjectEntities);
                            if (!RUtils.isEmptyData(grouprow[OSAC.EntityClass_RAssessProject])) {
                                grouprow[OSAC.FieldName_AssessProjectName] = grouprow[OSAC.EntityClass_RAssessProject].Rows[0][OSAC.FieldName_Name];
                            }
                            //处理组的主考官
                            var sExaminerUserIds = grouprow[OSAC.FieldName_ExaminerUserIds];
                            if (RUtils.isEmptyString(sExaminerUserIds)) {
                                continue;
                            }
                            grouprow[OSAC.FieldName_ExaminerUsers] = this.handleExaminerUser(sExaminerUserIds, userEntities);
                        }
                    }
                    row[OSAC.EntityClass_RAssessGroup] = aEntities;
                }
                aEntities = assessUserGroupEntities[sId];
                if (aEntities) {
                    for (var j = 0; j < aEntities.Rows.length; j++) {
                        var grouprow = aEntities.Rows[j];
                        var sGroupId = grouprow[OSAC.FieldName_Id];
                        var aUserEntities = assessUserListEntities[sGroupId];
                        if (aUserEntities) {
                            grouprow[OSAC.EntityClass_RAssessUserList] = aUserEntities;
                        }
                        //处理组的考核项目
                        var sAssessProjectIds = grouprow[OSAC.FieldName_AssessProjectId];
                        if (sAssessProjectIds) {
                            grouprow[OSAC.EntityClass_RAssessProject] = this.handleProject(sAssessProjectIds, assessProjectEntities);
                            //处理组的主考官
                            var sExaminerUserIds = grouprow[OSAC.FieldName_ExaminerUserIds];
                            if (RUtils.isEmptyString(sExaminerUserIds)) {
                                continue;
                            }
                            grouprow[OSAC.FieldName_ExaminerUsers] = this.handleExaminerUser(sExaminerUserIds, userEntities);
                        }
                    }
                    row[OSAC.EntityClass_RAssessUserGroup] = aEntities;
                }
                aEntities = assessUserEntities[sId];
                if (aEntities) {
                    row[OSAC.EntityClass_RAssessUser] = aEntities;
                }
                aEntities = assessUserListEntities[sId];

                //操作考打分规则参数
                var iScoreRole = OSAC.AssessOperation_ScoreRole_Unite;
                var iScoreReason = OSAC.AssessOperation_ScoreReason_Without;
                if (row[OSAC.FieldName_Type] === OSAC.AssessProjectType_Operation) {
                    var oFilter = this.mCondition[OSAC.Condition_filter] || {};
                    if (oFilter[OSAC.Condition_filter_showExaminerUser] === 1) {//操作打分功能时输出打分参数
                        //处理操作考的打分规则
                        var sParams = row.Params;
                        var oParams = JSON.parse(sParams);
                        if (oParams != null) {
                            if (!RUtils.isEmptyString(oParams.ScoreRole)) {
                                iScoreRole = oParams.ScoreRole;
                            }
                            if (!RUtils.isEmptyString(oParams.ScoreReason)) {
                                iScoreReason = oParams.ScoreReason;
                            }
                            row[OSAC.FieldName_ScoreRole] = iScoreRole;
                            row[OSAC.FieldName_ScoreReason] = iScoreReason;
                        }

                    }
                }
                if (aEntities) {
                    if (row[OSAC.FieldName_Type] === OSAC.AssessProjectType_Operation) {
                        var oFilter = this.mCondition[OSAC.Condition_filter] || {};
                        if (oFilter[OSAC.Condition_filter_showExaminerUser] === 1) {//操作打分功能时处理人员的状态
                            aEntities.Rows.forEach(function (item) {
                                //处理操作考的打分规则
                                if (iScoreRole === OSAC.AssessOperation_ScoreRole_Avg) {//平均分规则时处理是否打过分
                                    if (item[OSAC.FieldName_State] === 0 && item[OSAC.FieldName_ScoreDataCount] > 0) {
                                        item[OSAC.FieldName_State] = 3;
                                    }
                                    var sExaminerUserIds = item[OSAC.FieldName_ExaminerUserIds];
                                    if (!RUtils.isEmptyString(sExaminerUserIds) && sExaminerUserIds.indexOf(this.mUserId) != -1) {
                                        item[OSAC.FieldName_IsScore] = 1;
                                    } else {
                                        item[OSAC.FieldName_IsScore] = 0;
                                    }
                                } else {
                                    item[OSAC.FieldName_IsScore] = 1;//是否可以打分
                                }
                            }.bind(this));
                        }
                    }
                    row[OSAC.EntityClass_RAssessUserList] = aEntities;
                }
                //处理负责人
                var sResponsibleUserIds = row[OSAC.FieldName_ResponsibleUserIds];
                if (!RUtils.isEmptyString(sResponsibleUserIds)) {
                    row[OSAC.FieldName_ResponsibleUsers] = this.handleExaminerUser(sResponsibleUserIds, userEntities);
                }
                //处理考核项目
                var aAssessProjectIds = RUtils.aryToUniqueAry(RUtils.getFieldArray(assessGroupEntities, OSAC.FieldName_AssessProjectId));
                var sAssessProjectIds = row[OSAC.FieldName_AssessProjectIds];
                if (aAssessProjectIds.length > 0) {
                    sAssessProjectIds = aAssessProjectIds.join(";");
                }
                //处理主考官
                var aExaminerUserIds = RUtils.aryToUniqueAry(RUtils.getFieldArray(assessGroupEntities, OSAC.FieldName_AssessProjectId));
                var sExaminerUserIds = row[OSAC.FieldName_ExaminerUserIds];
                if (aExaminerUserIds.length > 0) {
                    sExaminerUserIds = aExaminerUserIds.join(";");
                    row[OSAC.EntityClass_RAssessProject] = this.handleProject(sAssessProjectIds, assessProjectEntities);
                } else if (sAssessProjectIds) {
                    row[OSAC.EntityClass_RAssessProject] = this.handleProject(sAssessProjectIds, assessProjectEntities, sExaminerUserIds, userEntities);
                }
                //处理试卷设置
                var sTestPaperId = row[OSAC.FieldName_TestPaperId];
                var aTestPaperSetting = testPaperSettingEntities[sTestPaperId];
                if (aTestPaperSetting) {
                    row[OSAC.EntityClass_RTestPaperSetting] = aTestPaperSetting;
                }
                //处理考核的操作
                var iState = row[OSAC.FieldName_State];
                var iPublishScore = row[OSAC.FieldName_PublishScore];
                //处理操作
                var aOperations = RHelper.makeEntities();
                var dStartDate = this.mService.mDataModule.dataJSONTodatetime(row[OSAC.FieldName_StartDate]);
                var dCurrData = this.mService.mDataModule.getServerTime();
                aOperations.Rows.push({
                    Name: "修改",
                    Code: "XG",
                });
                if (row[OSAC.FieldName_SourceType] === GBC.SourceType_User) {

                    if (row[OSAC.FieldName_CreatePersonId] === this.mUserId || isManage) {//自己创建的，或是管理员可删除
                        aOperations.Rows.push({
                            Name: "删除",
                            Code: "SC",
                        });
                    }
                } else {
                    if (iState === OSAC.State_Normal) {//正常状态可修改
                        aOperations.Rows.push({
                            Name: "删除",
                            Code: "SC",
                        });
                    }
                }

                if (iState === OSAC.State_Normal) {//正常状态且还未到开始时间可发布
                    aOperations.Rows.push({
                        Name: "发布",
                        Code: "FB",
                    });
                }
                if (iState === OSAC.State_Publish) {//已发布可撤回
                    aOperations.Rows.push({
                        Name: "撤回",
                        Code: "CH",
                    });
                    if (row[OSAC.FieldName_Type] === OSAC.AssessProjectType_Operation) {//操作考公示分数权限
                        if (iPublishScore === OSAC.State_Disable) {
                            aOperations.Rows.push({
                                Name: "公示分数",
                                Code: "GSFS",
                            });
                            aOperations.Rows.push({
                                Name: "操作打分",
                                Code: "CZDF",
                            });
                        } else {
                            if (row[OSAC.FieldName_SourceType] ==GBC.SourceType_User) {
                                aOperations.Rows.push({
                                    Name: "操作打分",
                                    Code: "CZDF",
                                });
                            }else {
                                aOperations.Rows.push({
                                    Name: "撤回分数",
                                    Code: "CHFS",
                                });
                            }

                        }
                    }
                }
                if (row[OSAC.FieldName_Type] === OSAC.AssessProjectType_Operation) {//操作考
                    if (iState === OSAC.State_Normal) {
                        aOperations.Rows.push({
                            Name: "自动分组",
                            Code: "ZDFZ",
                        });
                    }
                    aOperations.Rows.push({
                        Name: "分组修改",
                        Code: "FZXG",
                    });
                    aOperations.Rows.push({
                        Name: "分组删除",
                        Code: "FZSC",
                    });
                    aOperations.Rows.push({
                        Name: "分组添加",
                        Code: "FZTJ",
                    });
                }
                row[OSAC.FieldName_Operations] = aOperations;
            }
        }
        ;
        GetAssessByConditionAction.prototype.getAssessUserList = function (ids, callback) {
            var sSql = "SELECT au.*, ds.Name as DepartmentName,aug.AssessProjectId,if(au.EndDate <= ? and au.State !=1,'缺考',au.Score) ShowScore, " +
                "ag.ItemIndex as GroupItemIndex,es.Grade,ag.Name as TestCenterName,IFNULL(aus.ScoreDataCount,0) as ScoreDataCount,aus.ExaminerScore,aug.ExaminerUserIds from tb_assessuserlist au \n" +
                "inner join tb_EmployeeSupply es on au.UserId=es.UserId \n" +
                "left join tb_departmentsupply ds on au.DepartmentId=ds.Id \n" +
                "left join tb_assessusergroup aug on au.AssessId=aug.AssessId and au.AssessUserGroupId=aug.Id \n" +
                "left join tb_assessgroup ag on au.AssessId=ag.AssessId and aug.AssessGroupId=ag.Id \n" +
                "left join (select UserId,AssessProjectId,COUNT(id) as ScoreDataCount,Score as ExaminerScore from tb_assessexamineruserscore where AssessId in(?) and ExaminerUserId=? and State=1 group by UserId,AssessProjectId) as aus on aus.UserId=au.UserId and aus.AssessProjectId=aug.AssessProjectId\n" +
                "left join tb_assess ass on au.AssessId=ass.Id where au.AssessId in(?)";
            var oFilter = this.mCondition[OSAC.Condition_filter] || {};
            if (oFilter[OSAC.Condition_filter_showExaminerUser] === 1) {//显示我主考的，只显示当前时间1小时后的
                sSql += RUtils.format(" and ((au.StartDate<=ADDDATE(NOW(),interval 1 HOUR) and au.AssessUserGroupId in (select Id from tb_assessusergroup where AssessId in(?) and ExaminerUserids LIKE '%%1%')) or ass.ResponsibleUserIds LIKE '%%1%')", this.mUserId);
            }
            sSql += " order by au.Address, au.StartDate, au.ItemIndex, es.Code";
            this.mService.mDataModule.querySql(sSql, [RDateUtils.formatEmptyDatetime("yyyy-MM-dd HH:mm:ss", new Date()), ids, this.mUserId, ids, ids], callback);
        };
        GetAssessByConditionAction.prototype.getAssessUserGroup = function (ids, callback) {
            var sSql = "SELECT aug.* from tb_assessusergroup aug left join tb_assessgroup ag on aug.AssessGroupId=ag.Id where aug.AssessId in(?)";
            var oFilter = this.mCondition[OSAC.Condition_filter] || {};
            if (oFilter[OSAC.Condition_filter_showExaminerUser] === 1) {//显示我主考的
                sSql += RUtils.format(" and aug.ExaminerUserids LIKE '%%1%'", this.mUserId);
            }
            sSql += " order by aug.StartDate,ag.ItemIndex";
            this.mService.mDataModule.querySql(sSql, [ids], callback);
        };

        GetAssessByConditionAction.prototype.getAssessUserHistory = function (ids, userIds, year, callback) {
            var sSql = "select aul.AssessId,aug.StartDate,aug.EndDate,ap.`Name`,aul.UserId,aul.Score,aul.State from tb_assessuserlist aul \n" +
                "left join tb_assessusergroup aug on aul.AssessId=aug.AssessId and aul.AssessUserGroupId=aug.Id\n" +
                "left join tb_assessproject ap on aug.AssessProjectId=ap.Id\n" +
                "left join tb_assess a on aul.AssessId=a.Id\n" +
                "where a.State<>99 and date_format(aug.StartDate,'%Y')=? and aul.UserId in (?) and aul.State =1 and a.Type=?\n";
            if (this.mCondition[OSAC.FieldName_SourceId]) {
                sSql += "and a.SourceId ='" + this.mCondition[OSAC.FieldName_SourceId] + "'";
            }
            sSql += "order by aug.StartDate";
            var aValue = [];
            aValue.push(year);
            aValue.push(userIds);
            aValue.push(OSAC.AssessProjectType_Operation);
            this.mService.mDataModule.querySql(sSql, aValue, callback);
        };
        GetAssessByConditionAction.prototype.getAssessUser = function (ids, callback) {
            var sSql = "SELECT au.*, ds.Name as DepartmentName,a.StartDate from tb_assessuser au \n" + //es.Grade,
                "left join tb_departmentsupply ds on au.DepartmentId=ds.Id \n" +
                "left join tb_assess a on au.AssessId=a.Id\n" +
                " where AssessId in(?) order by au.ItemIndex";
            this.mService.mDataModule.querySql(sSql, [ids], callback);
        };
        GetAssessByConditionAction.prototype.getAssessUserGrade = function (userIds, callback) {
            var sSql = "select * from tb_employeesupply where userId in (?)";
            this.mService.mDataModule.querySql(sSql, [userIds], callback);
        };
        GetAssessByConditionAction.prototype.getAssessGroup = function (ids, callback) {
            var sSql = "SELECT * from tb_assessgroup where AssessId in(?)";
            sSql += " order by ItemIndex";
            this.mService.mDataModule.querySql(sSql, [ids], callback);
        };
        GetAssessByConditionAction.prototype._getQueryInfo = function (isQueryTotal, AssessIds, isManage) {
            var oFilter = this.mCondition[OSAC.Condition_filter] || {};
            var sSql = "SELECT %1 from tb_assess a left join (select AssessId,group_concat(ExaminerUserids separator ';') as ExaminerUserids from tb_assessgroup group by AssessId) ag on a.id=ag.AssessId  left JOIN tb_testpaper tp on a.Id= tp.SourceId \n" +
                "left join (select AssessId,COUNT(id) as ScoreDataCount from tb_assessuserscore group by AssessId) as aus on aus.AssessId=a.Id %2 where a.State!=99 \n";
            var sColumn = "a.*,tp.Id as TestPaperId,aus.ScoreDataCount";
            var sColumn2="";
            if (isQueryTotal) {//查询数量
                sColumn = "COUNT(a.Id) as SumTotal";
            }
            var aValues = [];
            var oConditions = new RConditions();
            if (this.mCondition[OSAC.FieldName_SourceType] == GBC.SourceType_User) {
                sColumn2 = " left join tb_assessuserlist al2  on al2.AssessId = a.Id left join tb_departmentsupply ds2  on al2.DepartmentId = ds2.Id ";
            }
            sSql = RUtils.format(sSql, sColumn,sColumn2);
            if (!RUtils.isEmptyString(this.mCondition[OSAC.FieldName_TraineeId]) && !RUtils.isEmptyString(this.mCondition[OSAC.FieldName_CollegeId])) {
                if (RUtils.isArray(AssessIds) && AssessIds.length > 0) {
                    oConditions.push("a.Id in (?)");
                    aValues.push(AssessIds);
                }
            }
            if (oFilter[OSAC.Condition_filter_showExaminerUser] === 1) {//显示我主考的
                oConditions.push(RUtils.format(" a.StartDate<=ADDDATE(NOW(),interval 1 HOUR) and (ag.ExaminerUserids LIKE '%%1%' or a.ResponsibleUserIds LIKE '%%1%')", this.mUserId));
            }
            if (oFilter[OSAC.Condition_filter_showMyCreate] === 1 && !isManage) {//显示我创建的
                oConditions.push("a.CreatePersonId=?");
                aValues.push(this.mUserId);
            }
            if (this.mCondition[OSAC.FieldName_SourceType]) {
                oConditions.push("a.SourceType=?");
                aValues.push(this.mCondition[OSAC.FieldName_SourceType]);
            }
            if (this.mCondition[OSAC.FieldName_SourceTypes]) {
                oConditions.push("a.SourceType in (?)");
                aValues.push(this.mCondition[OSAC.FieldName_SourceTypes]);
            }
            if (this.mCondition[OSAC.FieldName_SourceId]) {
                oConditions.push("a.SourceId=?");
                aValues.push(this.mCondition[OSAC.FieldName_SourceId]);
            }
            if (this.mCondition[OSAC.FieldName_AssessProjectId]) {
                oConditions.push("a.AssessProjectIds in (?)");
                aValues.push([this.mCondition[OSAC.FieldName_AssessProjectId]]);
            }
            if (this.mCondition[OSAC.FieldName_Id]) {
                oConditions.push("a.Id=?");
                aValues.push(this.mCondition[OSAC.FieldName_Id]);
            }
            if (this.mCondition[OSAC.FieldName_State]) {
                oConditions.push("a.State=?");
                aValues.push(this.mCondition[OSAC.FieldName_State]);
            }
            if (this.mCondition[OSAC.FieldName_Type]) {
                oConditions.push("a.Type=?");
                aValues.push(this.mCondition[OSAC.FieldName_Type]);
            }
            if (this.mCondition[OSAC.FieldName_TitleLike]) {
                oConditions.push(RUtils.format("a.Title like '%%1%'", this.mCondition[OSAC.FieldName_TitleLike]));
            }
            if (this.mCondition[OSAC.FieldName_Year]) {
                oConditions.push("date_format(a.startdate, '%Y')=?");
                aValues.push(this.mCondition[OSAC.FieldName_Year]);
                if (this.mCondition[OSAC.FieldName_Month]) {
                    oConditions.push("date_format(a.startdate, '%m')=?");
                    aValues.push(this.mCondition[OSAC.FieldName_Month]);
                }
            }
            if (this.mCondition[OSAC.FieldName_StartDate]) {
                oConditions.push("date_format(a.startdate, '%Y-%m')=?");
                aValues.push(this.mCondition[OSAC.FieldName_StartDate]);
            }
            if (oConditions.count() > 0) {
                sSql = RUtils.format("%1 and %2 ", sSql, oConditions.toSql());
            }
            if (this.mCondition[OSAC.FieldName_SourceType] == GBC.SourceType_User){
                sSql += " ORDER BY ds2.ReportItemIndex, a.StartDate desc ";
            } else
            sSql += " ORDER BY a.StartDate desc ";

            var iFrom = 0;
            if (!RUtils.isNullObject(this.mCondition[OSAC.Condition_from])) {
                iFrom = this.mCondition[OSAC.Condition_from];
            }
            var iCount = OSAC.RecordCount_DefaultLimit;
            if (!RUtils.isNullObject(this.mCondition[OSAC.Condition_count])) {
                iCount = this.mCondition[OSAC.Condition_count];
            }

            if (!isQueryTotal) {//不查总数
                sSql += RUtils.format(" limit %1,%2", iFrom, iCount);
            }
            var oQueryInfo = {
                Sql: sSql,
                Values: aValues
            };
            return oQueryInfo;
        };
        GetAssessByConditionAction.prototype.getAssessProjects = function (projectIds, callback) {
            var sSql = "select Id,Name from tb_assessproject where id in (?)"
            var aValue = [projectIds];
            this.mService.mDataModule.querySql(sSql, aValue, callback);
        };
        GetAssessByConditionAction.prototype.getCollegeAssessIds = function (UserIds, callback) {
            var sSql = "select distinct AssessId from tb_AssessUserList where UserId in (?)"
            var aValue = [UserIds];
            this.mService.mDataModule.querySql(sSql, aValue, callback);
        };

        GetAssessByConditionAction.prototype.getTraineeMember = function (userIds, callback) {
            if (userIds.length === 0) {
                callback(null, RHelper.makeEntities());
                return;
            }
            var oCondition = {"_filter": {}};
            oCondition[OSAC.FieldName_UserIds] = userIds;
            oCondition[OSAC.Condition_filter][OSAC.Condition_filter_showCollege] = 1;
            this.mService.mRMdTraineeService.getTraineeMemberByCondition(null, oCondition, callback)
        };
        GetAssessByConditionAction.prototype.getTestPaperSetting = function (testPaperIds, callback) {
            var sSql = "SELECT tps.*,ql.`Name` QuestionLibraryName  from tb_testpapersetting tps left join tb_questionlibrary ql" +
                " on tps.QuestionLibraryId=ql.Id where tps.TestPaperId in(?) order by tps.ItemIndex;";
            this.mService.mDataModule.querySql(sSql, [testPaperIds], callback);
        };

        GetAssessByConditionAction.prototype.execute = function (condition, callback) {
            var oTokenInfo = getNamespace(WCT.LOCALSTORAGE_NAMESPACE_WEBAPPHANDLER).get(GBC.LOCALSTORAGE_TOKENPAYLOAD);
            this.mUserId = oTokenInfo[OSAC.FieldName_UserId];
            this.mCorporationId = oTokenInfo[OSAC.FieldName_CorporationId];
            this.mCondition = condition;
            this.mFilter = this.mCondition[OSAC.Condition_filter] || {};
            async.auto({
                CheckManage: function (callback) {
                    this.checkAssessManage(this.mUserId, this.mCorporationId, callback);
                }.bind(this),
                CheckOperationAssessManage: function (callback) {
                    this.checkOperationAssessManage(this.mUserId, this.mCorporationId, callback);
                }.bind(this),
                GetCorporationManager: function (callback) {
                    this.getCorporationManager(callback);
                }.bind(this),
                GetTraineeMemberByTraineeCollegeId: function (callback) {
                    if (!RUtils.isEmptyString(this.mCondition[OSAC.FieldName_TraineeId]) && !RUtils.isEmptyString(this.mCondition[OSAC.FieldName_CollegeId])) {
                        var oCondition = {CollegeId: this.mCondition[OSAC.FieldName_CollegeId], NoCheckRole: true};
                        this.mService.mRMdTraineeService.getTraineeMemberByCondition(this.mCondition[OSAC.FieldName_TraineeId], oCondition, callback);
                    } else {
                        callback(null, {Rows: []});
                    }
                }.bind(this),
                GetCollegeAssessIds: ["GetTraineeMemberByTraineeCollegeId", function (results, callback) {
                    var aEntities = results.GetTraineeMemberByTraineeCollegeId;
                    var aUserIds = RUtils.getFieldArray(aEntities, OSAC.FieldName_UserId);
                    var aTraineeMemberEntities = results.GetTraineeMemberByTraineeCollegeId;
                    RHelper.buildEntitesIndexX(aTraineeMemberEntities, OSAC.FieldName_UserId);
                    var oMine = aTraineeMemberEntities[this.mUserId];
                    if (oMine) {
                        if (oMine[OSAC.FieldName_IsGroupManage] != 1) {//不是组长
                            aUserIds = [this.mUserId];
                        }
                    }
                    if (aUserIds.length === 0) {
                        callback(null, RHelper.makeEntities());
                        return;
                    }
                    this.getCollegeAssessIds(aUserIds, callback);
                }.bind(this)],
                GetAssess: ["GetCollegeAssessIds", "CheckManage","GetCorporationManager", "CheckOperationAssessManage",function (results, callback) {
                    var bIsManager = results.CheckManage;
                    if (this.mCondition[OSAC.FieldName_SourceType] == GBC.SourceType_User) {
                        bIsManager = results.CheckOperationAssessManage;
                    }
                    var  corporationManager  = results.GetCorporationManager;
                    RHelper.buildEntitesIndexX(corporationManager, OSAC.FieldName_UserId);
                    var obj = corporationManager[this.mUserId];
                    if (obj!=null){
                        bIsManager = true;
                    }
                    if (bIsManager){
                        var oFilter = this.mCondition[OSAC.Condition_filter] || {};
                        oFilter[OSAC.Condition_filter_showMyCreate]=0;
                    }
                    var aEntities = results.GetCollegeAssessIds;
                    var aIds = RUtils.getFieldArray(aEntities, OSAC.FieldName_AssessId);
                    if (aIds.length == 0)
                        aIds = ["-1"];
                    var oQuerySql = this._getQueryInfo(false, aIds, bIsManager);
                    this.mService.mDataModule.querySql(oQuerySql.Sql, oQuerySql.Values, callback);
                }.bind(this)],
                GetAssessTotal: ["GetCollegeAssessIds", "CheckManage","GetCorporationManager", "CheckOperationAssessManage", function (results, callback) {
                    if (!(this.mCondition[OSAC.FieldName_ShowSumTotal] === 1 || this.mCondition[OSAC.Condition_showTotal] === 1)) {
                        callback();
                        return;
                    }
                    var bIsManager = results.CheckManage;
                    if (this.mCondition[OSAC.FieldName_SourceType] == GBC.SourceType_User) {
                        bIsManager = results.CheckOperationAssessManage;
                    }
                    var  corporationManager  = results.GetCorporationManager;
                    RHelper.buildEntitesIndexX(corporationManager, OSAC.FieldName_UserId);
                    var obj = corporationManager[this.mUserId];
                    if (obj!=null){
                        bIsManager = true;
                    }
                    if (bIsManager){
                        var oFilter = this.mCondition[OSAC.Condition_filter] || {};
                        oFilter[OSAC.Condition_filter_showMyCreate]=0;
                    }
                    var aEntities = results.GetCollegeAssessIds;
                    var aIds = RUtils.getFieldArray(aEntities, OSAC.FieldName_AssessId);
                    if (aIds.length == 0)
                        aIds = ["-1"];
                    var oQuerySql = this._getQueryInfo(true, aIds, bIsManager);
                    this.mService.mDataModule.querySql(oQuerySql.Sql, oQuerySql.Values, callback);
                }.bind(this)],
                GetAssessGroup: ["GetAssess", function (results, callback) {
                    var aEntities = results.GetAssess;
                    var aIds = RUtils.getFieldArray(aEntities, OSAC.FieldName_Id);
                    if (aIds.length === 0) {
                        callback(null, RHelper.makeEntities());
                        return;
                    }
                    if (this.mFilter[OSAC.Condition_filter_showGroup] !== 1) {
                        callback(null, RHelper.makeEntities());
                        return;
                    }
                    this.getAssessGroup(aIds, callback);
                }.bind(this)],
                GetAssessUser: ["GetAssess", function (results, callback) {
                    var aEntities = results.GetAssess;
                    var aIds = RUtils.getFieldArray(aEntities, OSAC.FieldName_Id);
                    if (aIds.length === 0) {
                        callback(null, RHelper.makeEntities());
                        return;
                    }
                    if (this.mFilter[OSAC.Condition_filter_showUser] !== 1) {
                        callback(null, RHelper.makeEntities());
                        return;
                    }
                    this.getAssessUser(aIds, callback);
                }.bind(this)],
                GetAssessUserGrade: ["GetAssessUser", function (results, callback) {
                    var aEntities = results.GetAssessUser;
                    var aUserIds = RUtils.aryToUniqueAry(RUtils.getFieldArray(aEntities, OSAC.FieldName_UserId));
                    if (aUserIds.length === 0) {
                        callback(null, RHelper.makeEntities());
                        return;
                    }
                    if (this.mFilter[OSAC.Condition_filter_showUser] !== 1) {
                        callback(null, RHelper.makeEntities());
                        return;
                    }
                    this.getAssessUserGrade(aUserIds, callback);
                }.bind(this)],
                GetAssessUserHistory: ["GetAssess", "GetAssessUser", function (results, callback) {
                    if (this.mFilter[OSAC.Condition_filter_showUser] !== 1 || this.mFilter[OSAC.Condition_filter_showUserHistory] !== 1) {
                        callback(null, RHelper.makeEntities());
                        return;
                    }
                    var aEntities = results.GetAssess;
                    var aIds = RUtils.getFieldArray(aEntities, OSAC.FieldName_Id);
                    var aUserEntities = results.GetAssessUser;
                    var aUserIds = RUtils.aryToUniqueAry(RUtils.getFieldArray(aUserEntities, OSAC.FieldName_UserId));
                    if (aIds.length === 0) {
                        callback(null, RHelper.makeEntities());
                        return;
                    }
                    if (aUserIds.length === 0) {
                        callback(null, RHelper.makeEntities());
                        return;
                    }
                    var sYear = RDateUtils.formatDatetime("yyyy", this.mService.mDataModule.dataJSONTodatetime(aEntities.Rows[0][OSAC.FieldName_StartDate]));
                    this.getAssessUserHistory(aIds, aUserIds, sYear, callback);
                }.bind(this)],
                GetAssessUserGroup: ["GetAssess", function (results, callback) {
                    var aEntities = results.GetAssess;
                    var aIds = RUtils.getFieldArray(aEntities, OSAC.FieldName_Id);
                    if (aIds.length === 0) {
                        callback(null, RHelper.makeEntities());
                        return;
                    }
                    if (this.mFilter[OSAC.Condition_filter_showUserGroup] !== 1) {
                        callback(null, RHelper.makeEntities());
                        return;
                    }
                    this.getAssessUserGroup(aIds, callback);
                }.bind(this)],
                GetAssessUserList: ["GetAssess", function (results, callback) {
                    var aEntities = results.GetAssess;
                    var aIds = RUtils.getFieldArray(aEntities, OSAC.FieldName_Id);
                    if (aIds.length === 0) {
                        callback(null, RHelper.makeEntities());
                        return;
                    }
                    if (this.mFilter[OSAC.Condition_filter_showUserList] !== 1) {
                        callback(null, RHelper.makeEntities());
                        return;
                    }
                    this.getAssessUserList(aIds, callback);
                }.bind(this)],
                GetUsers: ["GetAssess", "GetAssessGroup", "GetAssessUser", "GetAssessUserList", function (results, callback) {//查询考官
                    var aEntities = results.GetAssess;
                    var aUserListUserIds = RUtils.getFieldArray(results.GetAssessUser, OSAC.FieldName_UserId);
                    if (aUserListUserIds.length <= 0) {
                        aUserListUserIds = RUtils.getFieldArray(results.GetAssessUserList, OSAC.FieldName_UserId);
                    }
                    var aResponsibleUserIds = [];
                    aEntities.Rows.forEach(function (item) {
                        var sResponsibleUserIds = item[OSAC.FieldName_ResponsibleUserIds];
                        if (sResponsibleUserIds) {
                            aResponsibleUserIds = _.concat(aResponsibleUserIds, sResponsibleUserIds.split(";"));
                        }
                    });
                    aEntities = results.GetAssessGroup;
                    var aExaminerUserIds = [];
                    aEntities.Rows.forEach(function (item) {
                        var sUserIds = item[OSAC.FieldName_ExaminerUserIds];
                        if (sUserIds) {
                            aExaminerUserIds = _.concat(aExaminerUserIds, sUserIds.split(";"));
                        }
                    });
                    aExaminerUserIds = _.concat(aExaminerUserIds, aUserListUserIds, aResponsibleUserIds);
                    this.getUsers(aExaminerUserIds, callback);
                }.bind(this)],
                GetAssessProjects: ["GetAssess", "GetAssessGroup", "GetAssessUserList", function (results, callback) {//查询考核项目
                    var aAssessProjectIds = RUtils.aryToUniqueAry(RUtils.getFieldArray(results.GetAssessGroup, OSAC.FieldName_AssessProjectId));
                    if (aAssessProjectIds.length === 0) {
                        aAssessProjectIds = RUtils.aryToUniqueAry(RUtils.getFieldArray(results.GetAssessUserList, OSAC.FieldName_AssessProjectId));
                    }
                    if (aAssessProjectIds.length === 0) {
                        callback(null, RHelper.makeEntities());
                        return;
                    }
                    this.getAssessProjects(aAssessProjectIds, callback);
                }.bind(this)],
                GetTraineeMember: ["GetAssessUserList", function (results, callback) {//查询实习生信息
                    if (this.mFilter[OSAC.Condition_filter_showCollege] !== 1) {//显示院校
                        callback(null, RHelper.makeEntities());
                        return;
                    }
                    var aUserListUserIds = RUtils.getFieldArray(results.GetAssessUser, OSAC.FieldName_UserId);
                    if (aUserListUserIds.length <= 0) {
                        aUserListUserIds = RUtils.getFieldArray(results.GetAssessUserList, OSAC.FieldName_UserId);
                    }
                    this.getTraineeMember(aUserListUserIds, callback);
                }.bind(this)],
                GetTestPaperSetting: ["GetAssess", function (results, callback) {
                    var aTestPaperIds = RUtils.getFieldArray(results.GetAssess, OSAC.FieldName_TestPaperId);
                    if (aTestPaperIds.length === 0 || this.mFilter[OSAC.Condition_filter_showTestPaperSetting] !== 1) {
                        callback(null, RHelper.makeEntities());
                        return;
                    }
                    this.getTestPaperSetting(aTestPaperIds, callback);
                }.bind(this)]
            }, function (error, results) {
                if (error) {
                    callback(error);
                    return;
                }
                if (!RUtils.isEmptyData(results.GetAssessTotal)) {
                    results.GetAssess[OSAC.FieldName_SumTotal] = results.GetAssessTotal.Rows[0][OSAC.FieldName_SumTotal];
                }
                var bIsManager = results.CheckManage;
                if (this.mCondition[OSAC.FieldName_SourceType] == GBC.SourceType_User) {
                    bIsManager = results.CheckOperationAssessManage;
                }
                var  corporationManager  = results.GetCorporationManager;
                RHelper.buildEntitesIndexX(corporationManager, OSAC.FieldName_UserId);
                var obj = corporationManager[this.mUserId];
                if (obj!=null){
                    bIsManager = true;
                }
                this.handleData(results.GetAssess, results.GetAssessUserGroup, results.GetAssessUserList,
                    results.GetUsers, results.GetTraineeMember,
                    results.GetAssessProjects, results.GetTestPaperSetting, results.GetAssessGroup, results.GetAssessUser,
                    results.GetAssessUserHistory, bIsManager, results.GetAssessUserGrade);
                callback(null, results.GetAssess);
            }.bind(this));
        };
    }
}

rs.registerClass(GetAssessByConditionAction);



function RMdAssessService() {
    if (rs.isDefClass(RMdAssessService)) {
        this.mDataModule = null;
        this.mRMdTraineeService = new RMdTraineeService("MdTraineeService");
        this.mRMdPermissionService = new RMdPermissionService("MdPermissionService");
    } else {
        rs.defClass(RMdAssessService);
        RMdAssessService.prototype.setup = function (injects, callback) {
            this.mDataModule = injects.dataModule;
            this.mBrOrganizationStructureProxy = injects.brOrganizationStructureProxy;
            this.mBrConfigureProxy = injects.brConfigureProxy;
            this.mBrProjectProxy = injects.brProjectProxy;
            this.mProjectProxy = injects.projectProxy;
            this.mBrUserProxy = injects.brUserProxy;
            this.mOrganizationStructureProxy = injects.organizationStructureProxy;
            this.mBrScheduleProxy = injects.brScheduleProxy;
            this.mSgTimerProxy = injects.sgTimerProxy;
            this.mBrMessageProxy = injects.brMessageProxy;
            this.mBrNewsupdateProxy = injects.brNewsupdateProxy;
            this.mBrPermissionProxy = injects.brPermissionProxy;
            this.mRMdTraineeService.setup(injects, function () {
                this.mRMdPermissionService.setup(injects, callback);
            }.bind(this));
        };


        /**
         * 新增 临床操作督导
         * @param row
         * @param callback
         */
        RMdAssessService.prototype.addClinicalAssess = function (row, callback) {
            var oAddClinicalAssessAction = new AddClinicalAssessAction(this);
            oAddClinicalAssessAction.execute(row, callback);
        };
        // /**
        //  * 查询 临床操作督导
        //  * @param condition
        //  * @param callback
        //  */
        // RMdAssessService.prototype.getClinicalAssessByCondition = function (condition, callback) {
        //     var oGetClinicalAssessByConditionAction = new GetClinicalAssessByConditionAction(this);
        //     oGetClinicalAssessByConditionAction.execute(condition, callback);
        // };
        /**
         * 新增考核
         * @param sourceType
         * @param sourceId
         * @param row
         * @param callback
         */
        RMdAssessService.prototype.addAssess = function (sourceType, sourceId, row, callback) {
            var oAddAssessAction = new AddAssessAction(this);
            oAddAssessAction.execute(sourceType, sourceId, row, callback);
        };

        /**
         * 修改考核
         * @param assessId
         * @param row
         * @param callback
         */
        RMdAssessService.prototype.modifyAssess = function (assessId, row, callback) {
            var oModifyAssessAction = new ModifyAssessAction(this);
            oModifyAssessAction.execute(assessId, row, callback);
        };
        /**
         * 操作考自动分组
         * @param assessId
         * @param row
         * @param callback
         */
        RMdAssessService.prototype.autoAssessUserGroup = function (assessId, row, callback) {
            var oAutoAssessUserGroupAction = new AutoAssessUserGroupAction(this);
            oAutoAssessUserGroupAction.execute(assessId, row, callback);
        };
        /**
         * 删除考核
         * @param assessId
         * @param callback
         */
        RMdAssessService.prototype.deleteAssess = function (assessId, callback) {
            var oDeleteAssessAction = new DeleteAssessAction(this);
            oDeleteAssessAction.execute(assessId, callback);
        };
        /**
         * 删除考核分组
         * @param assessId
         * @param callback
         */
        RMdAssessService.prototype.deleteAssessUserGroup = function (assessUserGroupId, callback) {
            var sSql = "delete from tb_assessusergroup where id=?;\n" +
                "delete from tb_assessuserlist where assessusergroupid=?;";
            this.mDataModule.executeSql(sSql, [assessUserGroupId, assessUserGroupId], callback);
        };
        /**
         * 查询考核
         * @param condition
         * @param callback
         */
        RMdAssessService.prototype.getAssessByCondition = function (condition, callback) {
            var oGetAssessByConditionAction = new GetAssessByConditionAction(this);
            oGetAssessByConditionAction.execute(condition, callback);
        };

    }
}

rs.registerClass(RMdAssessService);
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RMdAssessService;
}

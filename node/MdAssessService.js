var async = require('async');
WS.registerService("/organizationstructureservices/services/AssessService", "MdAssessService", {tokenVerify: true});
var RMdAssessService = require('../servicesaction/RMdAssessService.js');


function MdAssessService() {
    if (rs.isDefClass(MdAssessService)) {
        this.mRMdAssessService = new RMdAssessService();
        this.mLogger = null;
    } else {
        rs.defClass(MdAssessService);
        MdAssessService.prototype.setup = function (injects, callback) {
            this.mLogger = injects.log4js.getLogger('MdAssessService');
            this.mLogger.debug('MdAssessService.setup');
            this.mRMdAssessService.setup(
                injects,
                callback);
        };

        WS.registerMethod("addAssess", "POST", "application/json");
        WS.registerMethordParam("sourceType", WCT.DATATYPE_NUMBER);
        WS.registerMethordParam("sourceId", WCT.DATATYPE_STRING);
        WS.registerMethordParam("row", WCT.DATATYPE_JSON);
        MdAssessService.prototype.addAssess = function (sourceType, sourceId, row, callback) {
            this.mRMdAssessService.addAssess(sourceType, sourceId, row, callback);
        };

        WS.registerMethod("modifyAssess", "POST", "application/json");
        WS.registerMethordParam("assessId", WCT.DATATYPE_STRING);
        WS.registerMethordParam("row", WCT.DATATYPE_JSON);
        MdAssessService.prototype.modifyAssess = function (assessId, row, callback) {
            this.mRMdAssessService.modifyAssess(assessId, row, callback);
        };

        WS.registerMethod("autoAssessUserGroup", "POST", "application/json");
        WS.registerMethordParam("assessId", WCT.DATATYPE_STRING);
        WS.registerMethordParam("row", WCT.DATATYPE_JSON);
        MdAssessService.prototype.autoAssessUserGroup = function (assessId, row, callback) {
            this.mRMdAssessService.autoAssessUserGroup(assessId, row, callback);
        };

        WS.registerMethod("deleteAssess", "POST", "application/json");
        WS.registerMethordParam("assessId", WCT.DATATYPE_STRING);
        MdAssessService.prototype.deleteAssess = function (assessId, callback) {
            this.mRMdAssessService.deleteAssess(assessId, callback);
        };

        WS.registerMethod("deleteAssessUserGroup", "POST", "application/json");
        WS.registerMethordParam("assessUserGroupId", WCT.DATATYPE_STRING);
        MdAssessService.prototype.deleteAssessUserGroup = function (assessUserGroupId, callback) {
            this.mRMdAssessService.deleteAssessUserGroup(assessUserGroupId, callback);
        };

        WS.registerMethod("getAssessByCondition", "POST", "application/json");
        WS.registerMethordParam("condition", WCT.DATATYPE_JSON);
        MdAssessService.prototype.getAssessByCondition = function (condition, callback) {
            this.mRMdAssessService.getAssessByCondition(condition, callback);
        };

        WS.registerMethod("addAssessProject", "POST", "application/json");
        WS.registerMethordParam("row", WCT.DATATYPE_JSON);
        MdAssessService.prototype.addAssessProject = function (row, callback) {
            this.mRMdAssessService.addAssessProject(row, callback);
        };

        WS.registerMethod("modifyAssessProject", "POST", "application/json");
        WS.registerMethordParam("assessProjectId", WCT.DATATYPE_STRING);
        WS.registerMethordParam("row", WCT.DATATYPE_JSON);
        MdAssessService.prototype.modifyAssessProject = function (assessProjectId, row, callback) {
            this.mRMdAssessService.modifyAssessProject(assessProjectId, row, callback);
        };


        WS.registerMethod("deleteAssessProject", "POST", "application/json");
        WS.registerMethordParam("assessProjectId", WCT.DATATYPE_STRING);
        MdAssessService.prototype.deleteAssessProject = function (assessProjectId, callback) {
            this.mRMdAssessService.deleteAssessProject(assessProjectId, callback);
        };

        WS.registerMethod("getAssessProjectByCondition", "POST", "application/json");
        WS.registerMethordParam("condition", WCT.DATATYPE_JSON);
        MdAssessService.prototype.getAssessProjectByCondition = function (condition, callback) {
            this.mRMdAssessService.getAssessProjectByCondition(condition, callback);
        };

        WS.registerMethod("addAssessProjectDetail", "POST", "application/json");
        WS.registerMethordParam("assessProjectId", WCT.DATATYPE_STRING);
        WS.registerMethordParam("entities", WCT.DATATYPE_JSON);
        MdAssessService.prototype.addAssessProjectDetail = function (assessProjectId, entities, callback) {
            this.mRMdAssessService.addAssessProjectDetail(assessProjectId, entities, callback);
        };

        WS.registerMethod("modifyAssessProjectDetail", "POST", "application/json");
        WS.registerMethordParam("assessProjectDetailId", WCT.DATATYPE_STRING);
        WS.registerMethordParam("row", WCT.DATATYPE_JSON);
        MdAssessService.prototype.modifyAssessProjectDetail = function (assessProjectDetailId, row, callback) {
            this.mRMdAssessService.modifyAssessProjectDetail(assessProjectDetailId, row, callback);
        };

        WS.registerMethod("deleteAssessProjectDetail", "POST", "application/json");
        WS.registerMethordParam("entities", WCT.DATATYPE_JSON);
        MdAssessService.prototype.deleteAssessProjectDetail = function (entities, callback) {
            this.mRMdAssessService.deleteAssessProjectDetail(entities, callback);
        };
        WS.registerMethod("moveAssessProjectDetailOrder", "POST", "application/json");
        WS.registerMethordParam("assessProjectDetailId", WCT.DATATYPE_STRING);
        WS.registerMethordParam("orientation", WCT.DATATYPE_NUMBER);
        MdAssessService.prototype.moveAssessProjectDetailOrder = function (assessProjectDetailId, orientation, callback) {
            this.mRMdAssessService.moveAssessProjectDetailOrder(assessProjectDetailId, orientation, callback);
        };
        WS.registerMethod("getAssessProjectDetail", "POST", "application/json");
        WS.registerMethordParam("assessProjectId", WCT.DATATYPE_STRING);
        WS.registerMethordParam("condition", WCT.DATATYPE_JSON);
        MdAssessService.prototype.getAssessProjectDetail = function (assessProjectId, condition, callback) {
            this.mRMdAssessService.getAssessProjectDetail(assessProjectId, condition, callback);
        };

        WS.registerMethod("setAssessUserScore", "POST", "application/json");
        WS.registerMethordParam("assessId", WCT.DATATYPE_STRING);
        WS.registerMethordParam("userId", WCT.DATATYPE_STRING);
        WS.registerMethordParam("assessProjectId", WCT.DATATYPE_STRING);
        WS.registerMethordParam("entities", WCT.DATATYPE_JSON);
        MdAssessService.prototype.setAssessUserScore = function (assessId, userId, assessProjectId, entities, callback) {
            this.mRMdAssessService.setAssessUserScore(assessId, userId, assessProjectId, entities, callback);
        };

        WS.registerMethod("getAssessUserScore", "POST", "application/json");
        WS.registerMethordParam("assessId", WCT.DATATYPE_STRING);
        WS.registerMethordParam("condition", WCT.DATATYPE_JSON);
        MdAssessService.prototype.getAssessUserScore = function (assessId, condition, callback) {
            this.mRMdAssessService.getAssessUserScore(assessId, condition, callback);
        };

        WS.registerMethod("getAssessTraineeMember", "POST", "application/json");
        WS.registerMethordParam("traineeId", WCT.DATATYPE_STRING);
        WS.registerMethordParam("params", WCT.DATATYPE_JSON);
        WS.registerMethordParam("condition", WCT.DATATYPE_JSON);
        MdAssessService.prototype.getAssessTraineeMember = function (traineeId, params, condition, callback) {
            this.mRMdAssessService.getAssessTraineeMember(traineeId, params, condition, callback);
        };
        WS.registerMethod("getAssessEmployeeMember", "POST", "application/json");
        WS.registerMethordParam("params", WCT.DATATYPE_JSON);
        WS.registerMethordParam("condition", WCT.DATATYPE_JSON);
        MdAssessService.prototype.getAssessEmployeeMember = function ( params, condition, callback) {
            this.mRMdAssessService.getAssessEmployeeMember(params, condition, callback);
        };

        WS.registerMethod("publishAssess", "POST", "application/json");
        WS.registerMethordParam("assessId", WCT.DATATYPE_STRING);
        MdAssessService.prototype.publishAssess = function (assessId, callback) {
            this.mRMdAssessService.publishAssess(assessId, callback);
        };

        WS.registerMethod("revokeAssess", "POST", "application/json");
        WS.registerMethordParam("assessId", WCT.DATATYPE_STRING);
        MdAssessService.prototype.revokeAssess = function (assessId, callback) {
            this.mRMdAssessService.revokeAssess(assessId, callback);
        };

        WS.registerMethod("publishAssessScore", "POST", "application/json");
        WS.registerMethordParam("assessId", WCT.DATATYPE_STRING);
        MdAssessService.prototype.publishAssessScore = function (assessId, callback) {
            this.mRMdAssessService.publishAssessScore(assessId, callback);
        };

        WS.registerMethod("revokeAssessScore", "POST", "application/json");
        WS.registerMethordParam("assessId", WCT.DATATYPE_STRING);
        MdAssessService.prototype.revokeAssessScore = function (assessId, callback) {
            this.mRMdAssessService.revokeAssessScore(assessId, callback);
        };
        WS.registerMethod("getAssessUserListByCondition", "POST", "application/json");
        WS.registerMethordParam("condition", WCT.DATATYPE_JSON);
        MdAssessService.prototype.getAssessUserListByCondition = function (condition, callback) {
            this.mRMdAssessService.getAssessUserListByCondition(condition, callback);
        };
        WS.registerMethod("getAssessMemberByCondition", "POST", "application/json");
        WS.registerMethordParam("condition", WCT.DATATYPE_JSON);
        MdAssessService.prototype.getAssessMemberByCondition = function (condition, callback) {
            this.mRMdAssessService.getAssessMemberByCondition(condition, callback);
        };

        WS.registerMethod("importAssessTestQuestion", "POST", "application/json");
        WS.registerMethordParam("row", WCT.DATATYPE_JSON);
        WS.registerMethordParam("entities", WCT.DATATYPE_JSON);
        MdAssessService.prototype.importAssessTestQuestion = function (row, entities, callback) {
            this.mRMdAssessService.importAssessTestQuestion(row, entities, callback);
        };

        WS.registerMethod("submitAssessTestPaper", "POST", "application/json");
        WS.registerMethordParam("testPaperId", WCT.DATATYPE_STRING);
        WS.registerMethordParam("detailEntities", WCT.DATATYPE_JSON);
        MdAssessService.prototype.submitAssessTestPaper = function (testPaperId, detailEntities, callback) {
            this.mRMdAssessService.submitAssessTestPaper(testPaperId, detailEntities, callback);
        };
        WS.registerMethod("getAssessMemberByAssessId", "POST", "application/json");
        WS.registerMethordParam("assessId", WCT.DATATYPE_STRING);
        MdAssessService.prototype.getAssessMemberByAssessId = function (assessId, callback) {
            this.mRMdAssessService.getAssessMemberByAssessId(assessId, callback);
        };

        WS.registerMethod("addAssessUser", "POST", "application/json");
        WS.registerMethordParam("assessId", WCT.DATATYPE_STRING);
        WS.registerMethordParam("userEntities", WCT.DATATYPE_JSON);
        MdAssessService.prototype.addAssessUser = function (assessId, userEntities, callback) {
            this.mRMdAssessService.addAssessUser(assessId, userEntities, callback);
        };
        WS.registerMethod("createAssessTestPaperQuestion", "POST", "application/json");
        WS.registerMethordParam("assessId", WCT.DATATYPE_STRING);
        MdAssessService.prototype.createAssessTestPaperQuestion = function (assessId, callback) {
            this.mRMdAssessService.createAssessTestPaperQuestion(assessId, callback);
        };
        WS.registerMethod("getDepartmentSummaryReport", "POST", "application/json");
        WS.registerMethordParam("condition", WCT.DATATYPE_JSON);
        MdAssessService.prototype.getDepartmentSummaryReport = function (condition, callback) {
            this.mRMdAssessService.getDepartmentSummaryReport(condition, callback);
        };
        WS.registerMethod("sendPlaceNotice", "POST", "application/json");
        WS.registerMethordParam("assessId", WCT.DATATYPE_STRING);
        WS.registerMethordParam("assessUserGroupIds", WCT.DATATYPE_JSON);
        MdAssessService.prototype.sendPlaceNotice = function (assessId, assessUserGroupIds, callback) {
            this.mRMdAssessService.sendPlaceNotice(assessId, assessUserGroupIds, callback);
        };
        WS.registerMethod("getAssessRoleSetting", "POST", "application/json");
        WS.registerMethordParam("assessType", WCT.DATATYPE_NUMBER);
        MdAssessService.prototype.getAssessRoleSetting = function (assessType, callback) {
            this.mRMdAssessService.getAssessRoleSetting(assessType, callback);
        };
        WS.registerMethod("getAssessUserHistory", "POST", "application/json");
        WS.registerMethordParam("assessId", WCT.DATATYPE_STRING);
        WS.registerMethordParam("sourceId", WCT.DATATYPE_STRING);
        WS.registerMethordParam("userIds", WCT.DATATYPE_STRING);
        WS.registerMethordParam("startDate", WCT.DATATYPE_STRING);
        MdAssessService.prototype.getAssessUserHistory = function (assessId, sourceId, userIds, startDate, callback) {
            this.mRMdAssessService.getAssessUserHistory(assessId, sourceId, userIds, startDate, callback);
        };
        WS.registerMethod("getAssessMemberScoreByCondition", "POST", "application/json");
        WS.registerMethordParam("condition", WCT.DATATYPE_JSON);
        MdAssessService.prototype.getAssessMemberScoreByCondition = function (condition, callback) {
            this.mRMdAssessService.getAssessMemberScoreByCondition(condition, callback);
        };
        WS.registerMethod("resetAssessProjectDetailItemIndex", "POST", "application/json");
        WS.registerMethordParam("assessProjectId", WCT.DATATYPE_STRING);
        MdAssessService.prototype.resetAssessProjectDetailItemIndex = function (assessProjectId, callback) {
            this.mRMdAssessService.resetAssessProjectDetailItemIndex(assessProjectId, callback);
        };

        WS.registerMethod("assessSignUp", "POST", "application/json");
        WS.registerMethordParam("assessId", WCT.DATATYPE_STRING);
        WS.registerMethordParam("userIds", WCT.DATATYPE_JSON);
        MdAssessService.prototype.assessSignUp = function (assessId, userIds, callback) {
            this.mRMdAssessService.assessSignUp(assessId, userIds, callback);
        };
        WS.registerMethod("cancelAssessSignUp", "POST", "application/json");
        WS.registerMethordParam("assessId", WCT.DATATYPE_STRING);
        WS.registerMethordParam("userIds", WCT.DATATYPE_JSON);
        MdAssessService.prototype.cancelAssessSignUp = function (assessId, userIds, callback) {
            this.mRMdAssessService.cancelAssessSignUp(assessId, userIds, callback);
        };

        WS.registerMethod("addClinicalAssess", "POST", "application/json");
        WS.registerMethordParam("row", WCT.DATATYPE_JSON);
        MdAssessService.prototype.addClinicalAssess = function (row, callback) {
            this.mRMdAssessService.addClinicalAssess(row, callback);
        };
        // WS.registerMethod("getClinicalAssessByCondition", "POST", "application/json");
        // WS.registerMethordParam("condition", WCT.DATATYPE_JSON);
        // MdAssessService.prototype.getClinicalAssessByCondition = function (condition, callback) {
        //     this.mRMdAssessService.getClinicalAssessByCondition(condition, callback);
        // };

    }
}
;
rs.registerClass(MdAssessService);

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MdAssessService;
    global.MdAssessService = MdAssessService;
}

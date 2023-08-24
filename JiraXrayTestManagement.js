"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var axios_1 = require("axios");
var fs = require("fs");
var zip_a_folder_1 = require("zip-a-folder");
var FormData = require('form-data');
var format = require('date-format');
dotenv.config();
var JiraXrayTestManagement = /** @class */ (function () {
    function JiraXrayTestManagement() {
        this.username = process.env.ATLASSIAN_USERNAME;
        this.password = process.env.ATLASSIAN_API_KEY;
        this.baseUrl = process.env.JIRA_BASE_URL;
        this.xrayBaseUrl = process.env.XRAY_BASE_URL;
        this.clientId = process.env.JIRA_CLIENT_ID;
        this.clientSecret = process.env.JIRA_CLIENT_SECRET;
        this.auth = {
            username: this.username,
            password: this.password
        };
    }
    JiraXrayTestManagement.prototype.getAuthToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var authenticate_url, response, auth_token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        authenticate_url = "".concat(this.xrayBaseUrl, "/authenticate");
                        return [4 /*yield*/, axios_1.default.post(authenticate_url, { "client_id": this.clientId, "client_secret": this.clientSecret }, {})];
                    case 1:
                        response = _a.sent();
                        auth_token = response.data;
                        console.log("TOKEN CREATED");
                        return [2 /*return*/, auth_token];
                }
            });
        });
    };
    JiraXrayTestManagement.prototype.importExecutionReportToJiraXray = function (executionReportType, reportFileName, jiraProjectId, testExecutionIssueTypeId, issueSummary, issueDesc) {
        return __awaiter(this, void 0, void 0, function () {
            var report_content, auth_token, full_endpoint_url, endpoint, bodyFormData, info_json, testInfo_json, response, returnObject, _a, _b, error_1;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        console.log("IMPORT EXECUTION REPORT TO JIRA STARTED");
                        return [4 /*yield*/, fs.readFileSync(reportFileName).toString()];
                    case 1:
                        report_content = _d.sent();
                        return [4 /*yield*/, this.getAuthToken()];
                    case 2:
                        auth_token = _d.sent();
                        full_endpoint_url = "";
                        endpoint = "";
                        return [4 /*yield*/, new FormData()];
                    case 3:
                        bodyFormData = _d.sent();
                        info_json = {
                            "fields": {
                                "project": {
                                    "id": jiraProjectId
                                },
                                "summary": issueSummary,
                                "description": issueDesc,
                                "issuetype": {
                                    "id": testExecutionIssueTypeId
                                }
                            }
                        };
                        testInfo_json = {
                            "fields": {
                                "project": {
                                    "id": jiraProjectId
                                },
                                "labels": [
                                    "Server",
                                    "TestNG"
                                ]
                            }
                        };
                        _d.label = 4;
                    case 4:
                        _d.trys.push([4, 11, , 12]);
                        switch (executionReportType.toLowerCase()) {
                            case "junit":
                                endpoint = "/import/execution/junit/multipart";
                                break;
                            case "testng":
                                endpoint = "/import/execution/testng/multipart";
                                break;
                            default:
                                console.log("Please provide correct report type");
                                break;
                        }
                        return [4 /*yield*/, bodyFormData.append('results', report_content, 'results.xml')];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, bodyFormData.append('info', JSON.stringify(info_json), 'info.json')];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, bodyFormData.append('testInfo', JSON.stringify(testInfo_json), 'testInfo.json')];
                    case 7:
                        _d.sent();
                        full_endpoint_url = "".concat(this.xrayBaseUrl).concat(endpoint);
                        return [4 /*yield*/, axios_1.default.post(full_endpoint_url, bodyFormData, {
                                headers: __assign({ 'Authorization': "Bearer " + auth_token }, bodyFormData.getHeaders())
                            })];
                    case 8:
                        response = _d.sent();
                        _c = {};
                        _a = "testExecutionId";
                        return [4 /*yield*/, response.data.id];
                    case 9:
                        _c[_a] = _d.sent();
                        _b = "testExecutionKey";
                        return [4 /*yield*/, response.data.key];
                    case 10:
                        returnObject = (_c[_b] = _d.sent(),
                            _c);
                        console.log("IMPORT EXECUTION REPORT TO JIRA COMPLETED");
                        return [2 /*return*/, returnObject];
                    case 11:
                        error_1 = _d.sent();
                        console.log('error: Exception In importExecutionReportToJiraXray ******');
                        console.log(error_1.response);
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    JiraXrayTestManagement.prototype.attachFileWithIssue = function (issueKey, attachmentFilePath) {
        return __awaiter(this, void 0, void 0, function () {
            var bodyFormData, stats, fileSizeInBytes, fileStream, full_endpoint_url, config, response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("ATTACHED FILE WITH ISSUE STARTED");
                        return [4 /*yield*/, new FormData()];
                    case 1:
                        bodyFormData = _a.sent();
                        stats = fs.statSync(attachmentFilePath);
                        fileSizeInBytes = stats.size;
                        fileStream = fs.createReadStream(attachmentFilePath);
                        full_endpoint_url = "".concat(this.baseUrl, "/rest/api/3/issue/").concat(issueKey, "/attachments");
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, bodyFormData.append('file', fileStream, { knownLength: fileSizeInBytes })];
                    case 3:
                        _a.sent();
                        config = {
                            headers: __assign({ 'Content-Type': 'application/json', 'X-Atlassian-Token': 'no-check' }, bodyFormData.getHeaders()),
                            auth: this.auth
                        };
                        return [4 /*yield*/, axios_1.default.post(full_endpoint_url, bodyFormData, config)];
                    case 4:
                        response = _a.sent();
                        console.log("ATTACHED FILE WITH ISSUE COMPLETED");
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        console.log("THE ERROR IS IN attachFileWithIssue ******");
                        console.log(error_2.response);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    JiraXrayTestManagement.prototype.zipFolder = function (folderPath) {
        return __awaiter(this, void 0, void 0, function () {
            var dateTimeString, zipFileName, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("ZIP FOLDER FUNCTION STARTED");
                        return [4 /*yield*/, format.asString('yyyyMMddhhmmss', new Date())];
                    case 1:
                        dateTimeString = _a.sent();
                        zipFileName = "".concat(folderPath).concat(dateTimeString, ".zip");
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, (0, zip_a_folder_1.zip)(folderPath, zipFileName)];
                    case 3:
                        _a.sent();
                        console.log("ZIP FOLDER FUNCTION COMPLETED");
                        return [2 /*return*/, zipFileName];
                    case 4:
                        error_3 = _a.sent();
                        console.log("ERROR IN ZIP FOLDER FUNCTION ******");
                        console.log(error_3);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    JiraXrayTestManagement.prototype.uploadToJira = function (executionReportType, reportFileName, jiraProjectId, testExecutionIssueTypeId, issueSummary, issueDesc, executionReportFolderPath) {
        return __awaiter(this, void 0, void 0, function () {
            var issueDetailsObject, zipFileName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.importExecutionReportToJiraXray(executionReportType, reportFileName, jiraProjectId, testExecutionIssueTypeId, issueSummary, issueDesc)];
                    case 1:
                        issueDetailsObject = _a.sent();
                        return [4 /*yield*/, this.zipFolder(executionReportFolderPath)];
                    case 2:
                        zipFileName = _a.sent();
                        return [4 /*yield*/, this.attachFileWithIssue(issueDetailsObject === null || issueDetailsObject === void 0 ? void 0 : issueDetailsObject.testExecutionKey, zipFileName)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return JiraXrayTestManagement;
}());
exports.default = JiraXrayTestManagement;

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
var ManageJira = /** @class */ (function () {
    function ManageJira() {
        this.username = process.env.ATLASSIAN_USERNAME;
        this.password = process.env.ATLASSIAN_API_KEY;
        this.domain = process.env.DOMAIN;
        this.leadAccountID = process.env.LEAD_ACCT_ID;
        this.projKey = process.env.PROJECT_KEY;
        this.projectName = process.env.PROJECT_NAME;
        this.baseUrl = process.env.JIRA_BASE_URL;
        this.xrayBaseUrl = process.env.XRAY_BASE_URL;
        this.clientId = process.env.JIRA_CLIENT_ID; //|| "215FFD69FE4644728C72182E00000000";
        this.clientSecret = process.env.JIRA_CLIENT_SECRET;
        this.auth = {
            username: this.username,
            password: this.password
        };
        this.config = {
            headers: {
                'Content-Type': 'application/json'
            },
            auth: this.auth
        };
    }
    ManageJira.prototype.createJiraProject = function () {
        return __awaiter(this, void 0, void 0, function () {
            var config, data, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        config = this.config;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        data = {
                            key: this.projKey,
                            name: this.projectName,
                            projectTypeKey: 'software',
                            "leadAccountId": this.leadAccountID
                        };
                        return [4 /*yield*/, axios_1.default.post("".concat(this.baseUrl, "/rest/api/3/project"), data, config)];
                    case 2:
                        response = _a.sent();
                        console.log(response.data);
                        return [2 /*return*/, response.data.key];
                    case 3:
                        error_1 = _a.sent();
                        console.log('error: ');
                        console.log(error_1.response.data.errors);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ManageJira.prototype.getJiraProject = function () {
        return __awaiter(this, void 0, void 0, function () {
            var config, response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        config = __assign({ method: 'get', url: this.baseUrl + '/rest/api/3/project/recent' }, this.config);
                        return [4 /*yield*/, axios_1.default.request(config)];
                    case 1:
                        response = _a.sent();
                        console.log(response.data);
                        return [2 /*return*/, response.data];
                    case 2:
                        error_2 = _a.sent();
                        console.log('error: ');
                        console.log(error_2.response.data.errors);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ManageJira.prototype.createJiraIssue = function (projectKey, issueType, summary, description) {
        return __awaiter(this, void 0, void 0, function () {
            var data, config, response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data = {
                            fields: {
                                project: { key: projectKey },
                                summary: summary,
                                description: description,
                                issuetype: { name: issueType }
                            }
                        };
                        config = this.config;
                        return [4 /*yield*/, axios_1.default.post("".concat(this.baseUrl, "/rest/api/2/issue"), data, config)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.key];
                    case 2:
                        error_3 = _a.sent();
                        console.log('error: ');
                        console.log(error_3.response.data.errors);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ManageJira.prototype.getJiraIssues = function () {
        return __awaiter(this, void 0, void 0, function () {
            var config, response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        config = __assign({ method: 'get', url: this.baseUrl + '/rest/api/2/search' }, this.config);
                        return [4 /*yield*/, axios_1.default.request(config)];
                    case 1:
                        response = _a.sent();
                        console.log(response.data);
                        return [2 /*return*/, response.data];
                    case 2:
                        error_4 = _a.sent();
                        console.log('error: ');
                        console.log(error_4.response.data.errors);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ManageJira.prototype.getJiraIssueById = function (issueKey) {
        return __awaiter(this, void 0, void 0, function () {
            var config, response, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        config = __assign({ method: 'get', url: this.baseUrl + '/rest/api/2/issue/' + issueKey }, this.config);
                        return [4 /*yield*/, axios_1.default.request(config)];
                    case 1:
                        response = _a.sent();
                        console.log(response.data);
                        return [2 /*return*/, response.data];
                    case 2:
                        error_5 = _a.sent();
                        console.log('error: ');
                        console.log(error_5.response.data.errors);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //********************** */
    ManageJira.prototype.updateIssueField = function (issueKey) {
        return __awaiter(this, void 0, void 0, function () {
            var data, config, response, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            "update": {
                                "summary": [
                                    {
                                        "set": "Updated by update"
                                    }
                                ]
                            }
                        };
                        config = this.config;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.put("".concat(this.baseUrl) + "/rest/api/3/issue/" + issueKey, data, config)];
                    case 2:
                        response = _a.sent();
                        console.log(response.status);
                        return [2 /*return*/, response.status];
                    case 3:
                        error_6 = _a.sent();
                        console.log('error: ');
                        console.log(error_6.response.data.errors);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ManageJira.prototype.linkIssues = function (inwardIssueKey, outwardIssueKey, linkType) {
        return __awaiter(this, void 0, void 0, function () {
            var data, config, response, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            "inwardIssue": {
                                "key": inwardIssueKey
                            },
                            "outwardIssue": {
                                "key": outwardIssueKey
                            },
                            "type": {
                                "name": linkType
                            }
                        };
                        config = this.config;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.post("".concat(this.baseUrl) + "/rest/api/3/issueLink", data, config)];
                    case 2:
                        response = _a.sent();
                        console.log(response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_7 = _a.sent();
                        console.log('error: ');
                        console.log(error_7.response.data.errors);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //xray specific methods.
    ManageJira.prototype.getAuthToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var authenticate_url, response, auth_token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        authenticate_url = "".concat(this.xrayBaseUrl, "/authenticate");
                        return [4 /*yield*/, axios_1.default.post(authenticate_url, { "client_id": this.clientId, "client_secret": this.clientSecret }, {})];
                    case 1:
                        response = _a.sent();
                        console.log('success');
                        auth_token = response.data;
                        console.log("AUTH: " + auth_token);
                        return [2 /*return*/, auth_token];
                }
            });
        });
    };
    // public async importTestNGMultipartReport(projectKey: string) {
    //     const report_content = await fs.readFileSync("./testng.xml").toString();
    //     const test_info_content = await fs.readFileSync("./infoJSONTEST.json").toString();
    //     // console.log("report content is :");
    //     //  console.log(info_content);
    //     const endpoint_url = `${this.xrayBaseUrl}/import/execution/testng/multipart`;
    //     const auth_token = await this.getAuthToken();
    //     let info_json = {
    //         "fields": {
    //             "project": {
    //                 "id": "10006"
    //             },
    //             "summary": "Test Execution for TESTNG execution",
    //             "description": "This contains test automation results",
    //             "issuetype": {
    //                 "id": "10014"
    //             }
    //         }
    //     };
    //     // "xrayFields": {
    //     //     "environments": ["chrome","Windows"]
    //     // }
    //     // let multiData ={
    //     //     "results":JSON.stringify(report_content),
    //     //     "info":JSON.stringify(info_content)
    //     // };
    //     try {
    //         let bodyFormData = await new FormData();
    //         await bodyFormData.append('results', report_content, 'testng.xml');
    //         await bodyFormData.append('info', JSON.stringify(info_json), 'info.json');
    //         await bodyFormData.append('testInfo', JSON.stringify(test_info_content), 'test_info_content.json');
    //         let response = await axios.post(endpoint_url, bodyFormData, {
    //             headers: {
    //                 'Authorization': "Bearer " + auth_token,
    //                 ...bodyFormData.getHeaders()
    //             }
    //         })
    //         //console.log(response);
    //     } catch (error: any) {
    //         console.log('error: it is here ')
    //         console.log(error.response)
    //     }
    // }
    // public async importCucumberMultipartReport(projectKey: string) {
    //     const report_content = await fs.readFileSync("./cucumber.json").toString();
    //     //const test_info_content = await fs.readFileSync("./infoJSONTEST.json").toString();
    //     // console.log("report content is :");
    //     //  console.log(info_content);
    //     const endpoint_url = `${this.xrayBaseUrl}/import/execution/cucumber/multipart`;
    //     const auth_token = await this.getAuthToken();
    //     let info_json = {
    //         "fields": {
    //             "project": {
    //                 "id": "10006"
    //             },
    //             "summary": "Test Execution for Cucumber execution_PARAG",
    //             "description": "This contains test automation results",
    //             "issuetype": {
    //                 "id": "10014"
    //             }
    //         }
    //     };
    //     // "xrayFields": {
    //     //     "environments": ["chrome","Windows"]
    //     // }
    //     // let multiData ={
    //     //     "results":JSON.stringify(report_content),
    //     //     "info":JSON.stringify(info_content)
    //     // };
    //     try {
    //         let bodyFormData = await new FormData();
    //         await bodyFormData.append('results', report_content, 'cucumber.json');
    //         await bodyFormData.append('info', JSON.stringify(info_json), 'info.json');
    //         //await bodyFormData.append('testInfo', JSON.stringify(test_info_content), 'test_info_content.json');
    //         let response = await axios.post(endpoint_url, bodyFormData, {
    //             headers: {
    //                 'Authorization': "Bearer " + auth_token,
    //                 ...bodyFormData.getHeaders()
    //             }
    //         })
    //         //console.log(response);
    //     } catch (error: any) {
    //         console.log('error: it is here ')
    //         console.log(error.response)
    //     }
    // }
    ManageJira.prototype.getCucumberTestDetails = function (cucumberTestKey) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint_url, auth_token, config, response, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint_url = "".concat(this.xrayBaseUrl, "/export/cucumber?keys=\"").concat(cucumberTestKey, "\"");
                        console.log(endpoint_url);
                        return [4 /*yield*/, this.getAuthToken()];
                    case 1:
                        auth_token = _a.sent();
                        config = {
                            headers: {
                                "Content-Type": "application/json",
                                'Authorization': "Bearer " + auth_token
                            }
                        };
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        console.log(config);
                        return [4 /*yield*/, axios_1.default.get(endpoint_url, config)];
                    case 3:
                        response = _a.sent();
                        console.log(response.data);
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        console.log("this is the error ".concat(err_1.response.data.errors));
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // public async importJUnitXMLMultipartReport(projectKey: string) {
    //     const report_content = fs.readFileSync("cucumber.json").toString();
    //     const endpoint_url = `${this.xrayBaseUrl}/import/execution/junit/multipart`;
    //     const auth_token = await this.getAuthToken();
    //     let info_json = {
    //         "fields": {
    //             "project": {
    //                 "id": "10006"
    //             },
    //             "summary": "Test Execution for Cucumber execution",
    //             "description": "This contains test automation results",
    //             "issuetype": {
    //                 "id": "10014"
    //             },
    //             "xrayFields": {
    //                 "environments": ["chrome","Windows"]
    //             }
    //         }
    //     };
    //     try {
    //         let bodyFormData = await new FormData();
    //         // bodyFormData.append('results', report_content, 'cucumber.json');
    //         // bodyFormData.append('info', JSON.stringify(info_json), 'info.json');
    //         await bodyFormData.append('results', report_content,'cucumber-report.json');
    //         await bodyFormData.append('info', JSON.stringify(info_json), 'info.json');
    //         // await bodyFormData.append('data', JSON.stringify(info_json), 'info.json');
    //         //console.log(JSON.stringify(info_json));
    //         let response = await axios.post(endpoint_url, bodyFormData, {
    //             headers: {
    //                 'Authorization': "Bearer " + auth_token,
    //                 ...bodyFormData.getHeaders()
    //             }
    //         })
    //         //console.log(response);
    //     } catch (error: any) {
    //         console.log('error: it is here ')
    //         console.log(error.response)
    //     }
    // }
    // public async importJUNITMultipartReport(projectKey: string) {
    //     const report_content = await fs.readFileSync("./juitreport.xml").toString();
    //     const test_info_content = await fs.readFileSync("./testInfoJson.json").toString();
    //     const endpoint_url = `${this.xrayBaseUrl}/import/execution/junit/multipart`;
    //     const auth_token = await this.getAuthToken();
    //     let info_json = {
    //         "fields": {
    //             "project": {
    //                 "id": "10006"
    //             },
    //             "summary": "Test Execution for JUNIT execution",
    //             "description": "This contains test automation results",
    //             "issuetype": {
    //                 "id": "10014"
    //             }
    //         }
    //     };
    //     // "xrayFields": {
    //     //     "environments": ["chrome","Windows"]
    //     // }
    //     // let multiData ={
    //     //     "results":JSON.stringify(report_content),
    //     //     "info":JSON.stringify(info_content)
    //     // };
    //     try {
    //         let bodyFormData = await new FormData();
    //         await bodyFormData.append('results', report_content, 'juitreport.xml');
    //         await bodyFormData.append('info', JSON.stringify(info_json), 'info.json');
    //         await bodyFormData.append('testInfo', JSON.stringify(test_info_content), 'testInfoJson.json');
    //         let response = await axios.post(endpoint_url, bodyFormData, {
    //             headers: {
    //                 'Authorization': "Bearer " + auth_token,
    //                 ...bodyFormData.getHeaders()
    //             }
    //         })
    //         //console.log(response);
    //     } catch (error: any) {
    //         console.log('error: it is here ')
    //         console.log(error.response)
    //     }
    // }
    // public async importExecutionReportToJiraXray(projectId: string, testExecutionIssueTypeId: string, isueSummary: string, issueDesc: string, executionReportType: string, executionReportLocation: string) {
    //     //This object is required to create test execution issue type in JIRA
    //     const infoJson = {
    //         "fields": {
    //             "project": {
    //                 "id": projectId
    //             },
    //             "summary": isueSummary,
    //             "description": issueDesc,
    //             "issuetype": {
    //                 "id": testExecutionIssueTypeId
    //             }
    //         }
    //     };
    //     //This object is required to provide test details.
    //     const testInfoJson = {
    //         "fields": {
    //             "project": {
    //                 "id": projectId
    //             },
    //             "labels": ["Server", "TestNG"]
    //         }
    //     }
    //     const infoJsonString = JSON.stringify(infoJson);
    //     const testInfoJsonString = JSON.stringify(testInfoJson);
    //     // fs.writeFileSync('infoJson.json', infoJsonString);
    //     // fs.writeFileSync('testInfoJson.json', testInfoJsonString);
    //     // fs.writeFile('infoJson.json', JSON.stringify(infoJson) , function (err) {
    //     //     if (err) throw err;
    //     //     console.log('File is created successfully.');
    //     // });
    //     // fs.writeFile('testInfoJson.json', JSON.stringify(testInfoJson) , function (err) {
    //     //     if (err) throw err;
    //     //     console.log('File is created successfully.');
    //     // });
    //     const report_content = fs.readFileSync("./juitreport.xml").toString();
    //     const info_json_content = fs.readFileSync("./infoJson.json").toString();
    //     const test_info_content = fs.readFileSync("./testInfoJson.json").toString();
    //     const endpoint_url = `${this.xrayBaseUrl}/import/execution/junit/multipart`;
    //     const auth_token = await this.getAuthToken();
    //     switch (executionReportType.toLowerCase()) {
    //         case "junit":
    //             try {
    //                 let bodyFormData = await new FormData();
    //                 await bodyFormData.append('results', JSON.stringify(report_content), 'junitreport.xml');
    //                 await bodyFormData.append('info', JSON.stringify(info_json_content), "infoJson.json");
    //                 await bodyFormData.append('testInfo', JSON.stringify(test_info_content), "testInfoJson.json");
    //                 let response = await axios.post(endpoint_url, bodyFormData, {
    //                     headers: {
    //                         'Authorization': "Bearer " + auth_token,
    //                         ...bodyFormData.getHeaders()
    //                     }
    //                 })
    //                 //console.log(response);
    //             } catch (error: any) {
    //                 console.log('error: it is here ')
    //                 console.log(error.response)
    //             }
    //             break;
    //         default:
    //             break;
    //     }
    // }
    ManageJira.prototype.importExecutionReportToJiraXray = function (executionReportType, reportFileName, jiraProjectId, testExecutionIssueTypeId, issueSummary, issueDesc) {
        return __awaiter(this, void 0, void 0, function () {
            var report_content, auth_token, full_endpoint_url, endpoint, bodyFormData, info_json, testInfo_json, response, returnObject, _a, _b, error_8;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, fs.readFileSync(reportFileName).toString()];
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
                        return [2 /*return*/, returnObject];
                    case 11:
                        error_8 = _d.sent();
                        console.log('error: Exception In Execution Report Import ******* ');
                        console.log(error_8.response);
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    ManageJira.prototype.attachFileWithIssue = function (issueKey, attachmentFilePath) {
        return __awaiter(this, void 0, void 0, function () {
            var bodyFormData, stats, fileSizeInBytes, fileStream, full_endpoint_url, config, response, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new FormData()];
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
                        console.log(response);
                        return [3 /*break*/, 6];
                    case 5:
                        error_9 = _a.sent();
                        console.log("THE ERROR IS:");
                        console.log(error_9.response);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ManageJira.prototype.zipFolder = function (folderPath) {
        return __awaiter(this, void 0, void 0, function () {
            var dateTimeString, zipFileName, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, format.asString('yyyyMMddhhmmss', new Date())];
                    case 1:
                        dateTimeString = _a.sent();
                        zipFileName = "".concat(folderPath).concat(dateTimeString, ".zip");
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, (0, zip_a_folder_1.zip)(folderPath, zipFileName)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, zipFileName];
                    case 4:
                        error_10 = _a.sent();
                        console.log("ERROR IN ZIP FOLDER FUNCTION *******");
                        console.log(error_10);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return ManageJira;
}());
exports.default = ManageJira;

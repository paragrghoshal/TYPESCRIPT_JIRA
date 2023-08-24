import * as dotenv from "dotenv";
import axios from 'axios';
import * as fs from 'fs';
import { zip } from 'zip-a-folder';
var FormData = require('form-data');
var format = require('date-format');

dotenv.config();

export default class ManageJira {

    username = process.env.ATLASSIAN_USERNAME
    password = process.env.ATLASSIAN_API_KEY
    domain = process.env.DOMAIN
    leadAccountID = process.env.LEAD_ACCT_ID
    projKey = process.env.PROJECT_KEY
    projectName = process.env.PROJECT_NAME
    baseUrl = process.env.JIRA_BASE_URL
    xrayBaseUrl = process.env.XRAY_BASE_URL
    clientId = process.env.JIRA_CLIENT_ID //|| "215FFD69FE4644728C72182E00000000";
    clientSecret = process.env.JIRA_CLIENT_SECRET

    auth = {
        username: this.username!,
        password: this.password!
    };

    config = {
        headers: {
            'Content-Type': 'application/json'
        },
        auth: this.auth
    };

    public async createJiraProject() {

        const config = this.config;
        try {
            const data = {
                key: this.projKey,
                name: this.projectName,
                projectTypeKey: 'software',
                "leadAccountId": this.leadAccountID
            };
            const response = await axios.post(`${this.baseUrl}/rest/api/3/project`, data, config);
            console.log(response.data)
            return response.data.key;
        } catch (error: any) {
            console.log('error: ')
            console.log(error.response.data.errors)
        }
    }

    public async getJiraProject() {

        try {
            const config = {
                method: 'get',
                url: this.baseUrl + '/rest/api/3/project/recent',
                ...this.config
            };
            const response = await axios.request(config);
            console.log(response.data)
            return response.data;

        } catch (error: any) {
            console.log('error: ')
            console.log(error.response.data.errors)
        }
    }

    public async createJiraIssue(projectKey: string, issueType: string, summary: string, description: string) {

        try {
            const data = {
                fields: {
                    project: { key: projectKey },
                    summary: summary,
                    description: description,
                    issuetype: { name: issueType }
                }
            };
            const config = this.config;
            const response = await axios.post(`${this.baseUrl}/rest/api/2/issue`, data, config);
            return response.data.key;
        } catch (error: any) {
            console.log('error: ')
            console.log(error.response.data.errors)
        }
    }

    public async getJiraIssues() {
        try {
            const config = {
                method: 'get',
                url: this.baseUrl + '/rest/api/2/search',
                ... this.config
            };
            const response = await axios.request(config);
            console.log(response.data)
            return response.data;
        } catch (error: any) {
            console.log('error: ')
            console.log(error.response.data.errors)
        }

    }

    public async getJiraIssueById(issueKey: string) {
        try {
            const config = {
                method: 'get',
                url: this.baseUrl + '/rest/api/2/issue/' + issueKey,
                ...this.config
            };
            const response = await axios.request(config);
            console.log(response.data)
            return response.data;
        } catch (error: any) {
            console.log('error: ')
            console.log(error.response.data.errors)
        }
    }

    //********************** */

    public async updateIssueField(issueKey: string) {

        // const data = {
        //     "fields": {
        //         "summary": "Generic"
        //       }
        //   };

        //or customer fields

        // {
        //     "update": {
        //         "customfield_10051": [{
        //             "add": "Test"
        //         }]
        //     }
        // }

        const data = {
            "update": {
                "summary": [
                    {
                        "set": "Updated by update"
                    }
                ]
            }
        };
        const config = this.config;

        try {
            const response = await axios.put(`${this.baseUrl}` + `/rest/api/3/issue/` + issueKey, data, config);
            console.log(response.status)
            return response.status;

        } catch (error: any) {
            console.log('error: ')
            console.log(error.response.data.errors)
        }

    }

    public async linkIssues(inwardIssueKey: string, outwardIssueKey: string, linkType: string) {

        const data = {
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
        const config = this.config;

        try {
            const response = await axios.post(`${this.baseUrl}` + `/rest/api/3/issueLink`, data, config);
            console.log(response.data)
            return response.data;

        } catch (error: any) {
            console.log('error: ')
            console.log(error.response.data.errors)
        }

    }


    //xray specific methods.
    public async getAuthToken() {
        const authenticate_url = `${this.xrayBaseUrl}/authenticate`;
        let response = await axios.post(authenticate_url, { "client_id": this.clientId, "client_secret": this.clientSecret }, {})
        console.log('success');
        let auth_token = response.data;
        console.log("AUTH: " + auth_token);
        return auth_token;
    }

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

    public async getCucumberTestDetails(cucumberTestKey: string) {

        const endpoint_url = `${this.xrayBaseUrl}/export/cucumber?keys="${cucumberTestKey}"`;
        console.log(endpoint_url);
        const auth_token = await this.getAuthToken();
        const config = {
            headers: {
                "Content-Type": "application/json",
                'Authorization': "Bearer " + auth_token
            }
        }
        try {

            console.log(config);
            let response = await axios.get(endpoint_url, config);
            console.log(response.data)
        } catch (err: any) {
            console.log(`this is the error ${err.response.data.errors}`)
        }
    }



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


    public async importExecutionReportToJiraXray(executionReportType: string, reportFileName: string, jiraProjectId: string, testExecutionIssueTypeId: string, issueSummary: string, issueDesc: string) {

        const report_content = await fs.readFileSync(reportFileName).toString();
        const auth_token = await this.getAuthToken();
        let full_endpoint_url = "";
        let endpoint = "";
        let bodyFormData = await new FormData();

        //This is requried to create Test Execution issue type in JIRA
        const info_json = {
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
        //This is required to create test issue type in JIRA
        const testInfo_json = {
            "fields": {
                "project": {
                    "id": jiraProjectId
                },
                "labels": [
                    "Server",
                    "TestNG"
                ]
            }
        }

        try {
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

            await bodyFormData.append('results', report_content, 'results.xml');
            await bodyFormData.append('info', JSON.stringify(info_json), 'info.json');
            await bodyFormData.append('testInfo', JSON.stringify(testInfo_json), 'testInfo.json');
            full_endpoint_url = `${this.xrayBaseUrl}${endpoint}`;
            let response = await axios.post(full_endpoint_url, bodyFormData, {
                headers: {
                    'Authorization': "Bearer " + auth_token,
                    ...bodyFormData.getHeaders()
                }
            });

            let returnObject = {
                "testExecutionId": await response.data.id,
                "testExecutionKey": await response.data.key
            };
            return returnObject;
        } catch (error: any) {
            console.log('error: Exception In Execution Report Import ******* ');
            console.log(error.response);
        }
    }


    public async attachFileWithIssue(issueKey: string, attachmentFilePath: string) {
        const bodyFormData = await new FormData();
        const stats = fs.statSync(attachmentFilePath);
        const fileSizeInBytes = stats.size;
        const fileStream = fs.createReadStream(attachmentFilePath);


        let full_endpoint_url = `${this.baseUrl}/rest/api/3/issue/${issueKey}/attachments`;
        try {
            await bodyFormData.append('file', fileStream, { knownLength: fileSizeInBytes });
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Atlassian-Token': 'no-check',
                    ...bodyFormData.getHeaders()
                },
                auth: this.auth
            };
            let response = await axios.post(full_endpoint_url, bodyFormData, config);
            console.log(response);

        } catch (error: any) {
            console.log("THE ERROR IS:");
            console.log(error.response);

        }

    }

    public async zipFolder(folderPath: string) {
        let dateTimeString = await format.asString('yyyyMMddhhmmss', new Date());
        let zipFileName = `${folderPath}${dateTimeString}.zip`
        try {
            await zip(folderPath, zipFileName);
            return zipFileName;
        } catch (error: any) {
            console.log("ERROR IN ZIP FOLDER FUNCTION *******");
            console.log(error);
        }
    }

}

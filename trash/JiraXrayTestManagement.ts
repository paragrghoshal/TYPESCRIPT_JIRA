import * as dotenv from "dotenv";
import axios from 'axios';
import * as fs from 'fs';
var FormData = require('form-data');

dotenv.config();

export default class ManageJira {

    username = process.env.ATLASSIAN_USERNAME;
    password = process.env.ATLASSIAN_API_KEY;
    domain = process.env.DOMAIN;
    leadAccountID = process.env.LEAD_ACCT_ID;
    projKey = process.env.PROJECT_KEY;
    projectName = process.env.PROJECT_NAME;
    baseUrl = process.env.JIRA_BASE_URL;
    xrayBaseUrl = process.env.XRAY_BASE_URL;
    clientId = process.env.JIRA_CLIENT_ID;
    clientSecret = process.env.JIRA_CLIENT_SECRET;

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

    // public async createJiraProject() {

    //     const config = this.config;
    //     try {
    //         const data = {
    //             key: this.projKey,
    //             name: this.projectName,
    //             projectTypeKey: 'software',
    //             "leadAccountId": this.leadAccountID
    //         };
    //         const response = await axios.post(`${this.baseUrl}/rest/api/3/project`, data, config);
    //         console.log(response.data)
    //         return response.data.key;
    //     } catch (error: any) {
    //         console.log('error: ')
    //         console.log(error.response.data.errors)
    //     }
    // }

    // public async getJiraProject() {

    //     try {
    //         const config = {
    //             method: 'get',
    //             url: this.baseUrl + '/rest/api/3/project/recent',
    //             ...this.config
    //         };
    //         const response = await axios.request(config);
    //         console.log(response.data)
    //         return response.data;

    //     } catch (error: any) {
    //         console.log('error: ')
    //         console.log(error.response.data.errors)
    //     }
    // }

    // public async createJiraIssue(projectKey: string, issueType: string, summary: string, description: string) {

    //     try {
    //         const data = {
    //             fields: {
    //                 project: { key: projectKey },
    //                 summary: summary,
    //                 description: description,
    //                 issuetype: { name: issueType }
    //             }
    //         };
    //         const config = this.config;
    //         const response = await axios.post(`${this.baseUrl}/rest/api/2/issue`, data, config);
    //         return response.data.key;
    //     } catch (error: any) {
    //         console.log('error: ')
    //         console.log(error.response.data.errors)
    //     }
    // }

    // public async getJiraIssues() {
    //     try {
    //         const config = {
    //             method: 'get',
    //             url: this.baseUrl + '/rest/api/2/search',
    //             ... this.config
    //         };
    //         const response = await axios.request(config);
    //         console.log(response.data)
    //         return response.data;
    //     } catch (error: any) {
    //         console.log('error: ')
    //         console.log(error.response.data.errors)
    //     }

    // }

    // public async getJiraIssueById(issueKey: string) {
    //     try {
    //         const config = {
    //             method: 'get',
    //             url: this.baseUrl + '/rest/api/2/issue/' + issueKey,
    //             ...this.config
    //         };
    //         const response = await axios.request(config);
    //         console.log(response.data)
    //         return response.data;
    //     } catch (error: any) {
    //         console.log('error: ')
    //         console.log(error.response.data.errors)
    //     }
    // }

    //********************** */

    // public async updateIssueField(issueKey: string) {
    //     const data = {
    //         "update": {
    //             "summary": [
    //                 {
    //                     "set": "Updated by update"
    //                 }
    //             ]
    //         }
    //     };
    //     const config = this.config;

    //     try {
    //         const response = await axios.put(`${this.baseUrl}` + `/rest/api/3/issue/` + issueKey, data, config);
    //         console.log(response.status)
    //         return response.status;

    //     } catch (error: any) {
    //         console.log('error: ')
    //         console.log(error.response.data.errors)
    //     }

    // }

    // public async linkIssues(inwardIssueKey: string, outwardIssueKey: string, linkType: string) {

    //     const data = {
    //         "inwardIssue": {
    //             "key": inwardIssueKey
    //         },
    //         "outwardIssue": {
    //             "key": outwardIssueKey
    //         },
    //         "type": {
    //             "name": linkType
    //         }
    //     };
    //     const config = this.config;

    //     try {
    //         const response = await axios.post(`${this.baseUrl}` + `/rest/api/3/issueLink`, data, config);
    //         console.log(response.data)
    //         return response.data;

    //     } catch (error: any) {
    //         console.log('error: ')
    //         console.log(error.response.data.errors)
    //     }

    // }


    //xray specific methods.
    public async getAuthToken() {
        const authenticate_url = `${this.xrayBaseUrl}/authenticate`;
        let response = await axios.post(authenticate_url, { "client_id": this.clientId, "client_secret": this.clientSecret }, {})
        console.log('success');
        let auth_token = response.data;
        console.log("AUTH: " + auth_token);
        return auth_token;
    }

    // public async getCucumberTestDetails(cucumberTestKey:string) {

    //     const endpoint_url = `${this.xrayBaseUrl}/export/cucumber?keys="${cucumberTestKey}"`;
    //     console.log(endpoint_url);
    //     const auth_token = await this.getAuthToken();
    //     const config = {
    //         headers: {
    //             "Content-Type": "application/json",
    //             'Authorization': "Bearer " + auth_token
    //         }
    //     }
    //     try {

    //         console.log(config);
    //         let response = await axios.get(endpoint_url, config);
    //         console.log(response.data)
    //     } catch (err: any) {
    //         console.log(`this is the error ${err.response.data.errors}`)
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
}

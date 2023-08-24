import * as dotenv from "dotenv";
import axios from 'axios';
import * as fs from 'fs';
import { zip } from 'zip-a-folder';
var FormData = require('form-data');
var format = require('date-format');

dotenv.config();

export default class JiraXrayTestManagement {

    username = process.env.ATLASSIAN_USERNAME
    password = process.env.ATLASSIAN_API_KEY
    baseUrl = process.env.JIRA_BASE_URL
    xrayBaseUrl = process.env.XRAY_BASE_URL
    clientId = process.env.JIRA_CLIENT_ID
    clientSecret = process.env.JIRA_CLIENT_SECRET

    auth = {
        username: this.username!,
        password: this.password!
    };

    public async getAuthToken() {
        const authenticate_url = `${this.xrayBaseUrl}/authenticate`;
        let response = await axios.post(authenticate_url, { "client_id": this.clientId, "client_secret": this.clientSecret }, {})
        let auth_token = response.data;
        console.log("TOKEN CREATED");
        return auth_token;
    }


    public async importExecutionReportToJiraXray(executionReportType: string, reportFileName: string, jiraProjectId: string, testExecutionIssueTypeId: string, issueSummary: string, issueDesc: string) {
        console.log("IMPORT EXECUTION REPORT TO JIRA STARTED");
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
            console.log("IMPORT EXECUTION REPORT TO JIRA COMPLETED");
            return returnObject;
        } catch (error: any) {
            console.log('error: Exception In importExecutionReportToJiraXray ******');
            console.log(error.response);
        }
    }


    public async attachFileWithIssue(issueKey: string, attachmentFilePath: string) {
        console.log("ATTACHED FILE WITH ISSUE STARTED");
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
            console.log("ATTACHED FILE WITH ISSUE COMPLETED");
        } catch (error: any) {
            console.log("THE ERROR IS IN attachFileWithIssue ******");
            console.log(error.response);

        }

    }

    public async zipFolder(folderPath: string) {
        console.log("ZIP FOLDER FUNCTION STARTED");
        let dateTimeString = await format.asString('yyyyMMddhhmmss', new Date());
        let zipFileName = `${folderPath}${dateTimeString}.zip`
        try {
            await zip(folderPath, zipFileName);
            console.log("ZIP FOLDER FUNCTION COMPLETED");
            return zipFileName;
        } catch (error: any) {
            console.log("ERROR IN ZIP FOLDER FUNCTION ******");
            console.log(error);
        }
    }

    public async uploadToJira(executionReportType: string, reportFileName: string, jiraProjectId: string, testExecutionIssueTypeId: string, issueSummary: string, issueDesc: string,executionReportFolderPath: string) {
        let issueDetailsObject = await this.importExecutionReportToJiraXray(executionReportType, reportFileName, jiraProjectId, testExecutionIssueTypeId, issueSummary, issueDesc);
        let zipFileName = await this.zipFolder(executionReportFolderPath);
        await this.attachFileWithIssue(issueDetailsObject?.testExecutionKey,zipFileName!);
    }

}

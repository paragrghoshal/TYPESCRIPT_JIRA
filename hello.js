"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var ManageJira_1 = require("./ManageJira");
var JiraXrayTestManagement_1 = require("./JiraXrayTestManagement");
dotenv.config();
//console.log(process.env.JIRA_BASE_URL);
var m = new ManageJira_1.default();
var j = new JiraXrayTestManagement_1.default();
//m.createJiraProject();
//let abcd = m.getJiraProject();
var issueType = 'Test';
var summary = 'Subscribe to Horeas YouTube Channel! TWO';
var description = 'Do so now!!';
var projectKey = process.env.PROJECT_KEY;
//let abcd = m.createJiraIssue(projectKey,issueType,summary,description );
// let abcd = m.createJiraTest(projectKey,issueType,summary,description );
// console.log(abcd)
//let abcd = m.getJiraIssues();
//let abcd =m.getJiraIssueById("SCRUM-6");
//let abcd = m.updateIssueField("NXC-1");
//let abcd = m.linkIssues("NXC-4","NXC-3","is tested by");
//let abcd =m.addTestToTestExecution("NXC-4","NXC-3");
//let abcd =m.importTestNGMultipartReport("NXC");
//let abcd =m.getCucumberTestDetails();
//let abcd = m.importCucumberMultipartReport("NXC");
//let abcd =m.importJUNITMultipartReport("NXC");
//let aaa= m.importExecutionReportToJiraXray("10006","10014","This is parag","This is ghoshal","junit","abcd");
//let abcd =m.importExecutionReportToJiraXray("junit","./files/junitreport.xml","10006","10014","this is summary","this is desc");
//console.log(abcd)
//m.attachFileWithIssue("NXC-38","./files/multi_reports.zip");
//console.log(m.zipFolder("./files/multi_reports"));
j.uploadToJira("junit", "./files/junitreport.xml", "10006", "10014", "final issue created", "issue desc", "./files/multi_reports");

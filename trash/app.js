require('dotenv').config();
const createProject = require('./create-project.js');
//import createProject from 'create-project'




const createProjectIssueAndUpdate = async () => {
    const projectKey = await createProject(process.env.PROJECT_NAME);
    console.log(projectKey);
}

createProjectIssueAndUpdate()
var btoa = require('btoa');
var axios = require('axios');
require('dotenv').config();
var fs = require('fs');
var FormData = require('form-data');

var xray_cloud_base_url = "https://xray.cloud.getxray.app/api/v2";
var client_id = process.env.JIRA_CLIENT_ID //|| "215FFD69FE4644728C72182E00000000";
var client_secret = process.env.JIRA_CLIENT_SECRET //|| "1c00f8f22f56a8684d7c18cd6147ce2787d95e4da9f3bfb0af8f02ec00000000";

var authenticate_url = xray_cloud_base_url + "/authenticate";

axios.post(authenticate_url, { "client_id": client_id, "client_secret": client_secret }, {}).then( (response) => {
    console.log('success');
    var auth_token = response.data;
    console.log("AUTH: " + auth_token);

    const report_content = fs.readFileSync("cucumber.json").toString();
    //console.log(report_content);
    
    var endpoint_url = xray_cloud_base_url + "/import/execution/cucumber";
    axios.post(endpoint_url, report_content, {
	headers: { 'Authorization': "Bearer" + auth_token, "Content-Type": "application/json" }
    }).then(function(res) {
	console.log('success');
	console.log(res.data.key);
    }).catch(function(error) {
	console.log('Error submiting results: ' + error);
    });
}).catch( (error) => {
    console.log('Error on Authentication: ' + error);
});


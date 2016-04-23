/*
 * JIRA REST API Query - grab basic total responses for a JQL Query
 *
 * Set up some basic parameters we need for connecting with JIRA REST API
 * Fill in your account email, password,
 * and the URL where your project resides - cloud or server - where you log in
 *
 * TO DO: find another endpoint for total query only. This seems expensive  
 * to query for just one number.
 */

var jirauser = "user@domain.com";
var jiraauth = "userpassword";
var jiraurl  = "project.atlassian.net";

/*
 * USAGE
 *
 * add this script to your Google sheet,
 * add your values above
 * and call this function below,
 * making sure to pass the actual JQL, and the sprint it is limited to
 *
 * A good way to set up your sheet, is to have Sprint names, IDs and/or versions 
 * in left-most columns, then reference those with your specific queries
 * in right-hand cells
 *
 * Examples:
 * =calljira("project=PROJECT AND type=Story AND sprint = ",$B1)
 * where column B has your Sprint IDs
 *
 * =calljira("project=PROJECT AND type = Story and status changed to reopened from QA AND sprint = ",$B1)
 * will return only stories that were reopened from the 'QA' state in your workflow, 
 * for that sprint only
 *
 * Using variations of these queries will allow you to build some stats that you 
 * can do further math with, like percentage of reopened/total stories, etc.
 *
 */

function calljira(query,sprint) {
    var parameters = {
    method : "get",
    accept : "application/json",
      headers: {"Authorization" : "Basic " + Utilities.base64Encode( jirauser + ":" + jiraauth )}
      
      // 
      // Authorization: Basic ZnJlZDpmcmVk" -H "Content-Type: application/json"
   };
   
  var jira_url = "https://" + jiraurl + "/rest/api/2/search?jql=" + encodeURIComponent(query) + sprint;
  
  var text = UrlFetchApp.fetch(jira_url, parameters).getContentText();
  var data = JSON.parse(text);
  
  return data.total;
  
}

/*
 * JIRA REST API Query - grab basic total responses for a JQL Query
 * https://github.com/chrisurban/jira-sprint-reporting
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
 * =getepic(CONCATENATE("project = ",$A3," AND labels = ",$B$1))
 * where column A has your project ID, and cell B1 has a specific label to search for
 *
 * =gettotaltime(CONCATENATE("project = ",$A3," AND ""Epic Link"" = ",$B3))/3600
 * where column A has your project ID, and the next cell as an Epic key, will iterate 
 * through all tickets in that epic and return total time logged.
 *
 * Using variations of these queries will allow you to build some stats that you 
 * can do further math with, like percentage of reopened/total stories, etc.
 *
 */

function getepic(query) {
    var parameters = {
    method : "get",
    accept : "application/json",
      headers: {"Authorization" : "Basic " + Utilities.base64Encode( jirauser + ":" + jiraauth )} 
   };   
  var jira_url = "https://" + jiraurl + "/rest/api/2/search?jql=" + encodeURIComponent(query) ;
  var text = UrlFetchApp.fetch(jira_url, parameters).getContentText();
  var data = JSON.parse(text);
  //var issue = JSON.parse(data);
  return data.issues[0].key;
}

function gettotaltime(query) {
    var parameters = {
    method : "get",
    accept : "application/json",
      headers: {"Authorization" : "Basic " + Utilities.base64Encode( jirauser + ":" + jiraauth )} 
   };   
  var jira_url = "https://" + jiraurl + "/rest/api/2/search?jql=" + encodeURIComponent(query) ;
  var text = UrlFetchApp.fetch(jira_url, parameters).getContentText();
  var data = JSON.parse(text);
  var sum = 0;
  for (x in data.issues) {
    sum += data.issues[x].fields.timespent;
  }
  return sum;
}

/*
 * JIRA REST API Query - grab a specific field for a ticket
 * https://github.com/chrisurban/jira-sprint-reporting
 *
 * Set up some basic parameters we need for connecting with JIRA REST API
 * Fill in your account email, password,
 * and the URL where your project resides - cloud or server - where you log in
 *
 */

var jirauser = "username";
var jiraauth = "authentication";
var jiraurl  = "JIRA_URL";
// URL should be like "somewhere.atlassian.net"

/*
 * USAGE
 *
 * add this script to your Google sheet,
 * add your values above
 * and call this function below,
 * making sure to pass the actual JQL, and the sprint it is limited to general queries
 *
 * A good way to set up your sheet, is to have ticket key (e.g. ABC-123) 
 * in left-most columns, then reference those with your specific function
 * in right-hand cells
 *
 * Examples:
 * =ticketStatus(A2) returns the ticket status name (e.g. "Open")
 *
 */

function ticketStatus(ticket) {
    var parameters = {
    method : "get",
    accept : "application/json",
      headers: {"Authorization" : "Basic " + Utilities.base64Encode( jirauser + ":" + jiraauth )}
      
   };
   
  var jira_url = "https://" + jiraurl + "/rest/api/2/issue/" + encodeURIComponent(ticket) ;
  
  var text = UrlFetchApp.fetch(jira_url, parameters).getContentText();
  var data = JSON.parse(text);
  
  
  return data.fields.status.name;
  
}
function ticketDescription(ticket) {
    var parameters = {
    method : "get",
    accept : "application/json",
      headers: {"Authorization" : "Basic " + Utilities.base64Encode( jirauser + ":" + jiraauth )}
      
  };
   
  var jira_url = "https://" + jiraurl + "/rest/api/2/issue/" + encodeURIComponent(ticket) ;
  
  var text = UrlFetchApp.fetch(jira_url, parameters).getContentText();
  var data = JSON.parse(text);
  
  
  return data.fields.summary;
}
function ticketUserStory(ticket) {
    var parameters = {
    method : "get",
    accept : "application/json",
      headers: {"Authorization" : "Basic " + Utilities.base64Encode( jirauser + ":" + jiraauth )}
      
   };
   
  var jira_url = "https://" + jiraurl + "/rest/api/2/issue/" + encodeURIComponent(ticket) ;
  
  var text = UrlFetchApp.fetch(jira_url, parameters).getContentText();
  var data = JSON.parse(text);
  
  
  return data.fields.customfield_10200;
  // good example for having a reason to query a ticket to get a list of
  // field names. For custom fields, you'll have fields named like this one.
}

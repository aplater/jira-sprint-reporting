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
// alternatively, replace Utilities.base64Encode( jirauser + ":" + jiraauth ) with jirabase
// and update references below
// var jirabase = base64-encoded-string-here

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

function issueCount(query) {
    var parameters = {
    method : "get",
    accept : "application/json",
    headers: {"Authorization" : "Basic " + jirabase}
      
   };
  var jira_url = "https://" + jiraurl + "/rest/api/2/search?jql=" + encodeURIComponent(query) ;
  var text = UrlFetchApp.fetch(jira_url, parameters).getContentText();
  var data = JSON.parse(text);
  return data.total;
}

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

/*
 * ticketDetails
 *
 * The idea here is to use the key (ABC-123) and retrieve specific ticket values
 * by way of =ticketDetails("ABC-123","status") in a formula cell
 * this makes custom reporting for a list of tickets easy
 * allowing you to share a Google Sheet in lieu of JIRA access
 * 
 * customize the switch parameters to match your custom fields
 *
 */

function ticketDetails(ticket,attribute) {
    var parameters = {
    method : "get",
    accept : "application/json",
    headers: {"Authorization" : "Basic " + Utilities.base64Encode( jirauser + ":" + jiraauth )} 
      
   };
  if (ticket.indexOf(',') > -1)  {
	  var arr = ticket.split(",");
	  var ticket = arr.splice(0,1).join("");
	  }
  var jira_url = "https://" + jiraurl + "/rest/api/2/issue/" + encodeURIComponent(ticket) ;
  var text = UrlFetchApp.fetch(jira_url, parameters).getContentText();
  var data = JSON.parse(text);
  switch (attribute) {
    case "status":
      return data.fields.status.name;
      break;
    case "summary":
      return data.fields.summary;
      break;
    case "userstory":
      return data.fields.customfield_10202;
          // 
          // this field's name and customfield id will be different for your instance
          // 
      break;
    case "description":
      return data.fields.description;
      break;
    case "priority":
      return data.fields.priority.name;
      break;
    case "resolution":
      return data.fields.resolution.name;
      break;
    case "assignee":
      return data.fields.assignee.name;
      break;
    case "storypoints":
      return data.fields.customfield_10004;
          // 
          // this field's name and customfield id will be different for your instance
          // 
      break;
    default:
      return "No attribute provided.";
  }
  // data.fields.customfield_10106 = User Story
  // data.fields.description = Description
  // customfield_11400 = Implementation Details
  // customfield_10201 = Testing Steps
}
  
/*
 * ticketLabels
 *
 * The idea here is to use the key (ABC-123) and check for specific label values
 * by way of =ticketLabels("ABC-123","MVP") in a formula cell
 * which will return "yes" or "no" if the ticket is labeled with the tag "MVP"
 * 
 *
 */

  function ticketLabels(ticket,checkvalue) {
    var parameters = {
    method : "get",
    accept : "application/json",
    headers: {"Authorization" : "Basic " + Utilities.base64Encode( jirauser + ":" + jiraauth )} 
      
   };
  if (ticket.indexOf(',') > -1)  {
	  var arr = ticket.split(",");
	  var ticket = arr.splice(0,1).join("");
	  }
  var jira_url = "https://" + jiraurl + "/rest/api/2/issue/" + encodeURIComponent(ticket) ;
  var text = UrlFetchApp.fetch(jira_url, parameters).getContentText();
  var data = JSON.parse(text);
  var labelstring = data.fields.labels;
  if (labelstring.indexOf(',') > -1)  {
    var labelarray = labelstring.split(",");
  }
    else {
      var labelarray = labelstring;
    }
    if (labelarray.indexOf(checkvalue) > -1) {
      return "yes";
     } else {
       return "no";
     }
  }

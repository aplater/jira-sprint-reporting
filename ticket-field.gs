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
 * =ticketDetails(A2,"status") returns the ticket status name (e.g. "Open")
 *
 */

function ticketDetails(ticket,attribute) {
    var parameters = {
    method : "get",
    accept : "application/json",
      headers: {"Authorization" : "Basic " + Utilities.base64Encode( jirauser + ":" + jiraauth )}
   };
   
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
      break;
    default:
      return "No attribute provided.";
  }
  // You'll need to check your JIRA instance and adjust custom field names to use yours.
  // use the issue endpoint at /rest/api/2/issue/[ticket] to check

}

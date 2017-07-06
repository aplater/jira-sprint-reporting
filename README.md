# jira-sprint-reporting
Reporting on a Sprint level using JIRA REST API

These scripts provides a basis for utilizing the JIRA REST API to grab basic total responses for a JQL Query
* _general-query.gs_ is good for general reporting of an issue count for a specific query, as only JQL is passed
* _scripts.gs_ has functions to query a specific issue for a field, such as summary, assignee or status
* _sprints.gs_ has functions to get the epic from a query, and to total the logged time worked for all issues from a query

## TL;DR Setup
* Create a new Google Sheets spreadsheet
* Go to Tools > Script Editor
* Copy any of the .gs files' source and paste into Code.gs
* Update the basic parameters needed (see below)
* Save
* Return to the Sheet and fill in some details, like:

Sprint name | Sprint ID | Fix Version 
--- | --- | ---
Sprint 1 | 100 | 0.1.0 
Sprint 2 | 101 | 0.2.0 
Sprint 3 | 102 | 1.0.0 

In this example, you'll reference the second and/or third columns for the queries you'll be passing.
In another column/cell, enter in a formula to submit a query or issue key to the specific
.gs file you're using. Detailed examples are below.

## Update basic parameters

Set up some basic parameters we need for connecting with JIRA REST API
Fill in your account email, password,
and the URL where your project resides - cloud or server - where you log in

```
var jirauser = "user@domain.com";
var jiraauth = "userpassword";
var jiraurl  = "project.atlassian.net";
```

TO DO: find another endpoint for total query only. This seems expensive  
to query for just one number.

## USAGE

Add one of these scripts to your Google sheet,
then add your values above
and call this function below from the Sheet
making sure to pass the actual JQL, and the sprint it is limited to (if using sprints.gs)

A good way to set up your sheet, is to have Sprint names, IDs and/or versions 
in left-most columns, then reference those with your specific queries
in right-hand cells. This way, you concatenate the query from sheet-based fields,
pass the query via the function, and a result is returned.

Examples:

If you use _general-query.gs_
```
=issueCount("project=PROJECT AND type=Story AND sprint = ",$B1)
```
where column B has your Sprint IDs will return the number of tickets that are type Story

```
=issueCount("project=PROJECT AND type = Story and status changed to reopened from QA AND sprint = ",$B1)
```
will return the number of tickets that are only stories, that were reopened from the 'QA' state in your workflow, 
for that sprint only.

```
=issueCount("project=PROJECT AND priority=""Critical"" AND type=Bug AND status=""Open"" ")
```
will return a count of all Open Bugs that are marked with priority Critical, across all Sprints


If you use _sprints.gs_
```
=gettotaltime(CONCATENATE("project = ",$E3," AND "Component" = ",$F3))/3600
```
will generate a query to return all issues in a project (shortcode in column E). with component (in column F), iterate through those issues and total time logged in hours


If you use _ticket-field.gs_
```
=ticketDetails(A2,"status")
```
will return the ticket status name for the issue with key in A2 (e.g. "Open")

Using variations of these queries will allow you to build some stats that you 
can do further math with, like percentage of reopened/total stories, etc.

## Ticket specific fields
Use ticket-field.gs's _ticketDetails_ function as a starting point, to provide return
values from JIRA for Summary, Status and Description, among others. Depending on your setup
you may want to query a JIRA endpoint to figure out the machine name for a 
specific field, especially if it was added as a custom field. JIRA will refer to these
fields with generic names like ```customfield_10202```

For example, a field like "User Story" may be custom in your instance. When logged into
your instance, lint the JSON returned for a valid issue at ```/rest/api/2/issue/[issue-key]```
and check for the corresponding custom field for "User Story." Other often used
custom fields may include Story Points, Impediments, user-based fields like Developer, or
ticket details like Testing Steps.

## Other worthwhile notes ##
Suggestions for debugging if you run into problems:
* If you concatenate your queries in Google Sheets, I find that it's good practice to set
aside a cell to display the actual concatenated result of the query I thought I was
passing.
* Make sure you've got the right username, auth and URL for your instance.
* Some custom fields in JIRA are more than one word, or are reserved for use in queries. 
In these cases, you need to enclose them in quotes; concatenating them in a Sheet means
you need to remember to escape the quotes. Example:
```
=gettotaltime(CONCATENATE("project = ",$E3," AND ""Epic Link"" = ",$F3))/3600
```




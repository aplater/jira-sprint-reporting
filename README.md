# jira-sprint-reporting
Reporting on a Sprint level using JIRA REST API

These scripts provides a basis for utilizing the JIRA REST API to grab basic total responses for a JQL Query
* scripts.gs is good for sprint-level reporting, as it passes a specific Sprint ID as a separate parameter
* general-query.gs is good for more general reporting or specific queries, as only JQL is passed

## TL;DR Setup
* Create a new Google Sheets spreadsheet
* Go to Tools > Script Editor
* Copy either the sprints.gs source or the general-query.gs source and paste into Code.gs
* Update the basic parameters needed (see below)
* Save
* Return to the Sheet and fill in some details, like:

Sprint name | Sprint ID | Fix Version 
--- | --- | ---
Sprint 1 | 100 | 0.1.0 
Sprint 2 | 101 | 0.2.0 
Sprint 3 | 102 | 1.0.0 

You'll reference the second and/or third columns for the queries you'll be passing.

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

add one of these scripts to your Google sheet,
add your values above
and call this function below from the Sheet
making sure to pass the actual JQL, and the sprint it is limited to (if using sprints.gs)

A good way to set up your sheet, is to have Sprint names, IDs and/or versions 
in left-most columns, then reference those with your specific queries
in right-hand cells.


Examples:

```
=calljira("project=PROJECT AND type=Story AND sprint = ",$B1)
```
where column B has your Sprint IDs

```
=calljira("project=PROJECT AND type = Story and status changed to reopened from QA AND sprint = ",$B1)
```
will return only stories that were reopened from the 'QA' state in your workflow, 
for that sprint only

```
=calljira("project=PROJECT AND priority=""Critical"" AND type=Bug AND status=""Open"" ")
```
will return all Open Bugs that are marked with priority Critical, acorss all Sprints

Using variations of these queries will allow you to build some stats that you 
can do further math with, like percentage of reopened/total stories, etc.




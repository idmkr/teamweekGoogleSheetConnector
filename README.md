
# teamWeekStyleSheetExport

Export your projects and tasks from teamweek to Google Sheet
You can later use that in a Google Data Studio project to retrieve stats from TeamWeek

## How to run
- Create a new google sheet
- Create two sheets called tasks and projects
- Open Tools > Script Editor and copy paste teamweek.gs there
- Config teamweek.gs with your own ids
- Add oauth library to your project (https://github.com/gsuitedevs/apps-script-oauth2)
- Run the refresh function (you are not logged in yet)
- Click View > Logs to see the logs.
- Copy paste the URL you see there, and follow to grant access
- Run again the refresh function (you are now logged in)
- You can see that the sheets are now filled
- In the Editor, click Edit > Current Projet's Triggers ans add a cron to execute refresh every hour (or less if you need shorter updates)

There you go, your sheet is now connected to your Teamweek Account

## GOOGLE DATA STUDIO
You can now use and import these two sheets in a google data studio project. 
You will be able to create mixed data with tasks and projects using the project_id relationship


Fill free to modify this project as you want so it suits your needs ;)
Thanks https://medium.com/@alexisbedoret for the idea

var CLIENT_ID = '';     // Enter your Client ID
var CLIENT_SECRET = ''; // Enter your Client secret
var AUTH_URL = 'https://teamweek.com/oauth/login';
var TOKEN_URL = 'https://teamweek.com/api/v4/authenticate/token';
var API_URL = 'https://teamweek.com/api/v4/' + 'YOUR WORKSPACE ID';
var SERVICE_NAME = "teamweek";



/*
///////////////////////////////////////////////
///////////////////////////////////////////////
///////// FETCH AND WRITE FUNCTIONS ///////////
///////////////////////////////////////////////
///////////////////////////////////////////////
*/


var tasks = {
  url:  API_URL + '/tasks/timeline?since=2019-01-01T08:32:03.091461',
  sheetName: 'tasks',
  processData: function (data){
    return data.map(function(item) {
      if (item.estimated_minutes != null && item.estimated_minutes != 0 && item.project_id != null) {
        return [item.id,item.name,item.estimated_minutes,item.project_id,item.user_id,item.end_date];
      }
    });
  },
  columns: ["id","name", "estimated_time", "project_id", "user_id", "end_date"]
}


var projects = {
  url:  API_URL + '/projects/',
  sheetName: 'projects',
  processData: function (data){
    return data.map(function(item) {
      return [item.id,item.name];
    });
  },
  columns: ["project_id","name"]
}


/*
///////////////////////////////////////////////
///////////////////////////////////////////////
//////////// SERVICE AND OAUTH ////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
*/

function getService() {
   return OAuth2.createService(SERVICE_NAME)
      .setTokenUrl(TOKEN_URL)
      .setAuthorizationBaseUrl(AUTH_URL)
      .setClientId(CLIENT_ID)
      .setClientSecret(CLIENT_SECRET)
      .setCallbackFunction('authCallback')
      .setPropertyStore(PropertiesService.getUserProperties())
      .setTokenHeaders({
        'Authorization': 'Basic ' +
         Utilities.base64Encode(CLIENT_ID + ':' + CLIENT_SECRET)
      });
}

function authCallback(request) {
   var service = getService();
   var authorized = service.handleCallback(request);   
   if (authorized) {
      return HtmlService.createHtmlOutput('Success!');
   } else {
      return HtmlService.createHtmlOutput('Denied.');
   }
}

function authenticate() {
   var service = getService();   
   if (service.hasAccess()) {
      // … whatever needs to be done here …
   } else {
      var authorizationUrl = service.getAuthorizationUrl();
      Logger.log('Open the following URL and re-run the script: %s',authorizationUrl);
   }
}



/*
///////////////////////////////////////////////
///////////////////////////////////////////////
////////////// CORE FUNCTIONS /////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
*/

function fetch(url){
    // Prepare authentication to Hubspot
  var service = getService();
  Logger.log(service.getAccessToken());
  var headers = {
    headers: {
      Authorization: 'Bearer ' + service.getAccessToken()
    }
  };
  
  // API request
  var url = url;
  var response = UrlFetchApp.fetch(url, headers);
  var result = JSON.parse(response.getContentText());
  return result;
}

function prepareData(data, callback){
  return callback(data);
}

function write(data, columns, sheetName) {
   var ss = SpreadsheetApp.getActiveSpreadsheet();
   var sheet = ss.getSheetByName(sheetName);
   var matrix = Array(columns);
   matrix = matrix.concat(data);   // Writing the table to the spreadsheet
   var range = sheet.getRange(1,1,matrix.length,matrix[0].length);
   range.setValues(matrix);
}

function process(items){
  var data = fetch(items.url);
  data = prepareData(data, items.processData);
  write(data, items.columns, items.sheetName)
}


function refresh() {
   var service = getService();
   if (service.hasAccess()) {
       process(tasks);      
       process(projects);
   } else {
      var authorizationUrl = service.getAuthorizationUrl();
      Logger.log('Open the following URL and re-run the script: %s', authorizationUrl);
   }
}

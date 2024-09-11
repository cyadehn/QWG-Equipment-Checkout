function doGet(e) {
  Logger.log('query params: ' + Utilities.jsonStringify(e));
  if (e.queryString !== '') {
    switch (e.parameter.mode) {
      case 'thanks':
        return HtmlService
          .createHtmlOutputFromFile('thanks')
          .append('<br />onesheet')
        break;
      default:
        return HtmlService
          .createHtmlOutputFromFile('form')
          .append('<br />No Query String')
        break;
    }
  }
  else {
    return HtmlService
      .createHtmlOutputFromFile('form')
      .append('<br />No Query String')
  }
}

function getScriptURL() {
  var url = ScriptApp.getService().getUrl();
  return url;
}

function sendFormDataToSheets(form) {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Requests")
    .appendRow([
      form.name,
      form.contact,
      form.event,
      form.bikeModel
      //form.helmet,
      //form.lights
    ])
}

function getCheckoutData() {
  let dataArray = [];
  dataArray[0] = getEquipmentData();
  dataArray[1] = getRequestData();
  dataArray[2] = getCalendarEvents();
  Logger.log(dataArray);
  return dataArray;
}

function getEquipmentData() {
  let dataArray = SpreadsheetApp.openById("12X4CXp5YvkPcuTtFp_Ez0bXLrRSGdfj-sIHgN3fJu2A").getSheetByName("Dropdown Data").getDataRange().getValues();
  dataArray.shift();
  // listWithDuplicates = dataArray.map(row=>row[0]);
  // listWithoutDuplicates = [];
  // listWithDuplicates.forEach(element=>{
  //   if(listWithoutDuplicates.indexOf(element) == -1) listWithoutDuplicates.push(element);
  // });
  return dataArray;
}

function getRequestData() {
  let requestDataArray = SpreadsheetApp.openById("12X4CXp5YvkPcuTtFp_Ez0bXLrRSGdfj-sIHgN3fJu2A").getSheetByName("Requests").getDataRange().getValues();
  requestDataArray.shift();
  return requestDataArray;
}

function getCalendarEvents() {
  let now = new Date();
  let threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(now.getMonth() + 3);
  let eventArray = CalendarApp.getEvents(now, threeMonthsFromNow);
  let eventTitles = eventArray.map(function(event){
    let title = event.getTitle();
    let date = event.getStartTime().toDateString();
    // let time = event.getStartTime().toTimeString();
    return String.prototype.concat(title, ", ", date);
  });
  Logger.log(eventTitles);
  return eventTitles;
}
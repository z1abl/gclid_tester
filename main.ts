/*
Google Ads gclid tester
      
Description: script tests gclid on final/mobileFinal url and result
saves in spreadsheet, which is automatically created on Google Drive.

Five statuses can be assigned for particular url in output file:
[OK] - gclid was not dropped,
[NOT_OK] - gclid was dropped, 
[NO_IDEA] - response doesn't provide information about url,
[NOT_SET] - url was not set on ad level and status also is not set,
[ERR] - response returns error.

Author: Edward Kanibolocki
Date: 15/01/2020
      
apps-script.ninja
*/

function main() {
  var ads = AdsApp.ads().get();

  // buffer's data is pushed to spreadsheet, default values: adId, adDescr1 etc. define a header in spreadsheet
  var buffer = [['adId','adDescr1','adDescr2','adType','finalUrl','finalUrlStatus','mobileFinalUrl',
                 'mobileFinalUrlStatus','adGroupId','adGroupName','campaignId','campaignName']];

  // checkedUrls stores urls with statuses: {'example.com':'NOT_OK'}
  var checkedUrls = {};

  while (ads.hasNext()) {
    var ad = ads.next();
    var adId = ad.getId();
    var adDescr1 = ad.getDescription1();
    var adDescr2 = ad.getDescription2();
    var adType = ad.getType();

    var campaign = ad.getCampaign();
    var campaignId = campaign.getId();
    var campaignName = campaign.getName();

    var adGroup = ad.getAdGroup();
    var adGroupId = adGroup.getId();
    var adGroupName = adGroup.getName();

    var urls = ad.urls();
    var finalUrl = urls.getFinalUrl();
    var mobileFinalUrl = urls.getMobileFinalUrl();

    var finalUrlStatus,mobileFinalUrlStatus;

    if (finalUrl) {
      // checks or finalUrl already has status in checkedUrls-object
      if (checkedUrls[finalUrl]) { 
        finalUrlStatus = checkedUrls[finalUrl];
      } else {
          // calls checkGclid() if finalUrlStatus was not found in checkedUrls
          finalUrlStatus = checkGclid(finalUrl);
          checkedUrls[finalUrl] = finalUrlStatus;
        }
    }

    if (mobileFinalUrl) {
      // if mobileFinalUrl is the same as finalUrl it's enough to set the same status
      if (mobileFinalUrl == finalUrl) {
        mobileFinalUrlStatus = finalUrlStatus;         
      } else {
          if (checkedUrls[mobileFinalUrl]) {
            mobileFinalUrlStatus = checkedUrls[mobileFinalUrl];
          } else {
              mobileFinalUrlStatus = checkGclid(mobileFinalUrl);   
              checkedUrls[mobileFinalUrl] = mobileFinalUrlStatus;
            }
        }
    }  

    // instead of undefined in spreadsheet would be shown 'NOT_SET' for better readability
    if (!finalUrl){finalUrlStatus = 'NOT_SET'}
    if (!mobileFinalUrl){mobileFinalUrlStatus = 'NOT_SET'}

    buffer.push([adId,adDescr1,adDescr2,adType,finalUrl,finalUrlStatus,mobileFinalUrl,mobileFinalUrlStatus,
                adGroupId,adGroupName,campaignId,campaignName]);

  }

  // if buffer is not empty data is pushed to the first sheet of newly created spreadsheet
  // buffer.length>1 because buffer by default has a header as a first row
  if (buffer.length >1) {
    Logger.log(buffer);
    var today = new Date();
    var formatedDate = today.getFullYear() +'-'+today.getMonth()+1+'-'+today.getDate()+'T'+today.toTimeString().substr(0,5);
    SpreadsheetApp.create('Gclid tester'+': '+formatedDate, buffer.length, buffer[0].length).getSheets()[0].getRange(1,1,buffer.length,buffer[0].length).setValues(buffer);
  } else {
      Logger.log('No data to push to the spreadsheet.')
    }
      
}

// checkGclid tests how exactly gclid works with url and returns the status
function checkGclid(url){
  var response,location,gclid;
  
  // gclid test value from https://support.google.com/analytics/answer/2938246?hl=en
  gclid = 'TeSter-123-ABCDEFGHIJKLMNOPQRSTUVWXYZ-abcdefghijklmnopqrstuvwxyz-0123456789-AaBbCcDdEeFfGgHhIiJjKkLl';

  try {
    response = UrlFetchApp.fetch(url+'?'+gclid+'=', {'followRedirects': false, 'muteHttpExceptions': false});
  } catch (e) {
      Logger.log(e);
      return 'ERR';
    }

  if (response.getHeaders()['Location']) {
    location = response.getHeaders()['Location'];
    if (location.indexOf(gclid) > -1) {
      return 'OK';
    } else if (location.indexOf(gclid) < 0){
        return 'NOT_OK';
      } 
  } else {
      // in case if "Location" was not found in response
      return'NO_IDEA';
    } 
}

# Google Ads gclid tester

<h3>How to use?</h3>
Script was written on Google Apps Script and can be run in Google Ads account in section: tools and settings->scripts->new script.

<h3>What does it solve?</h3>

If auto-tagging is enabled in Google Ads account to final URL automatically is added gclid value for tracking purposes. In case if your URL doesn't work correctly with this parameter it can be the reason of data discrepancy in Google Analytics and it can even redirect your end-user to the page 404.
 
<h3>How does it work?</h4>

Script programmatically checks final URLs in your ads and tests gclid parameter according to this <a href="https://support.google.com/analytics/answer/2938246?hl=en">article</a>.

<h3>Where can I check result?</h3>

At the end of script execution new Google spreadsheet is created on Google drive and report is pushed to the first sheet in this file.

<h3>Authorization</h3>
Additional permission for Spreadsheet and Gogole Drive service is required because script should create spreadsheet and save it on Google Drive.

<h3>Example</h3>

50 ads with 50 different desktop/mobile <a href="https://en.wikipedia.org/wiki/List_of_most_popular_websites">urls</a> were tested and output is available under this <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vT3-MjbGPKfQPZ2jo1doAGNSh8cCy2bYoOxqS9WAK92MxUcSX_QDYk7bNWnoP44w9_1thnEQdiHyF8s/pubhtml?gid=0&single=true">link</a>.

http://google.com	OK (gclid works correctly)<br>
http://m.google.com	NOT_OK (gclid doesn't work correctly)

http://baidu.com	NO_IDEA	(script was unable to determine the status and test should be done manually)
http://m.baidu.com	NO_IDEA (script was unable to determine the status and test should be done manually)

http://apple.com	OK	(gclid works correctly)<br>
http://m.apple.com	ERR (this site is unavailable and while checking occured error)








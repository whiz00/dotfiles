// Copyright (C) 1999-2019 Siber Systems Inc. All Rights Reserved.
if(void 0===chrome_common_js_loaded){var chrome_common_js_loaded=1;if(-1!=navigator.appVersion.indexOf("OPR"))var g_isopera=!0;else var g_ischrome=!0;var browser=chrome;function GetBrowserType(){return g_isopera?"opera15":"chrome"}var data=browser.app.getDetails();function getBG(){return browser.extension&&browser.extension.getBackgroundPage()}function getRF(){return getBG().g_roboform}function getProxyRfo(){return getBG().g_proxy_rfo}function postToBG(e,r){browser.runtime.sendMessage(e,r)}function connectPopupToBG(e){return browser.runtime.connect(e)}function PutSettingNotify(e,r,t){var o={name:"putSetting",data:{section:e,name:r,value:t}};browser.runtime.sendMessage(o)}function ExecScriptInTabSilent(e,r,t,o){var n={file:t,allFrames:!0,matchAboutBlank:!0};r&&(n.frameId=r,n.allFrames=!1);try{browser.tabs.executeScript(e,n,function(){if(browser.runtime.lastError)log("ExecScriptInTabSilent: error: "+browser.runtime.lastError.message);else try{o&&o()}catch(e){log("ExecScriptInTabSilent: exception in callback:"+e)}})}catch(e){log("ExecScriptInTabSilent: exception: "+e)}}function GetSelectedTab(e,r){browser.tabs.getSelected?browser.tabs.getSelected(e,r):browser.tabs.query({active:!0,currentWindow:!0},function(e){e&&e[0]&&r(e[0])})}function IsBlankTabUrl(e){return"chrome://newtab/"===e||"chrome://startpage/"===e}function GetLocalURL(e){return browser.extension.getURL(e)}data&&(kCannotLoadExtension="Can not load "+(data.name||data.description)+" ("+data.version+")");var rf_version="version",rf_builddate="October 24, 2018";g_isedge&&(rf_version="1.1.3.0",rf_builddate="December 28, 2016");var RF_BROWSER_PARAM="RF-Chrome";function trace(){console_output("Common: "+format_log_args(trace.caller,arguments))}function log(){console_output("Common: "+format_log_args(log.caller,arguments))}}
//# sourceMappingURL=common.js.map
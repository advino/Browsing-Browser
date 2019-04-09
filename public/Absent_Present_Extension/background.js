chrome.runtime.onInstalled.addListener(() => {
  console.log("Browsing Browser Installed");
});

chrome.runtime.onStartup.addListener(() => {
  window.open("./popup.html", "Browsing Browser", "width=400, height=320, resizable=0");
});

chrome.browserAction.onClicked.addListener(tab => {
  window.open("./popup.html", "Browsing Browser", "width=400, height=320, resizable=0");
});

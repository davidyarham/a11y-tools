chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.tabs.sendMessage(tabId, { action: "runAxe" });
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    chrome.tabs.sendMessage(tab.id, { action: "runAxe" });
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateBadge") {
    chrome.action.setBadgeText({
      text: "",
      tabId: sender.tab.id,
    });

    if (message.count > 0) {
      chrome.action.setBadgeText({
        text: message.count.toString(),
        tabId: sender.tab.id,
      });
      chrome.action.setBadgeBackgroundColor({
        color: message.backgroundColor,
        tabId: sender.tab.id,
      });
      chrome.action.setBadgeTextColor({
        color: message.textColor,
        tabId: sender.tab.id,
      });
    }
  }
});

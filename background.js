/**
 * Background script for Workday Application Assistant
 * Handles events and communication between the extension parts
 */

// Listen for installation or update
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    // Show onboarding or welcome page on first install
    chrome.tabs.create({
      url: 'popup.html'
    });
  }
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'checkWorkdayPage') {
    // Check if current page is a Workday page
    const url = sender.tab.url;
    const isWorkday = url.includes('workday.com') || 
                     url.includes('myworkday.com') || 
                     url.includes('myworkdayjobs.com');
    
    sendResponse({ isWorkday });
  }
  
  // Allow asynchronous response
  return true;
});

// Optional: Add context menu for quick actions
chrome.contextMenus?.create({
  id: 'fillWorkdayForm',
  title: 'Fill Workday Form',
  contexts: ['page'],
  documentUrlPatterns: [
    '*://*.workday.com/*',
    '*://*.myworkday.com/*',
    '*://*.myworkdayjobs.com/*'
  ]
});

// Handle context menu clicks
chrome.contextMenus?.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'fillWorkdayForm') {
    chrome.storage.local.get('workdayAssistantData', (result) => {
      if (result.workdayAssistantData) {
        chrome.tabs.sendMessage(tab.id, {
          action: 'fillForm',
          userData: result.workdayAssistantData
        });
      } else {
        // Notify user that no data is saved
        chrome.tabs.sendMessage(tab.id, {
          action: 'showNotification',
          message: 'No profile data found. Please set up your profile first.'
        });
      }
    });
  }
});

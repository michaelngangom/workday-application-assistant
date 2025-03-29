/**
 * Saves user data to Chrome local storage
 * @param {Object} data - The user data to save
 * @returns {Promise} A promise that resolves when data is saved
 */
function saveToStorage(data) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set({ 'workdayAssistantData': data }, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves user data from Chrome local storage
 * @returns {Promise<Object>} A promise that resolves with the retrieved data
 */
function getFromStorage() {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get('workdayAssistantData', (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(result.workdayAssistantData);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Clears all user data from Chrome local storage
 * @returns {Promise} A promise that resolves when data is cleared
 */
function clearStorage() {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.remove('workdayAssistantData', () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Background script for YouTube Smart Content Blocker
 * Initializes default settings upon installation.
 */

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['enabled', 'keywords', 'blockShorts', 'password'], (result) => {
    // Set default values if not already set
    const defaults = {
      enabled: true,
      blockShorts: true,
      keywords: ["cartoon", "kids", "animation", "doraemon", "shinchan", "tom and jerry", "motu patlu", "nursery rhymes", "cocomelon"],
      password: "" // Empty means user needs to set it up
    };

    const newSettings = {};
    Object.keys(defaults).forEach(key => {
      if (result[key] === undefined) {
        newSettings[key] = defaults[key];
      }
    });

    if (Object.keys(newSettings).length > 0) {
      chrome.storage.sync.set(newSettings, () => {
        console.log('Default settings initialized');
      });
    }
  });
});

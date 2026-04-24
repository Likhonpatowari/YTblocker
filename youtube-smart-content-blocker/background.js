chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['enabled', 'keywords', 'password'], (result) => {
    const defaults = {
      enabled: true,
      keywords: ["cartoon", "kids", "doraemon", "shinchan", "motu patlu", "oggy", "rudra", "franklin"],
      password: ""
    };
    const newSettings = {};
    Object.keys(defaults).forEach(key => {
      if (result[key] === undefined) newSettings[key] = defaults[key];
    });
    if (Object.keys(newSettings).length > 0) {
      chrome.storage.sync.set(newSettings);
    }
  });
});

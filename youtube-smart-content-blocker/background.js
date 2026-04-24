chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['enabled', 'keywords', 'blockShorts', 'password'], (result) => {
    const defaults = {
      enabled: true,
      blockShorts: true,
      keywords: ["cartoon", "kids", "animation", "doraemon", "shinchan", "tom and jerry", "motu patlu", "nursery rhymes", "cocomelon"],
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

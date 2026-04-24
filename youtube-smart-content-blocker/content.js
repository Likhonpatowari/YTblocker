let settings = { enabled: true, keywords: [], blockShorts: true };

const updateSettings = () => {
  chrome.storage.sync.get(['enabled', 'keywords', 'blockShorts'], (result) => {
    settings = {
      enabled: result.enabled ?? true,
      keywords: result.keywords || [],
      blockShorts: result.blockShorts ?? true
    };
    if (settings.enabled) scanAndBlock();
  });
};

chrome.storage.onChanged.addListener(() => updateSettings());
updateSettings();

const createBlockedUI = () => {
  const div = document.createElement('div');
  div.className = 'yt-smart-block-overlay';
  div.innerHTML = `
    <div class="yt-smart-block-content">
      <div class="yt-smart-block-icon">🚫</div>
      <h3 class="yt-smart-block-message">এই ভিডিওটি ব্লক করা হয়েছে</h3>
      <p class="yt-smart-block-sub">সময় নষ্ট না করে কিছু শেখার চেষ্টা করো 💡</p>
    </div>
  `;
  return div;
};

const shouldBlock = (container) => {
  if (!settings.enabled) return false;
  const isShorts = container.tagName.toLowerCase() === 'ytd-reel-item-renderer' || 
                   container.querySelector('a[href^="/shorts/"]');
  if (settings.blockShorts && isShorts) return true;
  const titleEl = container.querySelector('#video-title, #video-title-link, .title');
  const textContent = (titleEl?.innerText || "").toLowerCase();
  return settings.keywords.some(keyword => textContent.includes(keyword.toLowerCase()));
};

const scanAndBlock = () => {
  if (!settings.enabled) return;
  const selectors = ['ytd-rich-item-renderer', 'ytd-video-renderer', 'ytd-compact-video-renderer', 'ytd-reel-item-renderer'];
  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(item => {
      if (item.classList.contains('yt-smart-blocked')) return;
      if (shouldBlock(item)) {
        item.classList.add('yt-smart-blocked');
        const contentContainer = item.querySelector('#content, ytd-thumbnail, .ytd-video-renderer');
        if (contentContainer) {
          contentContainer.innerHTML = '';
          contentContainer.appendChild(createBlockedUI());
        } else {
          item.style.display = 'none';
        }
      }
    });
  });
};

const observer = new MutationObserver(() => settings.enabled && scanAndBlock());
observer.observe(document.body, { childList: true, subtree: true });
scanAndBlock();

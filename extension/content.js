/**
 * content.js - Core blocking logic for YouTube Smart Content Blocker
 */

let settings = {
  enabled: true,
  keywords: [],
  blockShorts: true
};

// Load settings from storage
const updateSettings = () => {
  chrome.storage.sync.get(['enabled', 'keywords', 'blockShorts'], (result) => {
    settings = {
      enabled: result.enabled ?? true,
      keywords: result.keywords || [],
      blockShorts: result.blockShorts ?? true
    };
    // Re-scan page when settings change
    if (settings.enabled) {
      scanAndBlock();
    }
  });
};

// Listen for storage changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled || changes.keywords || changes.blockShorts) {
    updateSettings();
  }
});

updateSettings();

/**
 * Creates the Bangla replacement UI card
 */
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

/**
 * Checks if a video should be blocked based on its metadata
 */
const shouldBlock = (container) => {
  if (!settings.enabled) return false;

  // 1. Check for Shorts
  const isShorts = container.tagName.toLowerCase() === 'ytd-reel-item-renderer' || 
                   container.closest('ytd-reel-shelf-renderer') ||
                   container.querySelector('[is-shorts]') ||
                   container.querySelector('a[href^="/shorts/"]');

  if (settings.blockShorts && isShorts) return true;

  // 2. Check keywords in title and channel name
  const titleEl = container.querySelector('#video-title, #video-title-link, .title');
  const metadataEl = container.querySelector('#metadata, #metadata-line, #text');
  
  const textContent = (titleEl?.innerText + ' ' + metadataEl?.innerText).toLowerCase();

  return settings.keywords.some(keyword => textContent.includes(keyword.toLowerCase()));
};

/**
 * Scans the page and hides/replaces matched items
 */
const scanAndBlock = () => {
  if (!settings.enabled) return;

  // Selectors for different types of video items on YouTube
  const selectors = [
    'ytd-rich-item-renderer',     // Home page
    'ytd-video-renderer',        // Search results
    'ytd-compact-video-renderer', // Suggested sidebar
    'ytd-reel-item-renderer',    // Shorts in shelf
    'ytd-grid-video-renderer'    // Channel page videos
  ];

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(item => {
      if (item.classList.contains('yt-smart-blocked')) return;

      if (shouldBlock(item)) {
        item.classList.add('yt-smart-blocked');
        
        // Find the actual thumbnail element to overlay or hide
        const contentContainer = item.querySelector('#content, .ytd-video-renderer, .ytd-compact-video-renderer');
        
        if (contentContainer) {
          // Add the replacement UI
          const blockedUI = createBlockedUI();
          contentContainer.innerHTML = '';
          contentContainer.appendChild(blockedUI);
          
          // Apply minimal height to ensure it shows up nicely
          item.style.minHeight = '150px';
        } else {
          // Fallback: just hide the item if structure is unexpected
          item.style.display = 'none';
        }
      }
    });
  });

  // Specifically target the dedicated Shorts tab link in sidebar
  if (settings.blockShorts) {
    const shortsSidebarLink = document.querySelector('ytd-guide-entry-renderer a[title="Shorts"], ytd-mini-guide-entry-renderer[aria-label="Shorts"]');
    if (shortsSidebarLink) {
      shortsSidebarLink.closest('ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer').style.display = 'none';
    }
  }
};

/**
 * Observe dynamic changes as YouTube loads more content
 */
const observer = new MutationObserver((mutations) => {
  if (!settings.enabled) return;
  
  let shouldScan = false;
  for (const mutation of mutations) {
    if (mutation.addedNodes.length > 0) {
      shouldScan = true;
      break;
    }
  }
  
  if (shouldScan) {
    scanAndBlock();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Run initial scan
scanAndBlock();

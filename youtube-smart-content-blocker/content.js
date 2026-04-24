let settings = { enabled: true, keywords: [], blockShortsFilter: true };

const updateSettings = () => {
    chrome.storage.sync.get(['enabled', 'keywords', 'blockShortsFilter'], (result) => {
        settings = {
            enabled: result.enabled ?? true,
            keywords: result.keywords || [],
            blockShortsFilter: result.blockShortsFilter ?? true
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
            <h4 class="yt-smart-block-message">এই কন্টেন্টটি আপনার ফিল্টার অনুযায়ী ব্লক করা হয়েছে</h4>
        </div>
    `;
    return div;
};

const shouldBlock = (container) => {
    if (!settings.enabled) return false;

    // ১. ভিডিওর টাইটেল খুঁজে বের করা
    const titleEl = container.querySelector('#video-title, #video-title-link, .title, #video-title-container');
    const titleText = (titleEl?.innerText || "").toLowerCase();

    // ২. চ্যানেলের নাম খুঁজে বের করা
    const channelEl = container.querySelector('#channel-name, #text.ytd-channel-name, .ytd-channel-name, #metadata-line');
    const channelName = (channelEl?.innerText || "").toLowerCase();

    const fullTextSearch = titleText + " " + channelName;

    // কিউওয়ার্ড ম্যাচিং চেক
    return settings.keywords.some(keyword => {
        const k = keyword.toLowerCase().trim();
        return k !== "" && fullTextSearch.includes(k);
    });
};

const scanAndBlock = () => {
    if (!settings.enabled) return;

    // ইউটিউবের বিভিন্ন টাইপের ভিডিও গ্রিড সিলেক্টর
    const selectors = [
        'ytd-rich-item-renderer',      // Home page
        'ytd-video-renderer',           // Search results
        'ytd-compact-video-renderer',   // Sidebar videos
        'ytd-reel-item-renderer',       // Shorts videos
        'ytd-grid-video-renderer'       // Channel page
    ];

    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(item => {
            if (item.classList.contains('yt-smart-blocked')) return;

            if (shouldBlock(item)) {
                item.classList.add('yt-smart-blocked');
                
                // থাম্বনেইল এরিয়া বা মেইন কন্টেন্ট সরিয়ে রিপ্লেসমেন্ট দেওয়া
                const contentContainer = item.querySelector('#content, ytd-thumbnail, .details, #dismissible');
                
                if (contentContainer) {
                    contentContainer.style.position = 'relative';
                    contentContainer.innerHTML = '';
                    contentContainer.appendChild(createBlockedUI());
                } else {
                    item.style.display = 'none';
                }
            }
        });
    });
};

// ইউটিউব ডাইনামিকলি নতুন ভিডিও লোড করলে তা ধরার জন্য MutationObserver
const observer = new MutationObserver(() => {
    if (settings.enabled) scanAndBlock();
});

observer.observe(document.body, { childList: true, subtree: true });
scanAndBlock();

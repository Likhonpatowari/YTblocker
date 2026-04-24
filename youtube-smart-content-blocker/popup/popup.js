document.addEventListener('DOMContentLoaded', () => {
    const mainToggle = document.getElementById('mainToggle');
    const keywordInput = document.getElementById('keywordInput');
    const addKeywordBtn = document.getElementById('addKeywordBtn');
    const keywordList = document.getElementById('keywordList');
    const passwordOverlay = document.getElementById('passwordOverlay');
    const setupOverlay = document.getElementById('setupOverlay');
    
    let currentSettings = {};
    let pendingAction = null;

    chrome.storage.sync.get(null, (result) => {
        currentSettings = result;
        if (!result.password) setupOverlay.classList.remove('hidden');
        mainToggle.checked = result.enabled;
        renderKeywords(result.keywords || []);
    });

    function renderKeywords(keywords) {
        keywordList.innerHTML = '';
        keywords.forEach(k => {
            const tag = document.createElement('div');
            tag.className = 'keyword-tag';
            tag.innerHTML = `<span>${k}</span> <span class="remove" data-word="${k}">×</span>`;
            keywordList.appendChild(tag);
        });
        document.querySelectorAll('.remove').forEach(b => b.onclick = () => removeKeyword(b.dataset.word));
    }

    const save = () => chrome.storage.sync.set({
        enabled: mainToggle.checked,
        keywords: currentSettings.keywords
    });

    mainToggle.onchange = (e) => {
        if (!e.target.checked) {
            mainToggle.checked = true; // রিভার্ট
            pendingAction = () => { mainToggle.checked = false; save(); };
            passwordOverlay.classList.remove('hidden');
        } else save();
    };

    addKeywordBtn.onclick = () => {
        const word = keywordInput.value.trim();
        if (word) {
            if (!currentSettings.keywords.includes(word)) {
                currentSettings.keywords.push(word);
                renderKeywords(currentSettings.keywords);
                save();
            }
            keywordInput.value = '';
        }
    };

    function removeKeyword(word) {
        currentSettings.keywords = currentSettings.keywords.filter(k => k !== word);
        renderKeywords(currentSettings.keywords);
        save();
    }

    document.getElementById('authBtn').onclick = () => {
        if (document.getElementById('authPassword').value === currentSettings.password) {
            passwordOverlay.classList.add('hidden');
            document.getElementById('authPassword').value = '';
            if (pendingAction) pendingAction();
        } else alert('ভুল পাসওয়ার্ড!');
    };

    document.getElementById('savePasswordBtn').onclick = () => {
        const p = document.getElementById('newPassword').value;
        if (p.length >= 4) {
            chrome.storage.sync.set({ password: p });
            currentSettings.password = p;
            setupOverlay.classList.add('hidden');
        } else alert('কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড দিন');
    };
});

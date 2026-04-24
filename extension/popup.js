/**
 * popup.js - Interactive settings management for YouTube Smart Content Blocker
 */

document.addEventListener('DOMContentLoaded', () => {
    const mainToggle = document.getElementById('mainToggle');
    const shortsToggle = document.getElementById('shortsToggle');
    const keywordInput = document.getElementById('keywordInput');
    const addKeywordBtn = document.getElementById('addKeywordBtn');
    const keywordList = document.getElementById('keywordList');
    const statusLabel = document.getElementById('statusLabel');
    const saveStatus = document.getElementById('saveStatus');
    const resetBtn = document.getElementById('resetBtn');
    const changePassBtn = document.getElementById('changePassBtn');

    // Overlays
    const passwordOverlay = document.getElementById('passwordOverlay');
    const setupOverlay = document.getElementById('setupOverlay');
    const authBtn = document.getElementById('authBtn');
    const authPassword = document.getElementById('authPassword');
    const savePasswordBtn = document.getElementById('savePasswordBtn');
    const newPasswordEl = document.getElementById('newPassword');
    const cancelAuthBtn = document.getElementById('cancelAuthBtn');

    let currentSettings = {};
    let pendingAction = null; // Store function to run after successful password entry

    // 1. Load initial settings
    chrome.storage.sync.get(['enabled', 'keywords', 'blockShorts', 'password'], (result) => {
        currentSettings = result;
        
        // Initial setup check
        if (!result.password) {
            setupOverlay.classList.remove('hidden');
        }

        updateUI(result);
    });

    function updateUI(settings) {
        mainToggle.checked = settings.enabled;
        shortsToggle.checked = settings.blockShorts;
        statusLabel.innerText = settings.enabled ? 'ON' : 'OFF';
        statusLabel.style.color = settings.enabled ? '#FF0000' : '#999';

        renderKeywords(settings.keywords);
    }

    function renderKeywords(keywords) {
        keywordList.innerHTML = '';
        keywords.forEach(keyword => {
            const tag = document.createElement('div');
            tag.className = 'keyword-tag';
            tag.innerHTML = `
                ${keyword}
                <span class="remove-keyword" data-keyword="${keyword}">×</span>
            `;
            keywordList.appendChild(tag);
        });

        // Add removers
        document.querySelectorAll('.remove-keyword').forEach(btn => {
            btn.onclick = () => removeKeyword(btn.dataset.keyword);
        });
    }

    function showSaveStatus(message) {
        saveStatus.innerText = message;
        setTimeout(() => { saveStatus.innerText = ''; }, 2000);
    }

    function saveSettings() {
        chrome.storage.sync.set({
            enabled: mainToggle.checked,
            blockShorts: shortsToggle.checked,
            keywords: currentSettings.keywords
        }, () => {
            statusLabel.innerText = mainToggle.checked ? 'ON' : 'OFF';
            statusLabel.style.color = mainToggle.checked ? '#FF0000' : '#999';
            showSaveStatus('Settings saved!');
        });
    }

    // 2. Password Logic
    
    function requestAuth(action) {
        pendingAction = action;
        passwordOverlay.classList.remove('hidden');
        authPassword.value = '';
        authPassword.focus();
    }

    authBtn.onclick = () => {
        const inputPass = authPassword.value;
        if (inputPass === currentSettings.password) {
            passwordOverlay.classList.add('hidden');
            if (pendingAction) {
                pendingAction();
                pendingAction = null;
            }
        } else {
            alert('Incorrect password!');
            authPassword.value = '';
        }
    };

    cancelAuthBtn.onclick = () => {
        passwordOverlay.classList.add('hidden');
        pendingAction = null;
        // Revert UI if needed (e.g. if we were toggling)
        updateUI(currentSettings);
    };

    savePasswordBtn.onclick = () => {
        const pass = newPasswordEl.value;
        if (pass.length < 4) {
            alert('Password must be at least 4 characters');
            return;
        }
        chrome.storage.sync.set({ password: pass }, () => {
            currentSettings.password = pass;
            setupOverlay.classList.add('hidden');
            showSaveStatus('Password set!');
        });
    };

    // 3. Event Handlers

    mainToggle.onchange = (e) => {
        const isTurningOff = !e.target.checked;
        if (isTurningOff) {
            // Revert visually immediately then wait for auth
            mainToggle.checked = true;
            requestAuth(() => {
                mainToggle.checked = false;
                saveSettings();
            });
        } else {
            saveSettings();
        }
    };

    shortsToggle.onchange = () => {
        saveSettings();
    };

    addKeywordBtn.onclick = () => {
        const word = keywordInput.value.trim().toLowerCase();
        if (word && !currentSettings.keywords.includes(word)) {
            currentSettings.keywords.push(word);
            keywordInput.value = '';
            renderKeywords(currentSettings.keywords);
            saveSettings();
        }
    };

    function removeKeyword(word) {
        currentSettings.keywords = currentSettings.keywords.filter(k => k !== word);
        renderKeywords(currentSettings.keywords);
        saveSettings();
    }

    resetBtn.onclick = () => {
        requestAuth(() => {
            const defaults = {
                enabled: true,
                blockShorts: true,
                keywords: ["cartoon", "kids", "animation", "doraemon", "shinchan", "tom and jerry", "motu patlu", "nursery rhymes", "cocomelon"]
            };
            currentSettings.keywords = defaults.keywords;
            updateUI(defaults);
            saveSettings();
        });
    };

    changePassBtn.onclick = () => {
        requestAuth(() => {
            setupOverlay.classList.remove('hidden');
            newPasswordEl.value = '';
            newPasswordEl.focus();
        });
    };
});

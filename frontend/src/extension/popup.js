document.addEventListener('DOMContentLoaded', async () => {
    const select = document.getElementById('language-select');
    const btn = document.getElementById('translate-btn');

    //Load saved language from storage
    chrome.storage.local.get(['targetLanguage'], (result) => {
        if (result.targetLanguage) {
            select.value = result.targetLanguage;
        }
    });

    //Handle Click
    btn.addEventListener('click', () => {
        const lang = select.value;
        if (!lang) return;

        //Save selection
        chrome.storage.local.set({ targetLanguage: lang });

        //Send message to the active tab's Content Script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0].id) {
                chrome.tabs.sendMessage(tabs[0].id, { 
                    action: "CHANGE_LANGUAGE", 
                    language: lang 
                });
            }
        });
        
        window.close();
    });
});
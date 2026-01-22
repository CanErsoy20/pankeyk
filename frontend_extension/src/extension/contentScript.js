(() => {
    const PAGE_KEY = `${location.hostname}${location.pathname}`;

    let initialized = false;
    let requestInFlight = false;
    let resizeInProgress = false;
    
    //State for language and abort controller
    let currentLanguage = null;
    let currentAbortController = null;

    //Utilities
    function isVisible(el) {
        const style = window.getComputedStyle(el);
        return (
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            el.offsetParent !== null
        );
    }

    function stableHash(text) {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            hash = (hash << 5) - hash + text.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash).toString(16);
    }

    function getContext(tag) {
        switch (tag) {
            case "button": return "button";
            case "label": return "label";
            case "input": return "input";
            case "a": return "link";
            case "h1": case "h2": case "h3": return "heading";
            default: return "paragraph";
        }
    }

    //DOM Scan
    function scanDOM() {
        const results = [];
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT
        );

        let node;
        while ((node = walker.nextNode())) {
            const text = node.textContent?.trim();
            if (!text) continue;

            const parent = node.parentElement;
            if (!parent || !isVisible(parent)) continue;

            if (!node.__pankeykId) {
                node.__pankeykId = `text_${stableHash(text)}`;
                node.__pankeykOriginalText = text;
            }

            results.push({
                id: node.__pankeykId,
                text: node.__pankeykOriginalText,
                context: getContext(parent.tagName.toLowerCase()),
                node
            });
        }
        return results;
    }

    //Cache (Dynamic Key)
    function getCacheKey() {
        return `pankeyk_translation_cache::${currentLanguage}::${PAGE_KEY}`;
    }

    function loadCache() {
        if (!currentLanguage) return {};
        return JSON.parse(localStorage.getItem(getCacheKey()) || "{}");
    }

    function saveCache(cache) {
        if (!currentLanguage) return;
        localStorage.setItem(getCacheKey(), JSON.stringify(cache));
    }

    function applyTranslations(elements, cache) {
        elements.forEach(el => {
            const translated = cache[el.id];
            if (translated && el.node.textContent !== translated) {
                el.node.textContent = translated;
            }
        });
    }

    //Backend
    async function sendToBackend(payload, signal) {
        const response = await fetch("http://localhost:5000/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: signal //Abort signal
        });

        if (!response.ok) {
            throw new Error("Backend translation failed");
        }

        return response.json();
    }

    //Main Logic
    async function runTranslation(forceLanguage = null) {
        if (resizeInProgress) return;

        // Determine Language
        if (forceLanguage) {
            currentLanguage = forceLanguage;
        } else if (!currentLanguage) {
            //Check storage on first load
            const stored = await chrome.storage.local.get(['targetLanguage']);
            if (stored.targetLanguage) {
                currentLanguage = stored.targetLanguage;
            } else {
                console.log("GUI Extractor: No language selected. Waiting for user.");
                return;
            }
        }

        const elements = scanDOM();
        const cache = loadCache();

        applyTranslations(elements, cache);

        const missing = elements.filter(el => !cache[el.id]);
        if (missing.length === 0) {
            initialized = true;
            return;
        }

        //ABORT previous request if exists
        if (currentAbortController) {
            console.log("Aborting previous request...");
            currentAbortController.abort();
        }

        //AbortController
        currentAbortController = new AbortController();
        const signal = currentAbortController.signal;

        requestInFlight = true;

        try {
            const payload = {
                target_language: currentLanguage,
                page_url: window.location.href,
                request_id: Date.now(),
                elements: missing.map(el => ({
                    id: el.id,
                    text: el.text,
                    context: el.context
                }))
            };

            const response = await sendToBackend(payload, signal);

            response.elements.forEach(el => {
                cache[el.id] = el.translated_text;
            });

            saveCache(cache);
            applyTranslations(elements, cache);
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log("Request aborted by user.");
            } else {
                console.error(error);
            }
        } finally {
            requestInFlight = false;
            initialized = true;
        }
    }

    //Listeners

    // Listen for Popup selection
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "CHANGE_LANGUAGE") {
            runTranslation(request.language);
        }
    });

    //Mutation Observer
    let debounce = null;
    const observer = new MutationObserver(() => {
        if (!initialized || resizeInProgress) return;
        clearTimeout(debounce);
        debounce = setTimeout(() => runTranslation(), 300);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    //Resize Guard 
    let resizeTimeout = null;
    window.addEventListener("resize", () => {
        resizeInProgress = true;
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resizeInProgress = false;
        }, 500);
    });

    runTranslation();
})();
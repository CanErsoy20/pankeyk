(() => {
    const TARGET_LANGUAGE = "it";
    const CACHE_KEY = "pankeyk_translation_cache";

    /* =========================
       Utilities
    ========================== */

    function isVisible(el) {
        const style = window.getComputedStyle(el);
        return (
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            el.offsetParent !== null
        );
    }

    function hashText(text) {
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
            case "h1":
            case "h2":
            case "h3": return "heading";
            default: return "paragraph";
        }
    }

    /* =========================
       DOM Scan
    ========================== */

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

            const id = `text_${hashText(text)}`;

            results.push({
                id,
                text,
                context: getContext(parent.tagName.toLowerCase()),
                node
            });
        }
        return results;
    }

    /* =========================
       Cache
    ========================== */

    function loadCache() {
        return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
    }

    function saveCache(cache) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    }

    function applyTranslations(elements, cache) {
        elements.forEach(el => {
            const translated = cache[el.id];
            if (translated && el.node.textContent !== translated) {
                el.node.textContent = translated;
            }
        });
    }

    /* =========================
       Backend
    ========================== */

    async function sendToBackend(payload) {
        const response = await fetch("http://localhost:5000/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error("Translation request failed");
        }

        return response.json();
    }

    /* =========================
       Main Logic
    ========================== */

    async function runTranslation() {
        const elements = scanDOM();
        const cache = loadCache();

        // 1. Apply cached translations immediately
        applyTranslations(elements, cache);

        // 2. Find untranslated elements
        const missing = elements.filter(el => !cache[el.id]);
        if (missing.length === 0) return;

        const payload = {
            target_language: TARGET_LANGUAGE,
            elements: missing.map(el => ({
                id: el.id,
                text: el.text,
                context: el.context
            }))
        };

        const response = await sendToBackend(payload);

        response.elements.forEach(el => {
            cache[el.id] = el.translated_text;
        });

        saveCache(cache);
        applyTranslations(elements, cache);
    }

    /* =========================
       Mutation Watcher (debounced)
    ========================== */

    let debounce = null;

    const observer = new MutationObserver(() => {
        clearTimeout(debounce);
        debounce = setTimeout(runTranslation, 300);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial run
    runTranslation();
})();

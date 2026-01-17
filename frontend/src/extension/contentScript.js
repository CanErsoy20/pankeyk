const TARGET_LANGUAGE = "it";

function isVisible(el) {
    const style = window.getComputedStyle(el);
    return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        el.offsetParent !== null
    );
}

function getContext(tag) {
    switch (tag) {
        case "button":
            return "button";
        case "label":
            return "label";
        case "input":
            return "input";
        case "a":
            return "link";
        case "h1":
        case "h2":
        case "h3":
            return "heading";
        default:
            return "paragraph";
    }
}

function generateId(text, index) {
    return `text_${index}_${text
        .slice(0, 15)
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "")}`;
}

function scanDOM() {
    const results = [];
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
    );

    let node;
    let index = 0;

    while ((node = walker.nextNode())) {
        const text = node.textContent.trim();
        if (!text) continue;

        const parent = node.parentElement;
        if (!parent || !isVisible(parent)) continue;

        results.push({
            id: generateId(text, index++),
            text: text,
            context: getContext(parent.tagName.toLowerCase()),
        });
    }

    return results;
}

async function send(texts) {
    const payload = {
        target_language: TARGET_LANGUAGE,
        elements: texts,
    };

    try {
        await fetch("http://localhost:5000/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
    } catch (e) {
        console.error("Failed to send GUI text:", e);
    }
}

// Initial run
send(scanDOM());

// Observe dynamic changes
const observer = new MutationObserver(() => {
    send(scanDOM());
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
});

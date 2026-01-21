export function isVisible(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0" &&
        element.offsetParent !== null
    );
}

export function hashText(text: string): string {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = (hash << 5) - hash + text.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash).toString(16);
}

function getContext(tag: string): string {
    switch (tag) {
        case "button": return "button";
        case "label": return "label";
        case "input": return "input";
        case "a": return "link";
        case "h1": case "h2": case "h3": return "heading";
        case "li": return "list item";
        default: return "paragraph";
    }
}

// Helper to revert all translated nodes back to English
export function restoreDOM() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
        if ((node as any).__pankeykOriginal) {
            node.textContent = (node as any).__pankeykOriginal;
            (node as any).__pankeykTranslated = false; // Important: Uncheck the flag
        }
    }
}

export function scanDOM() {
    const results: any[] = [];
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
    );

    let node;
    while ((node = walker.nextNode())) {
        // 1. If it's already translated, SKIP IT (unless we just restored it)
        if ((node as any).__pankeykTranslated) continue;

        const text = node.textContent?.trim();
        if (!text) continue;
        if (text.length < 2) continue; 

        const parent = node.parentElement;
        if (!parent || !isVisible(parent)) continue;
        if (["SCRIPT", "STYLE", "NOSCRIPT", "CODE"].includes(parent.tagName)) continue;

        // 2. SAVE ORIGINAL TEXT (First time seeing this node)
        if (!(node as any).__pankeykOriginal) {
            (node as any).__pankeykOriginal = text;
        } else {
            // Safety: If the DOM text differs from original but NOT marked translated, 
            // it might be a dynamic update (like a counter). Update original.
            if (text !== (node as any).__pankeykOriginal) {
                (node as any).__pankeykOriginal = text;
            }
        }

        const id = `text_${hashText((node as any).__pankeykOriginal)}`;

        results.push({
            id,
            text: (node as any).__pankeykOriginal, // Always send original text to AI
            context: getContext(parent.tagName.toLowerCase()),
            node
        });
    }
    return results;
}
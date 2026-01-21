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

// Selects the tags to be translated
// In case of texts buried in child tags, checks parent tags also
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

// Reverts the page to original language - checks the translated flag to false
export function restoreDOM() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
        if ((node as any).__pankeykOriginal) {
            node.textContent = (node as any).__pankeykOriginal;
            (node as any).__pankeykTranslated = false; 
        }
    }
}

// Scans the target page's DOM and returns non-translated original text
export function scanDOM() {
    const results: any[] = [];
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
    );

    let node;
    while ((node = walker.nextNode())) {
        // 1. If it's already translated, skip it
        if ((node as any).__pankeykTranslated) continue;

        // Check the validity of the text (min length and non-null)
        const text = node.textContent?.trim();
        if (!text) continue;
        if (text.length < 2) continue; 

        // Check the validity of the parent element (visibility, non-text content tag names)
        const parent = node.parentElement;
        if (!parent || !isVisible(parent)) continue;
        
        // SKIP IGNORED ELEMENTS
        if (parent.closest('[data-pankeyk-ignore]')) continue;

        if (["SCRIPT", "STYLE", "NOSCRIPT", "CODE"].includes(parent.tagName)) continue;

        // 2. Save the original text (first time encounter)
        if (!(node as any).__pankeykOriginal) {
            (node as any).__pankeykOriginal = text;
        } else {
            // Not the first encounter
            // If not marked translated -> Dynamic update
            if (text !== (node as any).__pankeykOriginal) {
                (node as any).__pankeykOriginal = text;
            }
        }

        const id = `text_${hashText((node as any).__pankeykOriginal)}`;

        results.push({
            id,
            text: (node as any).__pankeykOriginal,
            context: getContext(parent.tagName.toLowerCase()),
            node
        });
    }
    return results;
}
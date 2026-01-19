import { isVisible } from "./visibility";

function hashText(text: string): string {
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
        case "h1":
        case "h2":
        case "h3": return "heading";
        default: return "paragraph";
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

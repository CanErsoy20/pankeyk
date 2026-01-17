import { isVisible } from "./visibility";

export interface ExtractedText {
    id: string;
    text: string;
    context: string;
}

function getContext(tag: string): string {
    switch (tag) {
        case "button":
            return "button";
        case "label":
            return "label";
        case "input":
            return "input";
        case "h1":
        case "h2":
        case "h3":
            return "heading";
        case "a":
            return "link";
        default:
            return "paragraph";
    }
}

function generateId(text: string, index: number): string {
    return `text_${index}_${text
        .slice(0, 15)
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "")}`;
}

export function scanDOM(): ExtractedText[] {
    const results: ExtractedText[] = [];
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
    );

    let node: Node | null;
    let index = 0;

    while ((node = walker.nextNode())) {
        const text = node.textContent?.trim();
        if (!text) continue;

        const parent = node.parentElement;
        if (!parent || !isVisible(parent)) continue;

        results.push({
            id: generateId(text, index++),
            text,
            context: getContext(parent.tagName.toLowerCase()),
        });
    }

    return results;
}

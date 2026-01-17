import { scanDOM } from "./domScanner";

export function observeDOM(
    onChange: (texts: ReturnType<typeof scanDOM>) => void
) {
    const observer = new MutationObserver(() => {
        const extracted = scanDOM();
        onChange(extracted);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
    });
}

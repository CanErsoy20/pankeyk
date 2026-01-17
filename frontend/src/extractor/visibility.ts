export function isVisible(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);

    return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0" &&
        element.offsetParent !== null
    );
}

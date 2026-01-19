export function toBackendPayload(elements: any[], targetLanguage: string) {
    return {
        target_language: targetLanguage,
        elements: elements.map(el => ({
            id: el.id,
            text: el.text,
            context: el.context
        }))
    };
}

import { ExtractedText } from "../extractor/domScanner";

export function buildJson(
    texts: ExtractedText[],
    targetLanguage: string
) {
    return {
        target_language: targetLanguage,
        texts: texts,
    };
}

import { scanDOM } from "./extractor/domScanner";
import { observeDOM } from "./extractor/mutationWatcher";
import { sendToBackend } from "./api/sendToBackend";
import { toBackendPayload } from "./serilalizer/toJson";

const TARGET_LANGUAGE = "it"; // can be changed dynamically later

function processAndSend() {
    const texts = scanDOM();
    const payload = toBackendPayload(texts, TARGET_LANGUAGE);
    sendToBackend(payload);
}

// Initial extraction
processAndSend();

// Observe dynamic changes (React / Angular / SPA)
observeDOM((texts) => {
    const payload = toBackendPayload(texts, TARGET_LANGUAGE);
    sendToBackend(payload);
});

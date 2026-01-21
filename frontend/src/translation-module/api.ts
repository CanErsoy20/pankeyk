const BACKEND_URL = "http://localhost:5000/translate";

// Sends the original text to backend and waits for the translated JSON
export async function sendToBackend(payload: any, signal?: AbortSignal) {
    try {
        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: signal
        });

        if (!response.ok) throw new Error("Backend failed");
        return await response.json();
    } catch (err: any) {
        if (err.name === 'AbortError') console.log("Request aborted");
        else console.error("API Error:", err);
        return null;
    }
}
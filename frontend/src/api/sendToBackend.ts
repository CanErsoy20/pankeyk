export async function sendToBackend(payload: any) {
    try {
        await fetch("http://localhost:5000/translate", {
            method: "POST",
            headers: {
                "Conode -vntent-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        console.error("Failed to send data to AI backend:", error);
    }
}

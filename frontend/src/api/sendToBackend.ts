export async function sendToBackend(payload: any) {
    const response = await fetch("http://localhost:5000/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error("Backend translation failed");
    }

    return response.json();
}

export async function sendN8nEvent(event: string, payload: unknown) {
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) return { sent: false, reason: "N8N_WEBHOOK_URL is not configured" };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.N8N_WEBHOOK_SECRET ? { "x-ultd-secret": process.env.N8N_WEBHOOK_SECRET } : {})
      },
      body: JSON.stringify({ event, payload })
    });
    return { sent: response.ok, status: response.status };
  } catch (error) {
    return { sent: false, reason: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function runAiWebhook(input: { text: string; sourceLanguage: string; targetLanguage: string }) {
  const url = process.env.N8N_AI_WEBHOOK_URL;
  if (!url) throw new Error("N8N_AI_WEBHOOK_URL is not configured");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.N8N_WEBHOOK_SECRET ? { "x-ultd-secret": process.env.N8N_WEBHOOK_SECRET } : {})
    },
    body: JSON.stringify(input)
  });
  if (!response.ok) throw new Error(`AI workflow returned ${response.status}`);
  return response.json();
}

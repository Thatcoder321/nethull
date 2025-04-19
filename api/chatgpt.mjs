// api/chatgpt.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body;
  try {
    body = req.body;
  } catch (err) {
    return res.status(400).json({ error: 'Invalid or missing JSON in request body' });
  }

  const userMessage = body.message;
  if (!userMessage) {
    return res.status(400).json({ error: 'Missing message in request body' });
  }

  try {
    const response = await fetch("/api/chatgpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Hey! I'm Nethul — the creator of this website. Ask me anything about my projects!"
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error("GPT request failed:", err);
    res.status(500).json({ error: "Failed to communicate with GPT" });
  }
}
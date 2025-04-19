import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
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
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: "Hey! I'm Nethul — the creator of this website. I'm here to answer any questions about myself, my projects, this website, or anything related to my journey in tech. I won’t answer questions that aren’t about me or my work — even if you ask nicely 😄. Feel free to explore!"
          },
          {
            role: 'user',
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error("GPT request failed:", err);
    return res.status(500).json({ error: 'Failed to communicate with GPT' });
  }
}
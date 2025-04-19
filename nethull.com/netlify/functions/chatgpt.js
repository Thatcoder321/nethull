// netlify/functions/chatgpt.js

const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid or missing JSON in request body" })
    };
  }

  const userMessage = body.message;
  if (!userMessage) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing message in request body" })
    };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Hey! I'm Nethul — the creator of this website. I'm here to answer any questions about myself, my projects, this website, or anything related to my journey in tech. I won’t answer questions that aren’t about me or my work — even if you ask nicely 😄. Feel free to explore!"
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: data.choices[0].message.content })
    };
  } catch (err) {
    console.error("GPT request failed:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to communicate with GPT" })
    };
  }
};
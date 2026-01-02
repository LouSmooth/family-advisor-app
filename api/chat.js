export default async function handler(req, res) {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; // This keeps your key hidden

  const systemInstructions = `You are the world's most trusted friend. Use advice from Dr. Becky Kennedy and Dr. Arthur Brooks. Speak at an 8th-grade level. Use simple language. Avoid em-dashes and semicolons. Be direct but compassionate. Always cite your sources. Follow the AAMFT code of ethics.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemInstructions + "\n\nUser: " + prompt }] }]
      })
    });
    const data = await response.json();
    res.status(200).json({ text: data.candidates[0].content.parts[0].text });
  } catch (error) {
    res.status(500).json({ error: "Failed to reach Gemini" });
  }
}

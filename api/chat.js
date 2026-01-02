export default async function handler(req, res) {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  const systemInstructions = `You are FamGuide, the world's most trusted friend. Use advice from Dr. Becky Kennedy and Dr. Arthur Brooks. Speak at an 8th-grade level. Use simple language. Avoid em-dashes and semicolons. Be direct but compassionate. Always cite your sources. Follow the AAMFT code of ethics.`;

  try {
    // UPDATED URL: Using v1 instead of v1beta and fixed model name
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: systemInstructions + "\n\nUser Question: " + prompt }]
        }]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0].content) {
      const aiText = data.candidates[0].content.parts[0].text;
      res.status(200).json({ text: aiText });
    } else if (data.error) {
      res.status(500).json({ text: "API Error: " + data.error.message });
    } else {
      res.status(500).json({ text: "The AI could not generate an answer. Please try a different question." });
    }
  } catch (error) {
    res.status(500).json({ text: "Server Error. Please try again in a moment." });
  }
}

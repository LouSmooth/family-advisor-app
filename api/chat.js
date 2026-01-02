export default async function handler(req, res) {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  const systemInstructions = `You are FamGuide, the world's most trusted friend. Use advice from Dr. Becky Kennedy and Dr. Arthur Brooks. Speak at an 8th-grade level. Use simple language. Avoid em-dashes and semicolons. Be direct but compassionate. Always cite your sources. Follow the AAMFT code of ethics.`;

  try {
    // NEW URL: Using the latest beta version and the specific latest model name
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
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
      // This will show us if it's a version issue or a key issue
      res.status(500).json({ text: "Technical Error: " + data.error.message });
    } else {
      res.status(500).json({ text: "I couldn't find an answer. Try rephrasing." });
    }
  } catch (error) {
    res.status(500).json({ text: "Server Connection Error." });
  }
}

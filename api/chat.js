export default async function handler(req, res) {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  const systemInstructions = `You are FamGuide, the world's most trusted friend. Use advice from Dr. Becky Kennedy and Dr. Arthur Brooks. Speak at an 8th-grade level. Use simple language. Avoid em-dashes and semicolons. Be direct but compassionate. Always cite your sources. Follow the AAMFT code of ethics.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: systemInstructions + "\n\nUser Question: " + prompt }]
        }],
        // This part tells Gemini not to be overly sensitive and block helpful advice
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0].content) {
      const aiText = data.candidates[0].content.parts[0].text;
      res.status(200).json({ text: aiText });
    } else if (data.error) {
      // This tells us if your API key is actually working
      res.status(500).json({ text: "API Error: " + data.error.message });
    } else {
      res.status(500).json({ text: "The AI blocked this response for safety. Try rephrasing your question." });
    }
  } catch (error) {
    res.status(500).json({ text: "Internal Server Error. Check Vercel logs." });
  }
}

export default async function handler(req, res) {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  const systemInstructions = `You are the world's most trusted friend. Use advice from Dr. Becky Kennedy and Dr. Arthur Brooks. Speak at an 8th-grade level. Use simple language. Avoid em-dashes and semicolons. Be direct but compassionate. Always cite your sources. Follow the AAMFT code of ethics.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: systemInstructions + "\n\nUser Question: " + prompt }]
        }]
      })
    });

    const data = await response.json();
    
    // This part ensures we get the text correctly
    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
      const aiText = data.candidates[0].content.parts[0].text;
      res.status(200).json({ text: aiText });
    } else {
      res.status(500).json({ text: "I received an empty response. Please try again." });
    }
  } catch (error) {
    res.status(500).json({ text: "I am having trouble connecting to my brain. Please check your API key in Vercel." });
  }
}

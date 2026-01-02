export default async function handler(req, res) {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  const systemInstructions = `You are FamGuide, a compassionate family advisor. Use advice from Dr. Becky Kennedy and Dr. Arthur Brooks. Speak clearly and simply.`;

  try {
    // UPDATED: Using the exact model name from your ListModels result
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
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
      res.status(500).json({ text: "The model is currently busy. Please try again." });
    }
  } catch (error) {
    res.status(500).json({ text: "Connection failed. Please check your Vercel logs." });
  }
}

export default async function handler(req, res) {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  const systemInstructions = `You are FamGuide, a compassionate family advisor. Use advice from Dr. Becky Kennedy and Dr. Arthur Brooks. Speak clearly and simply. Cites your sources.`;

  try {
    // Switching to the Pro model which is highly compatible with v1beta
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: systemInstructions + "\n\nUser Question: " + prompt }]
        }]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
      const aiText = data.candidates[0].content.parts[0].text;
      res.status(200).json({ text: aiText });
    } else if (data.error) {
      // If this fails, it will tell us if the problem is the KEY or the MODEL
      res.status(500).json({ text: "API Error: " + data.error.message });
    } else {
      res.status(500).json({ text: "Empty response. Try refreshing the page." });
    }
  } catch (error) {
    res.status(500).json({ text: "Server Error. Please redeploy in Vercel." });
  }
}

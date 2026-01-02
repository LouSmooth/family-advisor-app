export default async function handler(req, res) {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    // URL change to v1 (stable) and model change to 1.0-pro
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: "You are FamGuide. Respond to this: " + prompt }]
        }]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0].content) {
      const aiText = data.candidates[0].content.parts[0].text;
      res.status(200).json({ text: aiText });
    } else if (data.error) {
      // This will now display the FULL error so we can see if it's a regional block
      res.status(500).json({ text: "API Error (" + data.error.code + "): " + data.error.message });
    } else {
      res.status(500).json({ text: "The AI is not responding. Check your Google AI Studio billing/plan." });
    }
  } catch (error) {
    res.status(500).json({ text: "Network Error." });
  }
}

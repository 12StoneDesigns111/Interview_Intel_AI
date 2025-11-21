import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { query } = req.body || {};
  if (!query) return res.status(400).json({ error: 'Missing query' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });

  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are an expert Personal Company Research Assistant for job interviews. Return a valid JSON object only.`;
    const userPrompt = `Research this company: "${query}". Ensure data is up-to-date using Google Search.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }
      ],
      config: { tools: [{ googleSearch: {} }] },
    });

    const text = response.text || '{}';
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

    let report;
    try {
      report = JSON.parse(jsonString);
    } catch (err) {
      console.error('Failed to parse JSON from Gemini response', text);
      return res.status(500).json({ error: 'Failed to parse generator response' });
    }

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk) => chunk.web)
      .filter((web) => web?.uri && web?.title) || [];

    return res.status(200).json({ report, sources });
  } catch (err) {
    console.error('Gemini API Error:', err);
    return res.status(500).json({ error: err?.message || 'Failed to generate report' });
  }
}

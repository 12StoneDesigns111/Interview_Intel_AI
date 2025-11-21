import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
if (!apiKey) {
  console.warn('GEMINI_API_KEY not set. Server will return errors for requests that need the API.');
}

const ai = new GoogleGenAI({ apiKey });

// Simple login endpoint - issues a JWT when correct password provided
app.post('/api/login', (req, res) => {
  const { password } = req.body || {};
  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.GEMINI_SESSION_SECRET || 'dev-session-secret';

  if (!adminPassword) return res.status(500).json({ error: true, message: 'Server not configured for login' });
  if (!password) return res.status(400).json({ error: true, message: 'Missing password' });
  if (password !== adminPassword) return res.status(401).json({ error: true, message: 'Invalid credentials' });

  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ user: 'admin' }, sessionSecret, { expiresIn: '2h' });
  return res.json({ error: false, token });
});

// Middleware to verify JWT token for protected routes
function verifyTokenMiddleware(req, res, next) {
  const auth = req.headers['authorization'];
  const sessionSecret = process.env.GEMINI_SESSION_SECRET || 'dev-session-secret';
  if (!auth || !String(auth).startsWith('Bearer ')) return res.status(401).json({ error: true, message: 'Missing auth token' });
  const token = String(auth).split(' ')[1];
  try {
    const jwt = require('jsonwebtoken');
    jwt.verify(token, sessionSecret);
    return next();
  } catch (err) {
    return res.status(401).json({ error: true, message: 'Invalid or expired token' });
  }
}

app.post('/api/report', verifyTokenMiddleware, async (req, res) => {
  const { query } = req.body || {};
  if (!query) return res.status(400).json({ error: true, message: 'Missing query' });

  try {
    const systemPrompt = `
      You are an expert Personal Company Research Assistant for job interviews.
      Your goal is to research the provided company and return a comprehensive briefing.
      You MUST return the response as a VALID JSON object. Do not include markdown formatting around the JSON. Just return the raw JSON string.
    `;

    const userPrompt = `Research this company: "${query}". Ensure data is up-to-date using Google Search.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }
      ],
      config: {
        tools: [{ googleSearch: {} }],
      },
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

  return res.json({ error: false, report, sources });

  } catch (error) {
    console.error('Gemini API Error:', error);
    // If the API returns structured error message, forward a friendly version
    const message = (error && error.message) ? error.message : 'Failed to generate report';
    return res.status(500).json({ error: true, message });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});

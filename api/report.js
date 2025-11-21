// Normalizes a raw AI response to the required CompanyReport structure
function normalizeToCompanyReport(raw) {
  if (!raw || typeof raw !== 'object') return null;
  // Try to map the most common fields
  return {
    companyName: raw.company_name || raw.companyName || '',
    identity: {
      pronunciation: raw.company_name || raw.companyName || '',
      structure: raw.parent_company ? `Subsidiary of ${raw.parent_company}` : 'Independent',
      industry: Array.isArray(raw.industry) ? raw.industry.join(', ') : (raw.industry || ''),
      history: raw.founding_date ? `Founded ${raw.founding_date} by ${Array.isArray(raw.founders) ? raw.founders.join(', ') : (raw.founders || '')}` : '',
      hq: raw.headquarters && typeof raw.headquarters === 'object'
        ? `${raw.headquarters.address || ''}, ${raw.headquarters.city || ''}, ${raw.headquarters.state || ''}, ${raw.headquarters.country || ''}`.replace(/^[,\s]+|[,\s]+$/g, '')
        : '',
      scale: raw.financials && raw.financials.number_of_employees ? `${raw.financials.number_of_employees} employees` : '',
    },
    operations: {
      products: Array.isArray(raw.key_products_and_services) ? raw.key_products_and_services.join(', ') : (raw.key_products_and_services || ''),
      customers: '',
      competitors: Array.isArray(raw.major_competitors)
        ? raw.major_competitors.map(name => ({ name, differentiation: '' }))
        : [],
      swot: {
        strengths: '',
        weaknesses: '',
        valueProp: '',
      },
    },
    culture: {
      mission: raw.mission_statement || '',
      reputation: '',
      insiderView: '',
    },
    recent: {
      news: Array.isArray(raw.recent_news_and_major_developments)
        ? raw.recent_news_and_major_developments.map(n => (typeof n === 'object' ? `${n.date ? n.date + ': ' : ''}${n.description || ''}` : n))
        : [],
      growth: '',
      announcements: '',
      awareness: '',
    },
    interview: {
      persona: '',
      themes: [],
      skills: [],
      edge: [],
    },
    cheatSheet: {
      bullets: [],
      fastFacts: [],
      impressStrategy: '',
    },
  };
}
import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { query } = req.body || {};
  if (!query) return res.status(400).json({ error: true, message: 'Missing query' });

  // Auth removed: public endpoint

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: true, message: 'Server missing GEMINI_API_KEY' });

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
      const raw = JSON.parse(jsonString);
      // If not in CompanyReport shape, normalize
      if (
        !raw.companyName &&
        (raw.company_name || raw.industry || raw.key_products_and_services)
      ) {
        report = normalizeToCompanyReport(raw);
      } else {
        report = raw;
      }
    } catch (err) {
      console.error('Failed to parse JSON from Gemini response', text);
      return res.status(500).json({ error: true, message: 'Failed to parse generator response' });
    }

    // Robust validation: check for all required fields
    const required = [
      'companyName', 'identity', 'operations', 'culture', 'recent', 'interview', 'cheatSheet'
    ];
    const missing = required.filter(key => !(report && typeof report === 'object' && key in report));
    const identityFields = ['pronunciation','structure','industry','history','hq','scale'];
    const operationsFields = ['products','customers','competitors','swot'];
    const swotFields = ['strengths','weaknesses','valueProp'];
    let missingDetails = [];
    if (report && report.identity) {
      missingDetails = identityFields.filter(f => !(f in report.identity));
    }
    if (report && report.operations) {
      missingDetails = missingDetails.concat(operationsFields.filter(f => !(f in report.operations)));
      if (report.operations.swot) {
        missingDetails = missingDetails.concat(swotFields.filter(f => !(f in report.operations.swot)));
      }
    }
    if (missing.length > 0 || missingDetails.length > 0) {
      return res.status(422).json({ error: true, message: `AI response missing fields: ${missing.concat(missingDetails).join(', ')}` });
    }

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk) => chunk.web)
      .filter((web) => web?.uri && web?.title) || [];

    return res.status(200).json({ error: false, report, sources });
  } catch (err) {
    console.error('Gemini API Error:', err);
    return res.status(500).json({ error: true, message: err?.message || 'Failed to generate report' });
  }
}

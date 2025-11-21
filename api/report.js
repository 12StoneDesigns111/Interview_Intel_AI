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

  const systemPrompt = `Act as my Personal Company Research Assistant for job interviews.\n\nEvery time I give you the name of a company OR a link to the company website, automatically research and summarize everything I need to know before an interview, organizing the data into these six specific categories.\n\nReturn ONLY a valid JSON object in the following exact structure, filling every field with detailed, up-to-date, and relevant information. If you don't know, make a best guess based on public info. Do not omit any fields.\n\n{\n  "companyName": string,\n  "identity": {\n    "pronunciation": string,\n    "structure": string,\n    "industry": string,\n    "history": string,\n    "hq": string,\n    "scale": string\n  },\n  "operations": {\n    "products": string,\n    "customers": string,\n    "competitors": [{ "name": string, "differentiation": string }],\n    "swot": { "strengths": string, "weaknesses": string, "valueProp": string }\n  },\n  "culture": {\n    "mission": string,\n    "reputation": string,\n    "insiderView": string\n  },\n  "recent": {\n    "news": [string],\n    "growth": string,\n    "announcements": string,\n    "awareness": string\n  },\n  "interview": {\n    "persona": string,\n    "themes": [string],\n    "skills": [string],\n    "edge": [string]\n  },\n  "cheatSheet": {\n    "bullets": [string],\n    "fastFacts": [string],\n    "impressStrategy": string\n  }\n}\n\nThe six categories are:\n1. Basic Identity: Pronunciation, Structure, Industry, History, HQ, Scale.\n2. Operations & Strategy: Products & Services, Target Customers, Competitors, SWOT (Strengths, Weaknesses, Value Prop).\n3. Culture & Values: Mission, Reputation, Insider View.\n4. Recent & Relevant: News, Growth, Announcements, Awareness.\n5. Interview Insights: Candidate Persona, Themes, Valued Skills, Edge (3-5 talking points).\n6. The Cheat Sheet: Bullets, Fast Facts, What I Should Say in the Interview to Impress Them.\n\nDo not return markdown, only valid JSON.`;
  const userPrompt = `Research this company: "${query}". Use Google Search for up-to-date info. Fill every field in the JSON structure above with detailed, relevant, and specific information for a job interview. Do not return markdown, only valid JSON.`;

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

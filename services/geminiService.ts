import { CompanyReport, SearchResult } from '../types';

// Client-side shim: call the server endpoint which keeps the real API key secret.
export const generateCompanyReport = async (companyNameOrUrl: string): Promise<SearchResult> => {
  const res = await fetch('/api/report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: companyNameOrUrl })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Server returned ${res.status}`);
  }

  const data = await res.json();
  // Expecting { report, sources }
  return data;
};
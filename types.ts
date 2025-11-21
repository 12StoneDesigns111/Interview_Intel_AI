export interface Competitor {
  name: string;
  differentiation: string;
}

export interface CompanyReport {
  companyName: string;
  identity: {
    pronunciation: string;
    structure: string;
    industry: string;
    history: string;
    hq: string;
    scale: string;
  };
  operations: {
    products: string;
    customers: string;
    competitors: Competitor[];
    swot: {
      strengths: string;
      weaknesses: string;
      valueProp: string;
    };
  };
  culture: {
    mission: string;
    reputation: string;
    insiderView: string;
  };
  recent: {
    news: string[];
    growth: string;
    announcements: string;
    awareness: string;
  };
  interview: {
    persona: string;
    themes: string[];
    skills: string[];
    edge: string[];
  };
  cheatSheet: {
    bullets: string[];
    fastFacts: string[];
    impressStrategy: string;
  };
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export interface SearchResult {
  report: CompanyReport | null;
  sources: GroundingSource[];
}
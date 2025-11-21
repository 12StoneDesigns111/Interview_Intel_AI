import React, { useState } from 'react';
import { CompanyReport, GroundingSource } from '../types';
import cleanText from '../utils/cleanText';
import { Card } from './Card';
import FastFacts from './FastFacts';
import { ExternalLink } from 'lucide-react';


interface DashboardProps {
  data: CompanyReport;
  sources: GroundingSource[];
}

export const Dashboard: React.FC<DashboardProps> = ({ data, sources }) => {
  const [focusedSection, setFocusedSection] = useState<'all' | 'none' | string>('all');

  const sections = [
    { id: 'identity', label: 'Identity' },
    { id: 'operations', label: 'Operations & Strategy' },
    { id: 'culture', label: 'Culture & Values' },
    { id: 'recent', label: 'Recent Intel' },
    { id: 'interview', label: 'Interview Insights' },
    { id: 'cheat', label: 'Cheat Sheet' },
  ];
  // Defensive: check for required fields
  if (!data || !data.identity || !data.operations || !data.culture || !data.recent || !data.interview || !data.cheatSheet) {
    // Retry button: calls window.location.reload() to reset the app state
    return (
      <div className="w-full max-w-2xl mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center animate-fade-in">
        <h2 className="text-2xl font-bold mb-2">Incomplete or Invalid Report</h2>
        <p className="mb-2">Sorry, the AI response was missing required information.<br />
          <span className="text-slate-700">This sometimes happens if the company is obscure or the AI is overloaded.</span>
        </p>
        <button
          className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow transition-colors"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
        <div className="mt-4 text-xs text-left bg-white/70 p-2 rounded text-rose-700 overflow-auto max-h-40">
          <strong>Debug info:</strong>
          <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
        </div>
        <div className="mt-4 text-sm text-slate-600">
          <span>If this keeps happening, try a different company name or come back later.</span>
        </div>
      </div>
    );
  }

  return (
  <div className="w-full max-w-7xl mx-auto space-y-6 pb-20 px-2 sm:px-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight break-words">{data.companyName}</h2>
        <div className="flex flex-wrap items-center justify-center gap-2 text-slate-500 text-xs sm:text-sm">
          <span className="px-2 sm:px-3 py-1 bg-slate-100 rounded-full font-medium">{data.identity.industry}</span>
          <span>•</span>
          <span>{data.identity.hq}</span>
        </div>
      </div>
      {/* Fast Facts ribbon */}
      <div className="mt-4">
        <FastFacts facts={data.cheatSheet.fastFacts} />
      </div>

      {/* 3-Column Intelligence Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Column 1: Company Profile */}
        <div className="space-y-4">
          <Card title="Identity">
            <div style={{ lineHeight: 1.6 }}>
              <div className="text-sm font-medium text-slate-700">{cleanText(data.identity.pronunciation)}</div>
              <div className="text-sm text-slate-600 mt-2"><strong>Structure:</strong> {cleanText(data.identity.structure)}</div>
              <div className="text-sm text-slate-600 mt-1"><strong>Scale:</strong> {cleanText(data.identity.scale)}</div>
              <div className="text-sm text-slate-600 mt-1"><strong>HQ:</strong> {cleanText(data.identity.hq)}</div>
              <div className="text-sm text-slate-600 mt-2">{cleanText(data.identity.history)}</div>
            </div>
          </Card>

          <Card title="Mission & Values">
            <div style={{ lineHeight: 1.6 }}>
              <p className="italic text-slate-700">"{cleanText(data.culture.mission)}"</p>
              <div className="mt-3 text-sm text-slate-600"><strong>Values:</strong> {cleanText(data.culture.reputation)}</div>
              <div className="mt-2 text-sm text-slate-600">{cleanText(data.culture.insiderView)}</div>
            </div>
          </Card>
        </div>

        {/* Column 2: Intel Feed */}
        <div className="space-y-4">
          <Card title="Operations & Strategy" collapsible defaultOpen>
            <div style={{ lineHeight: 1.6 }}>
              <div className="mb-3">
                <div className="text-xs font-semibold text-slate-500 uppercase">Products & Services</div>
                <div className="text-sm text-slate-700">{cleanText(data.operations.products)}</div>
              </div>
              <div className="mb-3">
                <div className="text-xs font-semibold text-slate-500 uppercase">Target Customer</div>
                <div className="text-sm text-slate-700">{cleanText(data.operations.customers)}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Competitive Landscape</div>
                <div className="space-y-2">
                  {data.operations.competitors.map((c, i) => (
                    <div key={i} className="bg-slate-50 rounded p-3 border border-slate-100">
                      <div className="font-semibold text-sm text-slate-800">{cleanText(c.name)}</div>
                      <div className="text-sm text-slate-600 mt-1">{cleanText(c.differentiation)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card title="Recent Intel" collapsible defaultOpen>
            <div style={{ lineHeight: 1.6 }}>
              <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Latest News</div>
              <ul className="space-y-2">
                {data.recent.news.map((news, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="text-amber-500">•</span>
                    <div>{cleanText(news)}</div>
                  </li>
                ))}
              </ul>
              <div className="mt-3 text-sm text-slate-600"><strong>Growth:</strong> {cleanText(data.recent.growth)}</div>
              <div className="mt-1 text-sm text-slate-600"><strong>Announcements:</strong> {cleanText(data.recent.announcements)}</div>
            </div>
          </Card>
        </div>

        {/* Column 3: Strategy & Tips */}
        <div className="space-y-4">
          <Card title="Ideal Persona">
            <div style={{ lineHeight: 1.6 }} className="text-sm text-slate-700">{cleanText(data.interview.persona)}</div>
          </Card>

          <Card title="Valued Skills">
            <div className="flex flex-wrap gap-2">
              {data.interview.skills.map((s, i) => (
                <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{cleanText(s)}</span>
              ))}
            </div>
          </Card>

          <Card title="What to Say to Impress Them" accent accentColor="border-emerald-400" collapsible defaultOpen>
            <div style={{ lineHeight: 1.8 }} className="text-sm text-slate-700 whitespace-pre-line">
              {cleanText(data.cheatSheet.impressStrategy)}
            </div>
          </Card>

          <Card title="Talking Points" className="" collapsible defaultOpen>
            <ul className="space-y-2">
              {data.interview.edge.map((point, i) => (
                <li key={i} className="text-sm text-slate-700 flex gap-2 items-start">
                  <span className="text-emerald-500 font-bold">•</span>
                  <div>{cleanText(point)}</div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* Sources Footer */}
      {sources.length > 0 && (
        <div className="border-t border-slate-200 pt-8 mt-8">
          <h4 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Research Sources</h4>
          <div className="flex flex-wrap gap-3">
            {sources.map((source, idx) => (
              <a
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                <ExternalLink size={10} />
                {source.title || new URL(source.uri || '').hostname}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Component for consistent rows
const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{label}</h4>
    <p className="text-sm font-medium text-slate-700">{value}</p>
  </div>
);
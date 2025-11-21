import React, { useState } from 'react';
import { CompanyReport, GroundingSource } from '../types';
import { ReportSection } from './ReportSection';
import { 
  Building2, 
  Target, 
  Heart, 
  Newspaper, 
  Briefcase, 
  Zap, 
  CheckCircle2,
  ExternalLink,
  Swords
} from 'lucide-react';


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
  <div className="w-full max-w-7xl mx-auto space-y-8 pb-20 px-2 sm:px-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight break-words">{data.companyName}</h2>
        <div className="flex flex-wrap items-center justify-center gap-2 text-slate-500 text-xs sm:text-sm">
          <span className="px-2 sm:px-3 py-1 bg-slate-100 rounded-full font-medium">{data.identity.industry}</span>
          <span>•</span>
          <span>{data.identity.hq}</span>
        </div>
      </div>

      {/* Controls: dropdown + collapse/expand */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 mr-1">View:</label>
          <select
            value={focusedSection}
            onChange={(e) => setFocusedSection(e.target.value)}
            className="text-sm rounded-md border border-slate-200 bg-white px-3 py-1"
          >
            <option value="all">All Sections</option>
            <option value="none">Collapse All</option>
            {sections.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setFocusedSection('all')} className="text-sm px-3 py-1 rounded bg-slate-100 hover:bg-slate-200">Expand All</button>
          <button onClick={() => setFocusedSection('none')} className="text-sm px-3 py-1 rounded bg-slate-100 hover:bg-slate-200">Collapse All</button>
        </div>
      </div>

      {/* Grid Layout */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 xl:gap-8 mt-4">
        {/* 1. Identity */}
        <ReportSection id="identity" collapsible={true} forceOpen={focusedSection === 'all' ? true : (focusedSection === 'none' ? false : focusedSection === 'identity')} title="Identity" icon={Building2} colorClass="text-indigo-600" bgClass="bg-indigo-50/50">
          <InfoRow label="Pronunciation" value={data.identity.pronunciation} />
          <InfoRow label="Structure" value={data.identity.structure} />
          <InfoRow label="Scale" value={data.identity.scale} />
          <InfoRow label="History" value={data.identity.history} />
          <InfoRow label="HQ" value={data.identity.hq} />
        </ReportSection>

        {/* 2. Operations */}
        <ReportSection id="operations" collapsible={true} forceOpen={focusedSection === 'all' ? true : (focusedSection === 'none' ? false : focusedSection === 'operations')} title="Operations & Strategy" icon={Target} colorClass="text-blue-600" bgClass="bg-blue-50/50">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Products & Services</h4>
              <p className="text-sm leading-relaxed">{data.operations.products}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Target Customer</h4>
              <p className="text-sm leading-relaxed">{data.operations.customers}</p>
            </div>
             <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                <Swords size={14} /> Competitive Landscape
              </h4>
              <div className="space-y-3">
                {data.operations.competitors.map((c, i) => (
                  <div key={i} className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm">
                    <div className="font-semibold text-sm text-slate-800 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                       {c.name}
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed pl-3.5 border-l border-slate-100 ml-0.5">
                      {c.differentiation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-1">SWOT Snippet</h4>
              <ul className="text-sm space-y-1 text-slate-700">
                 <li><strong className="text-blue-700">Strength:</strong> {data.operations.swot.strengths}</li>
                 <li><strong className="text-red-600">Weakness:</strong> {data.operations.swot.weaknesses}</li>
                 <li><strong className="text-emerald-600">Value:</strong> {data.operations.swot.valueProp}</li>
              </ul>
            </div>
          </div>
        </ReportSection>

        {/* 3. Culture */}
        <ReportSection id="culture" collapsible={true} forceOpen={focusedSection === 'all' ? true : (focusedSection === 'none' ? false : focusedSection === 'culture')} title="Culture & Values" icon={Heart} colorClass="text-rose-600" bgClass="bg-rose-50/50">
          <div className="space-y-4">
             <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Mission & Vision</h4>
              <p className="text-sm italic text-slate-600 border-l-2 border-rose-200 pl-3">"{data.culture.mission}"</p>
            </div>
             <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Market Reputation</h4>
              <p className="text-sm">{data.culture.reputation}</p>
            </div>
             <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Insider View</h4>
              <p className="text-sm">{data.culture.insiderView}</p>
            </div>
          </div>
        </ReportSection>

        {/* 4. Recent & Relevant */}
        <ReportSection id="recent" collapsible={true} forceOpen={focusedSection === 'all' ? true : (focusedSection === 'none' ? false : focusedSection === 'recent')} title="Recent Intel" icon={Newspaper} colorClass="text-amber-600" bgClass="bg-amber-50/50">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Latest News</h4>
              <ul className="space-y-2">
                {data.recent.news.map((news, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="text-amber-500 shrink-0">•</span>
                    <span>{news}</span>
                  </li>
                ))}
              </ul>
            </div>
            <InfoRow label="Recent Growth" value={data.recent.growth} />
            <InfoRow label="Key Announcements" value={data.recent.announcements} />
            <InfoRow label="Awareness" value={data.recent.awareness} />
          </div>
        </ReportSection>

        {/* 5. Interview Insights */}
        <ReportSection id="interview" collapsible={true} forceOpen={focusedSection === 'all' ? true : (focusedSection === 'none' ? false : focusedSection === 'interview')} title="Interview Insights" icon={Briefcase} colorClass="text-emerald-600" bgClass="bg-emerald-50/50" className="md:col-span-2 lg:col-span-1">
          <div className="space-y-4">
             <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Ideal Persona</h4>
              <p className="text-sm">{data.interview.persona}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Theme Watch</h4>
              <div className="flex flex-wrap gap-2">
                 {data.interview.themes.map((t, i) => (
                  <span key={i} className="text-xs bg-emerald-50 text-emerald-800 px-2 py-1 rounded border border-emerald-100">{t}</span>
                ))}
              </div>
            </div>
            <div>
               <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Valued Skills</h4>
               <div className="flex flex-wrap gap-2">
                 {data.interview.skills.map((s, i) => (
                  <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{s}</span>
                ))}
              </div>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">Your Edge (Talking Points)</h4>
              <ul className="space-y-2">
                {data.interview.edge.map((point, i) => (
                   <li key={i} className="flex gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ReportSection>

        {/* 6. The Cheat Sheet (sticky sidebar on wide screens) */}
        <div className="md:col-span-2 lg:col-span-3 xl:col-span-3 mt-4 xl:mt-0 xl:sticky xl:top-28 h-fit">
          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl shadow-2xl overflow-hidden text-white border border-violet-200/30">
            <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-white/10 flex flex-col sm:flex-row items-center gap-3">
               <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                  <Zap size={24} className="text-yellow-300" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-bold text-lg sm:text-2xl">The Cheat Sheet</h3>
                  <p className="text-indigo-200 text-xs sm:text-sm">Your last-minute review guide</p>
                </div>
            </div>
            <div className="p-4 sm:p-8 space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-3">Fast Facts</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.cheatSheet.fastFacts.map((fact, i) => (
                    <li key={i} className="bg-white/10 rounded px-3 py-2 text-sm font-medium backdrop-blur-sm border border-white/5">
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-3">Key Takeaways</h4>
                 <ul className="space-y-2">
                  {data.cheatSheet.bullets.map((bullet, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed text-indigo-50">
                      <span className="text-yellow-300 font-bold">•</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white text-slate-900 rounded-xl p-4 sm:p-6 shadow-lg">
                 <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-violet-600 mb-3 flex items-center gap-2">
                   What to Say to Impress Them
                 </h4>
                 <p className="text-xs sm:text-sm leading-6 sm:leading-7 text-slate-700 whitespace-pre-line">
                   {data.cheatSheet.impressStrategy}
                 </p>
              </div>
            </div>
          </div>
        </div>
        {/* small anchor: allow focusing via select */}

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
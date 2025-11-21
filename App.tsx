import React, { useState, useEffect } from 'react';
import { Search, Sparkles, ArrowRight, Briefcase } from 'lucide-react';
import ThemeToggle from './components/ThemeToggle';
import { generateCompanyReport } from './services/geminiService';
import { Dashboard } from './components/Dashboard';
import { Spinner } from './components/Spinner';
import { CompanyReport, GroundingSource } from './types';
// import { Login } from './components/Login';

const App: React.FC = () => {
  const isDev = (import.meta as any)?.env?.DEV;
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<CompanyReport | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setReport(null);
    setSources([]);
    setHasSearched(true);

    try {
      const { report: data, sources: sourceData } = await generateCompanyReport(query);
      setReport(data);
      setSources(sourceData);
    } catch (err: any) {
      const msg = err?.message || "An unexpected error occurred while researching.";
      setError(msg);
      // In dev, also log full error for debugging
      if (isDev) {
        console.error('Search error details:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const exampleCompanies = ["Google", "Airbnb", "SpaceX", "McKinsey & Company"];



  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="glassmorphism border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600">
            <Briefcase className="h-6 w-6" />
            <span className="font-bold text-lg tracking-tight text-slate-900">Interview Intel AI</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full border border-slate-300">Powered by Gemini 2.5</div>
            <ThemeToggle />
          </div>
          {/* No logout button, auth removed */}
        </div>
      </header>

      <main className="flex-grow flex flex-col">
        {/* Hero / Search Section */}
        <div className={`transition-all duration-500 ease-in-out ${report ? 'py-10 bg-white border-b border-slate-200' : 'flex-grow flex flex-col justify-center items-center py-20'}`}>
          <div className="w-full max-w-2xl px-4 space-y-8 text-center">
            
            {!report && !loading && (
              <div className="space-y-4 animate-fade-in">
                <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent tracking-tight leading-tight">
                  Win the Interview <br/>
                  <span className="text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text">Before You Walk In.</span>
                </h1>
                <p className="text-base xs:text-lg text-slate-600 max-w-lg mx-auto leading-snug">
                  Automated deep-dive research on any company. Get culture, strategy, and interview cheat sheets in seconds.
                </p>
              </div>
            )}

            <form onSubmit={handleSearch} className="relative group">
              <div className={`absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl opacity-20 group-hover:opacity-40 transition duration-200 ${loading ? 'animate-pulse' : ''}`}></div>
              <div className="relative flex items-center">
                <div className="absolute left-3 sm:left-4 text-slate-400 pointer-events-none">
                  <Search size={18} className="sm:w-5 sm:h-5" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter company name (e.g., Netflix) or website URL..."
                  className="w-full bg-white border-0 rounded-xl py-4 sm:py-5 pl-10 sm:pl-12 pr-24 sm:pr-32 shadow-lg focus:shadow-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-base sm:text-lg"
                  disabled={loading}
                />
                <div className="absolute right-1 sm:right-2">
                  <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-base sm:text-lg"
                  >
                    {loading ? <Spinner /> : <><Sparkles size={16} /> Research</>}
                  </button>
                </div>
              </div>
            </form>

            {!report && !loading && (
              <div className="pt-4">
                 <p className="text-xs text-slate-400 font-medium mb-3 uppercase tracking-wide">Popular Searches</p>
                 <div className="flex flex-wrap justify-center gap-2">
                   {exampleCompanies.map(company => (
                     <button 
                      key={company}
                      onClick={() => setQuery(company)}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white border border-slate-200 shadow-sm rounded-full text-xs sm:text-sm text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                     >
                       {company}
                     </button>
                   ))}
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex-grow flex flex-col items-center justify-center p-12 space-y-6">
            <div className="w-16 h-16 relative">
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Analyzing {query}...</h3>
              <p className="text-slate-500">Gathering intelligence on culture, strategy, and recent news.</p>
            </div>
            <div className="max-w-sm w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 animate-progress origin-left w-full"></div>
            </div>
            
            {/* Simulated loading steps for UX */}
            <div className="space-y-2 text-sm text-slate-400 pt-4">
               <div className="flex items-center gap-2 animate-pulse">
                 <ArrowRight size={14} /> Scanning public records...
               </div>
               <div className="flex items-center gap-2 animate-pulse delay-75">
                 <ArrowRight size={14} /> Checking recent news...
               </div>
               <div className="flex items-center gap-2 animate-pulse delay-150">
                 <ArrowRight size={14} /> Synthesizing interview themes...
               </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-center">
            <p className="font-medium">{error}</p>
            <button 
              onClick={() => handleSearch({ preventDefault: () => {} } as React.FormEvent)}
              className="mt-2 text-sm underline hover:text-red-800"
            >
              Try Again
            </button>
            {isDev && (
              <pre className="mt-3 text-xs text-left bg-white/50 p-2 rounded max-h-40 overflow-auto text-rose-700">{String(error)}</pre>
            )}
          </div>
        )}

        {/* Report View */}
        {report && !loading && (
          <div className="flex-grow px-4 py-8">
            <Dashboard data={report} sources={sources} />
          </div>
        )}
      </main>

      {/* CSS Animations */}
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(-20%); }
          100% { transform: translateX(0%); }
        }
        .animate-progress {
          animation: progress 4s ease-out infinite;
        }
      `}</style>
    </div>
  );
};

export default App;

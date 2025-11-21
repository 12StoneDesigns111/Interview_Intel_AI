import React from 'react';
import { Trophy, Users, BarChart2 } from 'lucide-react';

interface FastFactsProps {
  facts: string[];
}

export const FastFacts: React.FC<FastFactsProps> = ({ facts }) => {
  // Expect up to 3 quick metrics; fall back gracefully
  const slots = [
    { icon: <BarChart2 size={18} />, label: facts[0] || 'Revenue' },
    { icon: <Users size={18} />, label: facts[1] || 'Headcount' },
    { icon: <Trophy size={18} />, label: facts[2] || 'Stock' },
  ];

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto">
        {slots.map((s, i) => (
          <div key={i} className="flex items-center gap-3 min-w-[10rem]">
            <div className="p-2 rounded-md bg-white/60 dark:bg-slate-800/60 shadow-sm">
              {s.icon}
            </div>
            <div>
              <div className="text-xs text-slate-500">Fast Fact</div>
              <div className="font-semibold text-sm text-slate-800 dark:text-slate-100 leading-tight">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FastFacts;

import React, { ReactNode, useState, useEffect } from 'react';
import { LucideIcon, ChevronDown } from 'lucide-react';

interface ReportSectionProps {
  title: string;
  icon: LucideIcon;
  colorClass: string; // e.g., text-blue-600
  bgClass: string;   // e.g., bg-blue-50
  children: ReactNode;
  className?: string;
  collapsible?: boolean;
  forceOpen?: boolean | null; // if set, forces open state (used for global expand/collapse)
  id?: string;
}

export const ReportSection: React.FC<ReportSectionProps> = ({ 
  title, 
  icon: Icon, 
  colorClass, 
  bgClass, 
  children,
  className = "",
  collapsible = true,
  forceOpen = null,
  id,
}) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (typeof forceOpen === 'boolean') setOpen(forceOpen);
  }, [forceOpen]);

  const toggle = () => setOpen((v) => !v);

  return (
    <section id={id} className={`group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className} ${collapsible ? 'cursor-pointer' : ''}`}>
      <div className={`px-3 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex items-center gap-2 sm:gap-3 ${bgClass}`}>
        <div className={`p-2 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm ${colorClass}`}>
          <Icon size={18} className="sm:w-5 sm:h-5" />
        </div>
        <h3 className={`font-bold text-base sm:text-lg ${colorClass} flex-1`}>{title}</h3>
        {collapsible && (
          <button onClick={toggle} aria-label={open ? 'Collapse' : 'Expand'} className="p-1 rounded hover:bg-slate-100/50">
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
      <div
        className={`p-3 sm:p-6 text-slate-700 transition-all duration-300 overflow-hidden ${
          !collapsible ? 'max-h-[2000px]' : (open ? 'max-h-[2000px]' : 'max-h-0 group-hover:max-h-[2000px]')
        }`}
      >
        {/* Layout children horizontally on larger screens */}
        <div className="section-body flex flex-col md:flex-row md:flex-wrap gap-4">
          {React.Children.toArray(children).map((child, idx) => (
            <div key={idx} className="w-full md:w-1/2 lg:w-1/3 flex-1 min-w-0">
              {child}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

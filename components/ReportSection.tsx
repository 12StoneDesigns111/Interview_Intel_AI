import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface ReportSectionProps {
  title: string;
  icon: LucideIcon;
  colorClass: string; // e.g., text-blue-600
  bgClass: string;   // e.g., bg-blue-50
  children: ReactNode;
  className?: string;
}

export const ReportSection: React.FC<ReportSectionProps> = ({ 
  title, 
  icon: Icon, 
  colorClass, 
  bgClass, 
  children,
  className = "" 
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
      <div className={`px-3 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex items-center gap-2 sm:gap-3 ${bgClass}`}>
        <div className={`p-2 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm ${colorClass}`}>
          <Icon size={18} className="sm:w-5 sm:h-5" />
        </div>
        <h3 className={`font-bold text-base sm:text-lg ${colorClass}`}>{title}</h3>
      </div>
      <div className="p-3 sm:p-6 text-slate-700 space-y-3 sm:space-y-4">
        {children}
      </div>
    </div>
  );
};

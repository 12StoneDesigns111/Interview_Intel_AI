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
      <div className={`px-6 py-4 border-b border-slate-100 flex items-center gap-3 ${bgClass}`}>
        <div className={`p-2 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm ${colorClass}`}>
          <Icon size={20} />
        </div>
        <h3 className={`font-bold text-lg ${colorClass}`}>{title}</h3>
      </div>
      <div className="p-6 text-slate-700 space-y-4">
        {children}
      </div>
    </div>
  );
};

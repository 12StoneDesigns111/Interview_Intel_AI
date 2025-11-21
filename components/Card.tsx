import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface CardProps {
  title?: string;
  accent?: boolean;
  accentColor?: string; // e.g., 'border-amber-400'
  children?: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  accent = false,
  accentColor = 'border-amber-400',
  children,
  className = '',
  collapsible = false,
  defaultOpen = true,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  const toggle = () => setOpen((v) => !v);

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-0 overflow-hidden ${className}`}
      style={{ minWidth: '12rem', wordBreak: 'normal', overflowWrap: 'normal', hyphens: 'none' }}
    >
      {title && (
        <div className={`px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between gap-3 ${accent ? '' : ''}`}>
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{title}</h3>
          </div>
          {collapsible && (
            <button aria-label={open ? 'Collapse' : 'Expand'} onClick={toggle} className="p-1 rounded hover:bg-slate-100/50 dark:hover:bg-slate-700/50">
              <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      )}

      <div className={`${accent ? `border-l-4 pl-3 ${accentColor}` : 'p-4'}` + (collapsible ? '' : '')}>
        <div className={`transition-all duration-300 overflow-hidden ${collapsible ? (open ? 'max-h-[2000px] p-4' : 'max-h-0 p-0') : ''}`}>
          {!collapsible ? <div className="p-4">{children}</div> : open ? <div>{children}</div> : null}
        </div>
      </div>
    </div>
  );
};

export default Card;

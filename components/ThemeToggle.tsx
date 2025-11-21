import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const THEME_KEY = 'iiai_theme';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) return saved === 'dark';
    } catch (e) {}
    // default to system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) html.classList.add('dark'); else html.classList.remove('dark');
    try { localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light'); } catch (e) {}
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark((v) => !v)}
      aria-label="Toggle dark mode"
      className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
    >
      {isDark ? <Sun className="w-5 h-5 text-yellow-300" /> : <Moon className="w-5 h-5 text-slate-600" />}
    </button>
  );
};

export default ThemeToggle;

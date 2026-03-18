'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = {
  bg: string;
  card: string;
  border: string;
  accent: string;
};

const defaultTheme: Theme = {
  bg: '#e2e8f0',
  card: '#f8fafc',
  border: 'rgba(0, 0, 0, 0.08)',
  accent: '#334155',
};

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: defaultTheme,
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('venture-os-theme');
      return savedTheme ? JSON.parse(savedTheme) : defaultTheme;
    }
    return defaultTheme;
  });

  useEffect(() => {
    document.documentElement.style.setProperty('--bg-color', theme.bg);
    document.documentElement.style.setProperty('--card-color', theme.card);
    document.documentElement.style.setProperty('--border-color', theme.border);
    document.documentElement.style.setProperty('--accent-color', theme.accent);
    localStorage.setItem('venture-os-theme', JSON.stringify(theme));
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

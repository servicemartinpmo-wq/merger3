'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = {
  bg: string;
  card: string;
  border: string;
  accent: string;
  wallpaper?: string;
};

const defaultTheme: Theme = {
  bg: '#000000',
  card: '#18181b',
  border: 'rgba(255, 255, 255, 0.1)',
  accent: '#3b82f6',
  wallpaper: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=3840&auto=format&fit=crop',
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
    if (theme.wallpaper) {
      document.documentElement.style.setProperty('--wallpaper', `url(${theme.wallpaper})`);
    }
    localStorage.setItem('venture-os-theme', JSON.stringify(theme));
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

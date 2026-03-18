'use client';

import { useState } from 'react';
import { useTheme } from './theme-provider';
import { Palette, X } from 'lucide-react';

export function ThemeCustomizer() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const presets = [
    { name: 'Showroom', bg: '#e2e8f0', card: '#f8fafc', border: 'rgba(0, 0, 0, 0.08)', accent: '#334155' },
    { name: 'Ocean', bg: '#e0f2fe', card: '#f0f9ff', border: 'rgba(14, 165, 233, 0.2)', accent: '#0369a1' },
    { name: 'Forest', bg: '#dcfce7', card: '#f0fdf4', border: 'rgba(34, 197, 94, 0.2)', accent: '#15803d' },
    { name: 'Warm', bg: '#fef3c7', card: '#fffbeb', border: 'rgba(245, 158, 11, 0.2)', accent: '#b45309' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[300]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-slate-900 text-white rounded-full shadow-2xl hover:scale-110 transition-transform"
      >
        <Palette size={24} />
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 bg-white p-6 rounded-3xl shadow-2xl border border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg">Customize Theme</h3>
            <button onClick={() => setIsOpen(false)}><X size={18} /></button>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Presets</label>
            <div className="grid grid-cols-3 gap-2">
              {presets.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setTheme(p)}
                  className="h-12 rounded-xl border border-slate-200"
                  style={{ backgroundColor: p.bg }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Custom Colors</label>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(theme).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-500">{key}</label>
                  <input
                    type="color"
                    value={value.startsWith('rgba') ? '#000000' : value}
                    onChange={(e) => setTheme({ ...theme, [key]: e.target.value })}
                    className="w-full h-8 rounded-lg cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

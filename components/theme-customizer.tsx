'use client';

import { useState } from 'react';
import { useTheme } from './theme-provider';
import { Palette, X } from 'lucide-react';

export function ThemeCustomizer() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const presets = [
    { name: 'Midnight', bg: '#000000', card: '#18181b', border: 'rgba(255, 255, 255, 0.1)', accent: '#3b82f6' },
    { name: 'Slate', bg: '#0f172a', card: '#1e293b', border: 'rgba(255, 255, 255, 0.1)', accent: '#0ea5e9' },
    { name: 'Emerald', bg: '#064e3b', card: '#065f46', border: 'rgba(255, 255, 255, 0.1)', accent: '#10b981' },
    { name: 'Deep Purple', bg: '#2e1065', card: '#4c1d95', border: 'rgba(255, 255, 255, 0.1)', accent: '#8b5cf6' },
    { name: 'Rose', bg: '#4c0519', card: '#881337', border: 'rgba(255, 255, 255, 0.1)', accent: '#f43f5e' },
    { name: 'Amber', bg: '#451a03', card: '#78350f', border: 'rgba(255, 255, 255, 0.1)', accent: '#f59e0b' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[300]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-white/10 backdrop-blur-md text-white rounded-full shadow-2xl hover:scale-110 transition-transform border border-white/20"
      >
        <Palette size={24} />
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 bg-slate-900/90 backdrop-blur-xl p-8 rounded-[32px] shadow-2xl border border-white/10 space-y-8 text-white">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-light">Theme Customizer</h3>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={18} /></button>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 font-bold">Presets</label>
            <div className="grid grid-cols-3 gap-3">
              {presets.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setTheme(p)}
                  className="group relative h-16 rounded-2xl border border-white/10 overflow-hidden transition-all hover:scale-105"
                  style={{ backgroundColor: p.bg }}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <span className="text-[8px] font-mono uppercase tracking-widest">{p.name}</span>
                  </div>
                  <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full" style={{ backgroundColor: p.accent }} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 font-bold">Wallpapers</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=3840&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=3840&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=3840&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=3840&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=3840&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=3840&auto=format&fit=crop',
              ].map((w) => (
                <button
                  key={w}
                  onClick={() => setTheme({ ...theme, wallpaper: w })}
                  className="h-20 rounded-2xl border border-white/10 bg-cover bg-center transition-all hover:scale-105"
                  style={{ backgroundImage: `url(${w})` }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 font-bold">Custom Colors</label>
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(theme).map(([key, value]) => {
                if (key === 'wallpaper') return null;
                return (
                  <div key={key} className="space-y-2">
                    <label className="text-[10px] uppercase text-white/60 font-mono tracking-widest">{key}</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={value.startsWith('rgba') ? '#000000' : value}
                        onChange={(e) => setTheme({ ...theme, [key]: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-none"
                      />
                      <span className="text-[10px] font-mono text-white/40">{value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

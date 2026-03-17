'use client';

import { motion } from 'framer-motion';
import { Palette, User, Building, Briefcase, HeartPulse, Rocket } from 'lucide-react';
import type { IndustryMode } from './lockscreen-banner';

interface IndustryModeSwitcherProps {
  currentMode: IndustryMode;
  onModeChange: (mode: IndustryMode) => void;
}

const modes: { id: IndustryMode; label: string; icon: any }[] = [
  { id: 'creative', label: 'Creative', icon: Palette },
  { id: 'freelancer', label: 'Freelancer', icon: User },
  { id: 'SMB', label: 'SMB', icon: Building },
  { id: 'executive', label: 'Executive', icon: Briefcase },
  { id: 'healthcare', label: 'Healthcare', icon: HeartPulse },
  { id: 'start-up', label: 'Start-up', icon: Rocket },
];

export function IndustryModeSwitcher({ currentMode, onModeChange }: IndustryModeSwitcherProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm">
      <span className="text-xs font-mono uppercase tracking-widest text-slate-400 mr-2">Switch Industry Mode</span>
      <div className="flex flex-wrap gap-1">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? 'text-slate-900' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-mode"
                  className="absolute inset-0 bg-white shadow-sm border border-slate-200 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon size={14} />
                {mode.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

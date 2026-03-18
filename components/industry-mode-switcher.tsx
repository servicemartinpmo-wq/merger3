'use client';

import { motion } from 'framer-motion';
import { Palette, User, Building, Briefcase, HeartPulse, Rocket, ChevronDown } from 'lucide-react';
import { IndustryMode } from '@/lib/types/pmo';

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
  const activeMode = modes.find(m => m.id === currentMode);
  const Icon = activeMode?.icon;

  return (
    <div className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/10">
      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Mode</span>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-white flex items-center gap-2">
          {Icon && <Icon size={14} />}
          {activeMode?.label}
        </span>
        <button className="text-slate-500 hover:text-white">
          <ChevronDown size={14} />
        </button>
      </div>
    </div>
  );
}

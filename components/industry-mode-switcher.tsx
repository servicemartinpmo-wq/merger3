'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, User, Building, Briefcase, HeartPulse, Rocket, ChevronDown, Check } from 'lucide-react';
import { IndustryMode } from '@/lib/types/pmo';

interface IndustryModeSwitcherProps {
  currentMode: IndustryMode;
  onModeChange: (mode: IndustryMode) => void;
}

const modes: { id: IndustryMode; label: string; icon: any }[] = [
  { id: 'executive', label: 'Executive', icon: Briefcase },
  { id: 'SMB', label: 'SMB', icon: Building },
  { id: 'start-up', label: 'Start-up', icon: Rocket },
  { id: 'creative', label: 'Creative', icon: Palette },
  { id: 'freelancer', label: 'Freelancer', icon: User },
  { id: 'healthcare', label: 'Healthcare', icon: HeartPulse },
];

export function IndustryModeSwitcher({ currentMode, onModeChange }: IndustryModeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const activeMode = modes.find(m => m.id === currentMode) || modes[0];
  const Icon = activeMode.icon;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2.5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-slate-300 group-hover:text-white transition-colors">
            <Icon size={14} />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Industry Mode</span>
            <span className="text-xs font-bold text-white">{activeMode.label}</span>
          </div>
        </div>
        <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 w-full mb-2 bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[60]"
          >
            <div className="p-1.5 space-y-0.5">
              {modes.map((mode) => {
                const ModeIcon = mode.icon;
                const isSelected = mode.id === currentMode;
                return (
                  <button
                    key={mode.id}
                    onClick={() => {
                      onModeChange(mode.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isSelected 
                        ? 'bg-sky-500 text-white' 
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <ModeIcon size={14} />
                      {mode.label}
                    </div>
                    {isSelected && <Check size={14} />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

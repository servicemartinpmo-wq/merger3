'use client';

import { motion } from 'framer-motion';
import { Activity, Briefcase, Mail, GitMerge, MessageSquare, Users, Gauge, ShieldCheck, Building2, Layers, Zap, Layout, Palette, Plug, Terminal, Search, Bell, Sparkles } from 'lucide-react';
import { IndustryMode } from '@/lib/types/pmo';
import { IndustryModeSwitcher } from './industry-mode-switcher';

export function CommandEnginePanel({ view, setView, navItems, industryMode, setIndustryMode, assistedMode, setAssistedMode }: { view: string, setView: (id: string) => void, navItems: any[], industryMode: IndustryMode, setIndustryMode: (mode: IndustryMode) => void, assistedMode: boolean, setAssistedMode: (mode: boolean) => void }) {
  return (
    <motion.aside 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-72 h-screen bg-[#0f172a] border-r border-white/10 flex flex-col p-6 shadow-2xl z-50"
    >
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.5)]">
          <Activity size={24} />
        </div>
        <div>
          <h1 className="font-display text-lg font-light text-white leading-tight">Command Center</h1>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-300">by Martin PMO-Ops</p>
          <p className="text-[9px] font-mono uppercase tracking-[0.1em] text-slate-500 mt-1">Powered by Apphia</p>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = view === item.id;
          const isUrgent = item.status === 'urgent';
          const isNew = item.status === 'new';

          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className={`relative ${isUrgent || isNew ? 'animate-pulse' : ''}`}>
                <Icon 
                  size={18} 
                  className={
                    isUrgent ? 'text-red-500' : 
                    isNew ? 'text-yellow-400' : 
                    isActive ? 'text-white' : 'text-slate-400'
                  } 
                />
              </div>
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="pt-6 border-t border-white/10 space-y-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setAssistedMode(!assistedMode)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
              assistedMode ? 'bg-emerald-900 text-emerald-200' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles size={18} />
            {assistedMode ? 'Assisted ON' : 'Assisted OFF'}
          </button>
          <button 
            onClick={() => { /* Implement Snooze logic */ }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Bell size={18} />
            Snooze
          </button>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all">
          <Search size={18} />
          Search
        </button>
        <div className="pt-2">
          <IndustryModeSwitcher currentMode={industryMode} onModeChange={setIndustryMode} />
        </div>
      </div>
    </motion.aside>
  );
}

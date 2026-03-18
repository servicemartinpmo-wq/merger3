'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Cpu, ChevronRight } from 'lucide-react';
import coreSystemsData from '@/data/core-systems.json';

export function SystemsView() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSystems = coreSystemsData.systems.filter(system => 
    system.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    system.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-serif font-medium tracking-tight">PMO-Ops Command Center</h1>
          <p className="text-slate-500 max-w-2xl text-lg leading-relaxed">
            25 Core AI Systems powering the Venture-OS Command Engine.
          </p>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search systems..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all w-72"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSystems.map((system) => (
          <div 
            key={system.id}
            className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <Cpu size={20} />
              </div>
              <h3 className="text-lg font-medium">{system.name}</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed flex-grow">{system.purpose}</p>
            <button className="text-xs font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2 mt-2">
              View Details <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

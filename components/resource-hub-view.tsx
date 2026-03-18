'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, BookOpen, GitMerge, FileText, ArrowRight, Download } from 'lucide-react';
import resourceData from '@/data/resource-hub-data.json';

export function ResourceHubView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const sections = [
    { id: 'templates', title: 'Templates', icon: FileText, items: resourceData.templates },
    { id: 'workflows', title: 'Pre-built Workflows', icon: GitMerge, items: resourceData.workflows },
    { id: 'sops', title: 'SOPs & Lessons Learned', icon: BookOpen, items: resourceData.sops },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-serif font-medium tracking-tight">Resource Hub</h1>
          <p className="text-slate-500 max-w-2xl text-lg leading-relaxed">
            Access templates, pre-built workflows, and SOPs. Filter by department, problem, or diagnostic need.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all w-72"
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-slate-900 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </header>

      {sections.map((section) => (
        <section key={section.id} className="space-y-6">
          <h2 className="text-xl font-medium flex items-center gap-3">
            <section.icon size={20} className="text-slate-400" />
            {section.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.items.map((item: any) => (
              <div 
                key={item.id}
                className="group bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 cursor-pointer"
                title={item.purpose ? `Purpose: ${item.purpose} | Past Use: ${item.pastUse} | Relevance: ${item.relevance}` : ''}
              >
                <h3 className="text-lg font-medium mb-2">{item.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{item.department} • {item.problem}</p>
                <button className="text-xs font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  {section.id === 'workflows' ? 'Deploy' : 'Download'} <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, BookOpen, GitMerge, FileText, ArrowRight, Download, Loader2, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSupabase } from '@/components/supabase-provider';
import { dataService } from '@/lib/services/data-service';
import resourceData from '@/data/resource-hub-data.json';

export function ResourceHubView() {
  const { user } = useSupabase();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [resources, setResources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchResources = async () => {
      try {
        const data = await dataService.getItems<any>('resource_hub', user.id);
        setResources(data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();

    const channel = supabase
      .channel('resource_hub-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'resource_hub',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setResources((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setResources((prev) =>
              prev.map((item) => (item.id === payload.new.id ? payload.new : item))
            );
          } else if (payload.eventType === 'DELETE') {
            setResources((prev) => prev.filter((item) => item.id === payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const allTemplates = [...resources.filter(r => r.type === 'template'), ...resourceData.templates];
  const allWorkflows = [...resources.filter(r => r.type === 'workflow'), ...resourceData.workflows];
  const allSops = [...resources.filter(r => r.type === 'sop'), ...resourceData.sops];

  const sections = [
    { id: 'templates', title: 'Templates', icon: FileText, items: allTemplates },
    { id: 'workflows', title: 'Pre-built Workflows', icon: GitMerge, items: allWorkflows },
    { id: 'sops', title: 'SOPs & Lessons Learned', icon: BookOpen, items: allSops },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Resource Hub</h1>
          <p className="text-slate-500 max-w-2xl text-lg leading-relaxed font-medium">
            Access templates, pre-built workflows, and SOPs. Filter by department, problem, or diagnostic need.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {resources.length === 0 && (
            <button
              onClick={async () => {
                if (!user) return;
                const demoResources = [
                  ...resourceData.templates.slice(0, 1).map(r => ({ ...r, type: 'template', user_id: user.id })),
                  ...resourceData.workflows.slice(0, 1).map(r => ({ ...r, type: 'workflow', user_id: user.id })),
                  ...resourceData.sops.slice(0, 1).map(r => ({ ...r, type: 'sop', user_id: user.id })),
                ];
                await supabase.from('resource_hub').insert(demoResources);
              }}
              className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 px-4 py-2 rounded-lg"
            >
              Seed Demo Data
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search resources..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-72 font-medium"
              />
            </div>
            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-colors shadow-sm">
              <Filter size={18} />
            </button>
          </div>
        </div>
      </header>

      {sections.map((section) => (
        <section key={section.id} className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <section.icon size={14} className="text-indigo-600" />
              {section.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.items.map((item: any) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                className="group bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                title={item.purpose ? `Purpose: ${item.purpose} | Past Use: ${item.pastUse} | Relevance: ${item.relevance}` : ''}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <section.icon size={20} />
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:text-indigo-600 transition-colors">
                    <Download size={14} />
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-900 group-hover:text-indigo-600 transition-colors">{item.name}</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">{item.department} • {item.problem}</p>
                <button className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  {section.id === 'workflows' ? 'Deploy Workflow' : 'Download Template'} <ArrowRight size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

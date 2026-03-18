'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, BookOpen, GitMerge, FileText, ArrowRight, Download, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSupabase } from './supabase-provider';
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
      const { data, error } = await supabase
        .from('resource_hub')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching resources:', error);
      } else {
        setResources(data || []);
      }
      setIsLoading(false);
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
        <Loader2 className="w-8 h-8 animate-spin text-showroom-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-display text-white tracking-tight">Resource Hub</h1>
          <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
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
              className="text-[10px] font-mono uppercase tracking-widest text-showroom-accent hover:underline"
            >
              Seed Demo Data
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:ring-4 focus:ring-showroom-accent/10 transition-all w-72 glass-reflection"
              />
            </div>
            <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-colors glass-reflection">
              <Filter size={18} />
            </button>
          </div>
        </div>
      </header>

      {sections.map((section) => (
        <section key={section.id} className="space-y-6">
          <h2 className="text-xl font-medium flex items-center gap-3 text-white">
            <section.icon size={20} className="text-showroom-accent" />
            {section.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.items.map((item: any) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white/5 border border-white/10 rounded-3xl p-8 hover:shadow-2xl hover:shadow-showroom-accent/5 transition-all duration-300 cursor-pointer glass-reflection"
                title={item.purpose ? `Purpose: ${item.purpose} | Past Use: ${item.pastUse} | Relevance: ${item.relevance}` : ''}
              >
                <h3 className="text-lg font-medium mb-2 text-white">{item.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{item.department} • {item.problem}</p>
                <button className="text-xs font-bold uppercase tracking-widest text-showroom-accent flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  {section.id === 'workflows' ? 'Deploy' : 'Download'} <ArrowRight size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

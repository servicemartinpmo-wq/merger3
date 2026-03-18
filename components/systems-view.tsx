'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Cpu, ChevronRight, Loader2, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSupabase } from '@/components/supabase-provider';
import { dataService } from '@/lib/services/data-service';
import coreSystemsData from '@/data/core-systems.json';

export function SystemsView() {
  const { user } = useSupabase();
  const [searchQuery, setSearchQuery] = useState('');
  const [systems, setSystems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchSystems = async () => {
      try {
        const data = await dataService.getItems<any>('systems', user.id);
        setSystems(data);
      } catch (error) {
        console.error('Error fetching systems:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystems();

    const channel = supabase
      .channel('systems-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'systems',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setSystems((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setSystems((prev) =>
              prev.map((item) => (item.id === payload.new.id ? payload.new : item))
            );
          } else if (payload.eventType === 'DELETE') {
            setSystems((prev) => prev.filter((item) => item.id === payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const allSystems = [...systems, ...coreSystemsData.systems];
  const filteredSystems = allSystems.filter(system => 
    system.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    system.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-showroom-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-10 bg-slate-900 p-8 min-h-screen">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-display text-white tracking-tight">PMO-Ops Command Center</h1>
          <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
            25 Core AI Systems powering the Venture-OS Command Engine.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {systems.length === 0 && (
            <button
              onClick={async () => {
                if (!user) return;
                const demoSystems = coreSystemsData.systems.slice(0, 3).map(s => ({
                  name: s.name,
                  purpose: s.purpose,
                  user_id: user.id
                }));
                await supabase.from('systems').insert(demoSystems);
              }}
              className="text-[10px] font-mono uppercase tracking-widest text-showroom-accent hover:underline"
            >
              Sync Core Systems
            </button>
          )}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search systems..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:ring-4 focus:ring-showroom-accent/10 transition-all w-72 glass-reflection"
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSystems.map((system) => (
          <motion.div 
            key={system.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:shadow-2xl hover:shadow-showroom-accent/5 transition-all duration-300 flex flex-col gap-4 glass-reflection group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-showroom-accent text-black flex items-center justify-center shadow-[0_0_15px_rgba(45,212,191,0.3)]">
                <Cpu size={20} />
              </div>
              <h3 className="text-lg font-medium text-white">{system.name}</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed flex-grow">{system.purpose}</p>
            <button className="text-xs font-bold uppercase tracking-widest text-showroom-accent flex items-center gap-2 mt-2 group-hover:translate-x-1 transition-transform">
              View Details <ChevronRight size={14} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

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
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Core Systems</h1>
          <p className="text-slate-500 max-w-2xl text-lg leading-relaxed font-medium">
            25 Core AI Systems powering the PMO-Ops Command Engine.
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
              className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 px-4 py-2 rounded-lg"
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
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-72 font-medium"
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSystems.map((system) => (
          <motion.div 
            key={system.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4 }}
            className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-6 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-200 group-hover:bg-indigo-600 transition-colors">
                <Cpu size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{system.name}</h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed flex-grow font-medium">{system.purpose}</p>
            <div className="pt-6 border-t border-slate-50">
              <button className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                View System Specs <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

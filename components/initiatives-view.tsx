'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Clock, AlertTriangle, Loader2, Plus } from 'lucide-react';
import { statusConfig } from '@/lib/status-colors';
import { supabase } from '@/lib/supabase';
import { useSupabase } from '@/components/supabase-provider';
import { dataService } from '@/lib/services/data-service';

export function InitiativesView() {
  const { user } = useSupabase();
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newInitiative, setNewInitiative] = useState({
    name: '',
    status: 'on-track',
    owner: '',
    department: ''
  });

  useEffect(() => {
    if (!user) return;

    const fetchInitiatives = async () => {
      try {
        const data = await dataService.getItems<any>('initiatives', user.id);
        setInitiatives(data);
      } catch (error) {
        console.error('Error fetching initiatives:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitiatives();

    const channel = supabase
      .channel('initiatives-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'initiatives',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setInitiatives((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setInitiatives((prev) =>
              prev.map((item) => (item.id === payload.new.id ? payload.new : item))
            );
          } else if (payload.eventType === 'DELETE') {
            setInitiatives((prev) => prev.filter((item) => item.id === payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleCreate = async () => {
    if (!user || !newInitiative.name) return;
    try {
      const item = await dataService.createItem('initiatives', {
        ...newInitiative,
        user_id: user.id
      }, user.id);
      setInitiatives(prev => [item, ...prev]);
      setNewInitiative({ name: '', status: 'on-track', owner: '', department: '' });
      setIsAdding(false);
    } catch (error) {
      console.error('Error creating initiative:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-showroom-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-light text-white">Initiatives</h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-showroom-accent text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-showroom-accent/90 transition-all shadow-lg shadow-showroom-accent/20"
          >
            <Plus size={16} /> New Initiative
          </button>
          {initiatives.length === 0 && (
            <button
              onClick={async () => {
                if (!user) return;
                const demoInitiatives = [
                  { name: 'Customer Portal v2', status: 'on-track', owner: 'Ryan Torres', department: 'Product', user_id: user.id },
                  { name: 'SOC2 Compliance', status: 'needs-attention', owner: 'Sarah J.', department: 'Security', user_id: user.id },
                  { name: 'Q3 Marketing Launch', status: 'delayed', owner: 'Mike T.', department: 'Marketing', user_id: user.id },
                  { name: 'Legacy System Migration', status: 'abandoned', owner: 'Alex R.', department: 'Tech-Ops', user_id: user.id },
                ];
                await supabase.from('initiatives').insert(demoInitiatives);
              }}
              className="text-[10px] font-mono uppercase tracking-widest text-showroom-accent hover:underline"
            >
              Seed Demo Data
            </button>
          )}
        </div>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-6 glass-reflection"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Initiative Name</label>
              <input 
                type="text" 
                value={newInitiative.name}
                onChange={(e) => setNewInitiative({ ...newInitiative, name: e.target.value })}
                placeholder="e.g. Customer Portal v2"
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-showroom-accent transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Owner</label>
              <input 
                type="text" 
                value={newInitiative.owner}
                onChange={(e) => setNewInitiative({ ...newInitiative, owner: e.target.value })}
                placeholder="e.g. Sarah J."
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-showroom-accent transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Department</label>
              <input 
                type="text" 
                value={newInitiative.department}
                onChange={(e) => setNewInitiative({ ...newInitiative, department: e.target.value })}
                placeholder="e.g. Product"
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-showroom-accent transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</label>
              <select 
                value={newInitiative.status}
                onChange={(e) => setNewInitiative({ ...newInitiative, status: e.target.value })}
                className="w-full p-3 bg-slate-800 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-showroom-accent transition-all"
              >
                {Object.entries(statusConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button 
              onClick={handleCreate}
              className="flex-1 py-3 bg-showroom-accent text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-showroom-accent/90 transition-all"
            >
              Create Initiative
            </button>
            <button 
              onClick={() => setIsAdding(false)}
              className="px-6 py-3 bg-white/5 text-slate-400 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      <div className="bg-white/5 rounded-2xl border border-white/10 p-6 glass-reflection overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="text-slate-500 text-[10px] font-mono uppercase tracking-widest border-b border-white/5">
              <th className="pb-4">Name</th>
              <th className="pb-4">Status</th>
              <th className="pb-4">Owner</th>
              <th className="pb-4">Department</th>
            </tr>
          </thead>
          <tbody>
            {initiatives.map((ini) => (
              <tr key={ini.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                <td className="py-4 text-sm text-white">{ini.name}</td>
                <td className="py-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${statusConfig[ini.status as keyof typeof statusConfig]?.border || 'border-white/10'} ${statusConfig[ini.status as keyof typeof statusConfig]?.text || 'text-white'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[ini.status as keyof typeof statusConfig]?.color || 'bg-white/10'}`} />
                    {statusConfig[ini.status as keyof typeof statusConfig]?.label || ini.status}
                  </span>
                </td>
                <td className="py-4 text-sm text-slate-300">{ini.owner}</td>
                <td className="py-4 text-sm text-slate-300">{ini.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

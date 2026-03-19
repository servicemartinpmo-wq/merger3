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
  const [filter, setFilter] = useState<'all' | 'transformative' | 'operational'>('all');
  const [newInitiative, setNewInitiative] = useState({
    name: '',
    status: 'on-track',
    owner: '',
    department: '',
    type: 'operational' as 'transformative' | 'operational'
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

    // Set up real-time subscription
    const channel = supabase
      .channel('initiatives-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'initiatives',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setInitiatives(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setInitiatives(prev => prev.map(item => item.id === payload.new.id ? payload.new : item));
          } else if (payload.eventType === 'DELETE') {
            setInitiatives(prev => prev.filter(item => item.id !== payload.old.id));
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
      await dataService.createItem('initiatives', {
        ...newInitiative,
        department: newInitiative.department || 'General'
      }, user.id);
      
      setNewInitiative({
        name: '',
        status: 'on-track',
        owner: '',
        department: '',
        type: 'operational'
      });
      setIsAdding(false);
    } catch (error) {
      console.error('Error creating initiative:', error);
    }
  };

  const filteredInitiatives = initiatives.filter(ini => 
    filter === 'all' ? true : ini.type === filter
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Initiatives</h2>
          <p className="text-sm text-slate-500 mt-1">Manage and track organizational growth and operational health.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-lg p-1 flex items-center shadow-sm">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
            >
              ALL
            </button>
            <button 
              onClick={() => setFilter('transformative')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filter === 'transformative' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-900'}`}
            >
              TRANSFORMATIVE
            </button>
            <button 
              onClick={() => setFilter('operational')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filter === 'operational' ? 'bg-sky-600 text-white' : 'text-slate-500 hover:text-slate-900'}`}
            >
              OPERATIONAL
            </button>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-sky-700 transition-all shadow-lg shadow-sky-600/20"
          >
            <Plus size={16} /> New Initiative
          </button>
        </div>
      </div>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 bg-white border border-slate-200 rounded-2xl shadow-xl space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Initiative Name</label>
              <input 
                type="text" 
                value={newInitiative.name}
                onChange={(e) => setNewInitiative({ ...newInitiative, name: e.target.value })}
                placeholder="e.g. Q2 Strategic Roadmap"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-sky-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Type</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setNewInitiative({ ...newInitiative, type: 'transformative' })}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${newInitiative.type === 'transformative' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                >
                  TRANSFORMATIVE
                </button>
                <button 
                  onClick={() => setNewInitiative({ ...newInitiative, type: 'operational' })}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${newInitiative.type === 'operational' ? 'bg-sky-50 border-sky-200 text-sky-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                >
                  OPERATIONAL
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Owner</label>
              <input 
                type="text" 
                value={newInitiative.owner}
                onChange={(e) => setNewInitiative({ ...newInitiative, owner: e.target.value })}
                placeholder="e.g. Sarah J."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-sky-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</label>
              <select 
                value={newInitiative.status}
                onChange={(e) => setNewInitiative({ ...newInitiative, status: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-sky-500 transition-all"
              >
                {Object.entries(statusConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button 
              onClick={handleCreate}
              className="flex-1 py-3 bg-sky-600 text-white rounded-xl text-sm font-bold hover:bg-sky-700 transition-all shadow-lg shadow-sky-600/20"
            >
              Create Initiative
            </button>
            <button 
              onClick={() => setIsAdding(false)}
              className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-200">
                <th className="px-6 py-4">Initiative</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Department</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInitiatives.map((ini) => (
                <tr key={ini.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="text-sm font-bold text-slate-900">{ini.name}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      ini.type === 'transformative' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'
                    }`}>
                      {ini.type}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${statusConfig[ini.status as keyof typeof statusConfig]?.border || 'border-slate-200'} ${statusConfig[ini.status as keyof typeof statusConfig]?.text || 'text-slate-600'} ${statusConfig[ini.status as keyof typeof statusConfig]?.bg || 'bg-slate-50'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[ini.status as keyof typeof statusConfig]?.color || 'bg-slate-400'}`} />
                      {statusConfig[ini.status as keyof typeof statusConfig]?.label || ini.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-600 font-medium">{ini.owner}</td>
                  <td className="px-6 py-5 text-sm text-slate-600 font-medium">{ini.department}</td>
                </tr>
              ))}
              {filteredInitiatives.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                    No initiatives found matching the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { statusConfig } from '@/lib/status-colors';
import { supabase } from '@/lib/supabase';
import { useSupabase } from './supabase-provider';

export function InitiativesView() {
  const { user } = useSupabase();
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchInitiatives = async () => {
      const { data, error } = await supabase
        .from('initiatives')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching initiatives:', error);
      } else {
        setInitiatives(data || []);
      }
      setIsLoading(false);
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

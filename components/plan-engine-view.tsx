'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, AlertTriangle, TrendingUp, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSupabase } from './supabase-provider';

export function PlanEngineView() {
  const { user } = useSupabase();
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchPlans = async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching plans:', error);
      } else {
        setPlans(data || []);
      }
      setIsLoading(false);
    };

    fetchPlans();

    const channel = supabase
      .channel('plans-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'plans',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPlans((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setPlans((prev) =>
              prev.map((item) => (item.id === payload.new.id ? payload.new : item))
            );
          } else if (payload.eventType === 'DELETE') {
            setPlans((prev) => prev.filter((item) => item.id === payload.old.id));
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
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display text-white">Recurring Plan Engine</h1>
        <div className="flex gap-4">
          {plans.length === 0 && (
            <button
              onClick={async () => {
                if (!user) return;
                const demoPlans = [
                  { title: 'Weekly Sprint Review', owner: 'Ryan T.', outcome: 'Clear blockers', cadence: 'weekly', status: 'green', user_id: user.id },
                  { title: 'Monthly Financials', owner: 'Sarah J.', outcome: 'Budget alignment', cadence: 'monthly', status: 'yellow', user_id: user.id },
                ];
                await supabase.from('plans').insert(demoPlans);
              }}
              className="text-[10px] font-mono uppercase tracking-widest text-showroom-accent hover:underline"
            >
              Seed Demo Data
            </button>
          )}
          <button className="flex items-center gap-2 px-6 py-3 bg-showroom-accent text-black rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-showroom-accent/90 transition-all shadow-[0_0_15px_rgba(45,212,191,0.3)]">
            <Plus size={16} />
            Create New Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(plan => (
          <motion.div 
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white/5 border border-white/10 rounded-3xl shadow-xl glass-reflection space-y-4"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-display text-lg text-white">{plan.title}</h3>
              <div className={`w-3 h-3 rounded-full ${plan.status === 'green' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'}`} />
            </div>
            <p className="text-sm text-slate-400">Owner: {plan.owner}</p>
            <p className="text-sm text-slate-400">Outcome: {plan.outcome}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest font-mono">
              <Calendar size={14} />
              {plan.cadence}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';

export function PlanEngineView() {
  const [plans, setPlans] = useState([
    { id: '1', title: 'Weekly Sprint Review', owner: 'Ryan T.', outcome: 'Clear blockers', cadence: 'weekly', status: 'green' },
    { id: '2', title: 'Monthly Financials', owner: 'Sarah J.', outcome: 'Budget alignment', cadence: 'monthly', status: 'yellow' },
  ]);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display text-slate-950">Recurring Plan Engine</h1>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all">
          <Plus size={16} />
          Create New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(plan => (
          <motion.div 
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-display text-lg">{plan.title}</h3>
              <div className={`w-3 h-3 rounded-full ${plan.status === 'green' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </div>
            <p className="text-sm text-slate-500">Owner: {plan.owner}</p>
            <p className="text-sm text-slate-500">Outcome: {plan.outcome}</p>
            <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-widest">
              <Calendar size={14} />
              {plan.cadence}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

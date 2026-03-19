'use client';

import { BrainCircuit } from 'lucide-react';
import insightsData from '@/data/learning-engine.json';

export function LearningEngineView() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Cross-Company Learning Engine</h1>
        <p className="text-slate-500 mt-1">Aggregated insights and pattern recognition from across the PMO-Ops network.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insightsData.insights.map((insight) => (
          <div key={insight.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
              <BrainCircuit className="text-indigo-600" size={20} />
            </div>
            <p className="text-sm font-bold text-slate-900 leading-snug mb-3">{insight.insight}</p>
            <div className="pt-3 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Recommendation</p>
              <p className="text-xs text-slate-600 leading-relaxed">{insight.recommendation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

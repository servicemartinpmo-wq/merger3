'use client';

import { BrainCircuit } from 'lucide-react';
import insightsData from '@/data/learning-engine.json';

export function LearningEngineView() {
  return (
    <section className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <BrainCircuit className="text-indigo-600" size={24} />
        <h2 className="text-xl font-serif">Cross-Company Learning Engine</h2>
      </div>
      <div className="space-y-4">
        {insightsData.insights.map((insight) => (
          <div key={insight.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-sm font-medium text-slate-900">{insight.insight}</p>
            <p className="text-xs text-slate-500 mt-1">Recommendation: {insight.recommendation}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

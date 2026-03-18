import { InsightCard } from '@/lib/types/pmo';
import { AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';

export function ExecutiveInsightPanel({ insights }: { insights: InsightCard[] }) {
  const icons = {
    Supervisory: AlertTriangle,
    Advisory: CheckCircle2,
    Structural: ShieldCheck,
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 glass-reflection">
      <h2 className="font-display text-xl font-light text-white mb-6">Executive Insight Panel</h2>
      <div className="space-y-4">
        {insights.sort((a, b) => b.priorityScore - a.priorityScore).map((insight, i) => {
          const Icon = icons[insight.type];
          return (
            <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className="text-showroom-accent" />
                <span className="text-[10px] uppercase tracking-widest text-slate-400">{insight.type} Insight</span>
              </div>
              <p className="text-sm text-white mb-2 font-medium">{insight.situation}</p>
              <p className="text-xs text-slate-400 mb-2">{insight.diagnosis}</p>
              <div className="bg-showroom-accent/10 p-3 rounded-lg">
                <p className="text-xs text-showroom-accent font-semibold mb-1">Recommendation: {insight.recommendation}</p>
                <p className="text-[10px] text-showroom-accent/70">System Remedy: {insight.systemRemedy}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

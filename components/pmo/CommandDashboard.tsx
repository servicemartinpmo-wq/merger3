'use client';

import { useState } from 'react';
import { Initiative, RiskLevel } from '@/lib/types';
import { runDepartmentEngine } from '@/lib/engine/departmentEngine';
import { generateStructuredPlan } from '@/lib/engine/planBuilder';
import { runAuthorityCheck } from '@/lib/engine/authorityFlow';
import { AlertTriangle, CheckCircle2, Clock, Loader2, Play, FileText, ShieldCheck } from 'lucide-react';

const RiskBadge = ({ level }: { level: RiskLevel }) => {
  const colors = {
    Green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Yellow: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Red: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${colors[level]}`}>
      {level}
    </span>
  );
};

export function CommandDashboard({ initiatives, setInitiatives }: { initiatives: Initiative[], setInitiatives: any }) {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleRunDiagnostic = async (initiative: Initiative) => {
    const auth = await runAuthorityCheck(initiative);
    if (!auth.isAligned || !auth.hasStructure) {
      alert(auth.message);
      return;
    }
    setProcessingId(initiative.id);
    try {
      const result = await runDepartmentEngine(initiative);
      setInitiatives((prev: Initiative[]) => prev.map(ini => 
        ini.id === initiative.id ? { ...ini, ...result } : ini
      ));
    } catch (error) {
      console.error('Diagnostic failed:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleGeneratePlan = async (initiative: Initiative) => {
    const auth = await runAuthorityCheck(initiative);
    if (!auth.isAligned || !auth.hasStructure) {
      alert(auth.message);
      return;
    }
    setProcessingId(initiative.id);
    try {
      const plan = await generateStructuredPlan(initiative);
      setInitiatives((prev: Initiative[]) => prev.map(ini => 
        ini.id === initiative.id ? { ...ini, plan } : ini
      ));
    } catch (error) {
      console.error('Plan generation failed:', error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 glass-reflection">
      <h2 className="font-display text-xl font-light text-white mb-6">Initiative Command Center</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-white/5">
            <th className="pb-4">Initiative</th>
            <th className="pb-4">Dept</th>
            <th className="pb-4">Priority</th>
            <th className="pb-4">Risk</th>
            <th className="pb-4">Next Action</th>
            <th className="pb-4">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm text-slate-300">
          {initiatives.map((ini) => (
            <tr key={ini.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
              <td className="py-4 font-medium text-white">{ini.name}</td>
              <td className="py-4 font-mono text-xs">{ini.department}</td>
              <td className="py-4 font-mono">{ini.priority_score}</td>
              <td className="py-4">
                <RiskBadge level={ini.risk_alert} />
              </td>
              <td className="py-4 font-mono text-xs text-slate-400">{ini.next_action_recommendation}</td>
              <td className="py-4 flex gap-2">
                <button
                  onClick={() => handleRunDiagnostic(ini)}
                  disabled={processingId === ini.id}
                  className="p-2 bg-showroom-accent/10 text-showroom-accent rounded-lg hover:bg-showroom-accent/20 transition-all disabled:opacity-50"
                  title="Run Diagnostic"
                >
                  {processingId === ini.id ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                </button>
                <button
                  onClick={() => handleGeneratePlan(ini)}
                  disabled={processingId === ini.id}
                  className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all disabled:opacity-50"
                  title="Generate Plan"
                >
                  <FileText size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

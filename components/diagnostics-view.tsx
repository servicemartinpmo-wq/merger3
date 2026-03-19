'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gauge, ArrowRightLeft, Lightbulb, GitMerge, ArrowRight } from 'lucide-react';

type DiagnosticReport = {
  loadPercentage: number;
  cltv: {
    cac: number;
    churnRate: number;
    nrr: number;
    ltv: number;
  };
  recommendations: { id: number; task: string; suggestTo: string; reason: string; mocha: { mission: string; objective: string; context: string; how: string; accountability: string } }[];
  redistribution: { id: number; from: string; to: string; project: string; impact: string }[];
  workflowSuggestions: { id: number; title: string; description: string; impact: string }[];
};

import { ApphiaObserver } from '@/lib/apphia/observer';
import { supabase } from '@/lib/supabase';

export function DiagnosticsView() {
  const [report, setReport] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [observer] = useState(() => new ApphiaObserver());

  useEffect(() => {
    const fetchDiagnostics = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.warn('User not authenticated');
          setIsLoading(false);
          return;
        }

        const result = await observer.runObservationCycle(user.id);
        setReport(result);
      } catch (error) {
        console.error('Failed to fetch diagnostics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiagnostics();
  }, [observer]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-white rounded-3xl shadow-sm border border-slate-200">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Apphia AI Reasoning Engine is analyzing your data...</p>
        </div>
      </div>
    );
  }

  if (!report || report.signals.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-white rounded-3xl shadow-sm border border-slate-200 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
        No significant signals detected at this time.
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Apphia AI Intelligence</h1>
          <p className="text-slate-500 mt-1">Real-time strategic reasoning and structural remedy proposals.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          REASONING ENGINE ACTIVE
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Signals Section */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-2">
            <Gauge className="text-sky-500" size={20} />
            <h2 className="text-lg font-bold text-slate-900">Detected Signals</h2>
          </div>
          <div className="p-6 space-y-4">
            {report.signals.map((signal: any) => (
              <div key={signal.id} className={`p-4 rounded-xl border flex gap-4 ${
                signal.severity === 'critical' ? 'bg-rose-50 border-rose-100' : 
                signal.severity === 'high' ? 'bg-amber-50 border-amber-100' : 
                'bg-slate-50 border-slate-100'
              }`}>
                <div className={`w-1 h-full rounded-full shrink-0 ${
                  signal.severity === 'critical' ? 'bg-rose-500' : 
                  signal.severity === 'high' ? 'bg-amber-500' : 
                  'bg-slate-400'
                }`} />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      signal.severity === 'critical' ? 'text-rose-600' : 
                      signal.severity === 'high' ? 'text-amber-600' : 
                      'text-slate-500'
                    }`}>
                      {signal.severity}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{signal.type}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900">{signal.message}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Diagnoses Section */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-2">
            <Lightbulb className="text-amber-500" size={20} />
            <h2 className="text-lg font-bold text-slate-900">AI Diagnoses</h2>
          </div>
          <div className="p-6 space-y-4">
            {report.diagnoses.map((diagnosis: any, idx: number) => (
              <div key={idx} className="p-5 rounded-xl border border-slate-100 bg-slate-50 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-slate-900">{diagnosis.rootCause}</h3>
                  <span className="px-2 py-0.5 bg-sky-100 text-sky-700 text-[10px] font-bold rounded-full">
                    {Math.round(diagnosis.confidence * 100)}% Confidence
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{diagnosis.analysis}</p>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Framework: {diagnosis.frameworkUsed}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Advisories Section */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-2">
            <ArrowRightLeft className="text-emerald-500" size={20} />
            <h2 className="text-lg font-bold text-slate-900">Strategic Advisories</h2>
          </div>
          <div className="p-6 space-y-4">
            {report.advisories.map((advisory: any, idx: number) => (
              <div key={idx} className="p-5 rounded-xl border border-emerald-100 bg-emerald-50 space-y-3">
                <h3 className="text-sm font-bold text-emerald-900">{advisory.guidance}</h3>
                <div className="space-y-2">
                  <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">Recommended Actions:</p>
                  <ul className="space-y-1.5">
                    {advisory.actions.map((action: string, aIdx: number) => (
                      <li key={aIdx} className="text-xs text-emerald-800 flex items-center gap-2 font-medium">
                        <div className="w-1 h-1 rounded-full bg-emerald-500" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
                {advisory.rationale && (
                  <p className="text-[10px] text-slate-500 italic border-t border-emerald-100 pt-2 mt-2">
                    Rationale: {advisory.rationale}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Structural Remedies Section */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-2">
            <GitMerge className="text-rose-500" size={20} />
            <h2 className="text-lg font-bold text-slate-900">Structural Remedies</h2>
          </div>
          <div className="p-6 space-y-4">
            {report.remedies.map((remedy: any, idx: number) => (
              <div key={idx} className="p-5 rounded-xl border border-rose-100 bg-rose-50 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-rose-900">{remedy.description}</h3>
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                    {remedy.remedyType.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-rose-800 leading-relaxed font-medium">
                  <span className="text-rose-600 font-bold uppercase tracking-tighter text-[10px] mr-2">Impact:</span> {remedy.impact}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}


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

export function DiagnosticsView() {
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDiagnostics = async () => {
      try {
        const response = await fetch('/api/frameworks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            framework: 'balanced-scorecard',
            data: {}
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch diagnostics');
        }

        const reportData = await response.json();
        
        // Map the backend result to the DiagnosticReport type
        setReport({
          loadPercentage: reportData.score,
          cltv: {
            cac: 150,
            churnRate: 0.03,
            nrr: 1.15,
            ltv: 5000
          },
          recommendations: [
            {
              id: 1,
              task: "Review Q2 Strategic Roadmap",
              suggestTo: "Mike T.",
              reason: "Mike has capacity and deep knowledge of the project scope, freeing up executive time for high-level alignment.",
              mocha: {
                mission: "Ensure Q2 roadmap aligns with 12-month vision.",
                objective: "Finalize roadmap by Friday.",
                context: "Q2 planning is underway.",
                how: "Review existing drafts and incorporate feedback.",
                accountability: "Mike T."
              }
            }
          ],
          redistribution: [
            { id: 1, from: "Sarah J.", to: "Mike T.", project: "Project Alpha", impact: "-15% load" }
          ],
          workflowSuggestions: [
            { id: 1, title: "Automated Approval Routing", description: "Route routine approvals to designated leads based on project tags.", impact: "-20% time" }
          ]
        });
      } catch (error) {
        console.error('Failed to fetch diagnostics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiagnostics();
  }, []);

  if (isLoading) {
    return null;
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-slate-900 rounded-3xl shadow-sm border border-white/10 text-slate-400">
        Failed to load diagnostics.
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-white bg-slate-900 min-h-[calc(100vh-8rem)] p-8 rounded-3xl shadow-sm border border-white/10">
      <header className="border-b border-white/10 pb-6">
        <h1 className="font-serif text-3xl font-medium tracking-tight text-white mb-2">
          Organizational Diagnostics
        </h1>
        <p className="text-slate-500 max-w-2xl text-base">
          Executive load monitoring and framework-driven delegation recommendations.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Executive Load Meter and CLTV */}
        <section className="lg:col-span-1 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Gauge className="text-indigo-600" size={24} />
              <h2 className="font-serif text-xl font-semibold">Executive Load Meter</h2>
            </div>
            <div className="p-6 rounded-xl border bg-slate-50 border-slate-200 flex flex-col items-center justify-center text-center h-64">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className={`${report.loadPercentage > 75 ? 'text-rose-500' : report.loadPercentage > 50 ? 'text-amber-500' : 'text-emerald-500'}`}
                    strokeDasharray={`${report.loadPercentage}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold text-slate-900">{report.loadPercentage}%</span>
                </div>
              </div>
              <h3 className="font-medium text-slate-900">Sarah J.</h3>
              <p className="text-sm text-slate-500 mt-1">
                {report.loadPercentage > 75 ? 'Critical Overload' : report.loadPercentage > 50 ? 'High Load' : 'Optimal Load'}
              </p>
            </div>
          </div>

          {/* CLTV Metrics */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-serif text-xl font-semibold">Customer Lifetime Value</h2>
            </div>
            <div className="p-6 rounded-xl border bg-slate-50 border-slate-200 space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">LTV</span>
                <span className="font-bold text-slate-900">${report.cltv.ltv}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">CAC</span>
                <span className="font-bold text-slate-900">${report.cltv.cac}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Churn Rate</span>
                <span className="font-bold text-slate-900">{(report.cltv.churnRate * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">NRR</span>
                <span className="font-bold text-slate-900">{(report.cltv.nrr * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </section>

        <div className="lg:col-span-2 space-y-8">
          {/* Delegation Recommendations */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="text-amber-500" size={24} />
              <h2 className="font-serif text-xl font-semibold">Delegation Recommendations</h2>
            </div>
            <div className="space-y-3">
              {report.recommendations.map(rec => (
                <div key={rec.id} className="p-4 rounded-xl border bg-amber-50 border-amber-100 flex items-start gap-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-amber-600 mt-1 shrink-0">
                    <ArrowRightLeft size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Delegate: {rec.task}</h3>
                    <p className="text-sm text-slate-700 mt-1">
                      <span className="font-semibold">Suggest to:</span> {rec.suggestTo}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">{rec.reason}</p>
                    <div className="mt-3 bg-white p-3 rounded-lg border border-amber-100 text-xs space-y-1">
                      <p><span className="font-bold">Mission:</span> {rec.mocha.mission}</p>
                      <p><span className="font-bold">Objective:</span> {rec.mocha.objective}</p>
                      <p><span className="font-bold">Context:</span> {rec.mocha.context}</p>
                      <p><span className="font-bold">How:</span> {rec.mocha.how}</p>
                      <p><span className="font-bold">Accountability:</span> {rec.mocha.accountability}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Task Redistribution */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <ArrowRightLeft className="text-indigo-600" size={24} />
              <h2 className="font-serif text-xl font-semibold">Task Redistribution</h2>
            </div>
            <div className="space-y-3">
              {report.redistribution.map(redist => (
                <div key={redist.id} className="p-4 rounded-xl border bg-slate-50 border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900">{redist.project}</h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                      <span>{redist.from}</span>
                      <ArrowRightLeft size={14} className="text-slate-400" />
                      <span>{redist.to}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                    {redist.impact}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Workflow Suggestions */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <GitMerge className="text-teal-600" size={24} />
              <h2 className="font-serif text-xl font-semibold">Workflow Automation</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.workflowSuggestions.map(suggest => (
                <div key={suggest.id} className="p-5 rounded-2xl border border-teal-100 bg-teal-50/30 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-slate-900">{suggest.title}</h3>
                    <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-[10px] font-bold rounded-full">
                      {suggest.impact}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{suggest.description}</p>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-teal-600 flex items-center gap-1 hover:gap-2 transition-all">
                    Configure Workflow <ArrowRight size={12} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


import { Shield, Brain, Activity } from 'lucide-react';

export default function DiagnosticsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-navy-900">AI Diagnostics</h1>
        <p className="text-slate-500 mt-2">Review AI decisions, confidence scores, and automated actions.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 rounded-2xl glass-card border border-slate-200 shadow-xl shadow-slate-200/50 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-navy-900">Ticket #{1000 + i} Analysis</h2>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-electric-blue/10 text-electric-blue border border-electric-blue/20">
                      Apphia.Kernel
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">"Cannot access billing portal"</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-emerald-600">94%</span>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Confidence</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-sm text-slate-600 shadow-inner">
                <pre className="whitespace-pre-wrap">
{`{
  "intent": "billing_access_issue",
  "urgency": "high",
  "suggested_tier": "Tier 1",
  "reasoning": "User is unable to access billing, which prevents payment updates. This is a known issue with the current deployment.",
  "action_taken": "Sent automated response with workaround link and escalated to Tier 2 for investigation."
}`}
                </pre>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-card border border-slate-200 shadow-xl shadow-slate-200/50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-navy-900">
              <Brain className="w-5 h-5 text-electric-blue" />
              Agent Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">IntakeAgent</span>
                <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
                  <Activity className="w-3 h-3" /> Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">DiagnosisAgent</span>
                <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
                  <Activity className="w-3 h-3" /> Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">ResolutionAgent</span>
                <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
                  <Activity className="w-3 h-3" /> Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

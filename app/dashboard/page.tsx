import { Activity, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default function DashboardOverview() {
  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white">System Overview</h1>
        <p className="text-slate-400 mt-2">Real-time metrics for the Apphia Engine.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Active Tickets</p>
            <p className="text-3xl font-bold text-white mt-2">142</p>
          </div>
          <div className="p-3 rounded-lg bg-indigo-500/10">
            <Activity className="w-6 h-6 text-indigo-400" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">AI Resolution Rate</p>
            <p className="text-3xl font-bold text-white mt-2">68%</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Avg. Response Time</p>
            <p className="text-3xl font-bold text-white mt-2">1.2m</p>
          </div>
          <div className="p-3 rounded-lg bg-cyan-500/10">
            <Clock className="w-6 h-6 text-cyan-400" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Escalations</p>
            <p className="text-3xl font-bold text-rose-400 mt-2">12</p>
          </div>
          <div className="p-3 rounded-lg bg-rose-500/10">
            <AlertCircle className="w-6 h-6 text-rose-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <h2 className="text-xl font-semibold mb-4">Recent AI Diagnostics</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <div>
                    <p className="font-medium text-slate-200">Ticket #{1000 + i}</p>
                    <p className="text-sm text-slate-500">Auto-resolved by Apphia.Kernel</p>
                  </div>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                  98% Confidence
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <h2 className="text-xl font-semibold mb-4">Active Workflows</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-950 border border-slate-800">
              <div>
                <p className="font-medium text-slate-200">High Priority Escalation</p>
                <p className="text-sm text-slate-500">Trigger: ticket_created (priority=high)</p>
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-950 border border-slate-800">
              <div>
                <p className="font-medium text-slate-200">Auto-Triage</p>
                <p className="text-sm text-slate-500">Trigger: ticket_created</p>
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

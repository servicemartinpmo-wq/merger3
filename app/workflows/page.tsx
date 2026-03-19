import { Zap, Play, Settings2, Plus } from 'lucide-react';

export default function WorkflowsPage() {
  return (
    <div className="p-8 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Workflows</h1>
          <p className="text-slate-400 mt-2">Configure event-driven automation and integrations.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create Workflow
        </button>
      </header>

      <div className="space-y-4">
        {[
          { name: "High Priority Escalation", trigger: "ticket_created", condition: "priority == 'high'", active: true },
          { name: "Auto-Triage", trigger: "ticket_created", condition: "always", active: true },
          { name: "SLA Breach Warning", trigger: "ticket_updated", condition: "time_open > 20h", active: false },
          { name: "Customer Satisfaction Survey", trigger: "ticket_resolved", condition: "always", active: true },
        ].map((workflow, i) => (
          <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${workflow.active ? 'bg-indigo-500/10' : 'bg-slate-800'}`}>
                <Zap className={`w-6 h-6 ${workflow.active ? 'text-indigo-400' : 'text-slate-500'}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-3">
                  {workflow.name}
                  {workflow.active ? (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                      Inactive
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <Play className="w-4 h-4" /> Trigger: {workflow.trigger}
                  </span>
                  <span className="flex items-center gap-1">
                    <Settings2 className="w-4 h-4" /> Condition: {workflow.condition}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

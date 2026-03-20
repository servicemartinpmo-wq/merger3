import { Zap, Play, Settings2, Plus } from 'lucide-react';

export default function WorkflowsPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Workflows</h1>
          <p className="text-slate-500 mt-2">Configure event-driven automation and integrations.</p>
        </div>
        <button className="px-4 py-2 bg-electric-blue hover:bg-electric-blue/90 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-electric-blue/20">
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
          <div key={i} className="flex items-center justify-between p-6 rounded-2xl glass-card border border-slate-200 shadow-xl shadow-slate-200/50 hover:border-electric-blue/50 transition-colors">
            <div className="flex items-center gap-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${workflow.active ? 'bg-electric-blue/10' : 'bg-slate-100'}`}>
                <Zap className={`w-6 h-6 ${workflow.active ? 'text-electric-blue' : 'text-slate-400'}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy-900 flex items-center gap-3">
                  {workflow.name}
                  {workflow.active ? (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                      Inactive
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
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
              <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-navy-900 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

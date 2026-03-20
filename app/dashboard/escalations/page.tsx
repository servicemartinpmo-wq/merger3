import { AlertTriangle, Check, X, RefreshCw, ShieldAlert, Clock, Activity } from 'lucide-react';

export default function EscalationsPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-navy-900 flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-rose-500" />
          Action Required: Escalations
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Review high-risk or low-confidence AI decisions. You are the final approver.
        </p>
      </header>

      <div className="space-y-8">
        {/* Escalation Card 1: High Risk */}
        <div className="glass-card border border-rose-200 rounded-2xl overflow-hidden shadow-xl shadow-rose-900/5">
          <div className="bg-rose-50 px-6 py-4 border-b border-rose-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h2 className="text-lg font-semibold text-rose-900">Case #8492 - High Risk Fix Proposed</h2>
            </div>
            <span className="flex items-center gap-2 text-sm font-medium text-rose-600">
              <Clock className="w-4 h-4" /> 10 mins ago
            </span>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">User Issue</h3>
                  <p className="text-navy-900 text-lg leading-relaxed">"Users cannot log in to the main dashboard. It keeps spinning."</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">AI Summary</h3>
                  <p className="text-slate-600">Login system is failing due to an expired authentication token on the primary auth gateway.</p>
                </div>
              </div>
              
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-5">
                <div className="flex justify-between items-center pb-5 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Risk Level</span>
                  <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-bold border border-rose-200">High</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">AI Confidence</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold border border-emerald-200">92%</span>
                </div>
              </div>
            </div>

            <div className="bg-electric-blue/5 border border-electric-blue/20 p-6 rounded-xl">
              <h3 className="text-xs font-bold text-electric-blue uppercase tracking-wider mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Recommended Fix
              </h3>
              <p className="text-navy-900 text-xl font-medium">Reset authentication service and regenerate tokens.</p>
              <div className="mt-4 p-3 bg-white rounded-lg border border-electric-blue/10 shadow-sm">
                <p className="text-slate-600 text-sm">
                  <strong className="text-navy-900">Impact:</strong> All currently logged-in users will be forced to re-authenticate immediately.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-200">
              <button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20">
                <Check className="w-5 h-5" /> Approve Fix
              </button>
              <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-navy-900 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-sm">
                <RefreshCw className="w-5 h-5" /> Re-analyze
              </button>
              <button className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all border border-rose-200">
                <X className="w-5 h-5" /> Reject
              </button>
            </div>
          </div>
        </div>

        {/* Escalation Card 2: Low Confidence */}
        <div className="glass-card border border-amber-200 rounded-2xl overflow-hidden shadow-xl shadow-amber-900/5 opacity-90 hover:opacity-100 transition-opacity">
          <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-amber-900">Case #8495 - Low Confidence</h2>
            </div>
            <span className="flex items-center gap-2 text-sm font-medium text-amber-600">
              <Clock className="w-4 h-4" /> 45 mins ago
            </span>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">User Issue</h3>
                  <p className="text-navy-900 text-lg leading-relaxed">"My reports are generating blank PDFs since the update."</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">AI Summary</h3>
                  <p className="text-slate-600">PDF generation service is returning empty buffers. Unclear if this is a data fetching issue or a rendering engine failure.</p>
                </div>
              </div>
              
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-5">
                <div className="flex justify-between items-center pb-5 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Risk Level</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold border border-emerald-200">Low</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">AI Confidence</span>
                  <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-bold border border-rose-200">42%</span>
                </div>
              </div>
            </div>

            <div className="bg-electric-blue/5 border border-electric-blue/20 p-6 rounded-xl">
              <h3 className="text-xs font-bold text-electric-blue uppercase tracking-wider mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Recommended Fix
              </h3>
              <p className="text-navy-900 text-xl font-medium">Rollback PDF rendering microservice to previous stable version (v2.1.4).</p>
              <div className="mt-4 p-3 bg-white rounded-lg border border-electric-blue/10 shadow-sm">
                <p className="text-slate-600 text-sm">
                  <strong className="text-navy-900">Impact:</strong> Minimal. Will temporarily disable new font features introduced in v2.1.5.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-200">
              <button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20">
                <Check className="w-5 h-5" /> Approve Fix
              </button>
              <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-navy-900 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-sm">
                <RefreshCw className="w-5 h-5" /> Re-analyze
              </button>
              <button className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all border border-rose-200">
                <X className="w-5 h-5" /> Reject
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

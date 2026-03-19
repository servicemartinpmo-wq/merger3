import { AlertTriangle, Check, X, RefreshCw, ShieldAlert, Clock, Activity } from 'lucide-react';

export default function EscalationsPage() {
  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-rose-500" />
          Action Required: Escalations
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          Review high-risk or low-confidence AI decisions. You are the final approver.
        </p>
      </header>

      <div className="space-y-8">
        {/* Escalation Card 1: High Risk */}
        <div className="bg-slate-900 border border-rose-500/30 rounded-2xl overflow-hidden shadow-lg shadow-rose-900/10">
          <div className="bg-rose-500/10 px-6 py-4 border-b border-rose-500/20 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h2 className="text-lg font-semibold text-rose-200">Case #8492 - High Risk Fix Proposed</h2>
            </div>
            <span className="flex items-center gap-2 text-sm font-medium text-rose-400/80">
              <Clock className="w-4 h-4" /> 10 mins ago
            </span>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">User Issue</h3>
                  <p className="text-slate-200 text-lg leading-relaxed">"Users cannot log in to the main dashboard. It keeps spinning."</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">AI Summary</h3>
                  <p className="text-slate-300">Login system is failing due to an expired authentication token on the primary auth gateway.</p>
                </div>
              </div>
              
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-5">
                <div className="flex justify-between items-center pb-5 border-b border-slate-800">
                  <span className="text-slate-400 font-medium">Risk Level</span>
                  <span className="px-3 py-1 bg-rose-500/20 text-rose-400 rounded-full text-sm font-bold border border-rose-500/30">High</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">AI Confidence</span>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-bold border border-emerald-500/30">92%</span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-950/30 border border-indigo-500/30 p-6 rounded-xl">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Recommended Fix
              </h3>
              <p className="text-indigo-100 text-xl font-medium">Reset authentication service and regenerate tokens.</p>
              <div className="mt-4 p-3 bg-indigo-900/40 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 text-sm">
                  <strong className="text-indigo-200">Impact:</strong> All currently logged-in users will be forced to re-authenticate immediately.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-800">
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20">
                <Check className="w-5 h-5" /> Approve Fix
              </button>
              <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
                <RefreshCw className="w-5 h-5" /> Re-analyze
              </button>
              <button className="flex-1 bg-rose-950/50 hover:bg-rose-900/50 text-rose-400 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all border border-rose-500/30">
                <X className="w-5 h-5" /> Reject
              </button>
            </div>
          </div>
        </div>

        {/* Escalation Card 2: Low Confidence */}
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl overflow-hidden shadow-lg shadow-amber-900/10 opacity-75 hover:opacity-100 transition-opacity">
          <div className="bg-amber-500/10 px-6 py-4 border-b border-amber-500/20 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-semibold text-amber-200">Case #8495 - Low Confidence</h2>
            </div>
            <span className="flex items-center gap-2 text-sm font-medium text-amber-400/80">
              <Clock className="w-4 h-4" /> 45 mins ago
            </span>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">User Issue</h3>
                  <p className="text-slate-200 text-lg leading-relaxed">"My reports are generating blank PDFs since the update."</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">AI Summary</h3>
                  <p className="text-slate-300">PDF generation service is returning empty buffers. Unclear if this is a data fetching issue or a rendering engine failure.</p>
                </div>
              </div>
              
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-5">
                <div className="flex justify-between items-center pb-5 border-b border-slate-800">
                  <span className="text-slate-400 font-medium">Risk Level</span>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-bold border border-emerald-500/30">Low</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">AI Confidence</span>
                  <span className="px-3 py-1 bg-rose-500/20 text-rose-400 rounded-full text-sm font-bold border border-rose-500/30">42%</span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-950/30 border border-indigo-500/30 p-6 rounded-xl">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Recommended Fix
              </h3>
              <p className="text-indigo-100 text-xl font-medium">Rollback PDF rendering microservice to previous stable version (v2.1.4).</p>
              <div className="mt-4 p-3 bg-indigo-900/40 rounded-lg border border-indigo-500/20">
                <p className="text-indigo-300 text-sm">
                  <strong className="text-indigo-200">Impact:</strong> Minimal. Will temporarily disable new font features introduced in v2.1.5.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-800">
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20">
                <Check className="w-5 h-5" /> Approve Fix
              </button>
              <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
                <RefreshCw className="w-5 h-5" /> Re-analyze
              </button>
              <button className="flex-1 bg-rose-950/50 hover:bg-rose-900/50 text-rose-400 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all border border-rose-500/30">
                <X className="w-5 h-5" /> Reject
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

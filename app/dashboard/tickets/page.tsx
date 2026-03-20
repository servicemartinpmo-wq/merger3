import { Ticket, Filter, Search } from 'lucide-react';

export default function TicketsPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Tickets</h1>
          <p className="text-slate-500 mt-2">Manage and triage incoming support requests.</p>
        </div>
        <button className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-xl font-medium transition-colors shadow-lg shadow-navy-900/20 lamination">
          New Ticket
        </button>
      </header>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search tickets..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:ring-2 focus:ring-electric-blue/20 focus:border-electric-blue transition-all shadow-sm"
          />
        </div>
        <button className="px-4 py-2 bg-white border border-slate-200 text-navy-900 rounded-xl hover:bg-slate-50 flex items-center gap-2 shadow-sm font-medium">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      <div className="glass-card border border-slate-200 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500">ID</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500">Title</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500">Priority</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-500">Assigned To</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white/50">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                <td className="px-6 py-4 text-sm font-medium text-slate-500 group-hover:text-electric-blue transition-colors">#{1000 + i}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-navy-900">Cannot access billing portal</p>
                  <p className="text-xs text-slate-500 mt-1">Created 2 hours ago</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
                    Open
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700 border border-rose-200">
                    High
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                  Apphia.Kernel (AI)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

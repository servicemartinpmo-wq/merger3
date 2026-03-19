import { Ticket, Filter, Search } from 'lucide-react';

export default function TicketsPage() {
  return (
    <div className="p-8 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Tickets</h1>
          <p className="text-slate-400 mt-2">Manage and triage incoming support requests.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
          New Ticket
        </button>
      </header>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search tickets..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg hover:bg-slate-800 flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-950 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-400">ID</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-400">Title</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-400">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-400">Priority</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-400">Assigned To</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="hover:bg-slate-800/50 transition-colors cursor-pointer">
                <td className="px-6 py-4 text-sm font-medium text-slate-300">#{1000 + i}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-200">Cannot access billing portal</p>
                  <p className="text-xs text-slate-500 mt-1">Created 2 hours ago</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400">
                    Open
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400">
                    High
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">
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

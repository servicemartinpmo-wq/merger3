import { FileText, Plus, Search } from 'lucide-react';

export default function KnowledgePage() {
  return (
    <div className="p-8 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Knowledge Base</h1>
          <p className="text-slate-400 mt-2">Manage articles, FAQs, and AI training data.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Article
        </button>
      </header>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search knowledge base..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Billing Portal Troubleshooting", category: "Troubleshooting", tags: ["billing", "access", "portal"] },
          { title: "Password Reset Policy", category: "Policy", tags: ["security", "auth"] },
          { title: "How to upgrade your plan", category: "FAQ", tags: ["billing", "upgrade"] },
          { title: "API Rate Limits", category: "Documentation", tags: ["api", "developer"] },
          { title: "Handling Refund Requests", category: "Internal Process", tags: ["support", "refund"] },
          { title: "Service Outage Communication", category: "Policy", tags: ["incident", "communication"] },
        ].map((article, i) => (
          <div key={i} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-colors cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                {article.category}
              </span>
              <FileText className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-slate-200 mb-2">{article.title}</h3>
            <div className="flex flex-wrap gap-2 mt-4">
              {article.tags.map(tag => (
                <span key={tag} className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-400">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

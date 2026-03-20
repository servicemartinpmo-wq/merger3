import { FileText, Plus, Search } from 'lucide-react';

export default function KnowledgePage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Knowledge Base</h1>
          <p className="text-slate-500 mt-2">Manage articles, FAQs, and AI training data.</p>
        </div>
        <button className="px-4 py-2 bg-electric-blue hover:bg-electric-blue/90 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-electric-blue/20">
          <Plus className="w-5 h-5" />
          New Article
        </button>
      </header>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search knowledge base..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 focus:outline-none focus:ring-2 focus:ring-electric-blue shadow-sm"
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
          <div key={i} className="p-6 rounded-2xl glass-card border border-slate-200 shadow-xl shadow-slate-200/50 hover:border-electric-blue/50 transition-colors cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-electric-blue">
                {article.category}
              </span>
              <FileText className="w-5 h-5 text-slate-400 group-hover:text-electric-blue transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-navy-900 mb-2">{article.title}</h3>
            <div className="flex flex-wrap gap-2 mt-4">
              {article.tags.map(tag => (
                <span key={tag} className="px-2 py-1 rounded-md bg-slate-100 text-xs text-slate-600 font-medium border border-slate-200">
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

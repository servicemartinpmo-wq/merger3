import Link from 'next/link';
import { Activity, Brain, FileText, Settings, Shield, Ticket, Zap, BookOpen, AlertTriangle } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 flex items-center gap-2">
          <Brain className="w-6 h-6 text-indigo-400" />
          Apphia
        </h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Engine Core</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <Activity className="w-5 h-5" />
          Overview
        </Link>
        <Link href="/escalations" className="flex items-center gap-3 px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors font-medium">
          <AlertTriangle className="w-5 h-5" />
          Escalations
          <span className="ml-auto bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">3</span>
        </Link>
        <Link href="/tickets" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <Ticket className="w-5 h-5" />
          Tickets
        </Link>
        <Link href="/diagnostics" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <Shield className="w-5 h-5" />
          AI Diagnostics
        </Link>
        <Link href="/knowledge" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <FileText className="w-5 h-5" />
          Knowledge Base
        </Link>
        <Link href="/tech-ops" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <BookOpen className="w-5 h-5" />
          Tech-Ops Playbook
        </Link>
        <Link href="/workflows" className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <Zap className="w-5 h-5" />
          Workflows
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
          Settings
        </Link>
      </div>
    </aside>
  );
}

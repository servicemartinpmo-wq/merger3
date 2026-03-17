'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Settings2, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Zap,
  Database,
  Globe,
  MessageSquare,
  Mail,
  Calendar,
  Cloud,
  ShieldCheck
} from 'lucide-react';

const integrations = [
  { 
    id: 'slack', 
    name: 'Slack', 
    category: 'Communication', 
    status: 'Connected', 
    desc: 'Sync notifications and command Venture-OS via Slack channels.',
    icon: MessageSquare,
    color: 'bg-purple-50 text-purple-600'
  },
  { 
    id: 'stripe', 
    name: 'Stripe', 
    category: 'Finance', 
    status: 'Connected', 
    desc: 'Real-time revenue tracking and automated invoice generation.',
    icon: Zap,
    color: 'bg-indigo-50 text-indigo-600'
  },
  { 
    id: 'hubspot', 
    name: 'HubSpot', 
    category: 'CRM', 
    status: 'Disconnected', 
    desc: 'Sync leads, contacts and pipeline data with Venture-OS CRM.',
    icon: Database,
    color: 'bg-orange-50 text-orange-600'
  },
  { 
    id: 'google', 
    name: 'Google Workspace', 
    category: 'Productivity', 
    status: 'Connected', 
    desc: 'Sync calendars, emails and drive documents for AI analysis.',
    icon: Mail,
    color: 'bg-blue-50 text-blue-600'
  },
  { 
    id: 'github', 
    name: 'GitHub', 
    category: 'Development', 
    status: 'Connected', 
    desc: 'Monitor repository health and automate deployment workflows.',
    icon: Globe,
    color: 'bg-slate-900 text-white'
  },
  { 
    id: 'aws', 
    name: 'AWS', 
    category: 'Infrastructure', 
    status: 'Disconnected', 
    desc: 'Monitor cloud infrastructure and automate scaling operations.',
    icon: Cloud,
    color: 'bg-amber-50 text-amber-600'
  },
];

export function IntegrationsView() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-serif font-medium tracking-tight">System Integrations</h2>
          <p className="text-slate-500">Connect your stack to the Venture-OS command engine.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">
          <Plus size={16} />
          Request Integration
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search integrations..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Connected', 'Productivity', 'Finance'].map((filter) => (
            <button key={filter} className="px-6 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all">
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((app) => (
          <motion.div
            key={app.id}
            whileHover={{ y: -4 }}
            className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className={`w-14 h-14 rounded-2xl ${app.color} flex items-center justify-center shadow-lg shadow-current/10`}>
                <app.icon size={28} />
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
                app.status === 'Connected' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
              }`}>
                {app.status === 'Connected' ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                {app.status}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-serif font-medium text-slate-900">{app.name}</h3>
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">{app.category}</p>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                {app.desc}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
              <button className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2">
                <Settings2 size={14} />
                Configure
              </button>
              <button className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors">
                <ExternalLink size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Security Banner */}
      <div className="bg-slate-900 rounded-[32px] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-serif font-medium">Enterprise-Grade Security</h3>
            <p className="text-slate-400 max-w-md">All integrations use OAuth 2.0 and AES-256 encryption. Your data remains private and secure.</p>
          </div>
        </div>
        <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-slate-100 transition-colors relative z-10">
          Security Audit Log
        </button>
      </div>
    </div>
  );
}

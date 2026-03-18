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
  ShieldCheck,
  Palette,
  FileText,
  BarChart2,
  Users,
  Briefcase,
  Lock
} from 'lucide-react';

const integrations = [
  { id: 'slack', name: 'Slack', category: 'Communication', status: 'Connected', desc: 'Sync notifications and command Venture-OS.', icon: MessageSquare, color: 'bg-purple-50 text-purple-600' },
  { id: 'google', name: 'Google Workspace', category: 'Productivity', status: 'Connected', desc: 'Sync calendars, emails and drive documents.', icon: Mail, color: 'bg-blue-50 text-blue-600' },
  { id: 'jira', name: 'Jira', category: 'Project Management', status: 'Disconnected', desc: 'Sync issues and sprints.', icon: CheckCircle2, color: 'bg-blue-50 text-blue-600' },
  { id: 'asana', name: 'Asana', category: 'Project Management', status: 'Disconnected', desc: 'Manage project tasks.', icon: CheckCircle2, color: 'bg-rose-50 text-rose-600' },
  { id: 'trello', name: 'Trello', category: 'Project Management', status: 'Disconnected', desc: 'Sync Kanban boards.', icon: CheckCircle2, color: 'bg-blue-50 text-blue-600' },
  { id: 'ms-project', name: 'MS Project', category: 'Project Management', status: 'Disconnected', desc: 'Sync project timelines.', icon: Calendar, color: 'bg-blue-50 text-blue-600' },
  { id: 'clickup', name: 'Click-Up', category: 'Project Management', status: 'Disconnected', desc: 'Sync tasks and docs.', icon: CheckCircle2, color: 'bg-purple-50 text-purple-600' },
  { id: 'tableau', name: 'Tableau', category: 'Data', status: 'Disconnected', desc: 'Visualize data insights.', icon: BarChart2, color: 'bg-blue-50 text-blue-600' },
  { id: 'monday', name: 'Monday', category: 'Project Management', status: 'Disconnected', desc: 'Sync team workflows.', icon: CheckCircle2, color: 'bg-red-50 text-red-600' },
  { id: 'ga', name: 'Google Analytics', category: 'Data', status: 'Disconnected', desc: 'Track website traffic.', icon: BarChart2, color: 'bg-orange-50 text-orange-600' },
  { id: 'squarespace', name: 'SquareSpace', category: 'Web', status: 'Disconnected', desc: 'Manage website content.', icon: Globe, color: 'bg-black text-white' },
  { id: 'wix', name: 'Wix', category: 'Web', status: 'Disconnected', desc: 'Manage website content.', icon: Globe, color: 'bg-blue-50 text-blue-600' },
  { id: 'wordpress', name: 'Wordpress', category: 'Web', status: 'Disconnected', desc: 'Manage website content.', icon: Globe, color: 'bg-blue-50 text-blue-600' },
  { id: 'canva', name: 'Canva', category: 'Creative', status: 'Disconnected', desc: 'Design assets.', icon: Palette, color: 'bg-cyan-50 text-cyan-600' },
  { id: 'hootsuite', name: 'Hootsuite', category: 'Marketing', status: 'Disconnected', desc: 'Manage social media.', icon: Zap, color: 'bg-blue-50 text-blue-600' },
  { id: 'hubspot', name: 'HubSpot', category: 'CRM', status: 'Disconnected', desc: 'Sync CRM data.', icon: Database, color: 'bg-orange-50 text-orange-600' },
  { id: 'mailchimp', name: 'Mailchimp', category: 'Marketing', status: 'Disconnected', desc: 'Manage email campaigns.', icon: Mail, color: 'bg-yellow-50 text-yellow-600' },
  { id: 'activecampaign', name: 'Active Campaign', category: 'Marketing', status: 'Disconnected', desc: 'Automate marketing.', icon: Mail, color: 'bg-blue-50 text-blue-600' },
  { id: 'docusign', name: 'DocuSign', category: 'Legal', status: 'Disconnected', desc: 'Manage e-signatures.', icon: FileText, color: 'bg-blue-50 text-blue-600' },
  { id: 'office365', name: 'Microsoft Office 365', category: 'Productivity', status: 'Disconnected', desc: 'Sync Office docs.', icon: Mail, color: 'bg-red-50 text-red-600' },
  { id: 'salesforce', name: 'Salesforce', category: 'CRM', status: 'Disconnected', desc: 'Sync CRM data.', icon: Database, color: 'bg-blue-50 text-blue-600' },
  { id: 'sap-concur', name: 'SAP Concur', category: 'Finance', status: 'Disconnected', desc: 'Manage expenses.', icon: Briefcase, color: 'bg-blue-50 text-blue-600' },
  { id: 'navan', name: 'Navan', category: 'Finance', status: 'Disconnected', desc: 'Manage travel/expenses.', icon: Briefcase, color: 'bg-blue-50 text-blue-600' },
  { id: 'expensify', name: 'Expensify', category: 'Finance', status: 'Disconnected', desc: 'Manage expenses.', icon: Briefcase, color: 'bg-green-50 text-green-600' },
  { id: 'zendesk', name: 'ZenDesk', category: 'Support', status: 'Disconnected', desc: 'Manage support tickets.', icon: MessageSquare, color: 'bg-green-50 text-green-600' },
  { id: 'okta', name: 'Okta', category: 'Security', status: 'Disconnected', desc: 'Manage identity.', icon: Lock, color: 'bg-blue-50 text-blue-600' },
  { id: 'adobe', name: 'Adobe', category: 'Creative', status: 'Disconnected', desc: 'Creative suite.', icon: Palette, color: 'bg-red-50 text-red-600' },
];

export function IntegrationsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredIntegrations = integrations.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || app.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

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
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {['All', ...Array.from(new Set(integrations.map(i => i.category)))].map((filter) => (
            <button 
              key={filter} 
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-4 bg-white border rounded-2xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                activeFilter === filter ? 'border-slate-900 text-slate-900' : 'border-slate-200 text-slate-500 hover:text-slate-900'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((app) => (
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

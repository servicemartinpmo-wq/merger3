'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Target, 
  BarChart3, 
  ArrowUpRight, 
  Search, 
  Filter, 
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  Zap,
  Briefcase,
  Star
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { statusConfig } from '@/lib/status-colors';

const performanceData = [
  { name: 'Jan', score: 65, growth: 12 },
  { name: 'Feb', score: 72, growth: 15 },
  { name: 'Mar', score: 68, growth: 10 },
  { name: 'Apr', score: 85, growth: 22 },
  { name: 'May', score: 82, growth: 18 },
  { name: 'Jun', score: 94, growth: 28 },
];

const leads = [
  { id: 1, name: 'Sarah Jenkins', company: 'Global Tech', value: '$12,500', status: 'needs-attention', lastContact: '2h ago', avatar: 'https://picsum.photos/seed/sarah/100/100' },
  { id: 2, name: 'Michael Chen', company: 'Innovate AI', value: '$8,200', status: 'in_progress', lastContact: '5h ago', avatar: 'https://picsum.photos/seed/michael/100/100' },
  { id: 3, name: 'Emma Wilson', company: 'Design Co', value: '$15,000', status: 'in_progress', lastContact: '1d ago', avatar: 'https://picsum.photos/seed/emma/100/100' },
  { id: 4, name: 'David Ross', company: 'Future Systems', value: '$4,500', status: 'pending', lastContact: '3d ago', avatar: 'https://picsum.photos/seed/david/100/100' },
];

export function MarketingCrmView() {
  const [activeTab, setActiveTab] = useState<'marketing' | 'crm'>('marketing');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-serif font-medium tracking-tight">Growth & Relationships</h2>
          <p className="text-slate-500">Managing your market presence and customer lifecycle.</p>
        </div>
        <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button 
            onClick={() => setActiveTab('marketing')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === 'marketing' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Marketing Intelligence
          </button>
          <button 
            onClick={() => setActiveTab('crm')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === 'crm' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            CRM Command
          </button>
        </div>
      </div>

      {activeTab === 'marketing' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Algorithm Score Card */}
          <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Zap size={24} />
                </div>
                <div>
                  <h3 className="font-serif text-xl">Mega Algorithm Score</h3>
                  <p className="text-sm text-slate-500">Real-time market visibility index</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-serif text-indigo-600">94.2</div>
                <div className="text-xs font-mono text-emerald-500 uppercase tracking-widest">+4.2% vs last week</div>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#4f46e5" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'SEO Authority', value: '88%', trend: '+2%' },
                { label: 'Social Reach', value: '1.2M', trend: '+15%' },
                { label: 'Ad Efficiency', value: '4.2x', trend: '+0.4' },
                { label: 'Brand Sentiment', value: 'Positive', trend: 'Stable' },
              ].map((stat) => (
                <div key={stat.label} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">{stat.label}</div>
                  <div className="text-lg font-bold text-slate-900">{stat.value}</div>
                  <div className="text-[10px] text-emerald-500 font-bold">{stat.trend}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Score */}
          <div className="bg-slate-900 rounded-[32px] p-8 text-white space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <TrendingUp size={20} className="text-indigo-400" />
                </div>
                <h3 className="font-serif text-xl">Performance Score</h3>
              </div>

              <div className="flex items-end gap-4">
                <div className="text-6xl font-serif">82</div>
                <div className="mb-2 text-indigo-400 font-mono text-xs uppercase tracking-widest">/ 100</div>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Conversion Rate', value: 75 },
                  { label: 'Customer LTV', value: 92 },
                  { label: 'Churn Rate', value: 15 },
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest opacity-60">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        className="h-full bg-indigo-400"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-colors">
                View Full Report
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* CRM Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Active Leads', value: '1,284', icon: Users, color: 'indigo' },
              { label: 'Pipeline Value', value: '$4.2M', icon: BarChart3, color: 'emerald' },
              { label: 'Avg Deal Size', value: '$12.5K', icon: Target, color: 'amber' },
              { label: 'Win Rate', value: '32%', icon: TrendingUp, color: 'rose' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">{stat.label}</div>
                  <div className="text-xl font-bold text-slate-900">{stat.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CRM Table */}
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search leads, companies..." 
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5"
                />
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                  <Filter size={16} />
                  Filters
                </button>
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
                  <Plus size={16} />
                  Add Lead
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-left text-[10px] font-mono uppercase tracking-widest text-slate-400">Lead Name</th>
                    <th className="px-6 py-4 text-left text-[10px] font-mono uppercase tracking-widest text-slate-400">Company</th>
                    <th className="px-6 py-4 text-left text-[10px] font-mono uppercase tracking-widest text-slate-400">Value</th>
                    <th className="px-6 py-4 text-left text-[10px] font-mono uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-6 py-4 text-left text-[10px] font-mono uppercase tracking-widest text-slate-400">Last Contact</th>
                    <th className="px-6 py-4 text-right text-[10px] font-mono uppercase tracking-widest text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Image src={lead.avatar} alt={lead.name} width={40} height={40} className="w-10 h-10 rounded-xl object-cover border border-slate-200" referrerPolicy="no-referrer" />
                          <div className="font-medium text-slate-900">{lead.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{lead.company}</td>
                      <td className="px-6 py-4 font-mono text-sm font-bold text-slate-900">{lead.value}</td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${statusConfig[lead.status as keyof typeof statusConfig]?.border} ${statusConfig[lead.status as keyof typeof statusConfig]?.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[lead.status as keyof typeof statusConfig]?.color}`} />
                          {statusConfig[lead.status as keyof typeof statusConfig]?.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{lead.lastContact}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 rounded-lg hover:bg-white text-slate-400 hover:text-indigo-600 transition-colors">
                            <Mail size={16} />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-white text-slate-400 hover:text-slate-900 transition-colors">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

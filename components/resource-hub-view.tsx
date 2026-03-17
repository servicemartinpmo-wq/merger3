'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Layers, 
  GitMerge, 
  Cpu, 
  Search, 
  ChevronRight, 
  ShieldAlert, 
  Activity, 
  BarChart3, 
  Zap,
  ArrowRight,
  Filter,
  Download,
  ExternalLink
} from 'lucide-react';

const systemBundles = [
  { id: 1, name: 'Strategic Planning System', icon: BookOpen, count: 10, description: 'Strategy formulation, initiative prioritization, OKR creation, market analysis, risk assessment.' },
  { id: 2, name: 'Initiative Management System', icon: GitMerge, count: 12, description: 'Project intake, prioritization, planning, milestone tracking, initiative diagnostics.' },
  { id: 3, name: 'Organizational Health System', icon: Activity, count: 5, description: 'Org maturity assessment, operational health analysis, leadership alignment review.' },
  { id: 4, name: 'Performance Management System', icon: BarChart3, count: 6, description: 'KPI design, performance dashboards, balanced scorecard, variance analysis.' },
  { id: 5, name: 'Operational Efficiency System', icon: Zap, count: 7, description: 'Process mapping, bottleneck detection, waste detection, automation opportunities.' },
  { id: 6, name: 'Governance & Risk System', icon: ShieldAlert, count: 4, description: 'Risk management, compliance tracking, board reporting, crisis escalation.' },
];

const coreSystems = [
  { id: 'SYS-01', name: 'Strategic Alignment System', purpose: 'Ensure all initiatives support organizational strategy.', signals: ['Initiative not mapped to strategic goal', 'KPI misalignment'] },
  { id: 'SYS-02', name: 'Initiative Health Monitoring System', purpose: 'Track initiative performance and detect risk early.', signals: ['Milestone delays', 'Budget variance', 'Task backlog growth'] },
  { id: 'SYS-03', name: 'Execution Discipline System', purpose: 'Detect breakdowns in execution.', signals: ['Low task completion rates', 'Frequent missed deadlines'] },
  { id: 'SYS-04', name: 'Dependency Intelligence System', purpose: 'Detect cascading impacts between initiatives and departments.', signals: ['Cross-team dependency conflicts', 'Task blocking chains'] },
  { id: 'SYS-05', name: 'Organizational Capacity System', purpose: 'Monitor workload and prevent overload.', signals: ['Resource utilization >85%', 'Department backlog'] },
  { id: 'SYS-06', name: 'Operational Bottleneck Detection System', purpose: 'Identify operational constraints slowing execution.', signals: ['Process delays', 'Queue build-up'] },
  { id: 'SYS-07', name: 'Risk Escalation System', purpose: 'Detect and respond to operational risk.', signals: ['High risk indicators', 'Initiative volatility'] },
  { id: 'SYS-08', name: 'Initiative Portfolio Optimization System', purpose: 'Ensure resources go to the highest-impact initiatives.', signals: ['Too many initiatives active', 'Low ROI initiatives'] },
];

export function ResourceHubView() {
  const [activeTab, setActiveTab] = useState<'bundles' | 'systems' | 'knowledge'>('bundles');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xl shadow-slate-900/20">
              <Layers size={24} />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-medium tracking-tight">Resource Hub</h1>
              <p className="text-xs font-mono uppercase tracking-[0.3em] text-slate-400">System Architecture & Workflows</p>
            </div>
          </div>
          <p className="text-slate-500 max-w-2xl text-lg leading-relaxed">
            The Master Workflow Library and System Bundles. These 25 Core Systems power the Venture-OS Command Engine, turning raw data into strategic execution.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search systems..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all w-72"
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-slate-900 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex gap-1 p-1.5 bg-slate-200/50 rounded-2xl border border-slate-300/30 w-fit">
        {[
          { id: 'bundles', label: 'System Bundles' },
          { id: 'systems', label: 'Core Systems' },
          { id: 'knowledge', label: 'Knowledge Base' },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all relative ${
              activeTab === tab.id ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div layoutId="hub-tab" className="absolute inset-0 bg-white shadow-sm border border-slate-200 rounded-xl" />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === 'bundles' && (
            <motion.div 
              key="bundles"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {systemBundles.map((bundle, idx) => (
                <div 
                  key={bundle.id}
                  className="group bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center mb-6 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                      <bundle.icon size={24} />
                    </div>
                    <h3 className="text-2xl font-serif font-medium mb-3">{bundle.name}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-8">{bundle.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">{bundle.count} Workflows</span>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-300 group-hover:border-slate-900 group-hover:text-slate-900 transition-all">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'systems' && (
            <motion.div 
              key="systems"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {coreSystems.map((sys, idx) => (
                <div 
                  key={sys.id}
                  className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col lg:flex-row gap-8 hover:border-slate-900 transition-all duration-500 group"
                >
                  <div className="lg:w-1/4">
                    <span className="text-[10px] font-mono text-slate-400 mb-1 block uppercase tracking-widest">{sys.id}</span>
                    <h3 className="text-xl font-serif font-medium group-hover:text-slate-900 transition-colors">{sys.name}</h3>
                  </div>
                  <div className="lg:w-1/3 border-l border-slate-100 pl-8">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-3 block">Primary Purpose</span>
                    <p className="text-sm text-slate-600 leading-relaxed">{sys.purpose}</p>
                  </div>
                  <div className="lg:w-5/12 border-l border-slate-100 pl-8">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-3 block">Trigger Signals</span>
                    <div className="flex flex-wrap gap-2">
                      {sys.signals.map((sig, sIdx) => (
                        <span key={sIdx} className="px-3 py-1 bg-rose-50 text-rose-700 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-rose-100">
                          {sig}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'knowledge' && (
            <motion.div 
              key="knowledge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border border-slate-200 rounded-[3rem] p-16 text-center space-y-8"
            >
              <div className="w-20 h-20 rounded-[2rem] bg-slate-900 text-white flex items-center justify-center mx-auto shadow-2xl shadow-slate-900/20">
                <Cpu size={40} />
              </div>
              <div className="space-y-4 max-w-2xl mx-auto">
                <h3 className="text-3xl font-serif font-medium">Knowledge Superbase</h3>
                <p className="text-slate-500 text-lg leading-relaxed">
                  The platform continuously grows using frameworks from major bodies of knowledge (e.g., Porter&apos;s Five Forces, Lean Six Sigma, PMBOK, Blue Ocean Strategy).
                </p>
              </div>
              <div className="flex items-center justify-center gap-4">
                <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold uppercase tracking-widest shadow-lg shadow-slate-900/20 hover:scale-105 transition-all">
                  Browse Frameworks
                </button>
                <button className="px-8 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                  <Download size={16} />
                  Export Library
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

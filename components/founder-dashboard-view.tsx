'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, TrendingUp, AlertTriangle, Target, DollarSign } from 'lucide-react';
import { calculateOperationalHealth } from '@/lib/health-score';
import coreSystemsData from '@/data/core-systems.json';

// Mock data for the dashboard
const mockHealthData = [
  { domain: 'Operations', score: 86, weight: 0.3 },
  { domain: 'Revenue', score: 78, weight: 0.3 },
  { domain: 'Product', score: 90, weight: 0.2 },
  { domain: 'Team Health', score: 74, weight: 0.2 },
];

export function FounderDashboardView() {
  const healthReport = calculateOperationalHealth(mockHealthData);

  return (
    <div className="space-y-8 bg-slate-900 p-8 min-h-screen text-white">
      <header className="space-y-2">
        <h1 className="text-4xl font-serif font-medium tracking-tight">Founder Mode</h1>
        <p className="text-slate-500">McKinsey-grade insights for your startup.</p>
      </header>

      {/* Company Health Score */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 bg-slate-900 text-white p-8 rounded-3xl flex items-center justify-between">
          <div>
            <h2 className="text-sm font-mono uppercase tracking-widest opacity-60 mb-2">Company Health Score</h2>
            <div className="text-6xl font-serif font-medium">{healthReport.overallScore}/100</div>
            <p className="mt-4 opacity-80">{healthReport.summary}</p>
          </div>
          <TrendingUp size={64} className="opacity-20" />
        </div>
        
        {/* Progressive Metrics */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Growth Score</h3>
          <div className="text-3xl font-serif font-medium text-emerald-600">88</div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-3xl">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Execution Score</h3>
          <div className="text-3xl font-serif font-medium text-blue-600">92</div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-3xl">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Financial Health</h3>
          <div className="text-3xl font-serif font-medium text-indigo-600">79</div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-3xl">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Team Efficiency</h3>
          <div className="text-3xl font-serif font-medium text-purple-600">85</div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-3xl">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Community Health</h3>
          <div className="text-3xl font-serif font-medium text-amber-600">91</div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-3xl">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Brand Presence</h3>
          <div className="text-3xl font-serif font-medium text-rose-600">74</div>
        </div>
      </section>

      {/* Risks & Opportunities */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-medium flex items-center gap-2"><AlertTriangle className="text-rose-500" /> Top Risks</h2>
          <div className="space-y-4">
            {coreSystemsData.systems.slice(0, 3).map((sys) => (
              <div key={sys.id} className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                <h4 className="font-bold text-rose-900">{sys.name}</h4>
                <p className="text-sm text-rose-700">{sys.signals[0]}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-medium flex items-center gap-2"><Target className="text-emerald-500" /> Top Opportunities</h2>
          <div className="space-y-4">
            {coreSystemsData.systems.slice(15, 18).map((sys) => (
              <div key={sys.id} className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <h4 className="font-bold text-emerald-900">{sys.name}</h4>
                <p className="text-sm text-emerald-700">{sys.purpose}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

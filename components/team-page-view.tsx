'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, Shield, Loader2, MessageSquare } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

// MOCHA Role Colors
const MOCHA_COLORS = {
  Manager: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  Owner: 'bg-showroom-accent/10 text-showroom-accent border-showroom-accent/20',
  Consulted: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  Helped: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  Accountable: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
};

export function TeamPageView() {
  const [teamSize, setTeamSize] = useState('2-10');
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulated real-time updates
    const timer = setTimeout(() => {
      setReport({
        updates: [
          { id: 1, user: 'Sarah J.', action: 'completed', target: 'SOC2 Audit Prep', time: '10m ago' },
          { id: 2, user: 'Mike T.', action: 'updated', target: 'Q3 Marketing Launch', time: '1h ago' },
        ],
        tasks: [
          { id: 1, user: 'Alex R.', title: 'Database Migration', status: 'In Progress' },
          { id: 2, user: 'Sarah J.', title: 'Annual Planning Offsite', status: 'Pending' },
        ],
        mocha: [
          { role: 'Manager', user: 'Sarah J.' },
          { role: 'Owner', user: 'Mike T.' },
          { role: 'Consulted', user: 'Alex R.' },
          { role: 'Helped', user: 'Ryan Torres' },
          { role: 'Accountable', user: 'Sarah J.' },
        ]
      });
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [teamSize]);

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif font-medium tracking-tight">Team Page</h1>
          <p className="text-slate-500">Real-time updates and MOCHA accountability.</p>
        </div>
        <select value={teamSize} onChange={(e) => setTeamSize(e.target.value)} className="p-3 bg-white border border-slate-200 rounded-xl text-sm">
          <option value="1">1 (Solo)</option>
          <option value="2-10">2–10</option>
          <option value="11-50">11–50</option>
          <option value="51-200">51–200</option>
          <option value="200+">200+</option>
        </select>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Updates */}
        <section className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-medium flex items-center gap-3"><Activity size={20} /> User Updates</h2>
          <div className="space-y-4">
            {report.updates.map((u: any) => (
              <div key={u.id} className="p-6 bg-white border border-slate-200 rounded-3xl flex justify-between items-center">
                <p><span className="font-bold">{u.user}</span> {u.action} <span className="text-showroom-accent">{u.target}</span></p>
                <span className="text-xs text-slate-400">{u.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* MOCHA */}
        <section className="space-y-6">
          <h2 className="text-xl font-medium flex items-center gap-3"><Shield size={20} /> MOCHA Framework</h2>
          <div className="space-y-3">
            {report.mocha.map((m: any, i: number) => (
              <div key={i} className={`p-4 rounded-2xl border ${MOCHA_COLORS[m.role as keyof typeof MOCHA_COLORS]}`}>
                <div className="text-xs font-bold uppercase tracking-widest mb-1">{m.role}</div>
                <div className="font-medium">{m.user}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

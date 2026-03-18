'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { statusConfig } from '@/lib/status-colors';

const initiatives = [
  { id: 'INI-001', name: 'Customer Portal v2', status: 'on-track', owner: 'Ryan Torres', department: 'Product' },
  { id: 'INI-002', name: 'SOC2 Compliance', status: 'needs-attention', owner: 'Sarah J.', department: 'Security' },
  { id: 'INI-003', name: 'Q3 Marketing Launch', status: 'delayed', owner: 'Mike T.', department: 'Marketing' },
  { id: 'INI-004', name: 'Legacy System Migration', status: 'abandoned', owner: 'Alex R.', department: 'Tech-Ops' },
];

export function InitiativesView() {
  return (
    <div className="space-y-8">
      <h2 className="font-display text-2xl font-light text-white">Initiatives</h2>
      <div className="bg-white/5 rounded-2xl border border-white/10 p-6 glass-reflection">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-500 text-[10px] font-mono uppercase tracking-widest border-b border-white/5">
              <th className="pb-4">ID</th>
              <th className="pb-4">Name</th>
              <th className="pb-4">Status</th>
              <th className="pb-4">Owner</th>
              <th className="pb-4">Department</th>
            </tr>
          </thead>
          <tbody>
            {initiatives.map((ini) => (
              <tr key={ini.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                <td className="py-4 font-mono text-xs text-slate-400">{ini.id}</td>
                <td className="py-4 text-sm text-white">{ini.name}</td>
                <td className="py-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${statusConfig[ini.status as keyof typeof statusConfig].border} ${statusConfig[ini.status as keyof typeof statusConfig].text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[ini.status as keyof typeof statusConfig].color}`} />
                    {statusConfig[ini.status as keyof typeof statusConfig].label}
                  </span>
                </td>
                <td className="py-4 text-sm text-slate-300">{ini.owner}</td>
                <td className="py-4 text-sm text-slate-300">{ini.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

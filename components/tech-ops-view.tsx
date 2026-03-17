'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, Server, AlertOctagon, Zap, GitCommit, Database, ShieldAlert, Cpu, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/lib/supabase';

const mockAlgoData = [
  { time: '08:00', score: 82, engagement: 75, freshness: 90 },
  { time: '10:00', score: 85, engagement: 78, freshness: 88 },
  { time: '12:00', score: 81, engagement: 72, freshness: 85 },
  { time: '14:00', score: 88, engagement: 85, freshness: 92 },
  { time: '16:00', score: 92, engagement: 88, freshness: 95 },
  { time: '18:00', score: 90, engagement: 86, freshness: 93 },
];

const mockJobs = [
  { id: 'JOB-892', name: 'compute_health_metrics', status: 'running' as const, duration: '45s' },
  { id: 'JOB-891', name: 'sync_algo_signals', status: 'completed' as const, duration: '12s' },
  { id: 'JOB-890', name: 'validate_dependencies', status: 'completed' as const, duration: '3s' },
  { id: 'JOB-889', name: 'generate_advisories', status: 'pending' as const, duration: '--' },
];

const mockAlerts = [
  { id: '1', type: 'critical' as const, title: 'Circular Dependency Blocked', message: "Task 'API Auth Update' attempted to link to 'DB Migration', creating a circular loop. Action denied.", time: '10m ago' },
  { id: '2', type: 'warning' as const, title: 'Cascade Risk Detected', message: "Milestone 'Q3 Launch' shifted by +5 days. 14 downstream tasks are now at risk of missing deadlines.", time: '1h ago' },
  { id: '3', type: 'info' as const, title: 'Capacity Overload Warning', message: "Backend team utilization > 85%. Recommend reassigning 'Cache Optimization' to Q4.", time: '3h ago' },
];

export function TechOpsView() {
  const [isLive, setIsLive] = useState(false);
  const [algoData, setAlgoData] = useState(mockAlgoData);
  const [currentScore, setCurrentScore] = useState({ score: 90, decimal: 4, engagement: 86, freshness: 93, efficiency: 95, relevance: 82 });
  const [jobs, setJobs] = useState(mockJobs);
  const [alerts, setAlerts] = useState(mockAlerts);

  useEffect(() => {
    async function fetchSupabaseData() {
      if (!supabase) return;

      try {
        // Fetch Algorithm Scores
        const { data: scores } = await supabase
          .from('algorithm_scores')
          .select('*')
          .order('calculated_at', { ascending: false })
          .limit(6);

        if (scores && scores.length > 0) {
          const formattedScores = scores.reverse().map(s => ({
            time: new Date(s.calculated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            score: Math.round(s.mega_algorithm_score || 0),
            engagement: Math.round(s.engagement_score || 0),
            freshness: Math.round(s.freshness_score || 0),
          }));
          setAlgoData(formattedScores);
          
          const latest = scores[scores.length - 1]; // Because we reversed it
          const fullScore = (latest.mega_algorithm_score || 0).toFixed(1);
          setCurrentScore({
            score: parseInt(fullScore.split('.')[0]),
            decimal: parseInt(fullScore.split('.')[1] || '0'),
            engagement: Math.round(latest.engagement_score || 0),
            freshness: Math.round(latest.freshness_score || 0),
            efficiency: Math.round(latest.efficiency_score || 0),
            relevance: Math.round(latest.relevance_score || 0),
          });
          setIsLive(true);
        }

        // Fetch Org Jobs
        const { data: jobsData } = await supabase
          .from('org_jobs')
          .select('*')
          .order('started_at', { ascending: false })
          .limit(5);

        if (jobsData && jobsData.length > 0) {
          setJobs(jobsData.map(j => ({
            id: j.id,
            name: j.process_name,
            status: j.status as 'running' | 'completed' | 'pending',
            duration: j.duration || '--'
          })));
          setIsLive(true);
        }

        // Fetch Blocked Action Items for Alerts
        const { data: blockedItems } = await supabase
          .from('action_items')
          .select('*')
          .eq('status', 'blocked')
          .order('due_date', { ascending: true })
          .limit(3);

        if (blockedItems && blockedItems.length > 0) {
          setAlerts(blockedItems.map(item => ({
            id: item.id,
            type: 'critical',
            title: 'Task Blocked',
            message: `Task '${item.title}' is currently blocked. Due date: ${new Date(item.due_date).toLocaleDateString()}.`,
            time: 'Live'
          })));
          setIsLive(true);
        }

      } catch (error) {
        console.error('Error fetching Supabase data:', error);
      }
    }

    fetchSupabaseData();
  }, []);

  return (
    <div className="space-y-12 font-sans text-white">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
            <Activity className="text-[#00FF00]" size={36} />
            Tech-Ops Command
          </h1>
          <p className="text-gray-400 max-w-2xl text-lg">
            High-intensity monitoring of system signals, algorithm scores, and execution dependencies.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge status="operational" label="API Gateway" />
          <StatusBadge status="degraded" label="DB Replica" />
          <StatusBadge status="operational" label="AI Engine" />
        </div>
      </header>

      {/* Mega Algorithm Score */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Cpu className="text-indigo-400" />
            Mega Algorithm Score
          </h2>
          {isLive ? (
            <span className="px-3 py-1 bg-[#00FF00]/10 border border-[#00FF00]/20 rounded-full text-xs font-mono text-[#00FF00] flex items-center gap-1.5">
              <Database size={12} /> LIVE SYNC
            </span>
          ) : (
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-mono text-amber-500 flex items-center gap-1.5">
              <Database size={12} /> MOCK DATA
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Score Card */}
          <div className="col-span-1 bg-[#151619] border border-white/10 rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF00]/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-[#00FF00]/20" />
            <div className="relative z-10">
              <p className="text-gray-400 font-mono text-sm uppercase tracking-widest mb-4">Current Score</p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-7xl font-bold text-white tracking-tighter">{currentScore.score}</span>
                <span className="text-xl text-[#00FF00] font-mono">.{currentScore.decimal}</span>
              </div>
              
              <div className="space-y-4">
                <ScoreBar label="Engagement (20%)" value={currentScore.engagement} color="bg-blue-500" />
                <ScoreBar label="Freshness (25%)" value={currentScore.freshness} color="bg-[#00FF00]" />
                <ScoreBar label="Efficiency (40%)" value={currentScore.efficiency} color="bg-purple-500" />
                <ScoreBar label="Relevance (15%)" value={currentScore.relevance} color="bg-amber-500" />
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="col-span-1 lg:col-span-2 bg-[#151619] border border-white/10 rounded-2xl p-6 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={algoData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12, fontFamily: 'monospace' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12, fontFamily: 'monospace' }} domain={[60, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A1A1C', borderRadius: '8px', border: '1px solid #333', color: '#fff' }}
                  itemStyle={{ fontFamily: 'monospace', fontSize: '14px' }}
                />
                <Line type="monotone" dataKey="score" stroke="#00FF00" strokeWidth={3} dot={{ r: 4, fill: '#00FF00', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#fff' }} name="Mega Score" />
                <Line type="monotone" dataKey="engagement" stroke="#3B82F6" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Engagement" />
                <Line type="monotone" dataKey="freshness" stroke="#A855F7" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Freshness" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Dependency Guardrails & Org Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Dependency Guardrails */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <ShieldAlert className="text-rose-500" />
              Dependency Guardrails
            </h2>
            <span className="text-sm font-mono text-gray-500">FAIL-SAFE ACTIVE</span>
          </div>
          <div className="space-y-4">
            {alerts.map(alert => (
              <AlertCard
                key={alert.id}
                type={alert.type}
                title={alert.title}
                message={alert.message}
                time={alert.time}
              />
            ))}
          </div>
        </section>

        {/* Org Jobs */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Server className="text-blue-400" />
              Active Org Jobs
            </h2>
            <button className="text-sm font-mono text-[#00FF00] hover:text-white transition-colors flex items-center gap-1">
              <Zap size={14} /> RUN ALL PENDING
            </button>
          </div>
          <div className="bg-[#151619] border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-gray-400 font-mono">
                  <th className="p-4 font-medium">Job ID</th>
                  <th className="p-4 font-medium">Process</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm font-mono">
                {jobs.map(job => (
                  <JobRow key={job.id} id={job.id} name={job.name} status={job.status} duration={job.duration} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatusBadge({ status, label }: { status: 'operational' | 'degraded' | 'down', label: string }) {
  const colors = {
    operational: 'bg-[#00FF00]/10 text-[#00FF00] border-[#00FF00]/20',
    degraded: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    down: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  };
  const dotColors = {
    operational: 'bg-[#00FF00]',
    degraded: 'bg-amber-500',
    down: 'bg-rose-500',
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${colors[status]} text-xs font-mono uppercase tracking-wider`}>
      <span className={`w-2 h-2 rounded-full ${dotColors[status]} animate-pulse`} />
      {label}
    </div>
  );
}

function ScoreBar({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
        <span>{label}</span>
        <span className="text-white">{value}</span>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function AlertCard({ type, title, message, time }: { type: 'critical' | 'warning' | 'info', title: string, message: string, time: string }) {
  const styles = {
    critical: 'border-rose-500/30 bg-rose-500/5 text-rose-400',
    warning: 'border-amber-500/30 bg-amber-500/5 text-amber-400',
    info: 'border-blue-500/30 bg-blue-500/5 text-blue-400',
  };
  const icons = {
    critical: <AlertOctagon size={18} className="text-rose-500" />,
    warning: <AlertTriangle size={18} className="text-amber-500" />,
    info: <Activity size={18} className="text-blue-500" />,
  };

  return (
    <div className={`p-4 rounded-xl border ${styles[type]} flex gap-4 items-start`}>
      <div className="mt-0.5">{icons[type]}</div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-semibold text-white">{title}</h4>
          <span className="text-xs font-mono opacity-70">{time}</span>
        </div>
        <p className="text-sm opacity-80 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

function JobRow({ id, name, status, duration }: { id: string, name: string, status: 'running' | 'completed' | 'pending', duration: string }) {
  const statusColors = {
    running: 'text-blue-400',
    completed: 'text-[#00FF00]',
    pending: 'text-gray-500',
  };

  return (
    <tr className="hover:bg-white/5 transition-colors group">
      <td className="p-4 text-gray-400 group-hover:text-white transition-colors">{id}</td>
      <td className="p-4 text-white flex items-center gap-2">
        <GitCommit size={14} className="text-gray-500" />
        {name}
      </td>
      <td className={`p-4 ${statusColors[status] || statusColors.pending}`}>
        <div className="flex items-center gap-2">
          {status === 'running' && <Zap size={12} className="animate-pulse" />}
          {status.toUpperCase()}
        </div>
      </td>
      <td className="p-4 text-right text-gray-400">{duration}</td>
    </tr>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, TrendingUp, CheckCircle2, Clock, ArrowRight, Database } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { supabase } from '@/lib/supabase';

const mockKpiData = [
  { month: 'Jan', target: 80, actual: 75 },
  { month: 'Feb', target: 82, actual: 78 },
  { month: 'Mar', target: 85, actual: 86 },
  { month: 'Apr', target: 88, actual: 84 },
  { month: 'May', target: 90, actual: 92 },
  { month: 'Jun', target: 92, actual: 95 },
];

const mockMilestones = [
  { id: '1', title: 'Q3 Marketing Launch', due_date: 'Mar 20, 2026', status: 'blocked', owner: 'Sarah J.' },
  { id: '2', title: 'Database Migration', due_date: 'Mar 25, 2026', status: 'in_progress', owner: 'Tech Ops' },
  { id: '3', title: 'Annual Planning Offsite', due_date: 'Apr 02, 2026', status: 'pending', owner: 'Exec Team' },
  { id: '4', title: 'SOC2 Audit Prep', due_date: 'Apr 15, 2026', status: 'pending', owner: 'Compliance' },
];

export function ExecutivePmoView() {
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [briefing, setBriefing] = useState<string | null>(null);
  
  // Data State
  const [isLive, setIsLive] = useState(false);
  const [kpiData, setKpiData] = useState(mockKpiData);
  const [milestones, setMilestones] = useState(mockMilestones);
  const [healthMetrics, setHealthMetrics] = useState({
    completion_rate: 85,
    cycle_time_avg_seconds: 207360, // 2.4 days
    team_focus_score: 92
  });

  useEffect(() => {
    async function fetchSupabaseData() {
      if (!supabase) return;

      try {
        // Fetch Health Metrics
        const { data: healthData } = await supabase
          .from('org_health_metrics')
          .select('*')
          .order('recorded_at', { ascending: false })
          .limit(1)
          .single();

        if (healthData) {
          setHealthMetrics({
            completion_rate: healthData.completion_rate || 85,
            cycle_time_avg_seconds: healthData.cycle_time_avg_seconds || 207360,
            team_focus_score: healthData.team_focus_score || 92
          });
          setIsLive(true);
        }

        // Fetch Milestones (Action Items)
        const { data: actionItems } = await supabase
          .from('action_items')
          .select('*')
          .order('due_date', { ascending: true })
          .limit(5);

        if (actionItems && actionItems.length > 0) {
          setMilestones(actionItems.map(item => ({
            id: item.id,
            title: item.title,
            due_date: new Date(item.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: item.status,
            owner: 'Assigned' // Simplified for demo
          })));
          setIsLive(true);
        }

        // Fetch KPIs
        const { data: kpis } = await supabase
          .from('kpis')
          .select('*')
          .order('recorded_month', { ascending: true });

        if (kpis && kpis.length > 0) {
          setKpiData(kpis.map(k => ({
            month: k.recorded_month,
            target: k.target_value,
            actual: k.current_value
          })));
          setIsLive(true);
        }
      } catch (error) {
        console.error('Error fetching Supabase data:', error);
      }
    }

    fetchSupabaseData();
  }, []);

  const generateBriefing = async () => {
    setIsGeneratingBrief(true);
    try {
      const res = await fetch('/api/advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_items: milestones,
          kpis: kpiData,
          org_health_metrics: healthMetrics
        })
      });
      const data = await res.json();
      setBriefing(data.advisory);
    } catch (e) {
      console.error(e);
      setBriefing("Error generating briefing. Please check API configuration.");
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  return (
    <div className="space-y-12 font-sans text-gray-900">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-300 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-serif text-5xl font-light tracking-tight text-gray-900">
              Strategic Overview
            </h1>
            {isLive ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider rounded-full border border-emerald-200">
                <Database size={12} /> Live Sync
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-semibold uppercase tracking-wider rounded-full border border-amber-200">
                <Database size={12} /> Mock Data
              </span>
            )}
          </div>
          <p className="text-gray-500 max-w-2xl text-lg leading-relaxed">
            Real-time pulse of organizational health, key performance indicators, and critical path milestones.
          </p>
        </div>
        <button
          onClick={generateBriefing}
          disabled={isGeneratingBrief}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 font-medium"
        >
          {isGeneratingBrief ? (
            <span className="animate-pulse">Synthesizing...</span>
          ) : (
            <>
              <FileText size={18} />
              One-Click Digest
            </>
          )}
        </button>
      </header>

      {/* Briefing Section */}
      {briefing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200"
        >
          <h2 className="font-serif text-2xl font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            Executive Advisory
          </h2>
          <div className="prose prose-gray max-w-none">
            {briefing.split('\n').map((line, i) => (
              <p key={i} className="text-gray-700 leading-relaxed">{line}</p>
            ))}
          </div>
        </motion.div>
      )}

      {/* Health Gauges */}
      <section>
        <h2 className="font-serif text-2xl font-semibold mb-6">Organizational Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HealthCard
            title="Completion Rate"
            value={`${healthMetrics.completion_rate}%`}
            trend="+2.4%"
            icon={<CheckCircle2 className="text-emerald-600" />}
            description="Tasks completed vs committed"
          />
          <HealthCard
            title="Avg Cycle Time"
            value={`${(healthMetrics.cycle_time_avg_seconds / 86400).toFixed(1)} days`}
            trend="-0.5 days"
            icon={<Clock className="text-indigo-600" />}
            description="From 'in-progress' to 'done'"
          />
          <HealthCard
            title="Team Focus Score"
            value={`${healthMetrics.team_focus_score}/100`}
            trend="+5 pts"
            icon={<TrendingUp className="text-amber-600" />}
            description="Completed / Active tasks ratio"
          />
        </div>
      </section>

      {/* KPI & Milestones Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* KPI Chart */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-semibold">KPI Trajectory</h2>
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">YTD 2026</span>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={kpiData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#111827', fontWeight: 500 }}
                />
                <Area type="monotone" dataKey="actual" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" name="Actual" />
                <Line type="monotone" dataKey="target" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Milestones */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-semibold">Critical Path</h2>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-4">
            {milestones.map((m) => (
              <MilestoneItem
                key={m.id}
                title={m.title}
                date={m.due_date}
                status={m.status}
                owner={m.owner}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function HealthCard({ title, value, trend, icon, description }: any) {
  const isPositive = trend.startsWith('+');
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
        <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
          {trend}
        </span>
      </div>
      <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">{title}</h3>
      <div className="text-3xl font-serif font-semibold text-gray-900 mb-2">{value}</div>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}

function MilestoneItem({ title, date, status, owner }: any) {
  const statusColors = {
    blocked: 'bg-rose-50 text-rose-700 border-rose-200',
    in_progress: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    pending: 'bg-gray-50 text-gray-600 border-gray-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <div className="group flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-2 h-12 rounded-full ${status === 'blocked' ? 'bg-rose-500' : status === 'in_progress' ? 'bg-indigo-500' : 'bg-gray-300'}`} />
        <div>
          <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">{title}</h4>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Clock size={14} /> {date}</span>
            <span>•</span>
            <span>{owner}</span>
          </div>
        </div>
      </div>
      <span className={`px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-full border ${(statusColors as any)[status] || statusColors.pending}`}>
        {status.replace('_', ' ')}
      </span>
    </div>
  );
}

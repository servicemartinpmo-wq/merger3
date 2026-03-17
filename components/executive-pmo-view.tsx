'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, CheckCircle2, Clock, ArrowRight, Database, Activity, Cpu, AlertTriangle, Info, AlertOctagon, Target, ShieldAlert, Zap, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell } from 'recharts';
import { GoogleGenAI, Type } from '@google/genai';

const mockSignals = [
  { id: 'sig-1', type: 'warning', message: 'Project X budget burn rate increased 15% WoW.', source: 'Financial Systems', timestamp: '2h ago' },
  { id: 'sig-2', type: 'critical', message: 'Dependency bottleneck detected: Database Migration blocking Q3 Marketing Launch.', source: 'Workflow Engine', timestamp: '4h ago' },
  { id: 'sig-3', type: 'info', message: 'Team focus score trending positively across Engineering.', source: 'HRIS', timestamp: '1d ago' },
];

const mockRiskForecast = [
  { category: 'Resource Capacity', riskScore: 85, trend: 'up' },
  { category: 'Vendor Delivery', riskScore: 45, trend: 'down' },
  { category: 'Budget Variance', riskScore: 60, trend: 'stable' },
  { category: 'Technical Debt', riskScore: 75, trend: 'up' },
];

export function ExecutivePmoView() {
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [briefing, setBriefing] = useState<string | null>(null);
  
  // Data State
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [kpiData, setKpiData] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [healthMetrics, setHealthMetrics] = useState({
    completion_rate: 0,
    cycle_time_avg_seconds: 0,
    team_focus_score: 0
  });

  useEffect(() => {
    async function fetchExecutiveData() {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        console.error('Gemini API key is not configured');
        setIsLive(false);
        setIsLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });

      try {
        const systemInstruction = `
          You are the Apphia Engine, an AI executive PMO tool.
          Analyze the current organizational state and generate an executive dashboard report.
          
          Simulated Current State:
          - Q3 Marketing Launch is blocked.
          - Database Migration is in progress.
          - Annual Planning Offsite is pending.
          - SOC2 Audit Prep is pending.
          - Health metrics are generally good but cycle time is slightly high.
          - KPIs are trending upwards.
          
          Generate a JSON response with the following structure:
          1. kpiData: Array of objects { month, target, actual } (6 months of data)
          2. milestones: Array of objects { id, title, due_date, status, owner } (status must be 'blocked', 'in_progress', 'pending', or 'completed')
          3. healthMetrics: Object { completion_rate, cycle_time_avg_seconds, team_focus_score }
          
          Make the data look realistic and professional for a tech company.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: 'Generate the executive PMO report.',
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                kpiData: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      month: { type: Type.STRING },
                      target: { type: Type.NUMBER },
                      actual: { type: Type.NUMBER },
                    },
                    required: ['month', 'target', 'actual'],
                  },
                },
                milestones: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      due_date: { type: Type.STRING },
                      status: { type: Type.STRING },
                      owner: { type: Type.STRING },
                    },
                    required: ['id', 'title', 'due_date', 'status', 'owner'],
                  },
                },
                healthMetrics: {
                  type: Type.OBJECT,
                  properties: {
                    completion_rate: { type: Type.NUMBER },
                    cycle_time_avg_seconds: { type: Type.NUMBER },
                    team_focus_score: { type: Type.NUMBER },
                  },
                  required: ['completion_rate', 'cycle_time_avg_seconds', 'team_focus_score'],
                },
              },
              required: ['kpiData', 'milestones', 'healthMetrics'],
            },
          },
        });

        const jsonStr = response.text?.trim();
        if (jsonStr) {
          const report = JSON.parse(jsonStr);
          setKpiData(report.kpiData);
          setMilestones(report.milestones);
          setHealthMetrics(report.healthMetrics);
        }
      } catch (error) {
        console.error('Error fetching executive data:', error);
        setIsLive(false);
      } finally {
        setIsLoading(false);
      }
    }

    fetchExecutiveData();
  }, []);

  const generateBriefing = async () => {
    setIsGeneratingBrief(true);
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      setBriefing("Gemini API key is not configured.");
      setIsGeneratingBrief(false);
      return;
    }

    const ai = new GoogleGenAI({ apiKey });

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate an executive briefing based on the following data:
          Milestones: ${JSON.stringify(milestones)}
          KPIs: ${JSON.stringify(kpiData)}
          Health Metrics: ${JSON.stringify(healthMetrics)}
          
          Focus on risks and recommendations. Keep it concise and professional.`,
        config: {
          systemInstruction: "You are an AI PMO advisor. Provide strategic insights.",
        }
      });
      setBriefing(response.text || "No briefing generated.");
    } catch (e) {
      console.error(e);
      setBriefing("Error generating briefing. Please check API configuration.");
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-white rounded-3xl shadow-sm border border-slate-200">
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <Loader2 size={32} className="animate-spin text-indigo-600" />
          <p>Apphia Engine is analyzing executive metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 font-sans text-slate-900 bg-white min-h-[calc(100vh-8rem)] p-8 rounded-3xl shadow-sm border border-slate-200">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-serif text-4xl font-medium tracking-tight text-slate-900">
              Executive Command Center
            </h1>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-widest rounded-full border border-teal-200">
              <Cpu size={14} className="animate-pulse" /> Apphia.x Active
            </span>
            {isLive ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider rounded-full border border-emerald-200">
                <Database size={12} /> Live Sync
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold uppercase tracking-wider rounded-full border border-amber-200">
                <Database size={12} /> Mock Data
              </span>
            )}
          </div>
          <p className="text-slate-500 max-w-2xl text-base leading-relaxed">
            Real-time operational intelligence, dependency mapping, and strategic advisory powered by the Apphia Engine.
          </p>
        </div>
        <button
          onClick={generateBriefing}
          disabled={isGeneratingBrief}
          className="inline-flex items-center gap-2 bg-navy-900 text-white px-6 py-3 rounded-md hover:bg-navy-800 transition-colors disabled:opacity-50 font-medium shadow-sm bg-slate-900 hover:bg-slate-800"
        >
          {isGeneratingBrief ? (
            <span className="flex items-center gap-2">
              <Cpu size={18} className="animate-spin" /> Synthesizing...
            </span>
          ) : (
            <>
              <FileText size={18} />
              Generate Advisory Brief
            </>
          )}
        </button>
      </header>

      {/* Briefing Section */}
      {briefing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-slate-50 p-8 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
          <h2 className="font-serif text-2xl font-semibold mb-4 flex items-center gap-2 text-slate-900">
            <Cpu size={20} className="text-teal-600" />
            Apphia Advisory Guidance
          </h2>
          <div className="prose prose-slate max-w-none">
            {briefing.split('\n').map((line, i) => {
              if (line.trim() === '') return <br key={i} />;
              const isHeader = line.startsWith('Signal Detection:') || line.startsWith('Diagnosis:') || line.startsWith('Advisory Guidance:');
              if (isHeader) {
                const [header, ...rest] = line.split(':');
                return (
                  <p key={i} className="text-slate-700 leading-relaxed mb-4">
                    <strong className="text-navy-900 font-semibold text-slate-900">{header}:</strong> {rest.join(':')}
                  </p>
                );
              }
              return <p key={i} className="text-slate-700 leading-relaxed mb-4">{line}</p>;
            })}
          </div>
        </motion.div>
      )}

      {/* Signal Detection Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <Activity className="text-rose-600" />
            Signal Detection
          </h2>
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Live Feed</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockSignals.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      </section>

      {/* Health Gauges */}
      <section>
        <h2 className="font-serif text-2xl font-semibold mb-6 text-slate-900">Operational Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HealthCard
            title="Completion Rate"
            value={`${healthMetrics.completion_rate}%`}
            trend="+2.4%"
            icon={<CheckCircle2 className="text-teal-600" />}
            description="Tasks completed vs committed"
            score={healthMetrics.completion_rate}
          />
          <HealthCard
            title="Avg Cycle Time"
            value={`${(healthMetrics.cycle_time_avg_seconds / 86400).toFixed(1)} days`}
            trend="-0.5 days"
            icon={<Clock className="text-teal-600" />}
            description="From 'in-progress' to 'done'"
            score={85} // Mock score for color coding
          />
          <HealthCard
            title="Team Focus Score"
            value={`${healthMetrics.team_focus_score}/100`}
            trend="+5 pts"
            icon={<TrendingUp className="text-teal-600" />}
            description="Completed / Active tasks ratio"
            score={healthMetrics.team_focus_score}
          />
        </div>
      </section>

      {/* Predictive Analytics & Risk Forecasting */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-semibold text-slate-900 flex items-center gap-2">
              <Zap className="text-indigo-600" />
              Predictive Analytics
            </h2>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest px-2 py-1 bg-indigo-50 rounded-full border border-indigo-200">SYS-24</span>
          </div>
          <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200 h-[300px] flex flex-col justify-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600 mt-1">
                  <Target size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Q3 Goal Projection</h4>
                  <p className="text-sm text-slate-600 mt-1">Based on current velocity, the Q3 Marketing Launch is projected to miss its deadline by <span className="font-semibold text-rose-600">4 days</span>. Recommend reallocating 2 engineers from Tech Debt.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600 mt-1">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Resource Burnout Risk</h4>
                  <p className="text-sm text-slate-600 mt-1">Design team capacity is operating at 94%. Historical data suggests a 40% increase in error rates within 2 weeks if sustained.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-semibold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="text-rose-600" />
              Strategic Risk Forecast
            </h2>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest px-2 py-1 bg-rose-50 rounded-full border border-rose-200">SYS-11</span>
          </div>
          <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockRiskForecast} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12 }} width={120} />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="riskScore" radius={[0, 4, 4, 0]} barSize={24}>
                  {mockRiskForecast.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.riskScore > 80 ? '#e11d48' : entry.riskScore > 60 ? '#f59e0b' : '#0d9488'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* KPI & Milestones Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* KPI Chart */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-semibold text-slate-900">KPI Trajectory</h2>
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">YTD 2026</span>
          </div>
          <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={kpiData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 500 }}
                />
                <Area type="monotone" dataKey="actual" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" name="Actual" />
                <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Milestones */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-semibold text-slate-900">Critical Path</h2>
            <button className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1">
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

function HealthCard({ title, value, trend, icon, description, score }: any) {
  const isPositive = trend.startsWith('+');
  
  // Color-coded signals: Red (0–40%), Yellow (41–60%), Green (61–80%), Electric Blue (81–100%)
  let scoreColor = 'text-slate-900';
  let scoreBg = 'bg-slate-50';
  if (score <= 40) {
    scoreColor = 'text-red-600';
    scoreBg = 'bg-red-50 border-red-200';
  } else if (score <= 60) {
    scoreColor = 'text-yellow-600';
    scoreBg = 'bg-yellow-50 border-yellow-200';
  } else if (score <= 80) {
    scoreColor = 'text-green-600';
    scoreBg = 'bg-green-50 border-green-200';
  } else {
    scoreColor = 'text-blue-600'; // Electric Blue
    scoreBg = 'bg-blue-50 border-blue-200';
  }

  return (
    <div className={`p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow ${scoreBg}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
        <span className={`text-sm font-medium px-2.5 py-1 rounded-full bg-white shadow-sm ${isPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
          {trend}
        </span>
      </div>
      <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">{title}</h3>
      <div className={`text-3xl font-serif font-semibold mb-2 ${scoreColor}`}>{value}</div>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}

function MilestoneItem({ title, date, status, owner }: any) {
  const statusColors = {
    blocked: 'bg-red-50 text-red-700 border-red-200',
    in_progress: 'bg-teal-50 text-teal-700 border-teal-200',
    pending: 'bg-slate-50 text-slate-600 border-slate-200',
    completed: 'bg-green-50 text-green-700 border-green-200',
  };

  return (
    <div className="group flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-2 h-12 rounded-full ${status === 'blocked' ? 'bg-red-500' : status === 'in_progress' ? 'bg-teal-500' : 'bg-slate-300'}`} />
        <div>
          <h4 className="font-medium text-slate-900 group-hover:text-teal-600 transition-colors">{title}</h4>
          <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
            <span className="flex items-center gap-1"><Clock size={14} /> {date}</span>
            <span>•</span>
            <span>{owner}</span>
          </div>
        </div>
      </div>
      <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${(statusColors as any)[status] || statusColors.pending}`}>
        {status.replace('_', ' ')}
      </span>
    </div>
  );
}

function SignalCard({ signal }: { signal: any }) {
  const isCritical = signal.type === 'critical';
  const isWarning = signal.type === 'warning';
  
  const Icon = isCritical ? AlertOctagon : isWarning ? AlertTriangle : Info;
  const colorClass = isCritical ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-blue-600';
  const bgClass = isCritical ? 'bg-rose-50 border-rose-200' : isWarning ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200';

  return (
    <div className={`p-5 rounded-xl border shadow-sm ${bgClass} flex flex-col justify-between`}>
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2 bg-white rounded-lg shadow-sm ${colorClass}`}>
            <Icon size={18} />
          </div>
          <span className="text-xs font-medium text-slate-500">{signal.timestamp}</span>
        </div>
        <p className="text-sm font-medium text-slate-900 leading-snug mb-3">
          {signal.message}
        </p>
      </div>
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-black/5">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{signal.source}</span>
        <button className={`text-xs font-bold uppercase tracking-wider ${colorClass} hover:opacity-80`}>
          Analyze
        </button>
      </div>
    </div>
  );
}

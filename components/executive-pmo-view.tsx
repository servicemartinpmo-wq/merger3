'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, CheckCircle2, Clock, ArrowRight, Database, Activity, Cpu, AlertTriangle, Info, AlertOctagon, Target, ShieldAlert, Zap, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell } from 'recharts';
import { GoogleGenAI, Type } from '@google/genai';
import { statusConfig } from '@/lib/status-colors';

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

import { useApphia } from '@/hooks/use-apphia';
import { pmoService } from '@/lib/services/pmo-service';
import { dataService } from '@/lib/services/data-service';
import { useSupabase } from '@/components/supabase-provider';

export function ExecutivePmoView() {
  const { user } = useSupabase();
  const { signals, advisories, isLoading: isApphiaLoading, error: apphiaError } = useApphia();
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [briefing, setBriefing] = useState<string | null>(null);
  
  // Data State
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [kpiData, setKpiData] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [maturityScore, setMaturityScore] = useState(0);
  const [healthMetrics, setHealthMetrics] = useState({
    completion_rate: 0,
    cycle_time_avg_seconds: 0,
    team_focus_score: 0
  });

  useEffect(() => {
    async function fetchExecutiveData() {
      if (!user) return;
      setIsLoading(true);
      
      try {
        // Fetch real data from Supabase
        const [initiatives, score] = await Promise.all([
          dataService.getItems<any>('initiatives', user.id),
          pmoService.calculateMaturityScore(user.id)
        ]);

        setMaturityScore(score);
        
        // If no initiatives, fallback to AI generation or mock
        if (initiatives.length === 0) {
          // Fallback logic (existing AI generation)
          await generateMockData();
        } else {
          setMilestones(initiatives.map(i => ({
            id: i.id,
            title: i.name,
            due_date: i.end_date,
            status: i.status,
            owner: 'Team'
          })));
          setIsLive(true);
        }
      } catch (error) {
        console.error('Error fetching executive data:', error);
        setIsLive(false);
      } finally {
        setIsLoading(false);
      }
    }

    async function generateMockData() {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        setIsLive(false);
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      // ... existing AI generation logic ...
    }

    fetchExecutiveData();
  }, [user]);

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
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] rounded-3xl laminated-surface border border-white/10">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <Loader2 size={32} className="animate-spin text-showroom-accent" />
          <p className="font-mono text-xs uppercase tracking-widest">Apphia Engine is analyzing executive metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 font-sans text-slate-100 bg-slate-900 min-h-[calc(100vh-8rem)] p-10 rounded-3xl border border-white/10">
      {/* What's happening section */}
      <section className="mb-12">
        <h2 className="font-display text-2xl font-light text-white mb-6">What&apos;s happening</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CommandCard title="Today&apos;s Priorities" count={5} icon={<Target className="text-showroom-accent" />} />
          <CommandCard title="Risks" count={2} icon={<ShieldAlert className="text-rose-500" />} />
          <CommandCard title="Approvals" count={3} icon={<CheckCircle2 className="text-emerald-500" />} />
          <CommandCard title="Deadlines" count={4} icon={<Clock className="text-amber-500" />} />
        </div>
      </section>

      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="font-display text-4xl font-light tracking-tight text-white text-glow">
              Executive Command Center
            </h1>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-showroom-accent/10 text-showroom-accent text-[10px] font-bold uppercase tracking-widest rounded-full border border-showroom-accent/20">
              <Cpu size={14} className="animate-pulse" /> Apphia.x Active
            </span>
            {isLive ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider rounded-full border border-emerald-500/20">
                <Database size={12} /> Live Sync
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-semibold uppercase tracking-wider rounded-full border border-amber-500/20">
                <Database size={12} /> Mock Data
              </span>
            )}
          </div>
          <p className="text-slate-400 max-w-2xl text-base leading-relaxed font-light">
            Real-time operational intelligence, dependency mapping, and strategic advisory powered by the Apphia Engine.
          </p>
        </div>
        <button
          onClick={generateBriefing}
          disabled={isGeneratingBrief}
          className="inline-flex items-center gap-2 bg-showroom-accent text-white px-8 py-4 rounded-xl hover:bg-showroom-accent/90 transition-all disabled:opacity-50 font-bold uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(59,130,246,0.3)]"
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
          className="bg-white/5 p-8 rounded-2xl border border-white/10 relative overflow-hidden glass-reflection"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-showroom-accent shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
          <h2 className="font-display text-2xl font-light mb-6 flex items-center gap-3 text-white">
            <Cpu size={20} className="text-showroom-accent" />
            Apphia Advisory Guidance
          </h2>
          <div className="prose prose-invert max-w-none">
            {briefing.split('\n').map((line, i) => {
              if (line.trim() === '') return <br key={i} />;
              const isHeader = line.startsWith('Signal Detection:') || line.startsWith('Diagnosis:') || line.startsWith('Advisory Guidance:');
              if (isHeader) {
                const [header, ...rest] = line.split(':');
                return (
                  <p key={i} className="text-slate-300 leading-relaxed mb-4">
                    <strong className="text-showroom-accent font-bold uppercase tracking-widest text-xs">{header}:</strong> {rest.join(':')}
                  </p>
                );
              }
              return <p key={i} className="text-slate-300 leading-relaxed mb-4 font-light">{line}</p>;
            })}
          </div>
        </motion.div>
      )}

      {/* Signal Detection Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl font-light text-white flex items-center gap-3">
            <Activity className="text-rose-500" />
            Signal Detection
          </h2>
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.3em]">Live Feed</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {signals.length === 0 && (
            <div className="col-span-3 p-8 rounded-2xl bg-white/5 border border-white/10 text-center text-slate-500 italic">
              No critical signals detected by Apphia.
            </div>
          )}
          {signals.map((signal) => (
            <SignalCard key={signal.id} signal={{
              ...signal,
              timestamp: new Date(signal.timestamp).toLocaleTimeString(),
              source: 'Apphia Kernel'
            }} />
          ))}
        </div>
      </section>

      {/* Health Gauges */}
      <section>
        <h2 className="font-display text-2xl font-light mb-8 text-white text-glow">Operational Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <HealthCard
            title="Maturity Score"
            value={`${maturityScore}%`}
            trend="+5.2%"
            icon={<Target className="text-showroom-accent" />}
            description="Overall organizational operational maturity"
            score={maturityScore}
          />
          <HealthCard
            title="Avg Cycle Time"
            value={`${(healthMetrics.cycle_time_avg_seconds / 86400).toFixed(1)} days`}
            trend="-0.5 days"
            icon={<Clock className="text-showroom-accent" />}
            description="From 'in-progress' to 'done'"
            score={85} // Mock score for color coding
          />
          <HealthCard
            title="Team Focus Score"
            value={`${healthMetrics.team_focus_score}/100`}
            trend="+5 pts"
            icon={<TrendingUp className="text-showroom-accent" />}
            description="Completed / Active tasks ratio"
            score={healthMetrics.team_focus_score}
          />
        </div>
      </section>

      {/* Predictive Analytics & Risk Forecasting */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl font-light text-white flex items-center gap-3">
              <Zap className="text-showroom-accent" />
              Predictive Analytics
            </h2>
            <span className="text-[10px] font-mono font-bold text-showroom-accent uppercase tracking-widest px-3 py-1 bg-showroom-accent/10 rounded-full border border-showroom-accent/20">SYS-24</span>
          </div>
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10 h-[300px] flex flex-col justify-center glass-reflection">
            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-showroom-accent mt-1">
                  <Target size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-white">Q3 Goal Projection</h4>
                  <p className="text-sm text-slate-400 mt-2 font-light leading-relaxed">Based on current velocity, the Q3 Marketing Launch is projected to miss its deadline by <span className="font-bold text-rose-500">4 days</span>. Recommend reallocating 2 engineers from Tech Debt.</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-showroom-accent mt-1">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-white">Resource Burnout Risk</h4>
                  <p className="text-sm text-slate-400 mt-2 font-light leading-relaxed">Design team capacity is operating at 94%. Historical data suggests a 40% increase in error rates within 2 weeks if sustained.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl font-light text-white flex items-center gap-3">
              <ShieldAlert className="text-rose-500" />
              Strategic Risk Forecast
            </h2>
            <span className="text-[10px] font-mono font-bold text-rose-500 uppercase tracking-widest px-3 py-1 bg-rose-500/10 rounded-full border border-rose-500/20">SYS-11</span>
          </div>
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10 h-[300px] glass-reflection">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockRiskForecast} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 300 }} width={120} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="riskScore" radius={[0, 4, 4, 0]} barSize={20}>
                  {mockRiskForecast.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.riskScore > 80 ? '#f43f5e' : entry.riskScore > 60 ? '#f59e0b' : '#3b82f6'} />
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
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl font-light text-white">KPI Trajectory</h2>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em]">YTD 2026</span>
          </div>
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10 h-[400px] glass-reflection">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={kpiData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 300 }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 300 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                  itemStyle={{ color: '#fff', fontWeight: 500 }}
                />
                <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" name="Actual" />
                <Line type="monotone" dataKey="target" stroke="rgba(255,255,255,0.2)" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Milestones */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl font-light text-white">Critical Path</h2>
            <button className="text-xs font-bold uppercase tracking-widest text-showroom-accent hover:text-white flex items-center gap-2 transition-colors">
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-5">
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

function CommandCard({ title, count, icon }: any) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 glass-reflection flex items-center gap-4">
      <div className="p-3 bg-white/5 rounded-xl border border-white/10">{icon}</div>
      <div>
        <div className="text-2xl font-display font-light text-white">{count}</div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500">{title}</div>
      </div>
    </div>
  );
}

function HealthCard({ title, value, trend, icon, description, score }: any) {
  const isPositive = trend.startsWith('+');
  
  // Color-coded signals: Red (0–40%), Yellow (41–60%), Green (61–80%), Electric Blue (81–100%)
  let scoreColor = 'text-white';
  let scoreBg = 'bg-white/5';
  let borderColor = 'border-white/10';
  
  if (score <= 40) {
    scoreColor = 'text-rose-500';
    scoreBg = 'bg-rose-500/5';
    borderColor = 'border-rose-500/20';
  } else if (score <= 60) {
    scoreColor = 'text-amber-500';
    scoreBg = 'bg-amber-500/5';
    borderColor = 'border-amber-500/20';
  } else if (score <= 80) {
    scoreColor = 'text-emerald-500';
    scoreBg = 'bg-emerald-500/5';
    borderColor = 'border-emerald-500/20';
  } else {
    scoreColor = 'text-showroom-accent';
    scoreBg = 'bg-showroom-accent/5';
    borderColor = 'border-showroom-accent/20';
  }

  return (
    <div className={`p-8 rounded-2xl border transition-all hover:scale-[1.02] duration-300 laminated-surface glass-reflection ${scoreBg} ${borderColor}`}>
      <div className="flex items-start justify-between mb-6">
        <div className="p-3 bg-white/5 rounded-xl border border-white/10">{icon}</div>
        <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {trend}
        </span>
      </div>
      <h3 className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.2em] mb-2">{title}</h3>
      <div className={`text-4xl font-display font-light mb-3 ${scoreColor} text-glow`}>{value}</div>
      <p className="text-xs text-slate-500 font-light leading-relaxed">{description}</p>
    </div>
  );
}

function MilestoneItem({ title, date, status, owner }: any) {
  // Map status to our new global colors
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const statusClass = `${config.color.replace('bg-', 'bg-').replace('500', '500/10')} ${config.text} ${config.border}`;

  return (
    <div className="group flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10 hover:border-showroom-accent/30 transition-all duration-300 glass-reflection">
      <div className="flex items-center gap-5">
        <div className={`w-1.5 h-12 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)] ${config.color} ${config.color.replace('bg-', 'shadow-').replace('500', '500/40')}`} />
        <div>
          <h4 className="font-medium text-white group-hover:text-showroom-accent transition-colors">{title}</h4>
          <div className="flex items-center gap-4 mt-2 text-[10px] font-mono uppercase tracking-widest text-slate-500">
            <span className="flex items-center gap-1.5"><Clock size={12} /> {date}</span>
            <span className="opacity-30">•</span>
            <span>{owner}</span>
          </div>
        </div>
      </div>
      <span className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full border ${statusClass}`}>
        {status.replace('_', ' ')}
      </span>
    </div>
  );
}

function SignalCard({ signal }: { signal: any }) {
  const isCritical = signal.type === 'critical';
  const isWarning = signal.type === 'warning';
  
  const Icon = isCritical ? AlertOctagon : isWarning ? AlertTriangle : Info;
  const colorClass = isCritical ? 'text-rose-500' : isWarning ? 'text-amber-500' : 'text-showroom-accent';
  const bgClass = isCritical ? 'bg-rose-500/5 border-rose-500/20' : isWarning ? 'bg-amber-500/5 border-amber-500/20' : 'bg-showroom-accent/5 border-showroom-accent/20';

  return (
    <div className={`p-6 rounded-2xl border shadow-2xl transition-all hover:scale-[1.02] duration-300 laminated-surface glass-reflection ${bgClass} flex flex-col justify-between`}>
      <div>
        <div className="flex items-start justify-between mb-5">
          <div className={`p-3 bg-white/5 rounded-xl border border-white/10 ${colorClass}`}>
            <Icon size={20} />
          </div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{signal.timestamp}</span>
        </div>
        <p className="text-sm font-medium text-white leading-relaxed mb-4 font-light">
          {signal.message}
        </p>
      </div>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">{signal.source}</span>
        <button className={`text-[10px] font-bold uppercase tracking-[0.2em] ${colorClass} hover:text-white transition-colors`}>
          Analyze
        </button>
      </div>
    </div>
  );
}

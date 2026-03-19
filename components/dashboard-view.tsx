'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Zap, Plus, AlertCircle, Info, CheckCircle, 
  Loader2, Sparkles, ArrowRight, Calendar, Users, 
  TrendingUp, ShieldAlert, Clock, BarChart3, Rocket
} from 'lucide-react';
import { useApphia } from '@/hooks/use-apphia';
import { Signal, Advisory } from '@/lib/apphia/kernel';
import { BannerCarousel } from '@/components/banner-carousel';

import { useSupabase } from '@/components/supabase-provider';
import { dataService } from '@/lib/services/data-service';

export function DashboardView({ assistedMode }: { assistedMode: boolean }) {
  const { user } = useSupabase();
  const { signals, advisories, isLoading: apphiaLoading, error, refresh } = useApphia();
  const [mounted, setMounted] = useState(false);
  const [priorities, setPriorities] = useState<any[]>([]);
  const [initiativesAtRisk, setInitiativesAtRisk] = useState<any[]>([]);
  const [stats, setStats] = useState({
    activeInitiatives: 0,
    transformative: 0,
    operational: 0,
    risksCount: 0,
    health: 94
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [allInitiatives, allActionItems] = await Promise.all([
        dataService.getItems<any>('initiatives', user.id),
        dataService.getItems<any>('action_items', user.id)
      ]);

      // Process Priorities (Action Items)
      const topPriorities = allActionItems
        .filter(item => item.status !== 'completed')
        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
        .slice(0, 3)
        .map(item => ({
          id: item.id,
          title: item.title,
          due: item.due_date ? new Date(item.due_date).toLocaleDateString() : 'No date',
          category: item.task_type || 'Task'
        }));
      setPriorities(topPriorities);

      // Process Initiatives at Risk
      const atRisk = allInitiatives
        .filter(i => i.status === 'at-risk' || i.status === 'critical')
        .map(i => ({
          id: i.id,
          name: i.title,
          status: i.status,
          owner: i.owner_id || 'Unassigned',
          reason: i.description?.slice(0, 50) + '...' || 'Operational delay'
        }));
      setInitiativesAtRisk(atRisk);

      // Process Stats
      const active = allInitiatives.filter(i => i.status !== 'completed');
      setStats({
        activeInitiatives: active.length,
        transformative: active.filter(i => i.type === 'transformative').length,
        operational: active.filter(i => i.type === 'operational').length,
        risksCount: atRisk.length,
        health: 94 // Placeholder for now
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-sky-600" />
          <p className="text-slate-500 font-medium animate-pulse">Initializing Executive Command View...</p>
        </div>
      </div>
    );
  }

  const delegationMatrix = [
    { role: "Executive", load: 85, tasks: 12 },
    { role: "Operations", load: 62, tasks: 24 },
    { role: "Technical", load: 45, tasks: 18 },
    { role: "Creative", load: 30, tasks: 8 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Good morning, Martin.</h1>
          <p className="text-slate-500 mt-1">Here is your operational status for Thursday, March 19th.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Schedule
          </button>
          <button className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-bold hover:bg-sky-700 transition-colors flex items-center gap-2 shadow-lg shadow-sky-600/20">
            <Plus className="w-4 h-4" />
            New Initiative
          </button>
        </div>
      </div>

      {/* Top Stats / Signals */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Op Health</span>
            <div className={`w-2 h-2 rounded-full ${stats.health > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.health}%</div>
          <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> System Nominal
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Initiatives</span>
            <Rocket className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.activeInitiatives}</div>
          <div className="text-xs text-slate-500 mt-1">{stats.transformative} transformative, {stats.operational} operational</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Team Velocity</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">4.8</div>
          <div className="text-xs text-slate-500 mt-1">Tasks per day avg</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Risks Detected</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.risksCount}</div>
          <div className="text-xs text-rose-600 font-medium mt-1">
            {stats.risksCount > 0 ? 'Requires immediate attention' : 'No critical risks detected'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Priorities & Risks */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Priorities */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-sky-500" />
                Today's Priorities
              </h2>
              <button className="text-sm text-sky-600 font-bold hover:text-sky-700">View All</button>
            </div>
            <div className="divide-y divide-slate-100">
              {priorities.map((item) => (
                <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-sky-100 group-hover:text-sky-600 transition-colors">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {item.due}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-sky-600 opacity-0 group-hover:opacity-100 transition-all">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Initiatives at Risk */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                Initiatives at Risk
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {initiativesAtRisk.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-rose-50 border border-rose-100">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-12 rounded-full bg-rose-500" />
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                        <p className="text-xs text-rose-700 font-medium mt-0.5">{item.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Owner</div>
                      <div className="text-sm font-medium text-slate-900">{item.owner}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Executive Load Matrix */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              Executive Load & Delegation
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {delegationMatrix.map((item) => (
                <div key={item.role} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase">{item.role}</span>
                    <span className="text-xs font-bold text-slate-900">{item.load}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.load}%` }}
                      className={`h-full rounded-full ${
                        item.load > 80 ? 'bg-rose-500' : 
                        item.load > 60 ? 'bg-amber-500' : 
                        'bg-emerald-500'
                      }`}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {item.tasks} active tasks
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: AI Insights & Signals */}
        <div className="space-y-8">
          {/* Apphia AI Insights */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                Apphia Intelligence
              </h2>
              <div className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold uppercase tracking-wider">
                Live Analysis
              </div>
            </div>
            <div className="p-6 space-y-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest animate-pulse">Analyzing operational signals...</p>
                </div>
              ) : (
                <>
                  {advisories.length > 0 ? (
                    advisories.map((advisory, idx) => (
                      <div key={idx} className="space-y-4">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                          <p className="text-sm leading-relaxed text-slate-700 font-medium">{advisory.guidance}</p>
                        </div>
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recommended Actions</span>
                          <div className="space-y-2">
                            {advisory.actions.map((action, aidx) => (
                              <div key={aidx} className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                                <div className="w-1 h-1 rounded-full bg-indigo-500" />
                                {action}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Info className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                      <p className="text-sm text-slate-400 font-bold uppercase tracking-widest text-[10px]">No critical advisories at this time.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* Operational Signals */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Live Signals
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {signals.length > 0 ? (
                signals.map((signal) => (
                  <div key={signal.id} className={`p-4 rounded-xl border flex gap-3 ${
                    signal.severity === 'high' || signal.severity === 'critical' ? 'bg-rose-50 border-rose-100 text-rose-900' :
                    signal.severity === 'medium' ? 'bg-amber-50 border-amber-100 text-amber-900' :
                    'bg-sky-50 border-sky-100 text-sky-900'
                  }`}>
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold">{signal.message}</p>
                      <p className="text-[10px] opacity-70 mt-1 uppercase tracking-wider font-bold">
                        {signal.type} • {new Date(signal.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-8 h-8 text-emerald-100 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">All systems nominal.</p>
                </div>
              )}
              <button 
                onClick={() => refresh()}
                className="w-full py-2 text-xs font-bold text-slate-500 hover:text-sky-600 transition-colors border-t border-slate-100 mt-2 pt-4"
              >
                REFRESH SIGNALS
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

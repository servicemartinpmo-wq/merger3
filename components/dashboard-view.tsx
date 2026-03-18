'use client';

import { useState } from 'react';
import { AIAssistant } from '@/components/ai-assistant';
import { RewardNotification } from '@/components/reward-notification';
import { FeatureNudge } from '@/components/feature-nudge';
import { LearningEngineView } from '@/components/learning-engine-view';
import { ExecutivePmoView } from '@/components/executive-pmo-view';
import { AssistedTooltip } from '@/components/assisted-tooltip';
import { Trophy, Zap, Moon, Sun, Plus } from 'lucide-react';
import { BannerCarousel } from '@/components/banner-carousel';

import { useApphia } from '@/hooks/use-apphia';
import { Signal, Advisory } from '@/lib/apphia/kernel';
import { AlertCircle, Info, CheckCircle, Loader2, Sparkles } from 'lucide-react';

export function DashboardView({ assistedMode }: { assistedMode: boolean }) {
  const { signals, advisories, isLoading, error, refresh } = useApphia();
  const today = new Date();
  const day = today.getDay();
  let content = { title: '', content: '', teamWins: [] as string[] };
  
  if (day === 1) {
    content = {
      title: "Weekly Projection",
      content: "Focusing on key initiatives for the week ahead.",
      teamWins: ["Completed Q1 planning", "Onboarded new lead", "Finalized project roadmap"]
    };
  } else if (day === 5) {
    content = {
      title: "Weekly Debrief",
      content: "Reviewing the week's accomplishments.",
      teamWins: ["Launched feature X", "Resolved critical bug", "Client feedback positive"]
    };
  } else {
    content = {
      title: "Daily Operational Status",
      content: "Maintaining operational health.",
      teamWins: ["Daily standup completed", "Resource conflict resolved"]
    };
  }

  const [reactions, setReactions] = useState<Record<number, string[]>>({});
  const [manualWins, setManualWins] = useState<string[]>([]);
  const [newWin, setNewWin] = useState('');

  const addReaction = (winIndex: number, emoji: string) => {
    setReactions(prev => ({
      ...prev,
      [winIndex]: [...(prev[winIndex] || []), emoji]
    }));
  };

  const addManualWin = () => {
    if (newWin.trim()) {
      setManualWins(prev => [...prev, newWin]);
      setNewWin('');
    }
  };

  return (
    <div className="space-y-8 bg-slate-900 p-8 min-h-screen text-white">
      {/* Banner Section */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-light">Dashboard Overview</h1>
        </div>
        
        <BannerCarousel />

        {/* Apphia Signals & Advisories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Zap className="text-yellow-400 w-5 h-5" />
                Operational Signals
              </h2>
              {isLoading && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
            </div>
            <div className="space-y-3">
              {signals.length === 0 && !isLoading && (
                <p className="text-sm text-slate-500 italic">No critical signals detected.</p>
              )}
              {signals.map(signal => (
                <div key={signal.id} className={`p-3 rounded-lg text-sm flex items-start gap-3 ${
                  signal.severity === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                  signal.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                  'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}>
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{signal.message}</p>
                    <p className="text-xs opacity-70 mt-1">{new Date(signal.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-medium flex items-center gap-2 mb-4">
              <Sparkles className="text-blue-400 w-5 h-5" />
              Apphia Advisory
            </h2>
            <div className="space-y-3">
              {advisories.length === 0 && !isLoading && (
                <p className="text-sm text-slate-500 italic">No strategic advisories available.</p>
              )}
              {advisories.map((advisory, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 text-sm">
                  <div className="flex items-start gap-3">
                    <Info className="text-blue-400 w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-200">{advisory.guidance}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {advisory.actions.map((action, aidx) => (
                          <span key={aidx} className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 text-[10px] font-medium uppercase tracking-wider">
                            {action}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4">
            <Zap className="text-blue-400" size={32} />
            <div>
              <h2 className="text-xl font-display font-light">{content.title}</h2>
              <p className="text-sm text-slate-400">{content.content}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Trophy className="text-yellow-400" size={32} />
            <div className="flex-1">
              <h2 className="text-xl font-display font-light">Team Wins</h2>
              <div className="space-y-1 mt-2">
                {content.teamWins.map((win, i) => (
                  <div key={i} className="text-sm text-slate-300 flex items-center gap-2">
                    <span>{win}</span>
                    <button onClick={() => addReaction(i, '🚀')} className="hover:scale-125 transition-transform">🚀</button>
                    <button onClick={() => addReaction(i, '🎉')} className="hover:scale-125 transition-transform">🎉</button>
                    <button onClick={() => addReaction(i, '👏')} className="hover:scale-125 transition-transform">👏</button>
                    {reactions[i]?.map((r, ri) => <span key={ri}>{r}</span>)}
                  </div>
                ))}
                {manualWins.map((win, i) => (
                  <div key={`manual-${i}`} className="text-sm text-emerald-300 flex items-center gap-2">
                    <span>{win} (Manual)</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 mt-2">
                  <input 
                    value={newWin}
                    onChange={(e) => setNewWin(e.target.value)}
                    placeholder="Add a minor win..."
                    className="bg-slate-800 rounded-full px-3 py-1 text-xs text-white"
                  />
                  <button onClick={addManualWin} className="text-emerald-400 hover:text-emerald-300"><Plus size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AIAssistant />
      <RewardNotification message="Great work on the Q3 Launch!" points={50} />
      <FeatureNudge feature="founder-mode" message="Try Founder Mode for executive-level insights." />
      <LearningEngineView />
      <ExecutivePmoView />
    </div>
  );
}

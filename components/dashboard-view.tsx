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

export function DashboardView({ assistedMode }: { assistedMode: boolean }) {
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
    <div className="space-y-8">
      {/* Banner Section */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-light">Dashboard Overview</h1>
        </div>
        
        <BannerCarousel />

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

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, CheckCircle2, FileText, Upload, Brain, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { statusConfig } from '@/lib/status-colors';

const initialActionItems = [
  { id: 'ACT-001', title: 'Escalate API docs to CTO', status: 'in_progress', owner: 'Ryan Torres', date: '3-8-2025', directive: 'Customer Portal v2', priority: 'High', category: 'Action Items' },
  { id: 'ACT-002', title: 'Review Q2 Strategic Roadmap', status: 'pending', owner: 'Mike T.', date: '3-10-2025', directive: 'Strategy Alignment', priority: 'Medium', category: 'Follow Up' },
];

const initialMeetings = [
  { id: 'MTG-001', title: 'Q2 Planning Offsite', time: '10:00 AM', status: 'pending' },
  { id: 'MTG-002', title: 'Weekly Operational Sync', time: '2:00 PM', status: 'on-track' },
];

export function ActionItemsView({ actionItems, setActionItems, setView, setSelectedEmailId }: { actionItems: any[], setActionItems: any, setView: any, setSelectedEmailId: any }) {
  const [brainDump, setBrainDump] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [meetings, setMeetings] = useState(initialMeetings);

  const processBrainDump = async () => {
    if (!brainDump.trim()) return;
    setIsProcessing(true);
    
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Gemini API key not configured');
      setIsProcessing(false);
      return;
    }

    const ai = new GoogleGenAI({ apiKey });

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Parse the following brain dump into structured action items and meetings.
          Brain Dump: "${brainDump}"
          
          Return JSON: {
            "actionItems": [{ "title": string, "status": "Pending", "owner": "Unassigned", "date": string, "directive": "General", "priority": "Medium" }],
            "meetings": [{ "title": string, "time": string, "status": "Prep Needed" }]
          }`,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.actionItems) setActionItems([...actionItems, ...parsed.actionItems.map((item: any, i: number) => ({ ...item, id: `ACT-${Date.now()}-${i}` }))]);
      if (parsed.meetings) setMeetings([...meetings, ...parsed.meetings.map((item: any, i: number) => ({ ...item, id: `MTG-${Date.now()}-${i}` }))]);
      setBrainDump('');
    } catch (e) {
      console.error('Error processing brain dump:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-12">
      <h2 className="font-display text-2xl font-light text-white">Action Items & Events</h2>
      
      {/* Brain Dump Input */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 glass-reflection">
        <div className="flex items-center gap-3 mb-4 text-showroom-accent">
          <Brain size={20} />
          <h3 className="text-sm font-mono uppercase tracking-widest">INTJ Brain Dump</h3>
        </div>
        <textarea
          value={brainDump}
          onChange={(e) => setBrainDump(e.target.value)}
          placeholder="Capture tasks, meetings, or ideas here (e.g., 'Schedule meeting with Sarah tomorrow at 2pm and remind Ryan to update the API docs')..."
          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-showroom-accent/50 min-h-[100px]"
        />
        <button
          onClick={processBrainDump}
          disabled={isProcessing || !brainDump.trim()}
          className="mt-4 inline-flex items-center gap-2 bg-showroom-accent text-white px-6 py-2 rounded-lg hover:bg-showroom-accent/90 transition-all disabled:opacity-50 font-bold uppercase tracking-widest text-[10px]"
        >
          {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Brain size={14} />}
          Process Input
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section>
          <h3 className="text-sm font-mono uppercase tracking-widest text-slate-500 mb-6">Action Items</h3>
          <div className="space-y-12">
            {['Action Items', 'Follow Up', 'Messaging', 'Meetings', 'Email', 'Uncategorized'].map(category => (
              <div key={category}>
                <h4 className="text-xs font-mono uppercase tracking-widest text-slate-600 mb-4">{category}</h4>
                <div className="space-y-4">
                  {actionItems.filter(item => (category === 'Uncategorized' ? !item.category : item.category === category)).map((item) => (
                    <div key={item.id} className="p-5 bg-white/5 rounded-2xl border border-white/10 glass-reflection flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white">{item.title}</h4>
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">
                          {item.directive} • {item.owner} {item.link && (
                            <button 
                              onClick={() => {
                                setSelectedEmailId(item.emailId);
                                setView('email');
                              }}
                              className="text-showroom-accent hover:underline"
                            >
                              • {item.link}
                            </button>
                          )}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${statusConfig[item.status as keyof typeof statusConfig]?.border} ${statusConfig[item.status as keyof typeof statusConfig]?.text}`}>
                        {statusConfig[item.status as keyof typeof statusConfig]?.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-mono uppercase tracking-widest text-slate-500 mb-6">Meeting Shortlist</h3>
          <div className="space-y-4">
            {meetings.map((mtg) => (
              <div key={mtg.id} className="p-5 bg-white/5 rounded-2xl border border-white/10 glass-reflection flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Clock size={16} className="text-showroom-accent" />
                  <div>
                    <h4 className="text-sm font-medium text-white">{mtg.title}</h4>
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">{mtg.time}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${statusConfig[mtg.status as keyof typeof statusConfig]?.border} ${statusConfig[mtg.status as keyof typeof statusConfig]?.text}`}>
                  {statusConfig[mtg.status as keyof typeof statusConfig]?.label}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

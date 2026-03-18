'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, CheckCircle2, FileText, Upload, Brain, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { statusConfig } from '@/lib/status-colors';
import { supabase } from '@/lib/supabase';
import { useSupabase } from './supabase-provider';

export function ActionItemsView({ setView, setSelectedEmailId }: { setView: any, setSelectedEmailId: any }) {
  const { user } = useSupabase();
  const [actionItems, setActionItems] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [brainDump, setBrainDump] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [itemsRes, meetingsRes] = await Promise.all([
        supabase.from('action_items').select('*').order('created_at', { ascending: false }),
        supabase.from('meetings').select('*').order('created_at', { ascending: false })
      ]);

      if (itemsRes.data) setActionItems(itemsRes.data);
      if (meetingsRes.data) setMeetings(meetingsRes.data);
      setIsLoading(false);
    };

    fetchData();

    const itemsChannel = supabase
      .channel('action-items-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'action_items', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') setActionItems(prev => [payload.new, ...prev]);
          else if (payload.eventType === 'UPDATE') setActionItems(prev => prev.map(i => i.id === payload.new.id ? payload.new : i));
          else if (payload.eventType === 'DELETE') setActionItems(prev => prev.filter(i => i.id === payload.old.id));
        }
      ).subscribe();

    const meetingsChannel = supabase
      .channel('meetings-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'meetings', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') setMeetings(prev => [payload.new, ...prev]);
          else if (payload.eventType === 'UPDATE') setMeetings(prev => prev.map(i => i.id === payload.new.id ? payload.new : i));
          else if (payload.eventType === 'DELETE') setMeetings(prev => prev.filter(i => i.id === payload.old.id));
        }
      ).subscribe();

    return () => {
      supabase.removeChannel(itemsChannel);
      supabase.removeChannel(meetingsChannel);
    };
  }, [user]);

  const processBrainDump = async () => {
    if (!brainDump.trim() || !user) return;
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
            "actionItems": [{ "title": string, "status": "pending", "owner": "Unassigned", "date": string, "directive": "General", "priority": "Medium", "category": "Action Items" }],
            "meetings": [{ "title": string, "time": string, "status": "pending" }]
          }`,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      
      if (parsed.actionItems) {
        const itemsToInsert = parsed.actionItems.map((item: any) => ({ ...item, user_id: user.id }));
        await supabase.from('action_items').insert(itemsToInsert);
      }
      
      if (parsed.meetings) {
        const meetingsToInsert = parsed.meetings.map((item: any) => ({ ...item, user_id: user.id }));
        await supabase.from('meetings').insert(meetingsToInsert);
      }

      setBrainDump('');
    } catch (e) {
      console.error('Error processing brain dump:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-showroom-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-light text-white">Action Items & Events</h2>
        {actionItems.length === 0 && (
          <button
            onClick={async () => {
              if (!user) return;
              const demoItems = [
                { title: 'Escalate API docs to CTO', status: 'in_progress', owner: 'Ryan Torres', date: '3-8-2025', directive: 'Customer Portal v2', priority: 'High', category: 'Action Items', user_id: user.id },
                { title: 'Review Q2 Strategic Roadmap', status: 'pending', owner: 'Mike T.', date: '3-10-2025', directive: 'Strategy Alignment', priority: 'Medium', category: 'Follow Up', user_id: user.id },
              ];
              await supabase.from('action_items').insert(demoItems);
            }}
            className="text-[10px] font-mono uppercase tracking-widest text-showroom-accent hover:underline"
          >
            Seed Demo Data
          </button>
        )}
      </div>
      
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
                          {item.directive} • {item.owner} {item.email_id && (
                            <button 
                              onClick={() => {
                                setSelectedEmailId(item.email_id);
                                setView('email');
                              }}
                              className="text-showroom-accent hover:underline"
                            >
                              • View Email
                            </button>
                          )}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${statusConfig[item.status as keyof typeof statusConfig]?.border || 'border-white/10'} ${statusConfig[item.status as keyof typeof statusConfig]?.text || 'text-white'}`}>
                        {statusConfig[item.status as keyof typeof statusConfig]?.label || item.status}
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
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${statusConfig[mtg.status as keyof typeof statusConfig]?.border || 'border-white/10'} ${statusConfig[mtg.status as keyof typeof statusConfig]?.text || 'text-white'}`}>
                  {statusConfig[mtg.status as keyof typeof statusConfig]?.label || mtg.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

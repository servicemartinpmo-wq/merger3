'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, CheckCircle2, FileText, Upload, Brain, Loader2, Plus, Zap } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { statusConfig } from '@/lib/status-colors';
import { supabase } from '@/lib/supabase';
import { useSupabase } from '@/components/supabase-provider';
import { dataService } from '@/lib/services/data-service';

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
      try {
        const [itemsData, meetingsData] = await Promise.all([
          dataService.getItems<any>('action_items', user.id),
          dataService.getItems<any>('meetings', user.id)
        ]);
        setActionItems(itemsData);
        setMeetings(meetingsData);
      } catch (error) {
        console.error('Error fetching action items/meetings:', error);
      } finally {
        setIsLoading(false);
      }
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
        for (const item of parsed.actionItems) {
          await dataService.createItem('action_items', { ...item, user_id: user.id }, user.id);
        }
      }
      
      if (parsed.meetings) {
        for (const mtg of parsed.meetings) {
          await dataService.createItem('meetings', { ...mtg, user_id: user.id }, user.id);
        }
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
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Action Items & Events</h2>
          <p className="text-slate-500">Manage your operational tasks and upcoming meetings.</p>
        </div>
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
            className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 px-4 py-2 rounded-lg"
          >
            Seed Demo Data
          </button>
        )}
      </div>
      
      {/* Brain Dump Input */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6 text-indigo-600">
          <Brain size={24} />
          <h3 className="text-xs font-bold uppercase tracking-widest">Intelligent Capture</h3>
        </div>
        <textarea
          value={brainDump}
          onChange={(e) => setBrainDump(e.target.value)}
          placeholder="Capture tasks, meetings, or ideas here (e.g., 'Schedule meeting with Sarah tomorrow at 2pm and remind Ryan to update the API docs')..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-6 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[120px] font-medium"
        />
        <div className="mt-6 flex justify-end">
          <button
            onClick={processBrainDump}
            disabled={isProcessing || !brainDump.trim()}
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-slate-200"
          >
            {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
            Process with Apphia
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Action Items</h3>
            <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
              <Plus size={16} />
            </button>
          </div>
          
          <div className="space-y-10">
            {['Action Items', 'Follow Up', 'Messaging', 'Meetings', 'Email', 'Uncategorized'].map(category => {
              const items = actionItems.filter(item => (category === 'Uncategorized' ? !item.category : item.category === category));
              if (items.length === 0) return null;
              
              return (
                <div key={category} className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2">{category}</h4>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <motion.div 
                        key={item.id} 
                        whileHover={{ x: 4 }}
                        className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full ${
                            item.priority === 'High' ? 'bg-rose-500' : 
                            item.priority === 'Medium' ? 'bg-amber-500' : 'bg-slate-300'
                          }`} />
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                              {item.directive} • {item.owner} {item.email_id && (
                                <button 
                                  onClick={() => {
                                    setSelectedEmailId(item.email_id);
                                    setView('email');
                                  }}
                                  className="text-indigo-600 hover:underline ml-1"
                                >
                                  • View Email
                                </button>
                              )}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${statusConfig[item.status as keyof typeof statusConfig]?.border || 'border-slate-200'} ${statusConfig[item.status as keyof typeof statusConfig]?.text || 'text-slate-600'}`}>
                          {statusConfig[item.status as keyof typeof statusConfig]?.label || item.status}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Meeting Shortlist</h3>
            <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
              <Plus size={16} />
            </button>
          </div>
          
          <div className="space-y-3">
            {meetings.map((mtg) => (
              <motion.div 
                key={mtg.id} 
                whileHover={{ y: -2 }}
                className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{mtg.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{mtg.time}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${statusConfig[mtg.status as keyof typeof statusConfig]?.border || 'border-slate-200'} ${statusConfig[mtg.status as keyof typeof statusConfig]?.text || 'text-slate-600'}`}>
                  {statusConfig[mtg.status as keyof typeof statusConfig]?.label || mtg.status}
                </span>
              </motion.div>
            ))}
            {meetings.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">No upcoming meetings</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

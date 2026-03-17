'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2, Clock, AlertCircle, Cpu, Inbox, Trash2, Plus, Loader2, FileText, Sparkles } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import supabase from '@/lib/supabase';
import { useSupabase } from '@/components/supabase-provider';

type EmailData = {
  id: string;
  subject: string;
  sender: string;
  date: string;
  body: string;
  status: 'parsed' | 'pending' | 'processing' | 'error';
  extracted?: {
    task: string;
    deadline: string;
    owner: string;
    priority: string;
    initiative: string;
    sentiment: string;
    urgency: string;
    summary: string;
    actionItems: string[];
  };
};

const mockEmails: EmailData[] = [
  {
    id: '1',
    subject: 'Fwd: URGENT: Q3 Marketing Budget Approval',
    sender: 'sarah.j@example.com',
    date: '10 mins ago',
    body: 'Hi team, we need to finalize the Q3 marketing budget by this Friday. Please review the attached spreadsheet and provide your sign-off. Also, ensure the new campaign costs are factored in. We have a lot of moving parts this quarter and I want to make sure we are not overspending on the digital ads which have been underperforming lately.',
    status: 'parsed',
    extracted: {
      task: 'Finalize Q3 Marketing Budget',
      deadline: 'This Friday',
      owner: 'Unassigned',
      priority: 'High',
      initiative: 'Q3 Marketing Launch',
      sentiment: 'Neutral',
      urgency: 'Critical',
      summary: 'Request to finalize the Q3 marketing budget by Friday, with a focus on reviewing campaign costs and digital ad spend efficiency.',
      actionItems: ['Review attached spreadsheet', 'Provide sign-off', 'Factor in new campaign costs']
    }
  },
  {
    id: '2',
    subject: 'Client Feedback - Project Alpha',
    sender: 'client.success@example.com',
    date: '1 hour ago',
    body: 'The client loved the new designs but requested a few minor tweaks to the dashboard layout. Can we get these done by next Tuesday? They specifically mentioned the color contrast on the charts and the font size in the sidebar.',
    status: 'parsed',
    extracted: {
      task: 'Implement dashboard layout tweaks',
      deadline: 'Next Tuesday',
      owner: 'Design Team',
      priority: 'Medium',
      initiative: 'Project Alpha',
      sentiment: 'Positive',
      urgency: 'Moderate',
      summary: 'Client approved designs but requested layout tweaks for the dashboard, specifically regarding chart contrast and sidebar typography.',
      actionItems: ['Adjust chart color contrast', 'Increase sidebar font size']
    }
  },
  {
    id: '3',
    subject: 'Weekly Team Sync Notes',
    sender: 'pm@example.com',
    date: '3 hours ago',
    body: 'Great meeting today. Action items: 1. John to update the API docs. 2. Mary to schedule the vendor call. 3. Everyone review the new security policy.',
    status: 'pending',
  }
];

export function EmailIntelligenceView() {
  const { user, signInWithGoogle } = useSupabase();
  const [emails, setEmails] = useState<EmailData[]>(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<EmailData | null>(mockEmails[0]);
  
  useEffect(() => {
    const fetchEmails = async () => {
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data && data.length > 0) {
        const dbEmails: EmailData[] = data.map(e => ({
          id: e.id,
          subject: e.subject,
          sender: e.sender,
          date: new Date(e.created_at).toLocaleTimeString(),
          body: e.body,
          status: e.status as any,
          extracted: e.extracted
        }));
        setEmails([...dbEmails, ...mockEmails]);
      }
    };

    fetchEmails();
  }, []);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newEmail, setNewEmail] = useState({ subject: '', sender: '', body: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeMode, setActiveMode] = useState<'email' | 'notetaker' | 'live'>('email');
  const [transcript, setTranscript] = useState('');
  const [meetingRecap, setMeetingRecap] = useState<{
    summary: string;
    actionItems: string[];
    attendees: string[];
  } | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState<string[]>([]);
  const [liveStatus, setLiveStatus] = useState<'idle' | 'joining' | 'active' | 'summarizing'>('idle');

  const handleJoinLive = () => {
    setLiveStatus('joining');
    setTimeout(() => {
      setLiveStatus('active');
      setIsLive(true);
      // Simulate live transcription
      const phrases = [
        "Welcome everyone to the Q1 Strategy sync.",
        "Sarah, can you update us on the marketing pipeline?",
        "Sure, we're seeing a 20% increase in lead velocity.",
        "That's great. We need to finalize the budget by Friday.",
        "Mark, please ensure the infrastructure team is ready for the surge.",
        "On it. We're scaling the database clusters as we speak."
      ];
      let i = 0;
      const interval = setInterval(() => {
        if (i < phrases.length) {
          setLiveTranscript(prev => [...prev, phrases[i]]);
          i++;
        } else {
          clearInterval(interval);
          setLiveStatus('summarizing');
          setTimeout(() => {
            setMeetingRecap({
              summary: "The team discussed Q1 strategy, highlighting a 20% increase in lead velocity and infrastructure scaling plans.",
              actionItems: ["Finalize budget by Friday (Sarah)", "Scale database clusters (Mark)"],
              attendees: ["Sarah", "Mark", "Team"]
            });
            setLiveStatus('idle');
            setIsLive(false);
            setActiveMode('notetaker');
          }, 2000);
        }
      }, 3000);
    }, 2000);
  };

  const handleApprove = (id: string, action: 'discard' | 'approve') => {
    if (action === 'approve') {
      alert('Task successfully added to the Tech-Ops workflow!');
    }
    
    const remaining = emails.filter(e => e.id !== id);
    setEmails(remaining);
    if (selectedEmail?.id === id) {
      setSelectedEmail(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const handleProcessEmail = async () => {
    if (!newEmail.body.trim()) return;
    
    setIsProcessing(true);
    
    const newId = Date.now().toString();
    const processingEmail: EmailData = {
      id: newId,
      subject: newEmail.subject || 'No Subject',
      sender: newEmail.sender || 'Unknown',
      date: 'Just now',
      body: newEmail.body,
      status: 'processing'
    };
    
    setEmails(prev => [processingEmail, ...prev]);
    setSelectedEmail(processingEmail);
    setIsAddingNew(false);
    setNewEmail({ subject: '', sender: '', body: '' });

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key is not configured');
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
        You are an AI assistant for a PMO (Project Management Office).
        Analyze the following email and extract key operational intelligence.
        
        Email Subject: ${processingEmail.subject}
        Sender: ${processingEmail.sender}
        Email Body:
        ${processingEmail.body}
        
        Extract the following:
        1. The main task or action item.
        2. The deadline (if mentioned, otherwise "None").
        3. The likely owner or assignee (if mentioned, otherwise "Unassigned").
        4. The priority (High, Medium, Low).
        5. The related initiative or project name (if mentioned, otherwise "General").
        6. The sentiment of the email (Positive, Neutral, Negative).
        7. The urgency (Critical, Moderate, Low).
        8. A concise summary of the email (1-2 sentences). IMPORTANT: Only provide a summary if the email body is longer than 3 sentences. If it is short, return "Brief message - no summary required".
        9. A list of specific action items extracted from the email.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              task: { type: Type.STRING, description: 'The main task or action item extracted from the email.' },
              deadline: { type: Type.STRING, description: 'The deadline for the task.' },
              owner: { type: Type.STRING, description: 'The person responsible for the task.' },
              priority: { type: Type.STRING, description: 'High, Medium, or Low.' },
              initiative: { type: Type.STRING, description: 'The project or initiative this relates to.' },
              sentiment: { type: Type.STRING, description: 'Positive, Neutral, or Negative.' },
              urgency: { type: Type.STRING, description: 'Critical, Moderate, or Low.' },
              summary: { type: Type.STRING, description: 'A concise summary of the email.' },
              actionItems: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of action items.' },
            },
            required: ['task', 'deadline', 'owner', 'priority', 'initiative', 'sentiment', 'urgency', 'summary', 'actionItems'],
          },
        },
      });
      
      const jsonStr = response.text?.trim();
      
      if (jsonStr) {
        const extracted = JSON.parse(jsonStr);
        
        // Save to Supabase if user is logged in
        if (user) {
          try {
            await supabase.from('emails').insert({
              subject: processingEmail.subject,
              sender: processingEmail.sender,
              body: processingEmail.body,
              status: 'parsed',
              extracted,
              user_id: user.id
            });
          } catch (err) {
            console.error('Error saving email to Supabase:', err);
          }
        }

        setEmails(prev => prev.map(e => 
          e.id === newId ? { ...e, status: 'parsed', extracted } : e
        ));
        setSelectedEmail(prev => prev?.id === newId ? { ...prev, status: 'parsed', extracted } : prev);
      } else {
        throw new Error('No extraction data');
      }
    } catch (error) {
      console.error(error);
      setEmails(prev => prev.map(e => 
        e.id === newId ? { ...e, status: 'error' } : e
      ));
      setSelectedEmail(prev => prev?.id === newId ? { ...prev, status: 'error' } : prev);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessPending = async (email: EmailData) => {
    if (email.status === 'parsed') return;
    
    setSelectedEmail({ ...email, status: 'processing' });
    setEmails(prev => prev.map(e => e.id === email.id ? { ...e, status: 'processing' } : e));
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key is not configured');
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
        You are an AI assistant for a PMO (Project Management Office).
        Analyze the following email and extract key operational intelligence.
        
        Email Subject: ${email.subject}
        Sender: ${email.sender}
        Email Body:
        ${email.body}
        
        Extract the following:
        1. The main task or action item.
        2. The deadline (if mentioned, otherwise "None").
        3. The likely owner or assignee (if mentioned, otherwise "Unassigned").
        4. The priority (High, Medium, Low).
        5. The related initiative or project name (if mentioned, otherwise "General").
        6. The sentiment of the email (Positive, Neutral, Negative).
        7. The urgency (Critical, Moderate, Low).
        8. A concise summary of the email (1-2 sentences). IMPORTANT: Only provide a summary if the email body is longer than 3 sentences. If it is short, return "Brief message - no summary required".
        9. A list of specific action items extracted from the email.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              task: { type: Type.STRING, description: 'The main task or action item extracted from the email.' },
              deadline: { type: Type.STRING, description: 'The deadline for the task.' },
              owner: { type: Type.STRING, description: 'The person responsible for the task.' },
              priority: { type: Type.STRING, description: 'High, Medium, or Low.' },
              initiative: { type: Type.STRING, description: 'The project or initiative this relates to.' },
              sentiment: { type: Type.STRING, description: 'Positive, Neutral, or Negative.' },
              urgency: { type: Type.STRING, description: 'Critical, Moderate, or Low.' },
              summary: { type: Type.STRING, description: 'A concise summary of the email.' },
              actionItems: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of action items.' },
            },
            required: ['task', 'deadline', 'owner', 'priority', 'initiative', 'sentiment', 'urgency', 'summary', 'actionItems'],
          },
        },
      });
      
      const jsonStr = response.text?.trim();
      
      if (jsonStr) {
        const extracted = JSON.parse(jsonStr);
        setEmails(prev => prev.map(e => 
          e.id === email.id ? { ...e, status: 'parsed', extracted } : e
        ));
        setSelectedEmail(prev => prev?.id === email.id ? { ...prev, status: 'parsed', extracted } : prev);
      } else {
        throw new Error('No extraction data');
      }
    } catch (error) {
      console.error(error);
      setEmails(prev => prev.map(e => 
        e.id === email.id ? { ...e, status: 'error' } : e
      ));
      setSelectedEmail(prev => prev?.id === email.id ? { ...prev, status: 'error' } : prev);
    }
  };

  const handleProcessNoteTaker = async () => {
    if (!transcript.trim()) return;
    setIsProcessing(true);
    setMeetingRecap(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error('Gemini API key is not configured');

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
        You are a virtual note taker like Otter.ai. 
        Analyze the following meeting transcript and provide a recap.
        
        Transcript: 
        ${transcript}
        
        Provide:
        1. A concise summary of the meeting.
        2. A list of action items with owners if mentioned.
        3. A list of attendees.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING, description: 'A concise summary of the meeting.' },
              actionItems: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of action items.' },
              attendees: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of attendees.' },
            },
            required: ['summary', 'actionItems', 'attendees'],
          },
        },
      });

      const jsonStr = response.text?.trim();
      if (jsonStr) {
        setMeetingRecap(JSON.parse(jsonStr));
      }
    } catch (error) {
      console.error(error);
      alert('Failed to process transcript.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 font-sans text-slate-900 bg-white min-h-[calc(100vh-8rem)] p-8 rounded-3xl shadow-sm border border-slate-200">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-serif text-4xl font-medium tracking-tight text-slate-900">
              Intelligence Hub
            </h1>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-widest rounded-full border border-teal-200">
              <Cpu size={14} className="animate-pulse" /> Apphia Engine
            </span>
          </div>
          <p className="text-slate-500 max-w-2xl text-base leading-relaxed">
            Extracting operational intelligence from emails and meeting transcripts to fuel your Tech-Ops workflow.
          </p>
        </div>
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button 
            onClick={() => setActiveMode('email')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeMode === 'email' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Email Parser
          </button>
          <button 
            onClick={() => setActiveMode('notetaker')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeMode === 'notetaker' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Virtual Note Taker
          </button>
          <button 
            onClick={() => setActiveMode('live')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeMode === 'live' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Live Meeting Bot
          </button>
        </div>
      </header>

      {activeMode === 'email' ? (
        <>
          <div className="flex justify-end gap-3 mb-4">
            <button 
              onClick={() => setIsAddingNew(true)}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors font-medium shadow-sm"
            >
              <Plus size={16} /> New Email
            </button>
          </div>

          {isAddingNew && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
              <h2 className="font-serif text-xl font-semibold mb-4 text-slate-900">Process New Email</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Sender</label>
                    <input 
                      type="text" 
                      value={newEmail.sender}
                      onChange={e => setNewEmail({...newEmail, sender: e.target.value})}
                      placeholder="e.g., client@example.com"
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                    <input 
                      type="text" 
                      value={newEmail.subject}
                      onChange={e => setNewEmail({...newEmail, subject: e.target.value})}
                      placeholder="e.g., Project Update"
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Body</label>
                  <textarea 
                    value={newEmail.body}
                    onChange={e => setNewEmail({...newEmail, body: e.target.value})}
                    placeholder="Paste the email content here..."
                    rows={4}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setIsAddingNew(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
                  <button 
                    onClick={handleProcessEmail}
                    disabled={!newEmail.body.trim() || isProcessing}
                    className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Cpu size={16} />}
                    Extract Intelligence
                  </button>
                </div>
              </div>
            </div>
          )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
        {/* Inbox Feed */}
        <div className="col-span-1 border border-slate-200 rounded-2xl overflow-hidden flex flex-col bg-slate-50">
          <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2 text-slate-800">
              <Inbox size={18} />
              Processing Queue
            </h2>
            <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
              {emails.length} items
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {emails.map(email => (
              <button
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedEmail?.id === email.id
                    ? 'bg-white border-teal-300 shadow-sm ring-1 ring-teal-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-medium text-slate-500 truncate pr-2">{email.sender}</span>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{email.date}</span>
                </div>
                <h3 className="font-medium text-slate-900 text-sm truncate mb-2">{email.subject}</h3>
                <div className="flex items-center gap-2">
                  {email.status === 'parsed' ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 size={10} /> Parsed
                    </span>
                  ) : email.status === 'processing' ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      <Loader2 size={10} className="animate-spin" /> Processing
                    </span>
                  ) : email.status === 'error' ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                      <AlertCircle size={10} /> Error
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      <Clock size={10} /> Pending
                    </span>
                  )}
                </div>
              </button>
            ))}
            {emails.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <CheckCircle2 size={32} className="mb-2 opacity-50" />
                <p className="text-sm">Inbox zero. All emails processed.</p>
              </div>
            )}
          </div>
        </div>

        {/* Parsing Engine & Preview */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          {selectedEmail ? (
            <>
              {/* Raw Email */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm shrink-0">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900">{selectedEmail.subject}</h2>
                    <p className="text-sm text-slate-500">From: {selectedEmail.sender}</p>
                  </div>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto">
                  {selectedEmail.body}
                </p>
              </div>

              {/* Extraction Results */}
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-6 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
                <h3 className="font-serif text-xl font-semibold mb-6 flex items-center gap-2 text-slate-900">
                  <Cpu size={20} className="text-teal-600" />
                  Apphia Extraction
                </h3>
                
                {selectedEmail.status === 'parsed' && selectedEmail.extracted ? (
                  <div className="space-y-6">
                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">AI Summary</span>
                      <p className="text-sm text-slate-700 leading-relaxed">{selectedEmail.extracted.summary}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-xl border border-slate-200 col-span-2">
                        <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Action Items</span>
                        <ul className="space-y-2">
                          {selectedEmail.extracted.actionItems.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                              <CheckCircle2 size={14} className="text-teal-500 mt-0.5 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Linked Initiative</span>
                        <span className="font-medium text-indigo-600 text-sm">{selectedEmail.extracted.initiative}</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Deadline</span>
                        <span className="font-medium text-slate-900 text-sm flex items-center gap-1.5"><Clock size={14} className="text-slate-400" /> {selectedEmail.extracted.deadline}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                      <button onClick={() => handleApprove(selectedEmail.id, 'discard')} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Discard</button>
                      <button onClick={() => handleApprove(selectedEmail.id, 'approve')} className="px-6 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm">Approve & Sync</button>
                    </div>
                  </div>
                ) : selectedEmail.status === 'processing' ? (
                  <div className="flex-1 flex items-center justify-center flex-col text-slate-400">
                    <Loader2 size={32} className="animate-spin text-teal-500" />
                    <p>Apphia is analyzing this email...</p>
                  </div>
                ) : selectedEmail.status === 'error' ? (
                  <div className="flex-1 flex items-center justify-center flex-col text-rose-500">
                    <AlertCircle size={32} className="mb-4" />
                    <p>Failed to analyze email. Please try again.</p>
                    <button 
                      onClick={() => handleProcessPending(selectedEmail)}
                      className="mt-4 px-4 py-2 bg-rose-100 text-rose-700 rounded-lg text-sm font-medium hover:bg-rose-200"
                    >
                      Retry Processing
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center flex-col text-slate-400">
                    <Cpu size={32} className="mb-4 text-slate-300" />
                    <p>Email pending analysis.</p>
                    <button 
                      onClick={() => handleProcessPending(selectedEmail)}
                      className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-2"
                    >
                      <Cpu size={16} /> Process Now
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-slate-300 rounded-2xl text-slate-400 bg-slate-50">
              Select an email to view intelligence
            </div>
          )}
        </div>
      </div>
    </>
  ) : activeMode === 'notetaker' ? (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <h2 className="font-serif text-xl font-semibold mb-4 text-slate-900">Meeting Transcript</h2>
          <textarea 
            value={transcript}
            onChange={e => setTranscript(e.target.value)}
            placeholder="Paste your meeting transcript here (e.g. from Zoom, Teams, or Otter.ai)..."
            rows={15}
            className="w-full p-4 border border-slate-300 rounded-xl focus:ring-teal-500 focus:border-teal-500 text-sm font-mono"
          />
          <button 
            onClick={handleProcessNoteTaker}
            disabled={!transcript.trim() || isProcessing}
            className="mt-4 w-full py-4 bg-teal-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-teal-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-teal-600/20"
          >
            {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            Generate Meeting Recap
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {meetingRecap ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10"><FileText size={80} /></div>
            <h3 className="font-serif text-2xl font-medium text-slate-900 mb-6">Meeting Recap</h3>
            
            <div className="space-y-8">
              <section>
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-3">Executive Summary</h4>
                <p className="text-slate-700 leading-relaxed">{meetingRecap.summary}</p>
              </section>

              <section>
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-3">Action Items</h4>
                <ul className="space-y-3">
                  {meetingRecap.actionItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0 mt-0.5">
                        <CheckCircle2 size={12} />
                      </div>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-3">Attendees</h4>
                <div className="flex flex-wrap gap-2">
                  {meetingRecap.attendees.map((person, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200">
                      {person}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 flex gap-3">
              <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all">Export to PDF</button>
              <button className="flex-1 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">Sync to CRM</button>
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center border border-dashed border-slate-300 rounded-2xl text-slate-400 bg-slate-50 p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
              <FileText size={32} />
            </div>
            <h3 className="text-slate-900 font-medium mb-2">No Recap Generated</h3>
            <p className="text-sm max-w-xs">Paste a meeting transcript on the left to generate an AI-powered summary and action items list.</p>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-slate-900 rounded-[32px] p-12 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#2DD4BF,transparent_70%)]" />
        </div>
        
        <div className="relative z-10 space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center mx-auto mb-8">
            <Cpu size={40} className="text-teal-400" />
          </div>
          <h2 className="text-4xl font-serif font-medium tracking-tight">Apphia Live Meeting Bot</h2>
          <p className="text-teal-100/60 max-w-md mx-auto text-lg leading-relaxed">
            Invite Apphia to your Zoom, Teams, or Google Meet. It will listen, transcribe, and generate intelligence in real-time.
          </p>
          
          <div className="pt-8">
            {liveStatus === 'idle' && (
              <button 
                onClick={handleJoinLive}
                className="px-12 py-5 bg-teal-500 text-slate-900 rounded-2xl font-bold uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-2xl shadow-teal-500/20"
              >
                Join Live Call Now
              </button>
            )}
            
            {liveStatus === 'joining' && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 size={32} className="animate-spin text-teal-400" />
                <p className="font-mono text-xs uppercase tracking-widest text-teal-400">Connecting to meeting bridge...</p>
              </div>
            )}
            
            {liveStatus === 'active' && (
              <div className="space-y-8">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-mono text-xs uppercase tracking-widest text-red-400">Live Transcription Active</span>
                </div>
                
                <div className="bg-black/40 border border-white/10 rounded-2xl p-8 text-left h-64 overflow-y-auto space-y-4 font-mono text-sm text-teal-100/80">
                  {liveTranscript.map((line, i) => (
                    <motion.p 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      {line}
                    </motion.p>
                  ))}
                  <div className="animate-pulse">_</div>
                </div>
              </div>
            )}

            {liveStatus === 'summarizing' && (
              <div className="flex flex-col items-center gap-4">
                <Sparkles size={32} className="text-teal-400 animate-bounce" />
                <p className="font-mono text-xs uppercase tracking-widest text-teal-400">Generating Intelligence Recap...</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-slate-200 rounded-2xl">
          <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">Bot Status</h4>
          <p className="font-medium text-slate-900">Apphia-Bot #1024</p>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-2xl">
          <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">Meeting Platform</h4>
          <p className="font-medium text-slate-900">Universal Bridge Active</p>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-2xl">
          <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">Security</h4>
          <p className="font-medium text-slate-900">End-to-End Encrypted</p>
        </div>
      </div>
    </div>
  )}
    </div>
  );
}

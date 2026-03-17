'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Server, 
  AlertOctagon, 
  Zap, 
  GitCommit, 
  Database, 
  ShieldAlert, 
  ShieldCheck,
  Cpu, 
  AlertTriangle, 
  Loader2,
  Ticket,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
  Terminal,
  Search,
  Filter,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { GoogleGenAI, Type } from '@google/genai';
import supabase from '@/lib/supabase';
import { useSupabase } from '@/components/supabase-provider';

const mockAlgoData = [
  { time: '08:00', score: 82, engagement: 75, freshness: 90 },
  { time: '10:00', score: 85, engagement: 78, freshness: 88 },
  { time: '12:00', score: 81, engagement: 72, freshness: 85 },
  { time: '14:00', score: 88, engagement: 85, freshness: 92 },
  { time: '16:00', score: 92, engagement: 88, freshness: 95 },
  { time: '18:00', score: 90, engagement: 86, freshness: 93 },
];

const mockTickets = [
  { id: 'TKT-1024', subject: 'Database Connection Timeout', priority: 'high', status: 'open', agent: 'Sarah K.', time: '12m ago' },
  { id: 'TKT-1023', subject: 'API Rate Limit Exceeded', priority: 'medium', status: 'in-progress', agent: 'Mark R.', time: '45m ago' },
  { id: 'TKT-1022', subject: 'UI Glitch on Dashboard', priority: 'low', status: 'open', agent: 'Unassigned', time: '1h ago' },
  { id: 'TKT-1021', subject: 'SSO Authentication Failure', priority: 'critical', status: 'open', agent: 'David L.', time: '5m ago' },
];

const mockAgents = [
  { name: 'Sarah K.', status: 'active', tickets: 4, csat: 4.8 },
  { name: 'Mark R.', status: 'active', tickets: 7, csat: 4.5 },
  { name: 'David L.', status: 'active', tickets: 2, csat: 4.9 },
  { name: 'Elena V.', status: 'away', tickets: 0, csat: 4.7 },
];

export function TechOpsView() {
  const { user, signInWithGoogle } = useSupabase();
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [algoData, setAlgoData] = useState(mockAlgoData);
  const [currentScore, setCurrentScore] = useState({ score: 90, decimal: 4, engagement: 86, freshness: 93, efficiency: 95, relevance: 82 });
  const [tickets, setTickets] = useState<any[]>(mockTickets);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', priority: 'medium' });
  
  useEffect(() => {
    const fetchTickets = async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data && data.length > 0) {
        // Merge with mock data for demo purposes if needed, or just use real data
        setTickets([...data.map(t => ({
          id: t.id.slice(0, 8),
          subject: t.subject,
          priority: t.priority,
          status: t.status,
          agent: t.agent,
          time: new Date(t.created_at).toLocaleTimeString()
        })), ...mockTickets]);
      }
    };

    fetchTickets();

    // Real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tickets' }, (payload) => {
        const newTkt = payload.new;
        setTickets(prev => [{
          id: newTkt.id.slice(0, 8),
          subject: newTkt.subject,
          priority: newTkt.priority,
          status: newTkt.status,
          agent: newTkt.agent,
          time: 'Just now'
        }, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleCreateTicket = async () => {
    if (!user) {
      alert('Please sign in to create a ticket');
      return;
    }
    
    const { error } = await supabase.from('tickets').insert({
      subject: newTicket.subject,
      priority: newTicket.priority,
      status: 'open',
      user_id: user.id
    });

    if (error) {
      console.error('Error creating ticket:', error);
    } else {
      setIsCreatingTicket(false);
      setNewTicket({ subject: '', priority: 'medium' });
    }
  };
  const [activeTab, setActiveTab] = useState<'monitor' | 'service' | 'infrastructure' | 'appmaker' | 'autonomous'>('monitor');
  const [appDescription, setAppDescription] = useState('');
  const [generatedApp, setGeneratedApp] = useState<{
    name: string;
    description: string;
    techStack: string[];
    features: string[];
    frontendCode: string;
    backendCode: string;
    databaseSchema: string;
    storageStrategy: string;
  } | null>(null);

  const [autonomousFixes, setAutonomousFixes] = useState<{
    id: string;
    issue: string;
    diagnosis: string;
    solution: string;
    status: 'analyzing' | 'deploying' | 'resolved';
    timestamp: string;
  }[]>([]);

  const handleGenerateApp = async () => {
    if (!appDescription.trim()) return;
    setIsLoading(true);
    setGeneratedApp(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error('Gemini API key is not configured');

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
        You are the Apphia App Maker engine. 
        Based on the following description, generate a full technical architecture for a micro-app.
        
        Description: ${appDescription}
        
        Provide a JSON response with:
        1. name: A professional name.
        2. description: A concise description.
        3. techStack: Array of technologies.
        4. features: Array of key features.
        5. frontendCode: Complete React component code using Tailwind.
        6. backendCode: Sample Express/Node.js API route code.
        7. databaseSchema: SQL or NoSQL schema definition.
        8. storageStrategy: Description of how files/data are stored.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
              features: { type: Type.ARRAY, items: { type: Type.STRING } },
              frontendCode: { type: Type.STRING },
              backendCode: { type: Type.STRING },
              databaseSchema: { type: Type.STRING },
              storageStrategy: { type: Type.STRING },
            },
            required: ['name', 'description', 'techStack', 'features', 'frontendCode', 'backendCode', 'databaseSchema', 'storageStrategy'],
          },
        },
      });

      const jsonStr = response.text?.trim();
      if (jsonStr) {
        setGeneratedApp(JSON.parse(jsonStr));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const runAutonomousDiagnostic = async () => {
    setIsLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) return;
      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Analyze the current system state and identify a potential issue that can be autonomously fixed. Provide issue, diagnosis, and solution.",
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              issue: { type: Type.STRING },
              diagnosis: { type: Type.STRING },
              solution: { type: Type.STRING },
            },
            required: ['issue', 'diagnosis', 'solution'],
          },
        },
      });

      const data = JSON.parse(response.text || '{}');
      const newFix = {
        id: `FIX-${Math.floor(Math.random() * 10000)}`,
        issue: data.issue,
        diagnosis: data.diagnosis,
        solution: data.solution,
        status: 'analyzing' as const,
        timestamp: new Date().toLocaleTimeString(),
      };

      setAutonomousFixes(prev => [newFix, ...prev]);

      // Simulate autonomous deployment
      setTimeout(() => {
        setAutonomousFixes(prev => prev.map(f => f.id === newFix.id ? { ...f, status: 'deploying' } : f));
        setTimeout(() => {
          setAutonomousFixes(prev => prev.map(f => f.id === newFix.id ? { ...f, status: 'resolved' } : f));
        }, 3000);
      }, 2000);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function fetchTechOpsData() {
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
          You are the Apphia Engine, an AI Tech-Ops monitoring tool.
          Generate realistic mock data for a technical operations dashboard.
          
          Generate a JSON response with the following structure:
          1. algoData: Array of objects { time, score, engagement, freshness } (6 data points)
          2. currentScore: Object { score, decimal, engagement, freshness, efficiency, relevance }
          3. tickets: Array of objects { id, subject, priority, status, agent, time } (priority: high, medium, low, critical; status: open, in-progress, resolved)
          
          Make the data look realistic and professional for a tech company.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: 'Generate the tech-ops dashboard data.',
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                algoData: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      score: { type: Type.NUMBER },
                      engagement: { type: Type.NUMBER },
                      freshness: { type: Type.NUMBER },
                    },
                    required: ['time', 'score', 'engagement', 'freshness'],
                  },
                },
                currentScore: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER },
                    decimal: { type: Type.NUMBER },
                    engagement: { type: Type.NUMBER },
                    freshness: { type: Type.NUMBER },
                    efficiency: { type: Type.NUMBER },
                    relevance: { type: Type.NUMBER },
                  },
                  required: ['score', 'decimal', 'engagement', 'freshness', 'efficiency', 'relevance'],
                },
                tickets: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      subject: { type: Type.STRING },
                      priority: { type: Type.STRING },
                      status: { type: Type.STRING },
                      agent: { type: Type.STRING },
                      time: { type: Type.STRING },
                    },
                    required: ['id', 'subject', 'priority', 'status', 'agent', 'time'],
                  },
                },
              },
              required: ['algoData', 'currentScore', 'tickets'],
            },
          },
        });

        const jsonStr = response.text?.trim();
        if (jsonStr) {
          const report = JSON.parse(jsonStr);
          setAlgoData(report.algoData);
          setCurrentScore(report.currentScore);
          setTickets(report.tickets);
        }
      } catch (error) {
        console.error('Error fetching tech-ops data:', error);
        setIsLive(false);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTechOpsData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-[#0A0A0A] rounded-3xl shadow-sm border border-white/10">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <Loader2 size={32} className="animate-spin text-[#00FF00]" />
          <p className="font-mono text-xs uppercase tracking-widest">Initializing Tech-Ops Command Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-white bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-white/5">
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00FF00]/10 border border-[#00FF00]/20 flex items-center justify-center">
              <Terminal className="text-[#00FF00]" size={20} />
            </div>
            <h1 className="text-3xl font-serif font-medium tracking-tight">Tech-Ops Command</h1>
          </div>
          <p className="text-gray-500 max-w-xl text-sm leading-relaxed">
            Real-time monitoring of infrastructure signals, support tickets, and system health.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {mockAgents.map((agent, i) => (
              <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#0A0A0A] flex items-center justify-center text-[10px] font-bold ${agent.status === 'active' ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                {agent.name.charAt(0)}
              </div>
            ))}
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex items-center gap-3">
            <StatusBadge status="operational" label="Cloud Infrastructure" />
            <StatusBadge status="operational" label="Database Cluster" />
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-2xl border border-white/10 w-fit">
        {[
          { id: 'monitor', label: 'System Monitor', icon: Activity },
          { id: 'service', label: 'Service Desk', icon: Ticket },
          { id: 'infrastructure', label: 'Infrastructure', icon: Server },
          { id: 'appmaker', label: 'App Maker', icon: Zap },
          { id: 'autonomous', label: 'Autonomous Fixes', icon: ShieldAlert },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeTab === tab.id ? 'bg-white text-black' : 'text-gray-500 hover:text-white'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'monitor' && (
          <motion.div 
            key="monitor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="System Health" value="99.98%" trend="+0.02%" icon={Activity} color="text-emerald-500" />
              <StatCard label="Active Tickets" value={tickets.length.toString()} trend="-2" icon={Ticket} color="text-blue-500" />
              <StatCard label="Avg. Response" value="14m" trend="-3m" icon={Clock} color="text-purple-500" />
              <StatCard label="SLA Compliance" value="98.5%" trend="+1.2%" icon={CheckCircle2} color="text-amber-500" />
            </div>

            {/* Main Monitor Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Score Card */}
              <div className="bg-[#151619] border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#00FF00]/5 rounded-full blur-[80px] -mr-20 -mt-20" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Algorithm Score</span>
                    <span className="px-2 py-1 bg-[#00FF00]/10 border border-[#00FF00]/20 rounded text-[10px] font-mono text-[#00FF00]">LIVE</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-10">
                    <span className="text-8xl font-serif font-medium tracking-tighter">{currentScore.score}</span>
                    <span className="text-2xl text-[#00FF00] font-mono">.{currentScore.decimal}</span>
                  </div>
                  <div className="space-y-5">
                    <ScoreBar label="Efficiency" value={currentScore.efficiency} color="bg-[#00FF00]" />
                    <ScoreBar label="Relevance" value={currentScore.relevance} color="bg-blue-500" />
                    <ScoreBar label="Freshness" value={currentScore.freshness} color="bg-purple-500" />
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="lg:col-span-2 bg-[#151619] border border-white/10 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-mono font-bold text-gray-500 uppercase tracking-widest">Performance History</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#00FF00]" />
                      <span className="text-[10px] font-mono text-gray-400">Score</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-[10px] font-mono text-gray-400">Engagement</span>
                    </div>
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={algoData}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00FF00" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#00FF00" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#555', fontSize: 10, fontFamily: 'monospace' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#555', fontSize: 10, fontFamily: 'monospace' }} domain={[60, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#151619', border: '1px solid #333', borderRadius: '12px', fontSize: '12px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#00FF00" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
                      <Area type="monotone" dataKey="engagement" stroke="#3B82F6" fillOpacity={0} strokeWidth={2} strokeDasharray="4 4" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'service' && (
          <motion.div 
            key="service"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative"
          >
            {/* Create Ticket Modal */}
            <AnimatePresence>
              {isCreatingTicket && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-[#151619] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-serif font-medium">Create New Ticket</h3>
                      <button onClick={() => setIsCreatingTicket(false)} className="text-gray-500 hover:text-white">
                        <XCircle size={24} />
                      </button>
                    </div>

                    {!user ? (
                      <div className="text-center py-8">
                        <p className="text-gray-400 mb-6">You must be signed in to create a ticket.</p>
                        <button 
                          onClick={signInWithGoogle}
                          className="w-full py-3 bg-white text-black rounded-xl font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                        >
                          Sign In with Google
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-2">Subject</label>
                          <input 
                            type="text" 
                            value={newTicket.subject}
                            onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                            placeholder="Describe the issue..."
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-2">Priority</label>
                          <select 
                            value={newTicket.priority}
                            onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                          </select>
                        </div>
                        <button 
                          onClick={handleCreateTicket}
                          disabled={!newTicket.subject}
                          className="w-full py-3 bg-emerald-500 text-black rounded-xl font-bold uppercase tracking-widest hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Submit Ticket
                        </button>
                      </div>
                    )}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Tickets Table */}
            <div className="lg:col-span-2 bg-[#151619] border border-white/10 rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-sm font-mono font-bold text-gray-500 uppercase tracking-widest">Active Tickets</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsCreatingTicket(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 text-black rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-400 transition-colors"
                  >
                    <Plus size={14} />
                    New Ticket
                  </button>
                  <button className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                    <Search size={16} />
                  </button>
                  <button className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                    <Filter size={16} />
                  </button>
                </div>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/2 border-b border-white/5 text-[10px] uppercase tracking-widest text-gray-500 font-mono">
                    <th className="p-6 font-medium">Ticket ID</th>
                    <th className="p-6 font-medium">Subject</th>
                    <th className="p-6 font-medium">Priority</th>
                    <th className="p-6 font-medium">Status</th>
                    <th className="p-6 font-medium text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs font-mono">
                  {tickets.map(ticket => (
                    <tr key={ticket.id} className="hover:bg-white/2 transition-colors group">
                      <td className="p-6 text-gray-500 group-hover:text-white">{ticket.id}</td>
                      <td className="p-6">
                        <div className="flex flex-col">
                          <span className="text-white font-medium mb-1">{ticket.subject}</span>
                          <span className="text-[10px] text-gray-500">Agent: {ticket.agent}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          ticket.priority === 'critical' ? 'bg-rose-500/10 text-rose-500' :
                          ticket.priority === 'high' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-gray-400">
                          <div className={`w-1.5 h-1.5 rounded-full ${ticket.status === 'open' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                          {ticket.status.toUpperCase()}
                        </div>
                      </td>
                      <td className="p-6 text-right text-gray-500">{ticket.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Agent Status */}
            <div className="space-y-8">
              <div className="bg-[#151619] border border-white/10 rounded-3xl p-8">
                <h3 className="text-sm font-mono font-bold text-gray-500 uppercase tracking-widest mb-6">Agent Availability</h3>
                <div className="space-y-6">
                  {mockAgents.map((agent, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${agent.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-800 text-slate-500'}`}>
                          {agent.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{agent.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest">{agent.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono text-white">{agent.tickets} Active</p>
                        <p className="text-[10px] text-emerald-500 font-mono">{agent.csat} CSAT</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
                  <BarChart3 size={64} />
                </div>
                <h3 className="text-xl font-serif font-medium mb-2">Weekly Report</h3>
                <p className="text-white/70 text-sm mb-6">Your team resolved 142 tickets this week, up 12% from last week.</p>
                <button className="w-full py-3 bg-white text-indigo-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/90 transition-all">
                  View Analytics
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'autonomous' && (
          <motion.div 
            key="autonomous"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-[#151619] border border-white/10 rounded-3xl p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-medium">Autonomous Command Center</h3>
                <p className="text-gray-500 text-sm max-w-xl">
                  Apphia continuously monitors signals to predict failures and autonomously deploy fixes.
                </p>
              </div>
              <button 
                onClick={runAutonomousDiagnostic}
                disabled={isLoading}
                className="px-8 py-4 bg-[#00FF00] text-black rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-all flex items-center gap-2"
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Activity size={14} />}
                Run Global Diagnostic
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {autonomousFixes.map((fix) => (
                <motion.div 
                  key={fix.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[#151619] border border-white/10 rounded-3xl p-8 grid grid-cols-1 lg:grid-cols-4 gap-8 items-center"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{fix.timestamp}</span>
                    <h4 className="text-lg font-medium text-white">{fix.id}</h4>
                    <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${
                      fix.status === 'resolved' ? 'text-emerald-500' : 'text-amber-500'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${fix.status === 'resolved' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                      {fix.status}
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Detected Issue</p>
                      <p className="text-sm text-white">{fix.issue}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">AI Diagnosis</p>
                      <p className="text-xs text-gray-400">{fix.diagnosis}</p>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Deployed Solution</p>
                    <p className="text-xs text-emerald-500 font-mono italic">&quot;{fix.solution}&quot;</p>
                  </div>
                </motion.div>
              ))}

              {autonomousFixes.length === 0 && (
                <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/2">
                  <ShieldAlert size={48} className="mx-auto text-gray-700 mb-4" />
                  <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">No autonomous actions required at this time.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#151619] border border-white/10 rounded-3xl p-8">
              <h3 className="text-sm font-mono font-bold text-gray-500 uppercase tracking-widest mb-6">Predictive Signals</h3>
              <div className="space-y-6">
                {[
                  { label: "Memory Pressure", value: 42, status: "stable" },
                  { label: "Network Latency", value: 12, status: "stable" },
                  { label: "DB Lock Contention", value: 8, status: "stable" },
                  { label: "API Error Rate", value: 0.02, status: "stable" }
                ].map((signal, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">
                      <span>{signal.label}</span>
                      <span className="text-emerald-500">{signal.status}</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${signal.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-500 rounded-3xl p-8 text-black">
              <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-serif font-medium mb-2">Autonomous Mode</h3>
              <p className="text-black/60 text-sm mb-6">Apphia is currently managing 42 micro-services with zero manual intervention required.</p>
              <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                System Healthy
              </div>
            </div>
          </div>
        </div>
          </motion.div>
        )}
        {activeTab === 'appmaker' && (
          <motion.div 
            key="appmaker"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="bg-[#151619] border border-white/10 rounded-3xl p-8 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#00FF00]/10 border border-[#00FF00]/20 flex items-center justify-center">
                  <Zap className="text-[#00FF00]" size={20} />
                </div>
                <h3 className="text-xl font-serif font-medium">Apphia App Maker</h3>
              </div>
              <p className="text-gray-500 text-sm">
                Describe the utility or micro-app you need, and Apphia will generate a technical blueprint and starter code.
              </p>
              <textarea 
                value={appDescription}
                onChange={e => setAppDescription(e.target.value)}
                placeholder="e.g., A real-time dashboard for tracking server costs across AWS and GCP..."
                rows={8}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm font-mono focus:border-[#00FF00]/50 focus:ring-1 focus:ring-[#00FF00]/50 outline-none transition-all"
              />
              <button 
                onClick={handleGenerateApp}
                disabled={!appDescription.trim() || isLoading}
                className="w-full py-4 bg-[#00FF00] text-black rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Cpu size={14} />}
                Generate App Blueprint
              </button>
            </div>

            <div className="space-y-6">
              {generatedApp ? (
                <div className="bg-[#151619] border border-white/10 rounded-3xl p-8 space-y-8 overflow-y-auto max-h-[600px]">
                  <div>
                    <h4 className="text-[#00FF00] font-mono text-[10px] font-bold uppercase tracking-widest mb-2">App Name</h4>
                    <p className="text-2xl font-serif font-medium">{generatedApp.name}</p>
                  </div>

                  <div>
                    <h4 className="text-gray-500 font-mono text-[10px] font-bold uppercase tracking-widest mb-2">Description</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{generatedApp.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-gray-500 font-mono text-[10px] font-bold uppercase tracking-widest mb-3">Tech Stack</h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedApp.techStack.map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-gray-300">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-gray-500 font-mono text-[10px] font-bold uppercase tracking-widest mb-3">Key Features</h4>
                      <ul className="space-y-1">
                        {generatedApp.features.map((feature, i) => (
                          <li key={i} className="text-[10px] text-gray-400 flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-[#00FF00]" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-gray-500 font-mono text-[10px] font-bold uppercase tracking-widest">Frontend (React + Tailwind)</h4>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(generatedApp.frontendCode);
                          alert('Code copied!');
                        }}
                        className="text-[10px] font-mono text-[#00FF00] hover:underline"
                      >
                        Copy
                      </button>
                    </div>
                    <pre className="bg-black/60 border border-white/5 rounded-2xl p-4 text-[10px] font-mono text-gray-300 overflow-x-auto max-h-40">
                      <code>{generatedApp.frontendCode}</code>
                    </pre>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-gray-500 font-mono text-[10px] font-bold uppercase tracking-widest">Backend (Node.js API)</h4>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(generatedApp.backendCode);
                          alert('Code copied!');
                        }}
                        className="text-[10px] font-mono text-[#00FF00] hover:underline"
                      >
                        Copy
                      </button>
                    </div>
                    <pre className="bg-black/60 border border-white/5 rounded-2xl p-4 text-[10px] font-mono text-gray-300 overflow-x-auto max-h-40">
                      <code>{generatedApp.backendCode}</code>
                    </pre>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-gray-500 font-mono text-[10px] font-bold uppercase tracking-widest mb-3">Data Schema</h4>
                      <pre className="bg-black/60 border border-white/5 rounded-xl p-3 text-[10px] font-mono text-gray-400 overflow-x-auto max-h-32">
                        <code>{generatedApp.databaseSchema}</code>
                      </pre>
                    </div>
                    <div>
                      <h4 className="text-gray-500 font-mono text-[10px] font-bold uppercase tracking-widest mb-3">Storage Layer</h4>
                      <p className="text-[10px] text-gray-400 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                        {generatedApp.storageStrategy}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl text-gray-600 bg-white/2 p-12 text-center">
                  <div className="w-16 h-16 rounded-[2rem] bg-white/5 flex items-center justify-center mb-4">
                    <Zap size={32} />
                  </div>
                  <h3 className="text-white font-medium mb-2">Ready for Generation</h3>
                  <p className="text-xs max-w-xs">Describe your micro-app on the left to see the AI-generated blueprint here.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusBadge({ status, label }: { status: 'operational' | 'degraded' | 'down', label: string }) {
  const colors = {
    operational: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    degraded: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    down: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  };
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${colors[status]} text-[10px] font-mono uppercase tracking-widest`}>
      <div className={`w-1.5 h-1.5 rounded-full ${status === 'operational' ? 'bg-emerald-500' : status === 'degraded' ? 'bg-amber-500' : 'bg-rose-500'} animate-pulse`} />
      {label}
    </div>
  );
}

function StatCard({ label, value, trend, icon: Icon, color }: { label: string, value: string, trend: string, icon: any, color: string }) {
  const isPositive = trend.startsWith('+');
  return (
    <div className="bg-[#151619] border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-mono font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
      </div>
      <p className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-serif font-medium text-white">{value}</p>
    </div>
  );
}

function ScoreBar({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] font-mono font-bold text-gray-500 mb-2 uppercase tracking-widest">
        <span>{label}</span>
        <span className="text-white">{value}%</span>
      </div>
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full ${color} rounded-full`} 
        />
      </div>
    </div>
  );
}

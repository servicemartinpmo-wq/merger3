'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Cpu, CheckCircle2, AlertCircle, ArrowRight, Zap } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

type Message = {
  id: string;
  role: 'user' | 'apphia';
  content: string;
  timestamp: string;
  recommendation?: {
    action: string;
    impact: string;
    applied: boolean;
  };
};

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'apphia',
    content: 'Apphia Engine initialized. I am monitoring 42 active initiatives and 18 critical dependencies. How can I assist with your operational strategy today?',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

export function AdvisoryDeskView() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key is not configured');
      }

      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `
        You are the Apphia Engine, an INTJ-architected reasoning core for the MARTIN PMO-OPs Command Center.
        Your role is to act as a highly analytical, strategic, and objective operational advisor to executives.
        You analyze data, detect signals, diagnose root causes, and provide actionable advisory guidance.
        
        Tone and Persona:
        - Analytical, precise, and objective.
        - Direct and concise. Avoid fluff.
        - Use structured thinking (e.g., "Observation -> Diagnosis -> Recommendation").
        - You are an AI engine, not a human. Refer to yourself as "Apphia" or "the engine".
        
        Context:
        You are currently monitoring a simulated environment with 42 active initiatives and 18 critical dependencies.
        Key ongoing projects include "Q3 Marketing Launch" (currently blocked by Database Migration), "Database Migration" (in progress, Tech Ops), and "API Auth Update".
        
        When asked a question, provide a structured response. If appropriate, suggest a concrete action that the user can apply.
        Format your response using Markdown.
        If you are recommending an action, clearly state it under a "Recommended Action:" heading, followed by a "Predicted Impact:" heading.
      `;

      const chat = ai.chats.create({
        model: 'gemini-3.1-pro-preview',
        config: {
          systemInstruction,
          temperature: 0.2,
        }
      });

      const response = await chat.sendMessage({ message: input });
      const reply = response.text;
      
      if (reply) {
        // Simple parsing to extract recommendation if present
        let recommendation;
        const actionMatch = reply.match(/Recommended Action:\s*(.*?)(?=\n|$)/i);
        const impactMatch = reply.match(/Predicted Impact:\s*(.*?)(?=\n|$)/i);
        
        if (actionMatch && impactMatch) {
          recommendation = {
            action: actionMatch[1].trim(),
            impact: impactMatch[1].trim(),
            applied: false
          };
        }

        const newApphiaMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'apphia',
          content: reply.replace(/Recommended Action:.*(\n|$)/ig, '').replace(/Predicted Impact:.*(\n|$)/ig, '').trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendation
        };
        setMessages(prev => [...prev, newApphiaMsg]);
      } else {
        throw new Error('No reply from Apphia');
      }
    } catch (e) {
      console.error(e);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'apphia',
        content: 'Error communicating with the Apphia Engine core. Please check API configuration.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleApply = (messageId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId && msg.recommendation) {
        return { ...msg, recommendation: { ...msg.recommendation, applied: true } };
      }
      return msg;
    }));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Advisory Desk</h1>
          <p className="text-slate-500 mt-1">Direct interface with the Apphia reasoning engine for strategic guidance.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">
          <Cpu size={14} className="animate-pulse" />
          APPHIA ENGINE ONLINE
        </div>
      </header>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col relative min-h-0">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white'
                }`}>
                  {msg.role === 'user' ? <span className="font-bold text-xs tracking-tighter">EXEC</span> : <Cpu size={20} />}
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1.5 px-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {msg.role === 'user' ? 'Executive Command' : 'Apphia Intelligence'}
                    </span>
                    <span className="text-[10px] text-slate-300 font-bold">•</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{msg.timestamp}</span>
                  </div>
                  
                  <div className={`p-4 rounded-2xl shadow-sm border ${
                    msg.role === 'user' 
                      ? 'bg-slate-900 text-white border-slate-800 rounded-tr-none' 
                      : 'bg-slate-50 border-slate-100 text-slate-800 rounded-tl-none'
                  }`}>
                    <div className="prose prose-sm max-w-none whitespace-pre-wrap leading-relaxed font-medium text-sm">
                      {msg.content}
                    </div>
                  </div>

                  {/* Recommendation Card */}
                  {msg.recommendation && (
                    <div className="mt-4 w-full max-w-md bg-white border border-indigo-100 rounded-xl p-5 shadow-md relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                          <Zap size={16} className="text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm tracking-tight">Strategic Recommendation</h4>
                          <p className="text-slate-600 text-xs mt-1 font-medium leading-relaxed">{msg.recommendation.action}</p>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Projected Impact</span>
                        <p className="text-xs text-slate-700 font-bold leading-relaxed">{msg.recommendation.impact}</p>
                      </div>
                      
                      {msg.recommendation.applied ? (
                        <div className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 text-xs font-bold uppercase tracking-widest">
                          <CheckCircle2 size={14} /> Action Deployed
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleApply(msg.id)}
                          className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-all text-xs font-bold uppercase tracking-widest shadow-sm active:scale-[0.98]"
                        >
                          Deploy Remedy <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Cpu size={20} className="animate-pulse" />
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-slate-100">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Query Apphia Engine... (e.g., 'Analyze Q3 delivery risks')"
              className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400 font-medium text-sm"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-30 transition-all active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <button onClick={() => setInput("Identify current operational bottlenecks")} className="shrink-0 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors border border-slate-200">
              Identify Bottlenecks
            </button>
            <button onClick={() => setInput("Simulate 15% capacity reduction")} className="shrink-0 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors border border-slate-200">
              Capacity Simulation
            </button>
            <button onClick={() => setInput("List all high-risk initiatives")} className="shrink-0 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors border border-slate-200">
              Risk Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className="space-y-8 font-sans text-slate-900 bg-white min-h-[calc(100vh-8rem)] p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-serif text-4xl font-medium tracking-tight text-slate-900">
              Advisory Desk
            </h1>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-widest rounded-full border border-teal-200">
              <Cpu size={14} className="animate-pulse" /> Apphia Engine
            </span>
          </div>
          <p className="text-slate-500 max-w-2xl text-base leading-relaxed">
            Direct interface with the Apphia reasoning engine. Ask strategic questions, simulate scenarios, and apply automated operational remedies.
          </p>
        </div>
      </header>

      <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col relative">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-teal-100 text-teal-700 border border-teal-200'
                }`}>
                  {msg.role === 'user' ? <span className="font-medium text-sm">EX</span> : <Cpu size={20} />}
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-slate-500">{msg.role === 'user' ? 'Executive' : 'Apphia Engine'}</span>
                    <span className="text-xs text-slate-400">{msg.timestamp}</span>
                  </div>
                  
                  <div className={`p-4 rounded-2xl shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-slate-900 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                  }`}>
                    <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                      {msg.content}
                    </div>
                  </div>

                  {/* Recommendation Card */}
                  {msg.recommendation && (
                    <div className="mt-3 w-full max-w-md bg-white border-2 border-teal-500/20 rounded-xl p-4 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
                      <div className="flex items-start gap-3 mb-3">
                        <Zap size={18} className="text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-slate-900 text-sm">Recommended Action</h4>
                          <p className="text-slate-700 text-sm mt-1">{msg.recommendation.action}</p>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Predicted Impact</span>
                        <p className="text-xs text-slate-600">{msg.recommendation.impact}</p>
                      </div>
                      
                      {msg.recommendation.applied ? (
                        <div className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 text-sm font-medium">
                          <CheckCircle2 size={16} /> Action Applied
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleApply(msg.id)}
                          className="flex items-center justify-center gap-2 w-full py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium shadow-sm"
                        >
                          Apply Recommendation <ArrowRight size={16} />
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
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 border border-teal-200 flex items-center justify-center shrink-0">
                  <Cpu size={20} className="animate-pulse" />
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Apphia a strategic question... (e.g., 'What happens if we delay the Q3 launch?')"
              className="w-full pl-4 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all text-slate-900 placeholder:text-slate-400"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <button onClick={() => setInput("What is the current bottleneck in Engineering?")} className="shrink-0 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs rounded-full transition-colors border border-slate-200">
              Identify Bottlenecks
            </button>
            <button onClick={() => setInput("Simulate a 10% budget cut across all departments.")} className="shrink-0 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs rounded-full transition-colors border border-slate-200">
              Simulate Budget Cut
            </button>
            <button onClick={() => setInput("Which initiatives are at risk of missing their Q3 deadlines?")} className="shrink-0 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs rounded-full transition-colors border border-slate-200">
              Show At-Risk Initiatives
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Send, Bot, User } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not configured');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export function TechSupportChat() {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsProcessing(true);

    try {
      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a technical support expert. Help the user with their issue: ${userMessage}. Explain the fix in simple, natural, plain language without jargon.`,
      });
      setMessages(prev => [...prev, { role: 'ai', content: response.text || 'No response.' }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white border border-black/10 rounded-3xl overflow-hidden laminated-surface glass-reflection">
      <div className="p-6 border-b border-black/5 bg-black/5">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Tech Support AI</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <Bot size={48} className="mx-auto mb-4 opacity-50" />
            <p>How can I help you with your tech issue today?</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'ai' && <div className="w-8 h-8 rounded-full bg-showroom-accent/10 flex items-center justify-center"><Bot size={16} className="text-showroom-accent" /></div>}
            <div className={`p-4 rounded-2xl max-w-[80%] ${m.role === 'user' ? 'bg-slate-900 text-white' : 'bg-black/5 text-slate-900'}`}>
              {m.content}
            </div>
            {m.role === 'user' && <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center"><User size={16} className="text-slate-600" /></div>}
          </div>
        ))}
        {isProcessing && <div className="p-4 text-slate-400 flex items-center gap-2"><Loader2 className="animate-spin" /> Thinking...</div>}
      </div>

      <div className="p-6 border-t border-black/5 flex gap-4">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Explain your tech issue in plain language..."
          className="flex-1 bg-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-showroom-accent/50"
        />
        <button onClick={handleSend} className="p-3 bg-showroom-accent text-black rounded-xl hover:bg-showroom-accent/90 transition-colors">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MessageSquare, X, Loader2, FileText, Send } from 'lucide-react';
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

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsProcessing(true);

    try {
      // Check if user wants to take a note
      if (userMessage.toLowerCase().startsWith('note:')) {
        const noteContent = userMessage.substring(5).trim();
        // Here you would typically save to a database
        setMessages(prev => [...prev, { role: 'ai', content: `Note saved: "${noteContent}"` }]);
      } else {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: userMessage,
        });
        setMessages(prev => [...prev, { role: 'ai', content: response.text || 'No response.' }]);
      }
    } catch (error) {
      console.error('AI Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-slate-900 text-white rounded-full shadow-xl hover:bg-slate-800 transition-colors"
      >
        <MessageSquare size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-medium">Apphia Assistant</h3>
              <button onClick={() => setIsOpen(false)}><X size={18} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`p-3 rounded-2xl ${m.role === 'user' ? 'bg-slate-100 ml-auto max-w-[80%]' : 'bg-showroom-accent/10 mr-auto max-w-[80%]'}`}>
                  {m.content}
                </div>
              ))}
              {isProcessing && <div className="p-3 text-slate-400"><Loader2 className="animate-spin" /></div>}
            </div>

            <div className="p-4 border-t border-slate-100 flex gap-2">
              <button 
                onClick={toggleRecording}
                className={`p-2 rounded-full ${isRecording ? 'bg-rose-500 text-white' : 'bg-slate-100'}`}
              >
                <Mic size={18} />
              </button>
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Apphia anything..."
                className="flex-1 bg-slate-50 rounded-xl px-4 py-2 text-sm"
              />
              <button onClick={handleSend} className="p-2 bg-slate-900 text-white rounded-full">
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function LandingView({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen flex flex-col items-center justify-center bg-white text-slate-900 p-8"
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <Image 
          src="https://drive.google.com/uc?id=18b3DTRptB-KV75a8ukiUJGw19f_2CB_k" 
          alt="Martin PMO Logo" 
          width={120} 
          height={120} 
          className="rounded-2xl shadow-xl"
          referrerPolicy="no-referrer"
        />
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-5xl font-bold tracking-tight mb-6 text-slate-900">
          PMO-Ops Command Center
        </h1>
        <p className="text-xl text-slate-500 mb-12 leading-relaxed">
          The expert-guided system that converts unstructured ambition into governed execution with real-time operational intelligence.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onComplete}
            className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
          >
            Initialize Command Center
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            SYSTEM READY
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-12 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300"
      >
        Powered by Apphia Intelligence Core
      </motion.div>
    </motion.div>
  );
}

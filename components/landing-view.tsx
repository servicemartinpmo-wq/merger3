'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function LandingView({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen flex flex-col items-center justify-center bg-showroom-bg text-white p-8"
    >
      <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
        <Image 
          src="https://drive.google.com/uc?id=18b3DTRptB-KV75a8ukiUJGw19f_2CB_k" 
          alt="Venture-OS Logo" 
          width={80} 
          height={80} 
          className="rounded-xl"
          referrerPolicy="no-referrer"
        />
      </div>
      <h1 className="text-4xl font-display mb-6">Welcome to Venture-OS</h1>
      <p className="text-slate-400 mb-8 max-w-md text-center">Your mission-control for operational excellence.</p>
      <button 
        onClick={onComplete}
        className="px-8 py-3 bg-showroom-accent text-white rounded-full font-medium hover:bg-opacity-90 transition"
      >
        Start Diagnostic
      </button>
    </motion.div>
  );
}

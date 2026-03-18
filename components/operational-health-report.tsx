'use client';
import { motion } from 'framer-motion';

export function OperationalHealthReport({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen flex flex-col items-center justify-center bg-showroom-bg text-white p-8"
    >
      <h1 className="text-4xl font-display mb-6">Operational Health Report</h1>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 w-full max-w-2xl">
        <p className="text-slate-400 mb-4">Your organization is currently at a 72% maturity level.</p>
        <p className="text-slate-400">Critical bottlenecks detected in Resource Allocation.</p>
      </div>
      <button 
        onClick={onComplete}
        className="px-8 py-3 bg-showroom-accent text-white rounded-full font-medium hover:bg-opacity-90 transition"
      >
        Continue to Onboarding
      </button>
    </motion.div>
  );
}

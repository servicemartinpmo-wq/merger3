'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, X } from 'lucide-react';

export function FeatureNudge({ feature, message }: { feature: string, message: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user has already seen this nudge
    const seen = localStorage.getItem(`nudge_${feature}`);
    if (!seen) {
      const timer = setTimeout(() => setVisible(true), 10000); // Show after 10s
      return () => clearTimeout(timer);
    }
  }, [feature]);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(`nudge_${feature}`, 'true');
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        className="fixed top-24 right-6 bg-white border border-slate-200 p-6 rounded-3xl shadow-2xl w-80 flex gap-4"
      >
        <Lightbulb className="text-amber-500 flex-shrink-0" />
        <div>
          <h4 className="font-bold">Pro Tip</h4>
          <p className="text-sm text-slate-600 mt-1">{message}</p>
          <button onClick={dismiss} className="mt-3 text-xs text-slate-400 hover:text-slate-600">Dismiss</button>
        </div>
        <button onClick={dismiss} className="absolute top-2 right-2 text-slate-400"><X size={16} /></button>
      </motion.div>
    </AnimatePresence>
  );
}

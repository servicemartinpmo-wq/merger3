'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { useGamification } from '@/components/gamification-provider';

export function RewardNotification({ message, points }: { message: string, points: number }) {
  const [visible, setVisible] = useState(true);
  const { addPoints } = useGamification();

  useEffect(() => {
    addPoints(points);
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [points, addPoints]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-24 left-6 bg-emerald-500 text-white p-4 rounded-3xl shadow-xl flex items-center gap-3"
      >
        <Star className="text-yellow-300" />
        <div>
          <p className="font-bold">{message}</p>
          <p className="text-sm opacity-90">+{points} points earned!</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

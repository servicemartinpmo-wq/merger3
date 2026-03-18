'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { IndustryMode } from '@/lib/types/pmo';

interface LockscreenBannerProps {
  mode: IndustryMode;
}

const images: Record<IndustryMode, string> = {
  creative: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2070',
  freelancer: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=2070',
  SMB: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069',
  executive: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070',
  healthcare: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2053',
  'start-up': 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=2070',
};

const titles: Record<IndustryMode, string> = {
  creative: 'Creative Studio',
  freelancer: 'Freelancer Hub',
  SMB: 'SMB Operations',
  executive: 'Executive Suite',
  healthcare: 'Healthcare Ops',
  'start-up': 'Start-up Launchpad',
};

export function LockscreenBanner({ mode }: LockscreenBannerProps) {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <Image
            src={images[mode]}
            alt={mode}
            fill
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#F5F2ED]" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-6xl md:text-8xl font-serif font-light tracking-tighter mb-2">
            {mounted ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
          </h1>
          <p className="text-sm md:text-base font-mono uppercase tracking-[0.3em] opacity-80">
            {mounted ? time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }) : '---'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center"
        >
          <span className="text-xs font-mono uppercase tracking-widest opacity-60 mb-2">Active Mode</span>
          <h2 className="text-2xl font-serif italic">{titles[mode]}</h2>
        </motion.div>
      </div>
    </div>
  );
}

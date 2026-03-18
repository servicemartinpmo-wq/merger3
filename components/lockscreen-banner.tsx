'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { IndustryMode } from '@/lib/types/pmo';
import { useMounted } from '@/hooks/use-mounted';

interface LockscreenBannerProps {
  mode: IndustryMode;
  operationalStatus?: string;
  operationalDetail?: string;
  teamWins?: string[];
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
  creative: 'Command Center: Creative',
  freelancer: 'Command Center: Freelancer',
  SMB: 'Command Center: SMB Ops',
  executive: 'Command Center: Executive',
  healthcare: 'Command Center: Healthcare',
  'start-up': 'Command Center: Start-up',
};

export function LockscreenBanner({ mode, operationalStatus, operationalDetail, teamWins }: LockscreenBannerProps) {
  const [time, setTime] = useState(new Date());
  const mounted = useMounted();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-showroom-bg" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Left: Operational Status */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="hidden lg:block space-y-4"
          >
            <div className="flex items-center gap-2 text-showroom-accent">
              <span className="w-2 h-2 rounded-full bg-showroom-accent animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">Live Status</span>
            </div>
            <h3 className="text-2xl font-serif font-light">{operationalStatus}</h3>
            <p className="text-sm text-white/60 font-light leading-relaxed max-w-xs">{operationalDetail}</p>
          </motion.div>

          {/* Center: Time & Date */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center space-y-4"
          >
            <h1 className="text-8xl md:text-9xl font-serif font-light tracking-tighter">
              {mounted ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
            </h1>
            <div className="space-y-1">
              <p className="text-sm md:text-base font-mono uppercase tracking-[0.4em] opacity-80">
                {mounted ? time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }) : '---'}
              </p>
              <div className="h-px w-12 bg-showroom-accent mx-auto mt-4" />
            </div>
          </motion.div>

          {/* Right: Team Wins */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="hidden lg:block space-y-6"
          >
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold text-white/40">Recent Team Wins</span>
            </div>
            <div className="space-y-4">
              {teamWins?.map((win, i) => (
                <div key={i} className="flex items-center justify-end gap-3 text-right">
                  <span className="text-sm font-light text-white/80 italic">{win}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40 mb-3">System Engine</span>
          <h2 className="text-3xl font-serif font-light tracking-tight">{titles[mode]}</h2>
        </motion.div>
      </div>
    </div>
  );
}

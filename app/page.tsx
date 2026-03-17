'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExecutivePmoView } from '@/components/executive-pmo-view';
import { TechOpsView } from '@/components/tech-ops-view';
import { Activity, Briefcase } from 'lucide-react';

export default function DashboardPage() {
  const [view, setView] = useState<'pmo' | 'techops'>('pmo');

  return (
    <div className={`min-h-screen transition-colors duration-500 ${view === 'pmo' ? 'bg-[#F5F2ED] text-gray-900' : 'bg-[#0B0B0C] text-white'}`}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 border-b backdrop-blur-md ${view === 'pmo' ? 'border-gray-200/50 bg-[#F5F2ED]/80' : 'border-white/10 bg-[#0B0B0C]/80'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded flex items-center justify-center ${view === 'pmo' ? 'bg-gray-900 text-white' : 'bg-[#00FF00] text-black'}`}>
                {view === 'pmo' ? <Briefcase size={18} /> : <Activity size={18} />}
              </div>
              <span className={`font-semibold tracking-tight ${view === 'pmo' ? 'font-serif text-xl' : 'font-sans text-lg uppercase tracking-widest'}`}>
                Strategic Ops
              </span>
            </div>
            
            <div className="flex space-x-1 p-1 rounded-full bg-black/5 dark:bg-white/5">
              <button
                onClick={() => setView('pmo')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  view === 'pmo' 
                    ? 'bg-white shadow-sm text-gray-900' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Executive PMO
              </button>
              <button
                onClick={() => setView('techops')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  view === 'techops' 
                    ? 'bg-[#1A1A1C] shadow-sm text-[#00FF00] border border-[#00FF00]/20' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Tech-Ops Command
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {view === 'pmo' ? (
            <motion.div
              key="pmo"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ExecutivePmoView />
            </motion.div>
          ) : (
            <motion.div
              key="techops"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <TechOpsView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

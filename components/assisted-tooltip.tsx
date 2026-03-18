'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AssistedTooltip({ children, content, enabled }: { children: React.ReactNode, content: string, enabled: boolean }) {
  const [show, setShow] = useState(false);

  if (!enabled) return <>{children}</>;

  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute z-[1000] w-64 p-3 mt-2 text-xs text-white bg-slate-900 rounded-lg shadow-xl border border-slate-700"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

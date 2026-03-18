'use client';
import { motion } from 'framer-motion';

export function AnimatedBorder({ children, className = "", isActive = false }: { children: React.ReactNode, className?: string, isActive?: boolean }) {
  return (
    <div className={`relative p-[2px] rounded-2xl overflow-hidden ${className}`}>
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 6, // Slower
            ease: "linear",
            repeat: Infinity,
          }}
        />
      )}
      <div className="relative bg-white rounded-[14px] h-full">
        {children}
      </div>
    </div>
  );
}

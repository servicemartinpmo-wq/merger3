'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function BackgroundCollage() {
  const images = [
    'https://images.unsplash.com/photo-1554188248-986adbb73be4?q=80&w=3840&auto=format&fit=crop', // Artistic texture/light
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=3840&auto=format&fit=crop', // Unique artistic composition
    'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=3840&auto=format&fit=crop', // Macro/Textured
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=3840&auto=format&fit=crop', // Artistic/Abstract
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      transition={{ duration: 2 }}
      className="fixed inset-0 -z-10 grid grid-cols-2 grid-rows-2 gap-0 overflow-hidden"
    >
      {images.map((src, i) => (
        <motion.div 
          key={i} 
          className="relative w-full h-full"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={src}
            alt={`Background collage ${i}`}
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      ))}
      <div className="bg-slate-950/40 absolute inset-0" /> {/* Overlay for contrast */}
    </motion.div>
  );
}

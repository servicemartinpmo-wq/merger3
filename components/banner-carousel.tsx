'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const images = [
  'https://picsum.photos/seed/nature/800/400',
  'https://picsum.photos/seed/architecture/800/400',
  'https://picsum.photos/seed/technology/800/400',
  'https://picsum.photos/seed/abstract/800/400',
  'https://picsum.photos/seed/city/800/400',
];

export function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
      const seed = dayOfYear % 90;
      setCurrentIndex(seed % images.length);
    }, 0);
  }, []);

  return (
    <div className="relative w-full h-48 rounded-2xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex]}
            alt="Banner"
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

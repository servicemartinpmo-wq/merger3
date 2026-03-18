'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { generateBanner } from '../app/generate-banner';

export function BannerImage({ title }: { title: string }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    generateBanner(title).then(setSrc);
  }, [title]);

  if (!src) return <div className="w-full h-32 bg-slate-200 animate-pulse rounded-t-2xl" />;

  return (
    <Image 
      src={src} 
      alt={title} 
      width={800} 
      height={450} 
      className="w-full h-32 object-cover rounded-t-2xl"
      referrerPolicy="no-referrer"
    />
  );
}

'use client';
import { useTheme } from './theme-provider';
import { motion } from 'framer-motion';
import { useMounted } from '@/hooks/use-mounted';

export function BackgroundCollage() {
  const { theme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return <div className="fixed inset-0 -z-10 overflow-hidden bg-black" />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      transition={{ duration: 2 }}
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ backgroundImage: theme.wallpaper ? `url(${theme.wallpaper})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="bg-slate-950/40 absolute inset-0" /> {/* Overlay for contrast */}
    </motion.div>
  );
}

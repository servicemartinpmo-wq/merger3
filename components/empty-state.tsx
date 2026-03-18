import { LucideIcon } from 'lucide-react';
import Image from 'next/image';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  imageUrl?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, imageUrl, action }: EmptyStateProps) {
  return (
    <div className="relative flex flex-col items-center justify-center py-24 px-8 text-center laminated-surface rounded-3xl border border-white/10 overflow-hidden bg-slate-800/50">
      {imageUrl && (
        <Image 
          src={imageUrl} 
          alt={title} 
          fill 
          className="object-cover opacity-20" 
          referrerPolicy="no-referrer"
        />
      )}
      <div className="relative z-10 flex flex-col items-center">
        {Icon && (
          <div className="w-20 h-20 rounded-3xl bg-slate-900/50 backdrop-blur-sm border border-white/10 flex items-center justify-center mb-8 text-blue-400 shadow-xl">
            <Icon size={40} />
          </div>
        )}
        <h3 className="text-2xl font-serif font-medium text-white mb-3">{title}</h3>
        <p className="text-slate-400 max-w-sm mb-10 leading-relaxed">{description}</p>
        {action && (
          <button
            onClick={action.onClick}
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20 hover:scale-105 active:scale-95"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}

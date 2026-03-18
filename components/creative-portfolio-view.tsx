'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Maximize2, 
  Heart, 
  MessageSquare, 
  Share2,
  ChevronLeft,
  ChevronRight,
  Play,
  Eye
} from 'lucide-react';

const portfolioItems = [
  { 
    id: 1, 
    title: 'Abstract Motion Study', 
    category: 'Motion Design', 
    image: 'https://picsum.photos/seed/motion/1000/1200',
    likes: 124,
    views: '1.2k',
    type: 'video'
  },
  { 
    id: 2, 
    title: 'Branding for EcoFlow', 
    category: 'Identity', 
    image: 'https://picsum.photos/seed/branding/1000/1200',
    likes: 89,
    views: '840',
    type: 'image'
  },
  { 
    id: 3, 
    title: 'Future Systems UI', 
    category: 'UI/UX', 
    image: 'https://picsum.photos/seed/ui/1000/1200',
    likes: 256,
    views: '3.4k',
    type: 'image'
  },
  { 
    id: 4, 
    title: 'Urban Architecture', 
    category: 'Photography', 
    image: 'https://picsum.photos/seed/architecture/1000/1200',
    likes: 67,
    views: '520',
    type: 'image'
  },
  { 
    id: 5, 
    title: 'Cyberpunk Editorial', 
    category: '3D Art', 
    image: 'https://picsum.photos/seed/cyberpunk/1000/1200',
    likes: 412,
    views: '5.1k',
    type: 'video'
  },
  { 
    id: 6, 
    title: 'Minimalist Interior', 
    category: 'ArchViz', 
    image: 'https://picsum.photos/seed/interior/1000/1200',
    likes: 156,
    views: '1.1k',
    type: 'image'
  },
];

export function CreativePortfolioView() {
  const [selectedItem, setSelectedItem] = useState<typeof portfolioItems[0] | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Motion Design', 'Identity', 'UI/UX', 'Photography', '3D Art'];

  return (
    <div className="space-y-12 bg-slate-900 p-8 min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Portfolio Live
          </div>
          <h2 className="text-5xl md:text-7xl font-serif font-light tracking-tighter leading-none">Creative Showcase</h2>
          <p className="text-lg text-slate-500 max-w-xl">Curating the finest digital experiences and visual narratives.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/20">
            <Plus size={16} />
            Upload Work
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-y border-slate-200 py-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                activeCategory === cat 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-white text-slate-400 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button className="p-2 rounded-lg bg-white shadow-sm text-slate-900"><Grid size={16} /></button>
            <button className="p-2 rounded-lg text-slate-400 hover:text-slate-900"><List size={16} /></button>
          </div>
          <button className="p-3 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900">
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {portfolioItems.map((item) => (
          <motion.div
            key={item.id}
            layoutId={`item-${item.id}`}
            onClick={() => setSelectedItem(item)}
            className="group cursor-pointer space-y-4"
          >
            <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden bg-slate-100">
              <Image 
                src={item.image} 
                alt={item.title} 
                fill
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  {item.type === 'video' ? <Play size={20} /> : <Maximize2 size={20} />}
                </div>
              </div>
              <div className="absolute top-6 right-6">
                <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-rose-500 transition-all">
                  <Heart size={18} />
                </button>
              </div>
            </div>
            <div className="px-4 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-serif font-medium text-slate-900">{item.title}</h3>
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">{item.category}</p>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <div className="flex items-center gap-1.5 text-[10px] font-bold">
                  <Eye size={14} />
                  {item.views}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold">
                  <MessageSquare size={14} />
                  {item.likes}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12"
          >
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
            >
              <Maximize2 size={32} className="rotate-45" />
            </button>

            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              <div className="lg:col-span-2 relative aspect-[16/10] rounded-[48px] overflow-hidden shadow-2xl">
                <Image 
                  src={selectedItem.image} 
                  alt={selectedItem.title} 
                  fill
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-y-0 left-4 flex items-center">
                  <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20">
                    <ChevronLeft size={24} />
                  </button>
                </div>
                <div className="absolute inset-y-0 right-4 flex items-center">
                  <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20">
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>

              <div className="space-y-8 text-white">
                <div className="space-y-2">
                  <p className="text-xs font-mono uppercase tracking-[0.3em] text-white/40">{selectedItem.category}</p>
                  <h2 className="text-4xl md:text-5xl font-serif font-light tracking-tight">{selectedItem.title}</h2>
                </div>
                
                <p className="text-white/60 leading-relaxed">
                  A deep dive into the intersection of technology and aesthetic minimalism. This project explores how digital interfaces can feel organic and human-centric while maintaining high technical precision.
                </p>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Heart size={18} />
                    </div>
                    <span className="text-sm font-bold">{selectedItem.likes}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <MessageSquare size={18} />
                    </div>
                    <span className="text-sm font-bold">24</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Share2 size={18} />
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Plus size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-white/40">Project Lead</p>
                    <p className="font-medium">Alex Venture</p>
                  </div>
                </div>

                <button className="w-full py-5 bg-white text-slate-900 rounded-3xl font-bold uppercase tracking-widest text-xs hover:bg-slate-100 transition-all">
                  View Case Study
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

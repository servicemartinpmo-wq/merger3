'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Book, Filter, ArrowLeft, ExternalLink } from 'lucide-react';
import { managementCanon, Book as BookType } from '@/lib/knowledge/canon';
import { Link } from 'react-router-dom';

export function ManagementCanonView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(managementCanon.map(b => b.category)))];

  const filteredBooks = managementCanon.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'All' || book.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <Link 
            to="/resource-hub" 
            className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-2 mb-4"
          >
            <ArrowLeft size={12} /> Back to Resource Hub
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Management Canon</h1>
          <p className="text-slate-500 max-w-2xl text-lg leading-relaxed font-medium">
            The Knowledge Superbase: A curated collection of foundational frameworks, strategic models, and management literature.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative group w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search the canon..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-full font-medium"
            />
          </div>
        </div>
      </header>

      <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-100">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
              activeCategory === category
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book, index) => (
          <motion.div 
            key={book.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-6 group"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Book size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded">
                {book.year}
              </span>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                {book.title}
              </h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">
                {book.author}
              </p>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed font-medium flex-grow">
              {book.description}
            </p>

            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600/60">
                {book.category}
              </span>
              <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                <ExternalLink size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-24 bg-white border border-slate-200 rounded-3xl">
          <Book className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No books found</h3>
          <p className="text-slate-500 font-medium">Try adjusting your search or category filter.</p>
        </div>
      )}
    </div>
  );
}

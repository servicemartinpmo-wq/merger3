'use client';

import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { 
  Plus, 
  MoreHorizontal, 
  Clock, 
  MessageSquare, 
  Paperclip,
  CheckCircle2,
  Calendar,
  Filter,
  Search,
  User
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  client: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  comments: number;
  attachments: number;
  tags: string[];
}

const initialTasks: Record<string, Task[]> = {
  'To Do': [
    { id: '1', title: 'Brand Identity Design', client: 'Nexus Corp', priority: 'High', dueDate: 'Mar 20', comments: 12, attachments: 4, tags: ['Design', 'Branding'] },
    { id: '2', title: 'Website Audit', client: 'EcoFlow', priority: 'Medium', dueDate: 'Mar 22', comments: 5, attachments: 2, tags: ['SEO', 'Audit'] },
  ],
  'In Progress': [
    { id: '3', title: 'Social Media Strategy', client: 'Vibe Agency', priority: 'High', dueDate: 'Mar 18', comments: 8, attachments: 1, tags: ['Marketing', 'Social'] },
  ],
  'Review': [
    { id: '4', title: 'Q1 Content Calendar', client: 'Growth Lab', priority: 'Low', dueDate: 'Mar 15', comments: 24, attachments: 6, tags: ['Content', 'Planning'] },
  ],
  'Done': [
    { id: '5', title: 'Logo Animation', client: 'Spark Studio', priority: 'Medium', dueDate: 'Mar 10', comments: 15, attachments: 3, tags: ['Motion', 'Logo'] },
  ]
};

export function FreelanceKanbanView() {
  const [columns, setColumns] = useState(initialTasks);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-serif font-medium tracking-tight">Project Pipeline</h2>
          <p className="text-slate-500">Managing your freelance workflow and client deliverables.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5"
            />
          </div>
          <button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors">
            <Filter size={18} />
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
            <Plus size={14} />
            New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(columns).map(([columnId, tasks]) => (
          <div key={columnId} className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400">{columnId}</h3>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">{tasks.length}</span>
              </div>
              <button className="text-slate-400 hover:text-slate-900">
                <MoreHorizontal size={16} />
              </button>
            </div>

            <div className="space-y-3 min-h-[500px] p-2 rounded-3xl bg-slate-100/50 border border-dashed border-slate-200">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layoutId={task.id}
                  whileHover={{ y: -2 }}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {task.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded-lg bg-slate-50 text-[9px] font-bold uppercase tracking-widest text-slate-500 border border-slate-100">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest ${
                        task.priority === 'High' ? 'bg-rose-50 text-rose-600' :
                        task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' :
                        'bg-emerald-50 text-emerald-600'
                      }`}>
                        {task.priority}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif text-lg text-slate-900 leading-tight mb-1">{task.title}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <User size={12} />
                        {task.client}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-slate-400">
                        <div className="flex items-center gap-1 text-[10px]">
                          <MessageSquare size={12} />
                          {task.comments}
                        </div>
                        <div className="flex items-center gap-1 text-[10px]">
                          <Paperclip size={12} />
                          {task.attachments}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                        <Clock size={12} />
                        {task.dueDate}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              <button className="w-full py-3 rounded-2xl border border-dashed border-slate-300 text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                <Plus size={14} />
                Add Task
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

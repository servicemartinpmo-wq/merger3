'use client';
import { InsightCard } from '@/lib/types/pmo';
import { motion } from 'framer-motion';

interface Props {
  insights: InsightCard[];
}

export function InsightDisplay({ insights }: Props) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {insights.map((insight, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col"
        >
          <div className="flex justify-between items-start mb-4">
            <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
              insight.type === 'Supervisory' ? 'bg-amber-100 text-amber-800' :
              insight.type === 'Advisory' ? 'bg-indigo-100 text-indigo-800' :
              'bg-emerald-100 text-emerald-800'
            }`}>
              {insight.type}
            </span>
            <span className="text-sm font-mono text-slate-500">{insight.priorityScore}%</span>
          </div>
          
          <h3 className="font-semibold text-slate-900 mb-2">{insight.situation}</h3>
          <p className="text-sm text-slate-600 mb-4 flex-grow">{insight.diagnosis}</p>
          
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Recommendation</p>
              <p className="text-sm text-slate-800">{insight.recommendation}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">System Remedy</p>
              <p className="text-sm text-slate-800">{insight.systemRemedy}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

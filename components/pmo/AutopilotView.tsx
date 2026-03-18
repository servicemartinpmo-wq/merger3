'use client';
import { useState } from 'react';
import { autopilotService } from '@/lib/services/autopilotService';
import { motion } from 'framer-motion';

export function AutopilotView({ orgId }: { orgId: string }) {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<any>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const newProject = await autopilotService.generateProjectPlan(goal, orgId);
      setProject(newProject);
    } catch (error) {
      console.error('Error generating project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-semibold mb-4">AI Project Autopilot</h2>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Describe your goal (e.g., Launch new SaaS product)"
          className="flex-grow p-2 border border-slate-300 rounded-lg"
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !goal}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300"
        >
          {loading ? 'Generating...' : 'Generate Plan'}
        </button>
      </div>
      {project && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3 className="text-lg font-medium text-emerald-600">Project &quot;{project.name}&quot; created successfully!</h3>
          <p className="text-slate-600">Check your initiatives dashboard to see the roadmap.</p>
        </motion.div>
      )}
    </div>
  );
}

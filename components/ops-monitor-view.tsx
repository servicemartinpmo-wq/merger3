'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Clock, Users, CheckCircle2, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';

type OpsReport = {
  projects: { id: number; name: string; status: string; delay: string; reason: string }[];
  workload: { id: number; team: string; status: string; load: string; issue: string }[];
  stalledTasks: { id: number; task: string; owner: string; daysStalled: number }[];
};

export function OpsMonitorView() {
  const [report, setReport] = useState<OpsReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOpsReport = async () => {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        console.error('Gemini API key is not configured');
        setIsLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });

      try {
        const systemInstruction = `
          You are the Apphia Engine, an AI operations monitor for a PMO.
          Analyze the current organizational state and generate an operations status report.
          
          Simulated Current State:
          - Q3 Marketing Launch is delayed.
          - Database Migration is slightly delayed.
          - Annual Planning Offsite is on track.
          - Design team is overloaded.
          - Engineering team is nearing capacity.
          - Marketing team is optimal.
          - Several tasks are stalled.
          
          Generate a JSON response with the following structure:
          1. projects: Array of objects { id, name, status, delay, reason } (status must be 'red', 'yellow', or 'green')
          2. workload: Array of objects { id, team, status, load, issue } (status must be 'red', 'yellow', or 'green')
          3. stalledTasks: Array of objects { id, task, owner, daysStalled }
          
          Make the data look realistic and professional for a tech company.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: 'Generate the operations status report.',
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                projects: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.NUMBER },
                      name: { type: Type.STRING },
                      status: { type: Type.STRING },
                      delay: { type: Type.STRING },
                      reason: { type: Type.STRING },
                    },
                    required: ['id', 'name', 'status', 'delay', 'reason'],
                  },
                },
                workload: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.NUMBER },
                      team: { type: Type.STRING },
                      status: { type: Type.STRING },
                      load: { type: Type.STRING },
                      issue: { type: Type.STRING },
                    },
                    required: ['id', 'team', 'status', 'load', 'issue'],
                  },
                },
                stalledTasks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.NUMBER },
                      task: { type: Type.STRING },
                      owner: { type: Type.STRING },
                      daysStalled: { type: Type.NUMBER },
                    },
                    required: ['id', 'task', 'owner', 'daysStalled'],
                  },
                },
              },
              required: ['projects', 'workload', 'stalledTasks'],
            },
          },
        });

        const jsonStr = response.text?.trim();
        if (jsonStr) {
          const reportData = JSON.parse(jsonStr);
          setReport(reportData);
        }
      } catch (error) {
        console.error('Failed to fetch ops report:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpsReport();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'red': return <XCircle className="text-rose-500" size={20} />;
      case 'yellow': return <AlertTriangle className="text-amber-500" size={20} />;
      case 'green': return <CheckCircle2 className="text-emerald-500" size={20} />;
      default: return <AlertCircle className="text-slate-500" size={20} />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'red': return 'bg-rose-50 border-rose-200';
      case 'yellow': return 'bg-amber-50 border-amber-200';
      case 'green': return 'bg-emerald-50 border-emerald-200';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-slate-900 rounded-3xl shadow-sm border border-white/10">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <Loader2 size={32} className="animate-spin text-showroom-accent" />
          <p>Apphia Engine is analyzing operational status...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-slate-900 rounded-3xl shadow-sm border border-white/10 text-slate-400">
        Failed to load operational status.
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-white bg-slate-900 min-h-[calc(100vh-8rem)] p-8 rounded-3xl shadow-sm border border-white/10">
      <header className="border-b border-white/10 pb-6">
        <h1 className="font-serif text-3xl font-medium tracking-tight text-white mb-2">
          Operational Status Monitor
        </h1>
        <p className="text-slate-500 max-w-2xl text-base">
          Real-time tracking of project delays, workload imbalances, and stalled tasks.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Delays */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-indigo-600" size={24} />
            <h2 className="font-serif text-xl font-semibold">Project Delays</h2>
          </div>
          <div className="space-y-3">
            {report.projects.map(project => (
              <div key={project.id} className={`p-4 rounded-xl border ${getStatusBg(project.status)}`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-slate-900">{project.name}</h3>
                  {getStatusIcon(project.status)}
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-semibold">Delay:</span> {project.delay}
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-semibold">Reason:</span> {project.reason}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Workload Imbalance */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="text-indigo-600" size={24} />
            <h2 className="font-serif text-xl font-semibold">Workload Imbalance</h2>
          </div>
          <div className="space-y-3">
            {report.workload.map(team => (
              <div key={team.id} className={`p-4 rounded-xl border ${getStatusBg(team.status)}`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-slate-900">{team.team}</h3>
                  {getStatusIcon(team.status)}
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-semibold">Current Load:</span> {team.load}
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-semibold">Issue:</span> {team.issue}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stalled Tasks */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="text-indigo-600" size={24} />
            <h2 className="font-serif text-xl font-semibold">Stalled Tasks</h2>
          </div>
          <div className="space-y-3">
            {report.stalledTasks.map(task => (
              <div key={task.id} className="p-4 rounded-xl border bg-slate-50 border-slate-200">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-slate-900">{task.task}</h3>
                  <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">
                    {task.daysStalled} Days
                  </span>
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-semibold">Owner:</span> {task.owner}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

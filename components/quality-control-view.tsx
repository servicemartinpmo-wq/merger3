'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, XCircle, AlertCircle, Database, Clock, Loader2 } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';

type QCReport = {
  missedTasks: { id: number; task: string; owner: string; daysOverdue: number }[];
  incompleteWorkflows: { id: number; workflow: string; step: string; stalledFor: string }[];
  dataGaps: { id: number; entity: string; missing: string; severity: string }[];
  overdueApprovals: { id: number; request: string; waitingOn: string; daysOverdue: number }[];
};

export function QualityControlView() {
  const [report, setReport] = useState<QCReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQCReport = async () => {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        console.error('Gemini API key is not configured');
        setIsLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });

      try {
        const systemInstruction = `
          You are the Apphia Engine, an AI quality control tool for a PMO.
          Analyze the current organizational state and generate a quality control report.
          
          Simulated Current State:
          - We have 15 active projects.
          - There are a few tasks that are overdue.
          - Some workflows are stalled.
          - We are missing some data in our CRM.
          - Some approvals are pending.
          
          Generate a JSON response with the following structure:
          1. missedTasks: Array of objects { id, task, owner, daysOverdue }
          2. incompleteWorkflows: Array of objects { id, workflow, step, stalledFor }
          3. dataGaps: Array of objects { id, entity, missing, severity } (severity should be 'high' or 'critical')
          4. overdueApprovals: Array of objects { id, request, waitingOn, daysOverdue }
          
          Make the data look realistic and professional for a tech company.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: 'Generate the quality control report.',
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                missedTasks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.NUMBER },
                      task: { type: Type.STRING },
                      owner: { type: Type.STRING },
                      daysOverdue: { type: Type.NUMBER },
                    },
                    required: ['id', 'task', 'owner', 'daysOverdue'],
                  },
                },
                incompleteWorkflows: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.NUMBER },
                      workflow: { type: Type.STRING },
                      step: { type: Type.STRING },
                      stalledFor: { type: Type.STRING },
                    },
                    required: ['id', 'workflow', 'step', 'stalledFor'],
                  },
                },
                dataGaps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.NUMBER },
                      entity: { type: Type.STRING },
                      missing: { type: Type.STRING },
                      severity: { type: Type.STRING },
                    },
                    required: ['id', 'entity', 'missing', 'severity'],
                  },
                },
                overdueApprovals: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.NUMBER },
                      request: { type: Type.STRING },
                      waitingOn: { type: Type.STRING },
                      daysOverdue: { type: Type.NUMBER },
                    },
                    required: ['id', 'request', 'waitingOn', 'daysOverdue'],
                  },
                },
              },
              required: ['missedTasks', 'incompleteWorkflows', 'dataGaps', 'overdueApprovals'],
            },
          },
        });

        const jsonStr = response.text?.trim();
        if (jsonStr) {
          const reportData = JSON.parse(jsonStr);
          setReport(reportData);
        }
      } catch (error) {
        console.error('Failed to fetch quality control report:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQCReport();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-slate-900 rounded-3xl shadow-sm border border-white/10">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <Loader2 size={32} className="animate-spin text-showroom-accent" />
          <p>Apphia Engine is analyzing quality control metrics...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-slate-900 rounded-3xl shadow-sm border border-white/10 text-slate-400">
        Failed to load quality control report.
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-white bg-slate-900 min-h-[calc(100vh-8rem)] p-8 rounded-3xl shadow-sm border border-white/10">
      <header className="border-b border-white/10 pb-6">
        <h1 className="font-serif text-3xl font-medium tracking-tight text-white mb-2">
          Quality Control
        </h1>
        <p className="text-slate-500 max-w-2xl text-base">
          Ensuring nothing falls through the cracks: missed tasks, incomplete workflows, data gaps, and overdue approvals.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Missed Tasks */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="text-rose-600" size={24} />
            <h2 className="font-serif text-xl font-semibold">Missed Tasks</h2>
          </div>
          <div className="space-y-3">
            {report.missedTasks.map(task => (
              <div key={task.id} className="p-4 rounded-xl border bg-rose-50 border-rose-200 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-slate-900">{task.task}</h3>
                  <p className="text-sm text-slate-600 mt-1">Owner: {task.owner}</p>
                </div>
                <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">
                  {task.daysOverdue} Days Overdue
                </span>
              </div>
            ))}
            {report.missedTasks.length === 0 && (
              <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 text-slate-500 text-center">
                No missed tasks.
              </div>
            )}
          </div>
        </section>

        {/* Incomplete Workflows */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="text-amber-600" size={24} />
            <h2 className="font-serif text-xl font-semibold">Incomplete Workflows</h2>
          </div>
          <div className="space-y-3">
            {report.incompleteWorkflows.map(wf => (
              <div key={wf.id} className="p-4 rounded-xl border bg-amber-50 border-amber-200">
                <h3 className="font-medium text-slate-900">{wf.workflow}</h3>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">Stuck at:</span> {wf.step}
                  </p>
                  <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-md">
                    Stalled {wf.stalledFor}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Data Gaps */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Database className="text-indigo-600" size={24} />
            <h2 className="font-serif text-xl font-semibold">Data Gaps</h2>
          </div>
          <div className="space-y-3">
            {report.dataGaps.map(gap => (
              <div key={gap.id} className="p-4 rounded-xl border bg-slate-50 border-slate-200 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-slate-900">{gap.entity}</h3>
                  <p className="text-sm text-slate-600 mt-1">Missing: {gap.missing}</p>
                </div>
                <span className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${gap.severity === 'critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                  {gap.severity}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Overdue Approvals */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-rose-600" size={24} />
            <h2 className="font-serif text-xl font-semibold">Overdue Approvals</h2>
          </div>
          <div className="space-y-3">
            {report.overdueApprovals.map(approval => (
              <div key={approval.id} className="p-4 rounded-xl border bg-rose-50 border-rose-200 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-slate-900">{approval.request}</h3>
                  <p className="text-sm text-slate-600 mt-1">Waiting on: {approval.waitingOn}</p>
                </div>
                <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">
                  {approval.daysOverdue} Days Overdue
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

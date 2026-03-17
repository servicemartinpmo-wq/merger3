'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gauge, ArrowRightLeft, Lightbulb, AlertTriangle, Loader2, GitMerge, ArrowRight } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';

type DiagnosticReport = {
  loadPercentage: number;
  recommendations: { id: number; task: string; suggestTo: string; reason: string }[];
  redistribution: { id: number; from: string; to: string; project: string; impact: string }[];
  workflowSuggestions: { id: number; title: string; description: string; impact: string }[];
};

export function DiagnosticsView() {
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDiagnostics = async () => {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        console.error('Gemini API key is not configured');
        setIsLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });

      try {
        const systemInstruction = `
          You are the Apphia Engine, an AI diagnostic tool for a PMO.
          Analyze the current organizational workload and generate a diagnostic report.
          
          Simulated Current State:
          - Sarah J. (Executive) is currently handling 12 active projects, 45 direct reports, and 8 critical approvals.
          - Mike T. (Project Manager) has bandwidth.
          - Alex R. (Operations) has bandwidth.
          
          Generate a JSON response with the following structure:
          1. loadPercentage: A number between 0 and 100 representing Sarah's load (should be high, e.g., 85).
          2. recommendations: An array of 2-3 tasks that Sarah should delegate. Each object needs an 'id', 'task', 'suggestTo' (name of person), and 'reason'.
          3. redistribution: An array of 1-2 projects to move from Sarah to someone else. Each object needs an 'id', 'from' (Sarah J.), 'to' (name), 'project', and 'impact' (e.g., "-15% load").
          4. workflowSuggestions: An array of 2 workflow automation suggestions. Each needs 'id', 'title', 'description', and 'impact'.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: 'Generate the diagnostic report.',
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                loadPercentage: { type: Type.NUMBER },
                recommendations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.NUMBER },
                      task: { type: Type.STRING },
                      suggestTo: { type: Type.STRING },
                      reason: { type: Type.STRING },
                    },
                    required: ['id', 'task', 'suggestTo', 'reason'],
                  },
                },
                redistribution: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.NUMBER },
                      from: { type: Type.STRING },
                      to: { type: Type.STRING },
                      project: { type: Type.STRING },
                      impact: { type: Type.STRING },
                    },
                    required: ['id', 'from', 'to', 'project', 'impact'],
                  },
                },
                workflowSuggestions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.NUMBER },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      impact: { type: Type.STRING },
                    },
                    required: ['id', 'title', 'description', 'impact'],
                  },
                },
              },
              required: ['loadPercentage', 'recommendations', 'redistribution', 'workflowSuggestions'],
            },
          },
        });

        const jsonStr = response.text?.trim();
        if (jsonStr) {
          const reportData = JSON.parse(jsonStr);
          setReport(reportData);
        }
      } catch (error) {
        console.error('Failed to fetch diagnostics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiagnostics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-white rounded-3xl shadow-sm border border-slate-200">
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <Loader2 size={32} className="animate-spin text-indigo-600" />
          <p>Apphia Engine is analyzing organizational load...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-white rounded-3xl shadow-sm border border-slate-200 text-slate-500">
        Failed to load diagnostics.
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-slate-900 bg-white min-h-[calc(100vh-8rem)] p-8 rounded-3xl shadow-sm border border-slate-200">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="font-serif text-3xl font-medium tracking-tight text-slate-900 mb-2">
          Organizational Diagnostics
        </h1>
        <p className="text-slate-500 max-w-2xl text-base">
          Executive load monitoring and AI-driven delegation recommendations.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Executive Load Meter */}
        <section className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Gauge className="text-indigo-600" size={24} />
            <h2 className="font-serif text-xl font-semibold">Executive Load Meter</h2>
          </div>
          <div className="p-6 rounded-xl border bg-slate-50 border-slate-200 flex flex-col items-center justify-center text-center h-64">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className={`${report.loadPercentage > 75 ? 'text-rose-500' : report.loadPercentage > 50 ? 'text-amber-500' : 'text-emerald-500'}`}
                  strokeDasharray={`${report.loadPercentage}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-slate-900">{report.loadPercentage}%</span>
              </div>
            </div>
            <h3 className="font-medium text-slate-900">Sarah J.</h3>
            <p className="text-sm text-slate-500 mt-1">
              {report.loadPercentage > 75 ? 'Critical Overload' : report.loadPercentage > 50 ? 'High Load' : 'Optimal Load'}
            </p>
          </div>
        </section>

        <div className="lg:col-span-2 space-y-8">
          {/* Delegation Recommendations */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="text-amber-500" size={24} />
              <h2 className="font-serif text-xl font-semibold">Delegation Recommendations</h2>
            </div>
            <div className="space-y-3">
              {report.recommendations.map(rec => (
                <div key={rec.id} className="p-4 rounded-xl border bg-amber-50 border-amber-100 flex items-start gap-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-amber-600 mt-1 shrink-0">
                    <ArrowRightLeft size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Delegate: {rec.task}</h3>
                    <p className="text-sm text-slate-700 mt-1">
                      <span className="font-semibold">Suggest to:</span> {rec.suggestTo}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">{rec.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Task Redistribution */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <ArrowRightLeft className="text-indigo-600" size={24} />
              <h2 className="font-serif text-xl font-semibold">Task Redistribution</h2>
            </div>
            <div className="space-y-3">
              {report.redistribution.map(redist => (
                <div key={redist.id} className="p-4 rounded-xl border bg-slate-50 border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900">{redist.project}</h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                      <span>{redist.from}</span>
                      <ArrowRightLeft size={14} className="text-slate-400" />
                      <span>{redist.to}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                    {redist.impact}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Workflow Suggestions */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <GitMerge className="text-teal-600" size={24} />
              <h2 className="font-serif text-xl font-semibold">Workflow Automation</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.workflowSuggestions.map(suggest => (
                <div key={suggest.id} className="p-5 rounded-2xl border border-teal-100 bg-teal-50/30 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-slate-900">{suggest.title}</h3>
                    <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-[10px] font-bold rounded-full">
                      {suggest.impact}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{suggest.description}</p>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-teal-600 flex items-center gap-1 hover:gap-2 transition-all">
                    Configure Workflow <ArrowRight size={12} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


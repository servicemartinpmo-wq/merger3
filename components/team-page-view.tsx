'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, Briefcase, MessageSquare, Shield, Loader2 } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';

type TeamReport = {
  activity: { id: number; user: string; action: string; target: string; time: string }[];
  workload: { id: number; user: string; load: number; projects: number }[];
  mocha: { role: string; description: string; user: string }[];
};

export function TeamPageView() {
  const [teamSize, setTeamSize] = useState('2-10');
  const [report, setReport] = useState<TeamReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeamReport = async () => {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        console.error('Gemini API key is not configured');
        setIsLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });

      try {
        const systemInstruction = `
          You are the Apphia Engine, an AI team operations tool for a PMO.
          Analyze the current organizational state and generate a team operations report.
          
          Simulated Current State:
          - The team is working on Q3 Marketing Launch, Database Migration, and Annual Planning Offsite.
          - Sarah J., Mike T., and Alex R. are the primary team members.
          
          Generate a JSON response with the following structure:
          1. activity: Array of objects { id, user, action, target, time } (e.g., action: 'completed task', target: 'Q3 Marketing Launch', time: '2h ago')
          2. workload: Array of objects { id, user, load, projects } (load is a number 0-120, projects is a number)
          3. mocha: Array of exactly 5 objects representing the MOCHA framework (Manager, Owner, Consulted, Helper, Approver). Each object needs { role, description, user }.
          
          Make the data look realistic and professional for a tech company.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: 'Generate the team operations report.',
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                activity: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.NUMBER },
                      user: { type: Type.STRING },
                      action: { type: Type.STRING },
                      target: { type: Type.STRING },
                      time: { type: Type.STRING },
                    },
                    required: ['id', 'user', 'action', 'target', 'time'],
                  },
                },
                workload: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.NUMBER },
                      user: { type: Type.STRING },
                      load: { type: Type.NUMBER },
                      projects: { type: Type.NUMBER },
                    },
                    required: ['id', 'user', 'load', 'projects'],
                  },
                },
                mocha: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      role: { type: Type.STRING },
                      description: { type: Type.STRING },
                      user: { type: Type.STRING },
                    },
                    required: ['role', 'description', 'user'],
                  },
                },
              },
              required: ['activity', 'workload', 'mocha'],
            },
          },
        });

        const jsonStr = response.text?.trim();
        if (jsonStr) {
          const reportData = JSON.parse(jsonStr);
          setReport(reportData);
        }
      } catch (error) {
        console.error('Failed to fetch team report:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamReport();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-white rounded-3xl shadow-sm border border-slate-200">
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <Loader2 size={32} className="animate-spin text-indigo-600" />
          <p>Apphia Engine is analyzing team operations...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-white rounded-3xl shadow-sm border border-slate-200 text-slate-500">
        Failed to load team operations report.
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-slate-900 bg-white min-h-[calc(100vh-8rem)] p-8 rounded-3xl shadow-sm border border-slate-200">
      <header className="border-b border-slate-200 pb-6 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-slate-900 mb-2">
            Team Operations
          </h1>
          <p className="text-slate-500 max-w-2xl text-base">
            Activity updates, workload overview, and MOCHA accountability framework.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Team Size</label>
          <select 
            value={teamSize} 
            onChange={(e) => setTeamSize(e.target.value)}
            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          >
            <option value="1">1 (Solo)</option>
            <option value="2-10">2–10</option>
            <option value="11-50">11–50</option>
            <option value="51-200">51–200</option>
            <option value="200+">200+</option>
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Updates */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-indigo-600" size={24} />
            <h2 className="font-serif text-xl font-semibold">Activity Updates</h2>
          </div>
          <div className="space-y-3">
            {report.activity.map(activity => (
              <div key={activity.id} className="p-4 rounded-xl border bg-slate-50 border-slate-200 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-slate-900">{activity.user}</span>{' '}
                  <span className="text-slate-600">{activity.action}</span>{' '}
                  <span className="font-medium text-indigo-600">{activity.target}</span>
                </div>
                <span className="text-xs text-slate-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Workload Overview */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="text-indigo-600" size={24} />
            <h2 className="font-serif text-xl font-semibold">Workload Overview</h2>
          </div>
          <div className="space-y-3">
            {report.workload.map(member => (
              <div key={member.id} className="p-4 rounded-xl border bg-slate-50 border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-slate-900">{member.user}</span>
                  <span className="text-sm text-slate-500">{member.projects} active projects</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${member.load > 100 ? 'bg-rose-500' : member.load > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${Math.min(member.load, 100)}%` }}
                  ></div>
                </div>
                <div className="text-right text-xs text-slate-500 mt-1">{member.load}% Capacity</div>
              </div>
            ))}
          </div>
        </section>

        {/* MOCHA Framework */}
        <section className="space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="text-indigo-600" size={24} />
            <h2 className="font-serif text-xl font-semibold">MOCHA Accountability Framework</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {report.mocha.map((role, idx) => (
              <div key={idx} className="p-4 rounded-xl border bg-indigo-50 border-indigo-100 flex flex-col h-full">
                <h3 className="font-bold text-indigo-900 mb-1">{role.role}</h3>
                <p className="text-xs text-indigo-700 mb-4 flex-grow">{role.description}</p>
                <div className="mt-auto pt-3 border-t border-indigo-200">
                  <span className="text-sm font-medium text-slate-900">{role.user}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

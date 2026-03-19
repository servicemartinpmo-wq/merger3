"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Briefcase, Code, HeartPulse, Rocket, User, Users, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const MODES = [
  { id: 'founder', icon: Rocket, title: 'Founder', desc: 'Strategic oversight and growth metrics.' },
  { id: 'creative', icon: Code, title: 'Creative', desc: 'Design, assets, and portfolio management.' },
  { id: 'freelance', icon: User, title: 'Freelance', desc: 'Client management and invoicing.' },
  { id: 'healthcare', icon: HeartPulse, title: 'Healthcare', desc: 'Patient records and compliance.' },
  { id: 'executive', icon: Briefcase, title: 'Executive', desc: 'High-level reporting and analytics.' },
  { id: 'startup', icon: Users, title: 'Startup', desc: 'Agile workflows and team scaling.' },
  { id: 'assisted', icon: ShieldCheck, title: 'Assisted Mode', desc: 'Simple, straightforward, explains everything.' },
];

const INDUSTRIES = [
  'Education', 'Engineering', 'Finance', 'Marketing', 'Retail', 'Technology', 'Other'
];

export default function IntakePage() {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-slate-50 py-20 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-electric-cyan/5 blur-[120px] -z-10" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-electric-blue/5 blur-[100px] -z-10" />

      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-navy-900 tracking-tight">Customize your experience</h1>
          <p className="text-lg text-slate-600">Tell us how you work so we can tailor the engine for you.</p>
        </div>

        <div className="space-y-12">
          {/* Mode Selection */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-navy-900">Select your mode</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={cn(
                    "p-6 rounded-2xl border text-left transition-all duration-300 group relative overflow-hidden",
                    selectedMode === mode.id 
                      ? "bg-navy-900 border-navy-900 shadow-xl shadow-navy-900/20" 
                      : "bg-white border-slate-200 hover:border-electric-cyan/50 hover:shadow-lg hover:shadow-electric-cyan/10"
                  )}
                >
                  {selectedMode === mode.id && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-electric-blue/20 to-transparent opacity-50 lamination" />
                  )}
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
                    selectedMode === mode.id ? "bg-white/10" : "bg-slate-50 group-hover:bg-electric-cyan/10"
                  )}>
                    <mode.icon className={cn(
                      "w-6 h-6",
                      selectedMode === mode.id ? "text-electric-cyan" : "text-navy-700 group-hover:text-electric-cyan"
                    )} />
                  </div>
                  <h3 className={cn("text-lg font-semibold mb-2", selectedMode === mode.id ? "text-white" : "text-navy-900")}>
                    {mode.title}
                  </h3>
                  <p className={cn("text-sm", selectedMode === mode.id ? "text-slate-300" : "text-slate-600")}>
                    {mode.desc}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* Industry Selection */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-navy-900">Select your industry</h2>
            <div className="flex flex-wrap gap-3">
              {INDUSTRIES.map((industry) => (
                <button
                  key={industry}
                  onClick={() => setSelectedIndustry(industry)}
                  className={cn(
                    "px-6 py-3 rounded-full border text-sm font-medium transition-all",
                    selectedIndustry === industry
                      ? "bg-electric-blue text-navy-900 border-electric-blue shadow-lg shadow-electric-blue/20"
                      : "bg-white text-slate-600 border-slate-200 hover:border-electric-blue/50 hover:text-navy-900"
                  )}
                >
                  {industry}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="pt-8 border-t border-slate-200 flex justify-end">
          <Link 
            href={`/onboarding?mode=${selectedMode || 'default'}&industry=${selectedIndustry || 'other'}`}
            className={cn(
              "flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium transition-all lamination group",
              selectedMode && selectedIndustry
                ? "bg-navy-900 text-white hover:bg-navy-800 shadow-xl shadow-navy-900/20"
                : "bg-slate-200 text-slate-400 pointer-events-none"
            )}
          >
            Continue to Onboarding
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';

const STEPS = [
  "Initializing Apphia Kernel...",
  "Configuring predictive models...",
  "Setting up industry-specific workflows...",
  "Establishing secure bridge connections...",
  "Finalizing your workspace..."
];

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'default';
  const industry = searchParams.get('industry') || 'other';
  
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            router.push(`/dashboard?mode=${mode}&industry=${industry}`);
          }, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [router, mode, industry]);

  return (
    <div className="max-w-md w-full glass-card rounded-3xl p-10 shadow-2xl shadow-slate-200/50 border border-white/60">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-navy-900 tracking-tight">Setting up your engine</h1>
        <p className="text-slate-600 mt-2">Tailoring the experience for {industry} {mode}s.</p>
      </div>

      <div className="space-y-6">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          
          return (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-electric-cyan" />
                ) : isActive ? (
                  <Loader2 className="w-6 h-6 text-electric-blue animate-spin" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-slate-200" />
                )}
              </div>
              <span className={`text-sm font-medium transition-colors ${
                isCompleted ? "text-navy-900" : isActive ? "text-electric-blue" : "text-slate-400"
              }`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-electric-purple/5 blur-[100px] -z-10" />

      <Suspense fallback={<div className="text-navy-900"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
        <OnboardingContent />
      </Suspense>
    </main>
  );
}

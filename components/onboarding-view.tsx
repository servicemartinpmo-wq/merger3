'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Target, 
  Users2, 
  Rocket,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: any) => void;
}

export function OnboardingView({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    teamSize: '',
    goals: [] as string[],
    focusArea: '',
    documents: [] as { name: string, type: string }[],
    diagnosticReport: null as any
  });
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const totalSteps = 6;

  const generateDiagnosticReport = () => {
    setIsGeneratingReport(true);
    // Simulate AI analysis of knowledge base and form data
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        diagnosticReport: {
          score: 84,
          summary: `Based on your ${prev.industry} focus and ${prev.documents.length} uploaded SOPs, we've identified 3 critical operational bottlenecks.`,
          recommendations: [
            "Automate Q3 budget reconciliation using the new Tech-Ops framework.",
            "Implement the 'Project Alpha' dashboard tweaks as prioritized in your knowledge base.",
            "Scale infrastructure to support your team of ${prev.teamSize}."
          ],
          riskLevel: "Low-Moderate"
        }
      }));
      setIsGeneratingReport(false);
    }, 3000);
  };

  const handleNext = () => {
    if (step === 4) {
      generateDiagnosticReport();
    }
    if (step < totalSteps) setStep(step + 1);
    else onComplete(formData);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) 
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#F5F2ED] flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100 flex">
          {[...Array(totalSteps)].map((_, i) => (
            <div 
              key={i}
              className={`h-full transition-all duration-500 ${
                i + 1 <= step ? 'bg-slate-900' : 'bg-transparent'
              }`}
              style={{ width: `${100 / totalSteps}%` }}
            />
          ))}
        </div>

        <div className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-6">
                    <Building2 size={24} />
                  </div>
                  <h2 className="text-3xl font-serif font-medium tracking-tight">Tell us about your venture</h2>
                  <p className="text-slate-500">Let&apos;s start with the basics to customize your OS experience.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Company Name</label>
                    <input 
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      placeholder="e.g. Acme Corp"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Industry Sector</label>
                    <select 
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all appearance-none"
                    >
                      <option value="">Select Industry</option>
                      <option value="tech">Technology & SaaS</option>
                      <option value="creative">Creative Agency</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="finance">Fintech & Finance</option>
                      <option value="healthcare">Healthcare</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-6">
                    <Users2 size={24} />
                  </div>
                  <h2 className="text-3xl font-serif font-medium tracking-tight">Scale of operations</h2>
                  <p className="text-slate-500">How many people are powering this venture?</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: '1', label: 'Solo Venture', desc: 'Just me' },
                    { id: '2-10', label: 'Small Team', desc: '2-10 people' },
                    { id: '11-50', label: 'Growth Stage', desc: '11-50 people' },
                    { id: '50+', label: 'Enterprise', desc: '50+ people' }
                  ].map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setFormData({...formData, teamSize: size.id})}
                      className={`p-6 rounded-2xl border text-left transition-all ${
                        formData.teamSize === size.id 
                          ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/20' 
                          : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-slate-400'
                      }`}
                    >
                      <div className="font-bold text-lg">{size.label}</div>
                      <div className={`text-sm ${formData.teamSize === size.id ? 'text-slate-400' : 'text-slate-500'}`}>
                        {size.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-6">
                    <Target size={24} />
                  </div>
                  <h2 className="text-3xl font-serif font-medium tracking-tight">Primary objectives</h2>
                  <p className="text-slate-500">Select what you want to optimize first.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Automate Workflows',
                    'Scale Sales Pipeline',
                    'Optimize Operations',
                    'Enhance Team Output',
                    'Financial Intelligence',
                    'Customer Experience'
                  ].map((goal) => (
                    <button
                      key={goal}
                      onClick={() => toggleGoal(goal)}
                      className={`px-6 py-4 rounded-2xl border flex items-center justify-between transition-all ${
                        formData.goals.includes(goal)
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-slate-400'
                      }`}
                    >
                      <span className="font-medium text-sm">{goal}</span>
                      {formData.goals.includes(goal) && <CheckCircle2 size={16} />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-6">
                    <Sparkles size={24} />
                  </div>
                  <h2 className="text-3xl font-serif font-medium tracking-tight">Knowledge Base</h2>
                  <p className="text-slate-500">Upload SOPs, framework documents, or knowledge bases for AI diagnostic analysis.</p>
                </div>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center hover:border-slate-400 transition-all cursor-pointer bg-slate-50 group">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Rocket size={24} className="text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-900">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-500 mt-1">PDF, DOCX, TXT (Max 10MB)</p>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setFormData(prev => ({
                            ...prev,
                            documents: [...prev.documents, { name: e.target.files![0].name, type: e.target.files![0].type }]
                          }));
                        }
                      }}
                    />
                  </div>

                  {formData.documents.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Uploaded Assets</p>
                      <div className="grid grid-cols-1 gap-2">
                        {formData.documents.map((doc, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                            <div className="flex items-center gap-3">
                              <CheckCircle2 size={14} className="text-emerald-500" />
                              <span className="text-sm font-medium text-slate-900">{doc.name}</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 uppercase">{doc.type.split('/')[1]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center mb-6">
                    <AlertCircle size={24} />
                  </div>
                  <h2 className="text-3xl font-serif font-medium tracking-tight">AI Diagnostic Report</h2>
                  <p className="text-slate-500">We&apos;ve analyzed your inputs and knowledge base to identify strategic opportunities.</p>
                </div>

                {isGeneratingReport ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <Loader2 size={40} className="animate-spin text-teal-500" />
                    <p className="font-mono text-xs uppercase tracking-widest text-slate-400 animate-pulse">Running Autonomous Diagnostics...</p>
                  </div>
                ) : formData.diagnosticReport ? (
                  <div className="space-y-6">
                    <div className="bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles size={100} /></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                          <span className="text-xs font-mono uppercase tracking-widest text-teal-400">Readiness Score</span>
                          <span className="text-4xl font-serif font-bold text-teal-400">{formData.diagnosticReport.score}%</span>
                        </div>
                        <p className="text-lg font-serif italic text-teal-50/80 leading-relaxed mb-4">
                          &quot;{formData.diagnosticReport.summary}&quot;
                        </p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 border border-teal-500/30 rounded-full text-[10px] font-mono uppercase text-teal-400">
                          Risk Level: {formData.diagnosticReport.riskLevel}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400">AI Recommendations</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {formData.diagnosticReport.recommendations.map((rec: string, i: number) => (
                          <div key={i} className="flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                            <div className="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0 mt-0.5">
                              {i + 1}
                            </div>
                            <p className="text-sm text-slate-700 leading-snug">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center text-slate-400">
                    <p>Failed to generate report. Please try again.</p>
                  </div>
                )}
              </motion.div>
            )}

            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20">
                    <Rocket size={40} className="animate-bounce" />
                  </div>
                  <h2 className="text-4xl font-serif font-medium tracking-tight">Ready for liftoff</h2>
                  <p className="text-slate-500 max-w-md mx-auto">
                    We&apos;ve configured your Venture-OS environment based on your inputs. Welcome to the future of operations.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Environment</span>
                    <span className="text-sm font-bold text-slate-900">{formData.industry || 'Standard'} Mode</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Scale</span>
                    <span className="text-sm font-bold text-slate-900">{formData.teamSize || '1'} Users</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Focus</span>
                    <span className="text-sm font-bold text-slate-900">{formData.goals.length} Strategic Goals</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handleBack}
              className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors ${
                step === 1 ? 'invisible' : ''
              }`}
            >
              <ChevronLeft size={16} />
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={step === 1 && !formData.companyName}
              className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === totalSteps ? 'Initialize OS' : 'Continue'}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExecutivePmoView } from '@/components/executive-pmo-view';
import { OpsMonitorView } from '@/components/ops-monitor-view';
import { EmailIntelligenceView } from '@/components/email-intelligence-view';
import { WorkflowBuilderView } from '@/components/workflow-builder-view';
import { AdvisoryDeskView } from '@/components/advisory-desk-view';
import { TeamPageView } from '@/components/team-page-view';
import { DiagnosticsView } from '@/components/diagnostics-view';
import { QualityControlView } from '@/components/quality-control-view';
import { ProfileView } from '@/components/profile-view';
import { ResourceHubView } from '@/components/resource-hub-view';
import { TechOpsView } from '@/components/tech-ops-view';
import { OnboardingView } from '@/components/onboarding-view';
import { MarketingCrmView } from '@/components/marketing-crm-view';
import { IntegrationsView } from '@/components/integrations-view';
import { FreelanceKanbanView } from '@/components/freelance-kanban-view';
import { CreativePortfolioView } from '@/components/creative-portfolio-view';
import { LockscreenBanner, type IndustryMode } from '@/components/lockscreen-banner';
import { IndustryModeSwitcher } from '@/components/industry-mode-switcher';
import { 
  Activity, 
  Briefcase, 
  Mail, 
  GitMerge, 
  MessageSquare, 
  Users, 
  Gauge, 
  ShieldCheck, 
  Building2, 
  Layers,
  Wifi,
  Battery,
  Signal,
  Search,
  Bell,
  Command,
  Terminal,
  Zap,
  Layout,
  Palette,
  User,
  Plug
} from 'lucide-react';

type ViewType = 
  | 'pmo' 
  | 'ops' 
  | 'email' 
  | 'workflow' 
  | 'advisory' 
  | 'team' 
  | 'diagnostics' 
  | 'qc' 
  | 'profile' 
  | 'hub' 
  | 'tech-ops' 
  | 'marketing' 
  | 'integrations' 
  | 'kanban' 
  | 'portfolio';

interface NavItem {
  id: ViewType;
  label: string;
  icon: any;
  modes: IndustryMode[];
}

export default function DashboardPage() {
  const [view, setView] = useState<ViewType>('pmo');
  const [industryMode, setIndustryMode] = useState<IndustryMode>('SMB');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOnboardingComplete = (data: any) => {
    console.log('Onboarding data:', data);
    setOnboardingComplete(true);
    if (data.industry) {
      const modeMap: Record<string, IndustryMode> = {
        'tech': 'start-up',
        'creative': 'creative',
        'ecommerce': 'SMB',
        'finance': 'executive',
        'healthcare': 'healthcare'
      };
      setIndustryMode(modeMap[data.industry] || 'SMB');
    }
  };

  const navItems: NavItem[] = [
    // Common
    { id: 'pmo', label: 'Executive Dashboard', icon: Briefcase, modes: ['SMB', 'executive', 'start-up', 'healthcare'] },
    { id: 'marketing', label: 'Marketing & CRM', icon: Zap, modes: ['SMB', 'freelancer', 'start-up', 'executive'] },
    { id: 'tech-ops', label: 'Tech-Ops', icon: Terminal, modes: ['SMB', 'start-up', 'healthcare'] },
    
    // Mode Specific
    { id: 'kanban', label: 'Project Pipeline', icon: Layout, modes: ['freelancer'] },
    { id: 'portfolio', label: 'Creative Showcase', icon: Palette, modes: ['creative'] },
    
    // Advanced
    { id: 'ops', label: 'Ops Monitor', icon: Activity, modes: ['SMB', 'executive', 'start-up', 'healthcare'] },
    { id: 'email', label: 'Email Intelligence', icon: Mail, modes: ['SMB', 'freelancer', 'executive', 'start-up'] },
    { id: 'workflow', label: 'Workflow Builder', icon: GitMerge, modes: ['SMB', 'executive', 'start-up'] },
    { id: 'integrations', label: 'Integrations', icon: Plug, modes: ['SMB', 'executive', 'start-up', 'freelancer'] },
    { id: 'hub', label: 'Resource Hub', icon: Layers, modes: ['SMB', 'creative', 'start-up', 'healthcare'] },
    { id: 'advisory', label: 'Advisory Desk', icon: MessageSquare, modes: ['SMB', 'creative', 'executive'] },
    
    // System
    { id: 'team', label: 'Team Page', icon: Users, modes: ['SMB', 'executive', 'start-up', 'healthcare'] },
    { id: 'diagnostics', label: 'Diagnostics', icon: Gauge, modes: ['SMB', 'executive', 'start-up', 'healthcare'] },
    { id: 'qc', label: 'Quality Control', icon: ShieldCheck, modes: ['SMB', 'executive', 'start-up', 'healthcare'] },
    { id: 'profile', label: 'Organization Profile', icon: Building2, modes: ['SMB', 'creative', 'freelancer', 'executive', 'healthcare', 'start-up'] },
  ];

  const filteredNavItems = navItems.filter(item => item.modes.includes(industryMode));

  if (!onboardingComplete) {
    return <OnboardingView onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      {/* OS Status Bar */}
      <div className="h-8 bg-black text-white px-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest z-[100] relative">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Command size={10} />
            <span>Venture-OS v4.2</span>
          </div>
          <div className="flex items-center gap-1 opacity-60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>System Online</span>
          </div>
          <div className="border-l border-white/20 pl-4 opacity-60">
            <span>Mode: {industryMode.toUpperCase()}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 opacity-80">
            <Wifi size={10} />
            <Signal size={10} />
            <Battery size={10} />
          </div>
          <div className="border-l border-white/20 pl-4">
            {mounted ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
          </div>
        </div>
      </div>

      {/* 4K Lockscreen Banner */}
      <LockscreenBanner mode={industryMode} />

      {/* Navigation Rail / Dock */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/50 bg-[#F5F2ED]/90 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-900 text-white shadow-lg shadow-slate-900/20">
                <Activity size={20} />
              </div>
              <div>
                <span className="font-serif text-2xl font-medium tracking-tight block leading-none">Venture-OS</span>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Command Engine</span>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-1 p-1.5 rounded-2xl bg-slate-200/50 border border-slate-300/30 overflow-x-auto max-w-[70%] no-scrollbar">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = view === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id as ViewType)}
                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 whitespace-nowrap ${
                      isActive 
                        ? 'text-slate-900' 
                        : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 bg-white shadow-sm border border-slate-200 rounded-xl"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon size={14} className={isActive ? 'text-slate-900' : 'text-slate-400'} />
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors">
                <Search size={18} />
              </button>
              <button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors relative">
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation (Scrollable) */}
      <div className="lg:hidden flex overflow-x-auto no-scrollbar gap-2 p-4 bg-white/50 border-b border-slate-200">
        {filteredNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as ViewType)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              view === item.id ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border border-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Industry Switcher Section */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-slate-400">Environment Configuration</h3>
            <p className="text-sm text-slate-600">Tailoring Venture-OS for your specific industry vertical.</p>
          </div>
          <IndustryModeSwitcher currentMode={industryMode} onModeChange={setIndustryMode} />
        </section>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="min-h-[600px]"
            >
              {view === 'pmo' && <ExecutivePmoView />}
              {view === 'ops' && <OpsMonitorView />}
              {view === 'email' && <EmailIntelligenceView />}
              {view === 'workflow' && <WorkflowBuilderView />}
              {view === 'hub' && <ResourceHubView />}
              {view === 'advisory' && <AdvisoryDeskView />}
              {view === 'team' && <TeamPageView />}
              {view === 'diagnostics' && <DiagnosticsView />}
              {view === 'qc' && <QualityControlView />}
              {view === 'profile' && <ProfileView />}
              {view === 'tech-ops' && <TechOpsView />}
              {view === 'marketing' && <MarketingCrmView />}
              {view === 'integrations' && <IntegrationsView />}
              {view === 'kanban' && <FreelanceKanbanView />}
              {view === 'portfolio' && <CreativePortfolioView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* OS Footer */}
      <footer className="border-t border-slate-200 bg-white/50 py-6 mt-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">© 2026 Venture-OS</span>
            <div className="flex gap-4">
              <a href="#" className="text-[10px] font-mono uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Documentation</a>
              <a href="#" className="text-[10px] font-mono uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Security</a>
              <a href="#" className="text-[10px] font-mono uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">API</a>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 font-bold">Encrypted Connection</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

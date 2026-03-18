'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlanEngineView } from '@/components/plan-engine-view';
import { BackgroundCollage } from '@/components/background-collage';
import { IndustryMode } from '@/lib/types/pmo';
import { CommandEnginePanel } from '@/components/command-engine-panel';
import { LockscreenBanner } from '@/components/lockscreen-banner';
import { InitiativesView } from '@/components/initiatives-view';
import { ActionItemsView } from '@/components/action-items-view';
import { SystemsView } from '@/components/systems-view';
import { ResourceHubView } from '@/components/resource-hub-view';
import { TeamPageView } from '@/components/team-page-view';
import { AdvisoryDeskView } from '@/components/advisory-desk-view';
import { OnboardingView } from '@/components/onboarding-view';
import { OpsMonitorView } from '@/components/ops-monitor-view';
import { EmailIntelligenceView } from '@/components/email-intelligence-view';
import { WorkflowBuilderView } from '@/components/workflow-builder-view';
import { DiagnosticsView } from '@/components/diagnostics-view';
import { QualityControlView } from '@/components/quality-control-view';
import { ProfileView } from '@/components/profile-view';
import { TechOpsView } from '@/components/tech-ops-view';
import { MarketingCrmView } from '@/components/marketing-crm-view';
import { IntegrationsView } from '@/components/integrations-view';
import { FreelanceKanbanView } from '@/components/freelance-kanban-view';
import { CreativePortfolioView } from '@/components/creative-portfolio-view';
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
  Zap,
  Layout,
  Palette,
  Plug,
  Terminal,
  CheckCircle2,
  Cpu,
  User
} from 'lucide-react';

type ViewType = 'pmo' | 'founder' | 'ops' | 'plan-engine' | 'initiatives' | 'actions' | 'systems' | 'resources' | 'team' | 'advisory' | 'onboarding' | 'email' | 'workflow' | 'diagnostics' | 'qc' | 'profile' | 'tech-ops' | 'marketing' | 'integrations' | 'kanban' | 'portfolio';

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [industryMode, setIndustryMode] = useState<IndustryMode>('SMB');
  const [view, setView] = useState<ViewType>('pmo');
  const [assistedMode, setAssistedMode] = useState(false);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  const today = new Date();
  const day = today.getDay();
  let content = { title: '', content: '', teamWins: [] as string[] };
  
  if (day === 1) {
    content = {
      title: "Weekly Projection",
      content: "Focusing on key initiatives for the week ahead.",
      teamWins: ["Completed Q1 planning", "Onboarded new lead", "Finalized project roadmap"]
    };
  } else if (day === 5) {
    content = {
      title: "Weekly Debrief",
      content: "Reviewing the week's accomplishments.",
      teamWins: ["Launched feature X", "Resolved critical bug", "Client feedback positive"]
    };
  } else {
    content = {
      title: "Daily Operational Status",
      content: "Maintaining operational health.",
      teamWins: ["Daily standup completed", "Resource conflict resolved"]
    };
  }

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleIntakeComplete = () => setView('pmo');
  const handleDiagnosticComplete = () => setView('pmo');

  const navItems = [
    { id: 'pmo', label: 'PMO Dashboard', icon: Gauge },
    { id: 'plan-engine', label: 'Plan Engine', icon: Zap },
    { id: 'initiatives', label: 'Initiatives', icon: Layers },
    { id: 'actions', label: 'Action Items', icon: CheckCircle2 },
    { id: 'systems', label: 'Systems', icon: Terminal },
    { id: 'resources', label: 'Resources', icon: Briefcase },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'advisory', label: 'Advisory', icon: MessageSquare },
    { id: 'email', label: 'Email Intelligence', icon: Mail },
    { id: 'workflow', label: 'Workflow Builder', icon: GitMerge },
    { id: 'diagnostics', label: 'Diagnostics', icon: ShieldCheck },
    { id: 'qc', label: 'Quality Control', icon: ShieldCheck },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'tech-ops', label: 'Tech Ops', icon: Cpu },
    { id: 'marketing', label: 'Marketing CRM', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Plug },
    { id: 'kanban', label: 'Freelance Kanban', icon: Layout },
    { id: 'portfolio', label: 'Portfolio', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-showroom-bg text-slate-100 font-sans flex relative">
      <BackgroundCollage />
      <CommandEnginePanel 
        view={view} 
        setView={(id) => setView(id as ViewType)} 
        navItems={navItems} 
        industryMode={industryMode} 
        setIndustryMode={setIndustryMode} 
        assistedMode={assistedMode}
        setAssistedMode={setAssistedMode}
      />

      <div className="flex-1 flex flex-col">
        {/* OS Status Bar */}
        <div className="bg-black/40 backdrop-blur-md text-white px-4 py-2 border-b border-white/10 z-50">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
            <div className="flex items-center gap-4">
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
                {currentTime ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
              </div>
            </div>
          </div>
        </div>

        <LockscreenBanner 
          mode={industryMode} 
          operationalStatus={content.title}
          operationalDetail={content.content}
          teamWins={content.teamWins}
        />

        {/* Main Content */}
        <main className="flex-1 p-8 space-y-8 overflow-y-auto">
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
                {view === 'pmo' && (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                    <div className="w-24 h-24 rounded-full bg-showroom-accent/10 border border-showroom-accent/20 flex items-center justify-center">
                      <Gauge size={48} className="text-showroom-accent" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-3xl font-display font-light">Command Center Active</h2>
                      <p className="text-slate-400 max-w-md">Select an engine from the sidebar to begin operational management.</p>
                    </div>
                  </div>
                )}
                {view === 'plan-engine' && <PlanEngineView />}
                {view === 'initiatives' && <InitiativesView />}
                {view === 'actions' && <ActionItemsView setView={setView} setSelectedEmailId={setSelectedEmailId} />}
                {view === 'systems' && <SystemsView />}
                {view === 'resources' && <ResourceHubView />}
                {view === 'team' && <TeamPageView />}
                {view === 'advisory' && <AdvisoryDeskView />}
                {view === 'onboarding' && <OnboardingView onComplete={handleIntakeComplete} />}
                {view === 'ops' && <OpsMonitorView />}
                {view === 'email' && <EmailIntelligenceView selectedEmailId={selectedEmailId} setSelectedEmailId={setSelectedEmailId} />}
                {view === 'workflow' && <WorkflowBuilderView />}
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
      </div>
    </div>
  );
}

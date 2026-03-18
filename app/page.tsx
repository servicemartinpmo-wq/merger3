'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardView } from '@/components/dashboard-view';
import { PlanEngineView } from '@/components/plan-engine-view';
import { BackgroundCollage } from '@/components/background-collage';
import { IndustryMode } from '@/lib/types/pmo';
import { CommandEnginePanel } from '@/components/command-engine-panel';
import { LockscreenBanner } from '@/components/lockscreen-banner';
import { FounderDashboardView } from '@/components/founder-dashboard-view';
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
  const [initiatives, setInitiatives] = useState([]);
  const [actionItems, setActionItems] = useState([]);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

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
    <div className="min-h-screen bg-showroom-bg text-slate-900 font-sans flex relative">
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
        <div className="h-8 bg-slate-900 text-white px-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest border-b border-white/5">
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

        <LockscreenBanner mode={industryMode} />

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
                {view === 'plan-engine' && <PlanEngineView />}
                {view === 'pmo' && <DashboardView assistedMode={assistedMode} />}
                {view === 'initiatives' && <InitiativesView />}
                {view === 'actions' && <ActionItemsView actionItems={actionItems} setActionItems={setActionItems} setView={setView} setSelectedEmailId={setSelectedEmailId} />}
                {view === 'systems' && <SystemsView />}
                {view === 'resources' && <ResourceHubView />}
                {view === 'team' && <TeamPageView />}
                {view === 'advisory' && <AdvisoryDeskView />}
                {view === 'onboarding' && <OnboardingView onComplete={handleIntakeComplete} />}
                {view === 'ops' && <OpsMonitorView />}
                {view === 'email' && <EmailIntelligenceView actionItems={actionItems} setActionItems={setActionItems} selectedEmailId={selectedEmailId} setSelectedEmailId={setSelectedEmailId} />}
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

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Rocket, Sparkles, Layout, Zap, ArrowRight, CheckCircle2, Home as HomeIcon, BarChart3, Users, Settings, Menu, X } from "lucide-react";
import { HashRouter, Routes, Route, useNavigate, Link, useLocation } from "react-router-dom";

// Import all views
import { LandingView } from "@/components/landing-view";
import { DashboardView } from "@/components/dashboard-view";
import { TechOpsView } from "@/components/tech-ops-view";
import { ExecutivePmoView } from "@/components/executive-pmo-view";
import { MarketingCrmView } from "@/components/marketing-crm-view";
import { CreativePortfolioView } from "@/components/creative-portfolio-view";
import { FounderDashboardView } from "@/components/founder-dashboard-view";
import { FreelanceKanbanView } from "@/components/freelance-kanban-view";
import { SystemsView } from "@/components/systems-view";
import { TeamPageView } from "@/components/team-page-view";
import { ResourceHubView } from "@/components/resource-hub-view";
import { WorkflowBuilderView } from "@/components/workflow-builder-view";
import { QualityControlView } from "@/components/quality-control-view";
import { DiagnosticsView } from "@/components/diagnostics-view";
import { InitiativesView } from "@/components/initiatives-view";
import { AdvisoryDeskView } from "@/components/advisory-desk-view";
import { EmailIntelligenceView } from "@/components/email-intelligence-view";
import { OpsMonitorView } from "@/components/ops-monitor-view";
import { ActionItemsView } from "@/components/action-items-view";
import { PlanEngineView } from "@/components/plan-engine-view";
import { ProfileView } from "@/components/profile-view";
import { IntegrationsView } from "@/components/integrations-view";
import { LearningEngineView } from "@/components/learning-engine-view";

function AppContent() {
  const [assistedMode, setAssistedMode] = useState(false);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: HomeIcon },
    { path: "/tech-ops", label: "Tech Ops", icon: Zap },
    { path: "/executive-pmo", label: "Executive PMO", icon: BarChart3 },
    { path: "/marketing-crm", label: "Marketing CRM", icon: Users },
    { path: "/creative-portfolio", label: "Creative Portfolio", icon: Layout },
    { path: "/founder-dashboard", label: "Founder Dashboard", icon: Rocket },
    { path: "/freelance-kanban", label: "Freelance Kanban", icon: Layout },
    { path: "/systems", label: "Systems", icon: Settings },
    { path: "/team", label: "Team", icon: Users },
    { path: "/resource-hub", label: "Resource Hub", icon: Layout },
    { path: "/workflow-builder", label: "Workflow Builder", icon: Zap },
    { path: "/quality-control", label: "Quality Control", icon: CheckCircle2 },
    { path: "/diagnostics", label: "Diagnostics", icon: Sparkles },
    { path: "/initiatives", label: "Initiatives", icon: Rocket },
    { path: "/advisory-desk", label: "Advisory Desk", icon: Users },
    { path: "/email-intelligence", label: "Email Intelligence", icon: Zap },
    { path: "/ops-monitor", label: "Ops Monitor", icon: BarChart3 },
    { path: "/action-items", label: "Action Items", icon: CheckCircle2 },
    { path: "/plan-engine", label: "Plan Engine", icon: Layout },
    { path: "/profile", label: "Profile", icon: Users },
    { path: "/integrations", label: "Integrations", icon: Settings },
    { path: "/learning-engine", label: "Learning Engine", icon: Sparkles },
  ];

  if (location.pathname === "/") {
    return <LandingView onComplete={() => navigate("/dashboard")} />;
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-full bg-slate-900 border-r border-white/10 flex flex-col overflow-hidden shrink-0"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <span className="font-bold text-lg text-white flex items-center gap-2">
                <Image 
                  src="https://drive.google.com/uc?id=18b3DTRptB-KV75a8ukiUJGw19f_2CB_k" 
                  alt="Venture-OS Logo" 
                  width={24} 
                  height={24} 
                  className="rounded-sm"
                  referrerPolicy="no-referrer"
                />
                Venture-OS
              </span>
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-showroom-accent/10 text-showroom-accent"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${isActive ? "text-showroom-accent" : "text-slate-400"}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-900">
        <header className="h-16 bg-slate-900 border-b border-white/10 flex items-center px-4 justify-between shrink-0">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="text-slate-400 hover:text-white">
                <Menu className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-lg font-semibold text-white">
              {navItems.find((item) => item.path === location.pathname)?.label || "Venture-OS"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={assistedMode}
                onChange={(e) => setAssistedMode(e.target.checked)}
                className="rounded border-white/20 bg-white/5 text-showroom-accent focus:ring-showroom-accent"
              />
              Assisted Mode
            </label>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/dashboard" element={<DashboardView assistedMode={assistedMode} />} />
            <Route path="/tech-ops" element={<TechOpsView />} />
            <Route path="/executive-pmo" element={<ExecutivePmoView />} />
            <Route path="/marketing-crm" element={<MarketingCrmView />} />
            <Route path="/creative-portfolio" element={<CreativePortfolioView />} />
            <Route path="/founder-dashboard" element={<FounderDashboardView />} />
            <Route path="/freelance-kanban" element={<FreelanceKanbanView />} />
            <Route path="/systems" element={<SystemsView />} />
            <Route path="/team" element={<TeamPageView />} />
            <Route path="/resource-hub" element={<ResourceHubView />} />
            <Route path="/workflow-builder" element={<WorkflowBuilderView />} />
            <Route path="/quality-control" element={<QualityControlView />} />
            <Route path="/diagnostics" element={<DiagnosticsView />} />
            <Route path="/initiatives" element={<InitiativesView />} />
            <Route path="/advisory-desk" element={<AdvisoryDeskView />} />
            <Route path="/email-intelligence" element={<EmailIntelligenceView selectedEmailId={selectedEmailId} setSelectedEmailId={setSelectedEmailId} />} />
            <Route path="/ops-monitor" element={<OpsMonitorView />} />
            <Route path="/action-items" element={<ActionItemsView setView={(view: string) => navigate(`/${view}`)} setSelectedEmailId={setSelectedEmailId} />} />
            <Route path="/plan-engine" element={<PlanEngineView />} />
            <Route path="/profile" element={<ProfileView />} />
            <Route path="/integrations" element={<IntegrationsView />} />
            <Route path="/learning-engine" element={<LearningEngineView />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

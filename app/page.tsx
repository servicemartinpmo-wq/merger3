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

import { IndustryModeSwitcher } from "@/components/industry-mode-switcher";
import { IndustryMode } from "@/lib/types/pmo";

function AppContent() {
  const [assistedMode, setAssistedMode] = useState(false);
  const [industryMode, setIndustryMode] = useState<IndustryMode>("executive");
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: HomeIcon },
    { path: "/initiatives", label: "Initiatives", icon: Rocket },
    { path: "/action-items", label: "Action Items", icon: CheckCircle2 },
    { path: "/departments", label: "Departments", icon: Users },
    { path: "/diagnostics", label: "Diagnostics", icon: Sparkles },
    { path: "/resource-hub", label: "Resource Hub", icon: Layout },
    { path: "/advisory", label: "Advisory", icon: Users },
    { path: "/reports", label: "Reports", icon: BarChart3 },
    { path: "/systems", label: "Systems", icon: Settings },
    { path: "/integrations", label: "Integrations", icon: Zap },
  ];

  if (location.pathname === "/") {
    return <LandingView onComplete={() => navigate("/dashboard")} />;
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-full bg-slate-900 flex flex-col overflow-hidden shrink-0"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <span className="font-bold text-lg text-white flex flex-col">
                <span className="text-xs text-slate-400 uppercase tracking-widest mb-1">Command Center</span>
                <span className="flex items-center gap-2">
                  <Image 
                    src="https://drive.google.com/uc?id=18b3DTRptB-KV75a8ukiUJGw19f_2CB_k" 
                    alt="Martin PMO Logo" 
                    width={24} 
                    height={24} 
                    className="rounded-sm"
                    referrerPolicy="no-referrer"
                  />
                  Martin PMO
                </span>
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
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-white/10 space-y-4">
              <IndustryModeSwitcher currentMode={industryMode} onModeChange={setIndustryMode} />
              <button 
                onClick={() => navigate("/profile")}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="truncate w-full">Martin PMO</span>
                  <span className="text-[10px] text-slate-500 uppercase">Executive Tier</span>
                </div>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between shrink-0">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="text-slate-500 hover:text-slate-900 transition-colors">
                <Menu className="w-6 h-6" />
              </button>
            )}
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {navItems.find((item) => item.path === location.pathname)?.label || "Command Center"}
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM ACTIVE
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-500 font-medium cursor-pointer hover:text-slate-900 transition-colors">
              <input
                type="checkbox"
                checked={assistedMode}
                onChange={(e) => setAssistedMode(e.target.checked)}
                className="rounded border-slate-300 bg-white text-sky-600 focus:ring-sky-500"
              />
              Assisted Mode
            </label>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/dashboard" element={<DashboardView assistedMode={assistedMode} />} />
            <Route path="/initiatives" element={<InitiativesView />} />
            <Route path="/action-items" element={<ActionItemsView setView={(view: string) => navigate(`/${view}`)} setSelectedEmailId={setSelectedEmailId} />} />
            <Route path="/departments" element={<TeamPageView />} />
            <Route path="/diagnostics" element={<DiagnosticsView />} />
            <Route path="/resource-hub" element={<ResourceHubView />} />
            <Route path="/advisory" element={<AdvisoryDeskView />} />
            <Route path="/reports" element={<LearningEngineView />} />
            <Route path="/systems" element={<SystemsView />} />
            <Route path="/integrations" element={<IntegrationsView />} />
            <Route path="/profile" element={<ProfileView />} />
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

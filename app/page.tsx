'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Rocket, Sparkles, Layout, Zap, ArrowRight, CheckCircle2, Home as HomeIcon, BarChart3, Users, Settings } from "lucide-react";
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleGetStarted = () => {
    setIsRedirecting(true);
    // Subtle delay for animation effect
    setTimeout(() => {
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-zinc-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center space-y-8"
      >
        <div className="flex justify-center">
          <motion.div 
            animate={isRedirecting ? { scale: [1, 1.2, 0.8], rotate: [0, 10, -10, 0] } : {}}
            className="p-4 bg-emerald-100 rounded-2xl shadow-sm"
          >
            <Rocket className={`w-12 h-12 text-emerald-600 ${isRedirecting ? 'animate-bounce' : ''}`} />
          </motion.div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900">
            Project Reinitialized
          </h1>
          <p className="text-xl text-zinc-600">
            Your application has been restored with a clean Next.js architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
          <FeatureCard 
            icon={<Zap className="w-5 h-5" />}
            title="Fast"
            description="Built with Next.js 15 and App Router."
          />
          <FeatureCard 
            icon={<Layout className="w-5 h-5" />}
            title="Styled"
            description="Tailwind CSS v4 for modern UI."
          />
          <FeatureCard 
            icon={<Sparkles className="w-5 h-5" />}
            title="Animated"
            description="Motion for smooth transitions."
          />
        </div>

        <div className="pt-8 relative flex flex-col items-center">
          <AnimatePresence mode="wait">
            {!isRedirecting ? (
              <motion.button
                key="start-btn"
                onClick={handleGetStarted}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group px-8 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-all shadow-md flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            ) : (
              <motion.div
                key="confirm-msg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-emerald-600 font-medium"
              >
                <CheckCircle2 className="w-5 h-5 animate-pulse" />
                Preparing your dashboard...
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-zinc-200 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-2 font-bold text-xl text-zinc-900">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          Applet
        </div>
        
        <nav className="flex-1 space-y-1">
          <NavItem icon={<HomeIcon className="w-4 h-4" />} label="Overview" active />
          <NavItem icon={<BarChart3 className="w-4 h-4" />} label="Analytics" />
          <NavItem icon={<Users className="w-4 h-4" />} label="Team" />
          <NavItem icon={<Settings className="w-4 h-4" />} label="Settings" />
        </nav>

        <button 
          onClick={() => navigate("/")}
          className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors text-left px-3 py-2"
        >
          ← Back to Landing
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 space-y-8 overflow-y-auto">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">Dashboard</h1>
            <p className="text-zinc-500">Welcome back to your project overview.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-zinc-200 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors">
              Export Data
            </button>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm">
              New Report
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Users" value="12,482" change="+12.5%" />
          <StatCard title="Active Projects" value="48" change="+3" />
          <StatCard title="System Health" value="99.9%" change="Stable" />
        </div>

        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-8 h-64 flex items-center justify-center text-zinc-400 italic">
          Activity chart placeholder...
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 bg-white border border-zinc-200 rounded-2xl text-left shadow-sm hover:shadow-md transition-shadow">
      <div className="text-emerald-600 mb-3">{icon}</div>
      <h3 className="font-semibold text-zinc-900 mb-1">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${active ? 'bg-emerald-50 text-emerald-700' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}`}>
      {icon}
      {label}
    </div>
  );
}

function StatCard({ title, value, change }: { title: string, value: string, change: string }) {
  return (
    <div className="p-6 border border-zinc-200 rounded-2xl bg-white shadow-sm">
      <p className="text-sm text-zinc-500 mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-2xl font-bold text-zinc-900">{value}</h4>
        <span className={`text-xs font-medium ${change.startsWith('+') ? 'text-emerald-600' : 'text-zinc-400'}`}>
          {change}
        </span>
      </div>
    </div>
  );
}

export default function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </HashRouter>
  );
}

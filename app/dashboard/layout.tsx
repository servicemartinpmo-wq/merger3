"use client";

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  FolderKanban, 
  Activity, 
  Shield, 
  Zap, 
  Menu,
  X,
  Bell,
  Search,
  AlertTriangle,
  Ticket,
  FileText,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: AlertTriangle, label: 'Escalations', href: '/dashboard/escalations' },
  { icon: Ticket, label: 'Tickets', href: '/dashboard/tickets' },
  { icon: Shield, label: 'AI Diagnostics', href: '/dashboard/diagnostics' },
  { icon: FileText, label: 'Knowledge Base', href: '/dashboard/knowledge' },
  { icon: BookOpen, label: 'Tech-Ops Playbook', href: '/dashboard/tech-ops' },
  { icon: Zap, label: 'Workflows', href: '/dashboard/workflows' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

function SidebarContent({ isSidebarOpen, setIsSidebarOpen }: { isSidebarOpen: boolean, setIsSidebarOpen: (v: boolean) => void }) {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'default';
  const industry = searchParams.get('industry') || 'other';

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 bg-navy-900 text-slate-300 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 border-r border-navy-800",
      isSidebarOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="h-full flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-navy-800">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-electric-cyan/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-electric-cyan" />
            </div>
            Apphia
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="ml-auto md:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-navy-800">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Current Mode</div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-electric-cyan animate-pulse" />
            <span className="text-sm font-medium text-white capitalize">{mode} - {industry}</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-navy-800 hover:text-white transition-colors group"
            >
              <item.icon className="w-5 h-5 text-slate-400 group-hover:text-electric-cyan transition-colors" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-navy-800">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-navy-800 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden">
              <Image src="https://picsum.photos/seed/avatar/100/100" alt="User" width={32} height={32} referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-slate-400 truncate">admin@apphia.io</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <Suspense fallback={<div className="w-64 bg-navy-900" />}>
        <SidebarContent isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </Suspense>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-electric-blue/5 blur-[100px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-electric-purple/5 blur-[80px] -z-10 pointer-events-none" />

        {/* Header */}
        <header className="h-20 glass-panel border-b border-slate-200/50 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-navy-900 hover:text-electric-blue"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm w-64 focus-within:border-electric-blue focus-within:ring-2 focus-within:ring-electric-blue/20 transition-all">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm w-full text-navy-900 placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors text-navy-900">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-electric-purple" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

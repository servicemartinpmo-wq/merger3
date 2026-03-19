"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  TrendingUp, 
  Users, 
  Activity, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreHorizontal,
  Shield
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

function DashboardContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'founder';
  const industry = searchParams.get('industry') || 'technology';

  const getMetrics = () => {
    switch(mode) {
      case 'founder':
        return [
          { title: 'MRR', value: '$45,231', change: '+12.5%', trend: 'up' },
          { title: 'Active Users', value: '2,405', change: '+5.2%', trend: 'up' },
          { title: 'Churn Rate', value: '1.2%', change: '-0.3%', trend: 'down' },
          { title: 'LTV', value: '$1,240', change: '+8.1%', trend: 'up' },
        ];
      case 'creative':
        return [
          { title: 'Active Projects', value: '14', change: '+2', trend: 'up' },
          { title: 'Client Approvals', value: '8', change: '-1', trend: 'down' },
          { title: 'Asset Views', value: '12.4k', change: '+15%', trend: 'up' },
          { title: 'Revenue', value: '$18,500', change: '+5%', trend: 'up' },
        ];
      case 'healthcare':
        return [
          { title: 'Patient Intake', value: '142', change: '+12', trend: 'up' },
          { title: 'Wait Time', value: '14m', change: '-2m', trend: 'down' },
          { title: 'Compliance Score', value: '98%', change: '+1%', trend: 'up' },
          { title: 'Staff Active', value: '24', change: '0', trend: 'up' },
        ];
      default:
        return [
          { title: 'Total Revenue', value: '$124,500', change: '+14.2%', trend: 'up' },
          { title: 'Active Projects', value: '45', change: '+5', trend: 'up' },
          { title: 'Team Members', value: '12', change: '0', trend: 'up' },
          { title: 'System Health', value: '99.9%', change: '+0.1%', trend: 'up' },
        ];
    }
  };

  const metrics = getMetrics();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy-900 tracking-tight capitalize">
            {mode} Overview
          </h1>
          <p className="text-slate-500 mt-1 capitalize">
            Industry: {industry}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-navy-900 hover:bg-slate-50 transition-colors shadow-sm">
            Export Report
          </button>
          <button className="px-4 py-2 rounded-xl bg-navy-900 text-white text-sm font-medium hover:bg-navy-800 transition-colors shadow-lg shadow-navy-900/20 lamination">
            New Initiative
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <div key={i} className="glass-card rounded-2xl p-6 border border-white/60 shadow-xl shadow-slate-200/50 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-electric-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500">{metric.title}</h3>
              <div className={cn(
                "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
                metric.trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              )}>
                {metric.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {metric.change}
              </div>
            </div>
            <div className="text-3xl font-bold text-navy-900">{metric.value}</div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chart/Activity Section */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-8 border border-white/60 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-navy-900">Performance Analytics</h2>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          
          <div className="relative w-full h-[300px] rounded-2xl overflow-hidden lamination">
            <Image 
              src="https://picsum.photos/seed/analytics-chart/1200/600" 
              alt="Analytics Chart" 
              fill 
              className="object-cover opacity-80 mix-blend-multiply"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
            
            {/* Mock Chart Overlay */}
            <div className="absolute bottom-0 left-0 w-full h-full flex items-end justify-between px-4 pb-4 gap-2">
              {[40, 60, 45, 80, 55, 90, 75, 100, 85, 65, 95, 70].map((h, i) => (
                <div key={i} className="w-full bg-gradient-to-t from-electric-blue to-electric-cyan rounded-t-md opacity-80 hover:opacity-100 transition-opacity cursor-pointer" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity / Feed */}
        <div className="glass-card rounded-3xl p-8 border border-white/60 shadow-2xl shadow-slate-200/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-navy-900">Recent Activity</h2>
            <button className="text-sm font-medium text-electric-blue hover:underline">View All</button>
          </div>

          <div className="space-y-6">
            {[
              { title: 'System Update Completed', time: '2 hours ago', icon: Zap, color: 'text-electric-cyan', bg: 'bg-electric-cyan/10' },
              { title: 'New User Registration', time: '4 hours ago', icon: Users, color: 'text-electric-purple', bg: 'bg-electric-purple/10' },
              { title: 'Weekly Report Generated', time: '1 day ago', icon: Activity, color: 'text-electric-blue', bg: 'bg-electric-blue/10' },
              { title: 'Security Scan Passed', time: '2 days ago', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 group cursor-pointer">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", item.bg)}>
                  <item.icon className={cn("w-5 h-5", item.color)} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-navy-900 group-hover:text-electric-blue transition-colors">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-4 border-electric-blue border-t-transparent rounded-full animate-spin" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}

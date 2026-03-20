import { ArrowRight, Brain, Shield, Zap, Activity, Network, LineChart, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-slate-100 to-transparent -z-10" />
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-blue-500/5 blur-[120px] -z-10" />
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-teal-500/5 blur-[100px] -z-10" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-md">
              <LayoutDashboard className="w-6 h-6 text-teal-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-900 tracking-tight leading-none">Command Center</span>
              <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mt-1">By Martin PMO-OPs</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#pipeline" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Platform</Link>
            <Link href="#engine" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Apphia Engine</Link>
            <Link href="/dashboard" className="text-sm font-medium px-6 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-md">
              Executive Access
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-xs font-bold tracking-wide uppercase text-slate-900">Powered by Apphia Engine</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
              Structured Operational Intelligence for <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-teal-600">Executives.</span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-xl leading-relaxed">
              Transform fragmented organizational data into actionable intelligence. Monitor capacity, diagnose root causes, and deploy structural remedies with our framework-powered reasoning engine.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-all shadow-lg group">
                Enter Command Center
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#pipeline" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-white text-slate-900 border border-slate-200 font-medium hover:bg-slate-50 transition-all shadow-sm">
                View Architecture
              </Link>
            </div>
          </div>

          <div className="relative z-10 lg:h-[600px] flex items-center justify-center">
            {/* Abstract 3D/Glass Representation */}
            <div className="relative w-full aspect-square max-w-[500px]">
              <div className="absolute inset-0 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-2xl overflow-hidden flex items-center justify-center">
                <Image 
                  src="https://picsum.photos/seed/tech-abstract/1000/1000" 
                  alt="Abstract Technology" 
                  fill 
                  className="object-cover opacity-20 mix-blend-overlay"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/5 to-transparent" />
                
                {/* Floating Elements */}
                <div className="absolute top-1/4 left-1/4 w-24 h-24 rounded-2xl bg-white/80 backdrop-blur-md border border-white/50 shadow-xl flex items-center justify-center animate-bounce" style={{ animationDuration: '4s' }}>
                  <Brain className="w-10 h-10 text-teal-600" />
                </div>
                <div className="absolute bottom-1/3 right-1/4 w-20 h-20 rounded-2xl bg-white/80 backdrop-blur-md border border-white/50 shadow-xl flex items-center justify-center animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}>
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Stage Pipeline Features */}
      <section id="pipeline" className="py-24 px-6 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">The 4-Stage Reasoning Pipeline</h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">Apphia doesn't just report data; it diagnoses and advises using canonical management frameworks like Lean, Six Sigma, and OKRs.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Activity,
                title: "1. Signal Detection",
                desc: "Monitor capacity, execution delays, initiative conflicts, and dependency bottlenecks in real-time."
              },
              {
                icon: Brain,
                title: "2. Diagnosis Engine",
                desc: "Perform root cause analysis using structured frameworks like Porter's Five Forces and Theory of Constraints."
              },
              {
                icon: Shield,
                title: "3. Advisory Guidance",
                desc: "Generate actionable executive recommendations to reprioritize initiatives and reallocate resources."
              },
              {
                icon: Network,
                title: "4. Structural Remedies",
                desc: "Propose long-term organizational improvements, capacity planning, and dependency mapping."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:border-teal-500/50 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-6 group-hover:shadow-md transition-all">
                  <feature.icon className="w-6 h-6 text-slate-900 group-hover:text-teal-600 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apphia Engine Architecture */}
      <section id="engine" className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://picsum.photos/seed/network/1920/1080')] opacity-5 bg-cover bg-center mix-blend-overlay" />
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 shadow-sm mb-4">
              <Zap className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold tracking-wide uppercase text-white">Apphia Engine Architecture</span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight">The Modular Fortress</h2>
            <p className="text-slate-400">Built on four foundational pillars to ensure maximum reliability, predictive orchestration, and self-healing capabilities.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Brain, title: 'Apphia.Kernel', desc: 'The core decision engine. Abstracting diverse entities into a single core pattern.', color: 'text-teal-400' },
              { icon: LineChart, title: 'Apphia.Observer', desc: 'Predictive orchestrator anticipating user needs by pre-fetching data.', color: 'text-blue-400' },
              { icon: Shield, title: 'Apphia.Guard', desc: 'The immune system. Built-in graceful degradation and self-healing.', color: 'text-indigo-400' },
              { icon: Network, title: 'Apphia.Bridge', desc: 'Seamless integration layer connecting the engine to external services.', color: 'text-cyan-400' }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group relative overflow-hidden">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

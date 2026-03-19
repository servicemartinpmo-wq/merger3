import { ArrowRight, Brain, Shield, Zap, Activity } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-slate-100 to-transparent -z-10" />
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-electric-cyan/10 blur-[120px] -z-10" />
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-electric-purple/10 blur-[100px] -z-10" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-navy-900 flex items-center justify-center lamination">
              <Zap className="w-5 h-5 text-electric-cyan" />
            </div>
            <span className="text-xl font-bold text-navy-900 tracking-tight">Apphia Engine</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-navy-900 transition-colors">Features</Link>
            <Link href="/demo" className="text-sm font-medium text-slate-600 hover:text-navy-900 transition-colors">Demo</Link>
            <Link href="/signup" className="text-sm font-medium px-5 py-2.5 rounded-full bg-navy-900 text-white hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/20 lamination">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-electric-cyan/30 text-electric-cyan bg-white/50 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-electric-cyan animate-pulse" />
              <span className="text-sm font-semibold tracking-wide uppercase text-navy-900">Next-Gen Autonomous Framework</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-navy-900 leading-[1.1]">
              Predictive orchestration for <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-electric-purple">resilient systems.</span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-xl leading-relaxed">
              A modular fortress architecture designed to anticipate needs, self-heal, and scale seamlessly across industries.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-navy-900 text-white font-medium hover:bg-navy-800 transition-all shadow-xl shadow-navy-900/20 lamination group">
                Start Building
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/demo" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full glass-card text-navy-900 font-medium hover:bg-white/80 transition-all">
                View Demo
              </Link>
            </div>
          </div>

          <div className="relative z-10 lg:h-[600px] flex items-center justify-center">
            {/* Abstract 3D/Glass Representation */}
            <div className="relative w-full aspect-square max-w-[500px]">
              <div className="absolute inset-0 rounded-3xl glass-card border-white/60 shadow-2xl overflow-hidden lamination flex items-center justify-center">
                <Image 
                  src="https://picsum.photos/seed/tech-abstract/1000/1000" 
                  alt="Abstract Technology" 
                  fill 
                  className="object-cover opacity-80 mix-blend-overlay"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-navy-900/10 to-transparent" />
                
                {/* Floating Elements */}
                <div className="absolute top-1/4 left-1/4 w-24 h-24 rounded-2xl glass-panel shadow-xl flex items-center justify-center animate-bounce" style={{ animationDuration: '4s' }}>
                  <Brain className="w-10 h-10 text-electric-purple" />
                </div>
                <div className="absolute bottom-1/3 right-1/4 w-20 h-20 rounded-2xl glass-panel shadow-xl flex items-center justify-center animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}>
                  <Shield className="w-8 h-8 text-electric-cyan" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-navy-900 tracking-tight">Core Architecture</h2>
            <p className="text-lg text-slate-600">Built on four foundational pillars to ensure maximum reliability and performance.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Brain, title: 'Apphia.Kernel', desc: 'The core decision engine. Abstracting diverse entities into a single core pattern.', color: 'text-electric-purple' },
              { icon: Zap, title: 'Apphia.Observer', desc: 'Predictive orchestrator anticipating user needs by pre-fetching data.', color: 'text-electric-cyan' },
              { icon: Shield, title: 'Apphia.Guard', desc: 'The immune system. Built-in graceful degradation and self-healing.', color: 'text-navy-700' },
              { icon: Activity, title: 'Apphia.Bridge', desc: 'Seamless integration layer connecting the engine to external services.', color: 'text-electric-blue' }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-electric-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-navy-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

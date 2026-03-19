import Link from 'next/link';
import { PlayCircle, ArrowRight, MonitorPlay } from 'lucide-react';
import Image from 'next/image';

export default function DemoPage() {
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
            <Link href="/" className="text-xl font-bold text-navy-900 tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-navy-900 flex items-center justify-center lamination">
                <MonitorPlay className="w-5 h-5 text-electric-cyan" />
              </div>
              Apphia Engine
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/signup" className="text-sm font-medium px-5 py-2.5 rounded-full bg-navy-900 text-white hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/20 lamination">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative">
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-electric-purple/30 text-electric-purple bg-white/50 shadow-sm mx-auto">
            <span className="w-2 h-2 rounded-full bg-electric-purple animate-pulse" />
            <span className="text-sm font-semibold tracking-wide uppercase text-navy-900">Interactive Demo</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-navy-900 leading-[1.1]">
            Experience the <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-electric-purple">future of work.</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Watch how Apphia Engine adapts to your industry and role in real-time.
          </p>

          <div className="relative w-full aspect-video max-w-4xl mx-auto mt-12 rounded-3xl overflow-hidden shadow-2xl shadow-navy-900/20 border border-white/60 glass-card lamination group cursor-pointer">
            <Image 
              src="https://picsum.photos/seed/dashboard-demo/1920/1080" 
              alt="Dashboard Demo" 
              fill 
              className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-navy-900/20 group-hover:bg-navy-900/40 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl border border-white/40">
                <PlayCircle className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-12">
            <Link href="/intake" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-navy-900 text-white font-medium hover:bg-navy-800 transition-all shadow-xl shadow-navy-900/20 lamination group">
              Try it yourself
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

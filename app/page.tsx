import { Activity, Brain, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            Apphia Engine
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl">
            Autonomous Tech Support Framework. A modular fortress architecture for predictive orchestration and resilient systems.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <Brain className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-xl font-semibold">Apphia.Kernel</h2>
            <p className="text-slate-400 text-sm">
              The core decision engine. Abstracting diverse entities into a single core pattern for scalability.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-xl font-semibold">Apphia.Observer</h2>
            <p className="text-slate-400 text-sm">
              Predictive orchestrator anticipating user needs by pre-fetching data and optimizing pipelines.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold">Apphia.Guard</h2>
            <p className="text-slate-400 text-sm">
              The immune system. Built-in graceful degradation and self-healing mechanisms for external failures.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-rose-400" />
            </div>
            <h2 className="text-xl font-semibold">Apphia.Bridge</h2>
            <p className="text-slate-400 text-sm">
              Seamless integration layer connecting the engine to external services, databases, and APIs.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

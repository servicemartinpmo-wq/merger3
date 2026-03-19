import { BookOpen, Brain, GitMerge, ShieldCheck, Zap, Server, Activity, ArrowRight } from 'lucide-react';

export default function TechOpsPage() {
  return (
    <div className="p-8 space-y-12 max-w-6xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-indigo-400" />
          Tech-Ops Playbook
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          The foundational manuals, frameworks, and AI-first support patterns driving the Apphia Engine.
        </p>
      </header>

      {/* Foundational Frameworks */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-200 border-b border-slate-800 pb-2">
          Foundational Frameworks (The "Laws of Physics")
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-lg font-semibold text-indigo-400 mb-2">ITIL</h3>
            <p className="text-sm text-slate-300 mb-4">The global standard for IT service management (ITSM).</p>
            <ul className="text-sm text-slate-400 space-y-2 list-disc pl-4">
              <li>Incident vs Problem vs Change</li>
              <li>Service Desk as central hub</li>
              <li>SLA / SLO structures</li>
            </ul>
            <div className="mt-4 p-3 bg-indigo-500/10 rounded-lg text-xs text-indigo-300">
              <strong>AI Mapping:</strong> AI = Level 1 + 2 agents. Humans = Level 3 escalation.
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-lg font-semibold text-cyan-400 mb-2">KCS</h3>
            <p className="text-sm text-slate-300 mb-4">Knowledge-Centered Service. The most important modern support concept.</p>
            <ul className="text-sm text-slate-400 space-y-2 list-disc pl-4">
              <li>Solve → Document → Reuse → Improve</li>
              <li>Capture issue, create article</li>
            </ul>
            <div className="mt-4 p-3 bg-cyan-500/10 rounded-lg text-xs text-cyan-300">
              <strong>AI Mapping:</strong> Exactly how AI support systems should self-learn.
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-lg font-semibold text-emerald-400 mb-2">SRE</h3>
            <p className="text-sm text-slate-300 mb-4">Site Reliability Engineering. Reliability over everything.</p>
            <ul className="text-sm text-slate-400 space-y-2 list-disc pl-4">
              <li>Automation-first support</li>
              <li>Error budgets & SLIs / SLOs</li>
              <li>Toil reduction</li>
            </ul>
            <div className="mt-4 p-3 bg-emerald-500/10 rounded-lg text-xs text-emerald-300">
              <strong>AI Mapping:</strong> Aligns perfectly with AI-led automation vision.
            </div>
          </div>
        </div>
      </section>

      {/* AI-First Support Pattern */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-200 border-b border-slate-800 pb-2">
          AI-First Support Pattern
        </h2>
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
            <div className="flex-1">
              <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-3">
                <Brain className="w-8 h-8 text-indigo-400" />
              </div>
              <h4 className="font-semibold text-slate-200">1. Intelligent Intake</h4>
              <p className="text-xs text-slate-400 mt-2">User describes issue (non-technical). AI converts to structured data.</p>
            </div>
            <ArrowRight className="hidden md:block w-6 h-6 text-slate-600" />
            <div className="flex-1">
              <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-3">
                <Activity className="w-8 h-8 text-cyan-400" />
              </div>
              <h4 className="font-semibold text-slate-200">2. Diagnostic Engine</h4>
              <p className="text-xs text-slate-400 mt-2">Logs + patterns + past cases. Root cause analysis.</p>
            </div>
            <ArrowRight className="hidden md:block w-6 h-6 text-slate-600" />
            <div className="flex-1">
              <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-3">
                <Zap className="w-8 h-8 text-emerald-400" />
              </div>
              <h4 className="font-semibold text-slate-200">3. Resolution Engine</h4>
              <p className="text-xs text-slate-400 mt-2">Suggest fix OR execute fix automatically.</p>
            </div>
            <ArrowRight className="hidden md:block w-6 h-6 text-slate-600" />
            <div className="flex-1">
              <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-3">
                <GitMerge className="w-8 h-8 text-rose-400" />
              </div>
              <h4 className="font-semibold text-slate-200">4. Knowledge Loop</h4>
              <p className="text-xs text-slate-400 mt-2">Store solution. Improve future responses (KCS).</p>
            </div>
          </div>
        </div>
      </section>

      {/* System Role Design */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-200 border-b border-slate-800 pb-2">
            System Role Design
          </h2>
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-indigo-400 flex items-center gap-2 mb-3">
                <Server className="w-5 h-5" /> AI = Everything
              </h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2"><span className="w-16 text-slate-500">Tier 1</span> Answers questions</li>
                <li className="flex items-center gap-2"><span className="w-16 text-slate-500">Tier 2</span> Diagnoses issues</li>
                <li className="flex items-center gap-2"><span className="w-16 text-slate-500">Tier 3</span> Suggests or executes fixes</li>
                <li className="flex items-center gap-2"><span className="w-16 text-slate-500">Tier 4</span> Writes knowledge + automations</li>
              </ul>
            </div>
            <div className="pt-6 border-t border-slate-800">
              <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5" /> You = Moderator / Controller
              </h3>
              <p className="text-sm text-slate-400 mb-3">You are NOT fixing things manually. You only:</p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>✅ Approve risky fixes</li>
                <li>🚨 Review escalations</li>
                <li>🧠 Improve system (by feedback)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-200 border-b border-slate-800 pb-2">
            Decision Engine Logic
          </h2>
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-sm text-slate-300">
            <pre className="whitespace-pre-wrap">
{`IF confidence >= 85 AND low risk:
    auto_execute_fix()

ELIF confidence >= 60:
    suggest_fix_to_user()

ELIF risk_high:
    escalate_to_human()

ELSE:
    continue_diagnosis()`}
            </pre>
          </div>
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <h4 className="text-rose-400 font-semibold mb-1">🚨 Escalation System</h4>
            <p className="text-sm text-rose-200/70">
              Triggered when confidence is low, risk is high, or fix could break the system. Each escalation is translated into plain English for the non-technical operator.
            </p>
          </div>
        </div>
      </section>

      {/* MVP Phases */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-200 border-b border-slate-800 pb-2">
          MVP Roadmap
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <h4 className="font-bold text-slate-200 mb-2">Phase 1</h4>
            <p className="text-sm text-slate-400">AI chat support. No auto-fix yet. Escalation to human.</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <h4 className="font-bold text-slate-200 mb-2">Phase 2</h4>
            <p className="text-sm text-slate-400">Add suggested fixes. Add approval system.</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <h4 className="font-bold text-slate-200 mb-2">Phase 3</h4>
            <p className="text-sm text-slate-400">Add auto-fix (low-risk only).</p>
          </div>
          <div className="p-5 rounded-xl bg-indigo-900/20 border border-indigo-500/30">
            <h4 className="font-bold text-indigo-300 mb-2">Phase 4</h4>
            <p className="text-sm text-indigo-200/70">Full self-healing system.</p>
          </div>
        </div>
      </section>

    </div>
  );
}

import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-electric-blue/5 blur-[120px] -z-10" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-electric-purple/5 blur-[100px] -z-10" />

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-navy-900 shadow-xl shadow-navy-900/20 mb-6 lamination">
            <Zap className="w-8 h-8 text-electric-cyan" />
          </Link>
          <h1 className="text-3xl font-bold text-navy-900 tracking-tight">Create your account</h1>
          <p className="text-slate-600 mt-2">Join the next generation of autonomous systems.</p>
        </div>

        <div className="glass-card rounded-3xl p-8 shadow-2xl shadow-slate-200/50 border border-white/60">
          <form className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-900 mb-1.5">Work Email</label>
                <input 
                  type="email" 
                  placeholder="you@company.com" 
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200 focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-900 mb-1.5">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200 focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 outline-none transition-all"
                />
              </div>
            </div>

            <Link href="/intake" className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-navy-900 text-white font-medium hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/20 lamination group">
              Continue
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600">
              Already have an account? <Link href="/login" className="text-electric-blue font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

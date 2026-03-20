import { Database, Key, Shield, User } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <header>
        <h1 className="text-3xl font-bold text-navy-900">Settings</h1>
        <p className="text-slate-500 mt-2">Manage your Apphia Engine configuration.</p>
      </header>

      <div className="space-y-6">
        <section className="p-6 rounded-2xl glass-card border border-slate-200 shadow-xl shadow-slate-200/50">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-navy-900">
            <User className="w-5 h-5 text-electric-blue" />
            Profile
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Name</label>
              <input type="text" defaultValue="Admin User" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 focus:outline-none focus:ring-2 focus:ring-electric-blue shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
              <input type="email" defaultValue="admin@apphia.com" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 focus:outline-none focus:ring-2 focus:ring-electric-blue shadow-sm" />
            </div>
          </div>
        </section>

        <section className="p-6 rounded-2xl glass-card border border-slate-200 shadow-xl shadow-slate-200/50">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-navy-900">
            <Key className="w-5 h-5 text-electric-blue" />
            AI Model Providers
          </h2>
          <p className="text-sm text-slate-500 mb-4">Configure multiple AI providers to combine their strengths for intake, diagnosis, and resolution.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">OpenAI API Key (ChatGPT)</label>
              <input type="password" defaultValue="sk-..." className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 focus:outline-none focus:ring-2 focus:ring-electric-blue shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Anthropic API Key (Claude)</label>
              <input type="password" defaultValue="sk-ant-..." className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 focus:outline-none focus:ring-2 focus:ring-electric-blue shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Google Gemini API Key</label>
              <input type="password" defaultValue="AIza..." className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 focus:outline-none focus:ring-2 focus:ring-electric-blue shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">DeepSeek API Key</label>
              <input type="password" defaultValue="sk-deepseek-..." className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 focus:outline-none focus:ring-2 focus:ring-electric-blue shadow-sm" />
            </div>
          </div>
        </section>

        <section className="p-6 rounded-2xl glass-card border border-slate-200 shadow-xl shadow-slate-200/50">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-navy-900">
            <Database className="w-5 h-5 text-electric-blue" />
            Supabase Configuration
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Supabase URL</label>
              <input type="text" defaultValue="https://xyzcompany.supabase.co" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 focus:outline-none focus:ring-2 focus:ring-electric-blue shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Supabase Service Role Key</label>
              <input type="password" defaultValue="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 focus:outline-none focus:ring-2 focus:ring-electric-blue shadow-sm" />
            </div>
          </div>
        </section>

        <section className="p-6 rounded-2xl glass-card border border-slate-200 shadow-xl shadow-slate-200/50">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-navy-900">
            <Database className="w-5 h-5 text-electric-blue" />
            Database Schema
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Download the complete SQL schema to initialize your Supabase project.
          </p>
          <a href="/schema.sql" download className="inline-flex items-center gap-2 px-4 py-2 bg-electric-blue hover:bg-electric-blue/90 text-white rounded-lg font-medium transition-colors shadow-lg shadow-electric-blue/20">
            Download schema.sql
          </a>
        </section>
      </div>
    </div>
  );
}

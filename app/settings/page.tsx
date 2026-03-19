import { Database, Key, Shield, User } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <header>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-2">Manage your Apphia Engine configuration.</p>
      </header>

      <div className="space-y-6">
        <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" />
            Profile
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
              <input type="text" defaultValue="Admin User" className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
              <input type="email" defaultValue="admin@apphia.com" className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
        </section>

        <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-400" />
            API Keys
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">OpenAI API Key</label>
              <input type="password" defaultValue="sk-..." className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Supabase URL</label>
              <input type="text" defaultValue="https://xyzcompany.supabase.co" className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Supabase Service Role Key</label>
              <input type="password" defaultValue="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
        </section>

        <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            Database Schema
          </h2>
          <p className="text-sm text-slate-400 mb-4">
            Download the complete SQL schema to initialize your Supabase project.
          </p>
          <a href="/schema.sql" download className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
            Download schema.sql
          </a>
        </section>
      </div>
    </div>
  );
}

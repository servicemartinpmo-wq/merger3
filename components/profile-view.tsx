'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Briefcase, 
  History, 
  Upload, 
  CheckCircle2, 
  Palette, 
  Globe, 
  Shield, 
  Settings2, 
  Plus, 
  Trash2,
  ChevronRight,
  Monitor,
  Database,
  Lock,
  LogOut,
  LogIn
} from 'lucide-react';
import { useSupabase } from '@/components/supabase-provider';
import supabase from '@/lib/supabase';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'active' | 'pending';
}

export function ProfileView() {
  const { user, session, signInWithGoogle, signOut } = useSupabase();
  const [activeSection, setActiveSection] = useState<'general' | 'branding' | 'team' | 'security' | 'history'>('general');
  const [isEditing, setIsEditing] = useState(false);
  const [brandColor, setBrandColor] = useState('#0f172a');
  const [team, setTeam] = useState<TeamMember[]>([
    { id: '1', name: 'Alex Rivera', role: 'Executive Admin', email: 'alex@venture-os.com', status: 'active' },
    { id: '2', name: 'Sarah Chen', role: 'Ops Lead', email: 'sarah@venture-os.com', status: 'active' },
    { id: '3', name: 'Marcus Thorne', role: 'Strategic Advisor', email: 'marcus@venture-os.com', status: 'pending' },
  ]);

  const menuItems = [
    { id: 'general', label: 'General Info', icon: Building2 },
    { id: 'branding', label: 'Branding & UI', icon: Palette },
    { id: 'team', label: 'Team & Access', icon: Users },
    { id: 'security', label: 'Security & Data', icon: Shield },
    { id: 'history', label: 'System History', icon: History },
  ] as const;

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[700px]">
      {/* Sidebar Navigation */}
      <aside className="lg:w-72 space-y-2">
        <div className="px-4 py-6">
          <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-slate-400 mb-1">Organization</h2>
          <p className="text-lg font-serif font-medium">Workspace Settings</p>
        </div>
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-white shadow-sm text-slate-900 border border-slate-200' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-slate-900' : 'text-slate-400'} />
                {item.label}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <header className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
              {menuItems.find(i => i.id === activeSection)?.icon({ size: 20 })}
            </div>
            <div>
              <h1 className="text-xl font-serif font-medium">{menuItems.find(i => i.id === activeSection)?.label}</h1>
              <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">Configuration Panel</p>
            </div>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
              isEditing 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                : 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
            }`}
          >
            {isEditing ? 'Save Changes' : 'Edit Mode'}
          </button>
        </header>

        <div className="flex-1 p-8">
          <AnimatePresence mode="wait">
            {activeSection === 'general' && (
              <motion.div 
                key="general"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 max-w-2xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Company Name</label>
                    <input 
                      type="text" 
                      defaultValue="Venture-OS Global" 
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900/5 outline-none disabled:bg-slate-50 disabled:text-slate-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Industry Vertical</label>
                    <input 
                      type="text" 
                      defaultValue="Strategic Operations" 
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900/5 outline-none disabled:bg-slate-50 disabled:text-slate-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Primary Domain</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        defaultValue="venture-os.com" 
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900/5 outline-none disabled:bg-slate-50 disabled:text-slate-500 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Workspace ID</label>
                    <input 
                      type="text" 
                      defaultValue="VOS-992-X" 
                      disabled
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                    <Settings2 size={16} />
                    Regional Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Timezone</label>
                      <select disabled={!isEditing} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none disabled:bg-slate-50">
                        <option>UTC-08:00 (Pacific Time)</option>
                        <option>UTC+00:00 (GMT)</option>
                        <option>UTC+01:00 (CET)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Currency</label>
                      <select disabled={!isEditing} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none disabled:bg-slate-50">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'branding' && (
              <motion.div 
                key="branding"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Primary Brand Color</label>
                      <div className="flex items-center gap-4">
                        <input 
                          type="color" 
                          value={brandColor}
                          onChange={(e) => setBrandColor(e.target.value)}
                          disabled={!isEditing}
                          className="w-16 h-16 rounded-2xl border-4 border-slate-100 cursor-pointer disabled:opacity-50"
                        />
                        <div className="flex-1">
                          <input 
                            type="text" 
                            value={brandColor}
                            onChange={(e) => setBrandColor(e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Logo Configuration</label>
                      <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-4 bg-slate-50/50">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-300">
                          <Upload size={24} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">Drop your logo here</p>
                          <p className="text-xs text-slate-400">SVG, PNG or JPG (max 2MB)</p>
                        </div>
                        {isEditing && (
                          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors">
                            Select File
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="text-xs font-mono uppercase tracking-widest text-slate-400">UI Preview</label>
                    <div className="p-8 rounded-3xl border border-slate-200 bg-[#F5F2ED] space-y-4">
                      <div className="h-12 w-full rounded-xl bg-white border border-slate-200 flex items-center px-4 gap-3">
                        <div className="w-6 h-6 rounded-md" style={{ backgroundColor: brandColor }} />
                        <div className="h-2 w-24 bg-slate-100 rounded" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-32 rounded-xl bg-white border border-slate-200 p-4 space-y-2">
                          <div className="h-2 w-12 bg-slate-100 rounded" />
                          <div className="h-4 w-full bg-slate-50 rounded" />
                          <div className="h-4 w-2/3 bg-slate-50 rounded" />
                        </div>
                        <div className="h-32 rounded-xl bg-white border border-slate-200 p-4 flex flex-col justify-end">
                          <div className="h-8 w-full rounded-lg" style={{ backgroundColor: brandColor }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'team' && (
              <motion.div 
                key="team"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-widest">Active Members ({team.length})</h3>
                  {isEditing && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest">
                      <Plus size={14} />
                      Invite Member
                    </button>
                  )}
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-slate-400">Member</th>
                        <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-slate-400">Role</th>
                        <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-slate-400">Status</th>
                        {isEditing && <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-slate-400">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {team.map((member) => (
                        <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{member.name}</p>
                                <p className="text-xs text-slate-400">{member.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded-md">{member.role}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                              <span className="text-xs capitalize">{member.status}</span>
                            </div>
                          </td>
                          {isEditing && (
                            <td className="px-6 py-4">
                              <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeSection === 'security' && (
              <motion.div 
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 max-w-2xl"
              >
                {/* Supabase Integration */}
                <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                        <Database size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Supabase Integration</p>
                        <p className="text-xs text-slate-500">Backend & Database Connection</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${user ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span className="text-[10px] font-mono uppercase tracking-widest font-bold">
                        {user ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                  </div>

                  {user ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Authenticated User</p>
                        <p className="text-sm font-medium">{user.email}</p>
                        <p className="text-[10px] text-slate-400 font-mono">ID: {user.id}</p>
                      </div>
                      <button 
                        onClick={signOut}
                        className="w-full py-3 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <LogOut size={14} />
                        Disconnect Supabase
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-500">Connect your Supabase account to enable real-time data persistence and secure authentication.</p>
                      <button 
                        onClick={signInWithGoogle}
                        className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
                      >
                        <LogIn size={14} />
                        Connect with Google
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                        <Lock size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Two-Factor Authentication</p>
                        <p className="text-xs text-slate-500">Enforce 2FA for all team members</p>
                      </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-colors ${isEditing ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isEditing ? 'translate-x-6' : ''}`} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                        <Database size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Data Retention Policy</p>
                        <p className="text-xs text-slate-500">Current: 24 Months</p>
                      </div>
                    </div>
                    <button disabled={!isEditing} className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 disabled:opacity-50">Configure</button>
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-rose-100 bg-rose-50/30 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-rose-600 flex items-center gap-2">
                    <Shield size={14} />
                    Danger Zone
                  </h4>
                  <p className="text-xs text-slate-500">Permanently delete this workspace and all associated data. This action cannot be undone.</p>
                  <button className="px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-rose-500/20">Delete Workspace</button>
                </div>
              </motion.div>
            )}

            {activeSection === 'history' && (
              <motion.div 
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  {[
                    { date: '2026-03-17 13:45', user: 'Alex Rivera', action: 'Updated Branding Colors', icon: Palette },
                    { date: '2026-03-16 09:12', user: 'System', action: 'Automated Security Audit Completed', icon: Shield },
                    { date: '2026-03-15 16:30', user: 'Sarah Chen', action: 'Added 2 New Team Members', icon: Users },
                    { date: '2026-03-14 11:05', user: 'Alex Rivera', action: 'Modified Workspace Settings', icon: Settings2 },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                          <log.icon size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{log.action}</p>
                          <p className="text-xs text-slate-400">{log.user} • {log.date}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-slate-300" />
                    </div>
                  ))}
                </div>
                <button className="w-full py-3 border border-dashed border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                  Load More Logs
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

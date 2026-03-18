'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, Shield, Loader2, MessageSquare, Plus, UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSupabase } from '@/components/supabase-provider';
import { dataService } from '@/lib/services/data-service';

// MOCHA Role Colors
const MOCHA_COLORS = {
  Manager: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  Owner: 'bg-showroom-accent/10 text-showroom-accent border-showroom-accent/20',
  Consulted: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  Helped: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  Accountable: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
};

export function TeamPageView() {
  const { user } = useSupabase();
  const [teamSize, setTeamSize] = useState('2-10');
  const [updates, setUpdates] = useState<any[]>([]);
  const [mocha, setMocha] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', role: 'Owner' });

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [updatesData, mochaData] = await Promise.all([
          dataService.getItems<any>('team_updates', user.id),
          dataService.getItems<any>('team_members', user.id)
        ]);
        setUpdates(updatesData);
        setMocha(mochaData);
      } catch (error) {
        console.error('Error fetching team data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const updatesChannel = supabase
      .channel('team-updates-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'team_updates', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') setUpdates(prev => [payload.new, ...prev]);
          else if (payload.eventType === 'DELETE') setUpdates(prev => prev.filter(u => u.id === payload.old.id));
        }
      ).subscribe();

    const mochaChannel = supabase
      .channel('team-members-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'team_members', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') setMocha(prev => [...prev, payload.new]);
          else if (payload.eventType === 'UPDATE') setMocha(prev => prev.map(m => m.id === payload.new.id ? payload.new : m));
          else if (payload.eventType === 'DELETE') setMocha(prev => prev.filter(m => m.id === payload.old.id));
        }
      ).subscribe();

    return () => {
      supabase.removeChannel(updatesChannel);
      supabase.removeChannel(mochaChannel);
    };
  }, [user]);

  const handleAddMember = async () => {
    if (!user || !newMember.name) return;
    try {
      const member = await dataService.createItem('team_members', {
        ...newMember,
        user_id: user.id
      }, user.id);
      setMocha(prev => [...prev, member]);
      setNewMember({ name: '', role: 'Owner' });
      setIsAddingMember(false);
    } catch (error) {
      console.error('Error adding team member:', error);
    }
  };

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-showroom-accent" /></div>;

  return (
    <div className="space-y-10 bg-slate-900 p-8 min-h-screen">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display text-white tracking-tight">Team Page</h1>
          <p className="text-slate-400">Real-time updates and MOCHA accountability.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsAddingMember(true)}
            className="flex items-center gap-2 bg-showroom-accent text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-showroom-accent/90 transition-all shadow-lg shadow-showroom-accent/20"
          >
            <UserPlus size={16} /> Add Member
          </button>
          {mocha.length === 0 && (
            <button
              onClick={async () => {
                if (!user) return;
                const demoMembers = [
                  { name: 'Sarah J.', role: 'Manager', user_id: user.id },
                  { name: 'Mike T.', role: 'Owner', user_id: user.id },
                  { name: 'Alex R.', role: 'Consulted', user_id: user.id },
                  { name: 'Ryan Torres', role: 'Helped', user_id: user.id },
                  { name: 'Sarah J.', role: 'Accountable', user_id: user.id },
                ];
                const demoUpdates = [
                  { user_name: 'Sarah J.', action: 'completed', target: 'SOC2 Audit Prep', user_id: user.id },
                  { user_name: 'Mike T.', action: 'updated', target: 'Q3 Marketing Launch', user_id: user.id },
                ];
                await supabase.from('team_members').insert(demoMembers);
                await supabase.from('team_updates').insert(demoUpdates);
              }}
              className="text-[10px] font-mono uppercase tracking-widest text-showroom-accent hover:underline"
            >
              Seed Demo Data
            </button>
          )}
          <select value={teamSize} onChange={(e) => setTeamSize(e.target.value)} className="p-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white glass-reflection outline-none">
            <option value="1">1 (Solo)</option>
            <option value="2-10">2–10</option>
            <option value="11-50">11–50</option>
            <option value="51-200">51–200</option>
            <option value="200+">200+</option>
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Updates */}
        <section className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-medium flex items-center gap-3 text-white"><Activity size={20} className="text-showroom-accent" /> User Updates</h2>
          <div className="space-y-4">
            {updates.map((u: any) => (
              <motion.div 
                key={u.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 bg-white/5 border border-white/10 rounded-3xl flex justify-between items-center glass-reflection"
              >
                <p className="text-white"><span className="font-bold">{u.user_name}</span> {u.action} <span className="text-showroom-accent">{u.target}</span></p>
                <span className="text-xs text-slate-500 font-mono">{new Date(u.created_at).toLocaleTimeString()}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* MOCHA */}
        <section className="space-y-6">
          <h2 className="text-xl font-medium flex items-center gap-3 text-white"><Shield size={20} className="text-showroom-accent" /> MOCHA Framework</h2>
          
          {isAddingMember && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4 glass-reflection"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Member Name</label>
                <input 
                  type="text" 
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="e.g. Sarah J."
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-showroom-accent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Role</label>
                <select 
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  className="w-full p-3 bg-slate-800 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-showroom-accent transition-all"
                >
                  {Object.keys(MOCHA_COLORS).map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={handleAddMember}
                  className="flex-1 py-2 bg-showroom-accent text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-showroom-accent/90 transition-all"
                >
                  Save Member
                </button>
                <button 
                  onClick={() => setIsAddingMember(false)}
                  className="px-4 py-2 bg-white/5 text-slate-400 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          <div className="space-y-3">
            {mocha.map((m: any, i: number) => (
              <motion.div 
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border glass-reflection ${MOCHA_COLORS[m.role as keyof typeof MOCHA_COLORS]}`}
              >
                <div className="text-xs font-bold uppercase tracking-widest mb-1">{m.role}</div>
                <div className="font-medium">{m.name}</div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

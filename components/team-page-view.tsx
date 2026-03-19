'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, Shield, Loader2, MessageSquare, Plus, UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSupabase } from '@/components/supabase-provider';
import { dataService } from '@/lib/services/data-service';

// MOCHA Role Colors
const MOCHA_COLORS = {
  Manager: 'bg-rose-50 text-rose-600 border-rose-100',
  Owner: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  Consulted: 'bg-amber-50 text-amber-600 border-amber-100',
  Helped: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Accountable: 'bg-purple-50 text-purple-600 border-purple-100',
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

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Department & Team</h1>
          <p className="text-slate-500">Real-time updates and MOCHA accountability matrix.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsAddingMember(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
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
              className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 px-4 py-2 rounded-lg"
            >
              Seed Demo Data
            </button>
          )}
          <select value={teamSize} onChange={(e) => setTeamSize(e.target.value)} className="p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all">
            <option value="1">1 (Solo)</option>
            <option value="2-10">2–10</option>
            <option value="11-50">11–50</option>
            <option value="51-200">51–200</option>
            <option value="200+">200+</option>
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* User Updates */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Activity size={14} className="text-indigo-600" /> 
              Live Activity
            </h2>
          </div>
          <div className="space-y-3">
            {updates.map((u: any) => (
              <motion.div 
                key={u.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-5 bg-white border border-slate-200 rounded-2xl flex justify-between items-center shadow-sm hover:shadow-md transition-all"
              >
                <p className="text-sm text-slate-900 font-medium">
                  <span className="font-bold">{u.user_name}</span> 
                  <span className="mx-1 text-slate-400">{u.action}</span> 
                  <span className="text-indigo-600 font-bold">{u.target}</span>
                </p>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(u.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </motion.div>
            ))}
            {updates.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">No recent activity</p>
              </div>
            )}
          </div>
        </section>

        {/* MOCHA */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Shield size={14} className="text-indigo-600" /> 
              MOCHA Matrix
            </h2>
          </div>
          
          {isAddingMember && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Member Name</label>
                <input 
                  type="text" 
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="e.g. Sarah J."
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Role</label>
                <select 
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                >
                  {Object.keys(MOCHA_COLORS).map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={handleAddMember}
                  className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                >
                  Save Member
                </button>
                <button 
                  onClick={() => setIsAddingMember(false)}
                  className="px-4 py-3 bg-white border border-slate-200 text-slate-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all"
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
                whileHover={{ x: 4 }}
                className={`p-5 rounded-2xl border shadow-sm transition-all ${MOCHA_COLORS[m.role as keyof typeof MOCHA_COLORS]}`}
              >
                <div className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">{m.role}</div>
                <div className="font-bold text-sm tracking-tight">{m.name}</div>
              </motion.div>
            ))}
            {mocha.length === 0 && !isAddingMember && (
              <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">No team members defined</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

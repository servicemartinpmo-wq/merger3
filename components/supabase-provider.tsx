'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

type SupabaseContext = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        if (!supabase?.auth) {
          setIsLoading(false);
          return;
        }
        // Set a timeout for the session fetch to prevent infinite loading
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session fetch timeout')), 5000)
        );

        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting Supabase session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    if (!supabase?.auth) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!supabase?.auth) return;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const signOut = async () => {
    if (!supabase?.auth) return;
    await supabase.auth.signOut();
  };

  return (
    <Context.Provider value={{ session, user, isLoading, signInWithGoogle, signOut }}>
      {children}
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};

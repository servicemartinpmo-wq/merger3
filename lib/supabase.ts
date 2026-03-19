import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper types based on the schema
export type Ticket = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
  resolved_at?: string;
};

export type AIDiagnostic = {
  id: string;
  ticket_id: string;
  ai_agent_name: string;
  analysis_result: any;
  confidence_score: number;
  recommended_action: string;
  created_at: string;
};

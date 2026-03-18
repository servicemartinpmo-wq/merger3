import { createClient } from '@supabase/supabase-js';
import { StrategicGoal, StrategicInitiative, OperationalMetric, AlgorithmSignal, AlgorithmScore } from '../types/pmo';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const pmoService = {
  // Strategy
  getStrategicGoals: async (orgId: string) => {
    return await supabase.from('strategic_goals').select('*').eq('org_id', orgId);
  },
  
  // Operations
  getOperationalMetrics: async (orgId: string) => {
    return await supabase.from('operational_metrics').select('*').eq('org_id', orgId);
  },
  
  // Marketing Intelligence
  getAlgorithmScores: async (campaignId: string) => {
    return await supabase.from('algorithm_scores').select('*').eq('campaign_id', campaignId).order('calculated_at', { ascending: false });
  },
  
  addAlgorithmSignal: async (signal: Omit<AlgorithmSignal, 'id' | 'recorded_at'>) => {
    return await supabase.from('algorithm_signals').insert(signal);
  }
};

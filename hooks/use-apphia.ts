import { useState, useCallback, useEffect } from 'react';
import { ApphiaKernel, Signal, Diagnosis, Advisory } from '@/lib/apphia/kernel';
import { ApphiaObserver } from '@/lib/apphia/observer';
import { ApphiaGuard, ResilienceProtocol } from '@/lib/apphia/guard';
import { ApphiaBridge } from '@/lib/apphia/bridge';
import { useSupabase } from '@/components/supabase-provider';

/**
 * useApphia
 * Custom hook to interact with the Apphia reasoning engine.
 */
export function useApphia() {
  const { user } = useSupabase();
  const [signals, setSignals] = useState<Signal[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [protocols, setProtocols] = useState<ResilienceProtocol[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const observer = new ApphiaObserver();
  const guard = ApphiaGuard.getInstance();
  const bridge = ApphiaBridge.getInstance();

  const runObservation = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await observer.runObservationCycle(user.id);
      setSignals(result.signals);
      setDiagnoses(result.diagnoses);
      setAdvisories(result.advisories);

      // Also check system health via Guard
      const unifiedView = await bridge.getUnifiedView(user.id);
      const healthProtocols = await guard.checkSystemHealth({
        capacityScore: 0.5 // Placeholder for real capacity calculation
      });
      setProtocols(healthProtocols);

    } catch (err: any) {
      setError(err.message || 'Apphia observation failed');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      runObservation();
    }
  }, [user, runObservation]);

  return {
    signals,
    diagnoses,
    advisories,
    protocols,
    isLoading,
    error,
    refresh: runObservation
  };
}

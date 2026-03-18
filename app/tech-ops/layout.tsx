import { ErrorBoundary } from '@/components/error-boundary';
import { GamificationProvider } from '@/components/gamification-provider';
import { SupabaseProvider } from '@/components/supabase-provider';
import { ThemeProvider } from '@/components/theme-provider';

export default function TechOpsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <GamificationProvider>
        <ThemeProvider>
          <SupabaseProvider>
            <div className="min-h-screen bg-slate-950 text-white">
              {children}
            </div>
          </SupabaseProvider>
        </ThemeProvider>
      </GamificationProvider>
    </ErrorBoundary>
  );
}

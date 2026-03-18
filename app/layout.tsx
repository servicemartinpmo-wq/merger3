import type {Metadata} from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Strategic Operations Platform',
  description: 'Unified PMO and Tech-Ops dashboard with AI-driven insights and health scoring.',
};

import { ErrorBoundary } from '@/components/error-boundary';
import { GamificationProvider } from '@/components/gamification-provider';
import { SupabaseProvider } from '@/components/supabase-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeCustomizer } from '@/components/theme-customizer';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="antialiased" suppressHydrationWarning>
        <ErrorBoundary>
          <GamificationProvider>
            <ThemeProvider>
              <SupabaseProvider>
                {children}
                <ThemeCustomizer />
              </SupabaseProvider>
            </ThemeProvider>
          </GamificationProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

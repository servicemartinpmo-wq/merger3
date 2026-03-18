'use client';

import { createContext, useContext, useState, useCallback } from 'react';

interface GamificationContextType {
  points: number;
  streak: number;
  addPoints: (amount: number) => void;
  incrementStreak: () => void;
}

const GamificationContext = createContext<GamificationContextType>({
  points: 0,
  streak: 0,
  addPoints: () => {},
  incrementStreak: () => {},
});

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);

  const addPoints = useCallback((amount: number) => setPoints(prev => prev + amount), []);
  const incrementStreak = useCallback(() => setStreak(prev => prev + 1), []);

  return (
    <GamificationContext.Provider value={{ points, streak, addPoints, incrementStreak }}>
      {children}
    </GamificationContext.Provider>
  );
}

export const useGamification = () => useContext(GamificationContext);

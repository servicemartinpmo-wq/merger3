import { Initiative } from '@/lib/types';

// In-memory store for the MVP
const historicalDecisions: { initiativeId: string; decision: string; date: Date }[] = [];
const recurringRisks: { risk: string; department: string; count: number }[] = [];

export const KnowledgeBase = {
  recordDecision: (initiativeId: string, decision: string) => {
    historicalDecisions.push({ initiativeId, decision, date: new Date() });
  },
  
  recordRisk: (risk: string, department: string) => {
    const existing = recurringRisks.find(r => r.risk === risk && r.department === department);
    if (existing) {
      existing.count++;
    } else {
      recurringRisks.push({ risk, department, count: 1 });
    }
  },

  getInsights: (department: string) => {
    return {
      recentDecisions: historicalDecisions.slice(-5),
      topRisks: recurringRisks
        .filter(r => r.department === department)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
    };
  }
};

import { Initiative } from '@/lib/types';
import { MaturityScore } from '@/lib/types/pmo';

export function calculateMaturityScore(initiatives: Initiative[]): MaturityScore {
  // Simple scoring logic for MVP
  // Strategic Alignment: % of initiatives with high alignment
  // Execution Discipline: % of initiatives with status 'In Progress' or 'Complete'
  // Operational Capacity: % of initiatives with owner
  // Process Structure: % of initiatives with plan
  // Risk Management: % of initiatives with low risk
  
  const total = initiatives.length;
  if (total === 0) return { strategicAlignment: 0, executionDiscipline: 0, operationalCapacity: 0, processStructure: 0, riskManagement: 0, total: 0, tier: 'Foundational' };

  const strategicAlignment = (initiatives.filter(i => i.strategic_alignment > 70).length / total) * 100;
  const executionDiscipline = (initiatives.filter(i => i.status !== 'Pending' && i.status !== 'Blocked').length / total) * 100;
  const operationalCapacity = (initiatives.filter(i => !!i.owner).length / total) * 100;
  const processStructure = (initiatives.filter(i => !!i.plan).length / total) * 100;
  const riskManagement = (initiatives.filter(i => i.risk_alert === 'Green').length / total) * 100;

  const totalScore = Math.round((strategicAlignment + executionDiscipline + operationalCapacity + processStructure + riskManagement) / 5);

  return {
    strategicAlignment: Math.round(strategicAlignment),
    executionDiscipline: Math.round(executionDiscipline),
    operationalCapacity: Math.round(operationalCapacity),
    processStructure: Math.round(processStructure),
    riskManagement: Math.round(riskManagement),
    total: totalScore,
    tier: totalScore > 70 ? 'Optimized' : 'Foundational'
  };
}

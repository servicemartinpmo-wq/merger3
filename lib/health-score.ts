/**
 * Operational Health Score Calculator
 * 
 * This module provides logic to calculate an overall operational health score
 * based on weighted performance across different organizational domains.
 */

export interface DomainHealth {
  domain: string;
  score: number; // 0-100
  weight: number; // 0-1
}

export interface OperationalHealthReport {
  overallScore: number;
  domainReports: DomainHealth[];
  summary: string;
}

/**
 * Calculates the overall operational health score.
 * 
 * @param domainHealths Array of health scores for different domains
 * @returns OperationalHealthReport
 */
export function calculateOperationalHealth(domainHealths: DomainHealth[]): OperationalHealthReport {
  let totalWeightedScore = 0;
  let totalWeight = 0;

  domainHealths.forEach(dh => {
    totalWeightedScore += dh.score * dh.weight;
    totalWeight += dh.weight;
  });

  const overallScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;

  let summary = "";
  if (overallScore >= 90) summary = "Excellent: System is highly optimized and resilient.";
  else if (overallScore >= 75) summary = "Good: System is performing well with minor areas for improvement.";
  else if (overallScore >= 50) summary = "Fair: System requires attention in key operational areas.";
  else summary = "Critical: Immediate intervention required to stabilize operations.";

  return {
    overallScore: Math.round(overallScore),
    domainReports: domainHealths,
    summary
  };
}

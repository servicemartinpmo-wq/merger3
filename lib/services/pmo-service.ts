import { dataService } from './data-service';

export interface Initiative {
  id: string;
  name: string;
  status: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  budget: number;
  owner_id: string;
  start_date: string;
  end_date: string;
}

export const pmoService = {
  /**
   * Calculates the Operational Maturity Score.
   */
  async calculateMaturityScore(userId: string) {
    const initiatives = await dataService.getItems<Initiative>('initiatives', userId);
    if (initiatives.length === 0) return 0;

    const completedCount = initiatives.filter(i => i.status === 'completed').length;
    const onTrackCount = initiatives.filter(i => i.status === 'on-track').length;
    
    // Simple weighted score
    const score = ((completedCount * 1.0) + (onTrackCount * 0.7)) / initiatives.length;
    return Math.round(score * 100);
  },

  /**
   * Calculates the Executive Priority Score for an initiative.
   */
  calculatePriorityScore(initiative: Initiative) {
    let score = 0;
    if (initiative.priority === 'critical') score += 50;
    if (initiative.priority === 'high') score += 30;
    if (initiative.priority === 'medium') score += 15;
    
    // Add progress weight
    score += (100 - initiative.progress) * 0.5;
    
    return Math.min(Math.round(score), 100);
  },

  /**
   * Detects dependency bottlenecks.
   */
  async detectBottlenecks(userId: string) {
    // In a real app, this would query a 'dependencies' table
    // For now, we simulate based on initiative status
    const initiatives = await dataService.getItems<Initiative>('initiatives', userId);
    const delayed = initiatives.filter(i => i.status === 'delayed');
    
    return delayed.map(i => ({
      initiativeId: i.id,
      name: i.name,
      reason: 'Resource conflict detected in upstream dependency.'
    }));
  }
};

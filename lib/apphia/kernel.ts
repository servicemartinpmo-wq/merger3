/**
 * Apphia.Kernel
 * The core reasoning engine for MARTIN PMO-OPs.
 * Implements the four-stage pipeline: Signal Detection -> Diagnosis -> Advisory -> Structural Remedies.
 */

export interface Signal {
  id: string;
  type: 'capacity' | 'delay' | 'conflict' | 'risk' | 'performance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  metadata: any;
  timestamp: Date;
}

export interface Diagnosis {
  signalId: string;
  rootCause: string;
  frameworkUsed: string;
  confidence: number;
}

export interface Advisory {
  diagnosisId: string;
  guidance: string;
  priority: number;
  actions: string[];
}

export interface StructuralRemedy {
  advisoryId: string;
  remedyType: 'org_redesign' | 'process_optimization' | 'resource_reallocation' | 'strategic_pivot';
  description: string;
  impact: string;
}

export class ApphiaKernel {
  private static instance: ApphiaKernel;

  private constructor() {}

  public static getInstance(): ApphiaKernel {
    if (!ApphiaKernel.instance) {
      ApphiaKernel.instance = new ApphiaKernel();
    }
    return ApphiaKernel.instance;
  }

  /**
   * Processes a set of operational data to detect signals.
   */
  public async detectSignals(data: any): Promise<Signal[]> {
    const signals: Signal[] = [];

    // 1. Capacity Overload Detection
    if (data.initiatives && data.teamMembers) {
      const totalCapacity = data.teamMembers.length * 40; // 40 hours per week
      const estimatedLoad = data.initiatives.reduce((acc: number, i: any) => acc + (i.estimated_hours || 0), 0);
      
      if (estimatedLoad > totalCapacity) {
        signals.push({
          id: crypto.randomUUID(),
          type: 'capacity',
          severity: estimatedLoad > totalCapacity * 1.2 ? 'critical' : 'high',
          message: `Capacity overload detected: ${estimatedLoad}h estimated vs ${totalCapacity}h available.`,
          metadata: { estimatedLoad, totalCapacity },
          timestamp: new Date()
        });
      }
    }

    // 2. Execution Delay Detection
    if (data.actionItems) {
      const overdueItems = data.actionItems.filter((item: any) => 
        new Date(item.due_date) < new Date() && item.status !== 'completed'
      );
      if (overdueItems.length > 0) {
        signals.push({
          id: crypto.randomUUID(),
          type: 'delay',
          severity: overdueItems.length > 5 ? 'high' : 'medium',
          message: `${overdueItems.length} action items are overdue.`,
          metadata: { overdueCount: overdueItems.length },
          timestamp: new Date()
        });
      }
    }

    // 3. Dependency Bottleneck Detection
    if (data.dependencies) {
      const blockedDependencies = data.dependencies.filter((d: any) => d.status === 'blocked');
      if (blockedDependencies.length > 0) {
        signals.push({
          id: crypto.randomUUID(),
          type: 'conflict',
          severity: 'high',
          message: `${blockedDependencies.length} critical dependency bottlenecks detected.`,
          metadata: { blockedCount: blockedDependencies.length },
          timestamp: new Date()
        });
      }
    }

    return signals;
  }

  /**
   * Diagnoses detected signals using management frameworks.
   */
  public async diagnose(signals: Signal[]): Promise<Diagnosis[]> {
    return signals.map(signal => {
      let rootCause = '';
      let frameworkUsed = '';
      
      switch (signal.type) {
        case 'capacity':
          rootCause = 'Poor resource allocation and initiative over-commitment.';
          frameworkUsed = 'Theory of Constraints';
          break;
        case 'delay':
          rootCause = 'Operational friction and lack of accountability.';
          frameworkUsed = 'Lean Six Sigma';
          break;
        case 'conflict':
          rootCause = 'Misaligned departmental objectives and siloed planning.';
          frameworkUsed = 'Balanced Scorecard';
          break;
        default:
          rootCause = 'General operational variance.';
          frameworkUsed = 'Root Cause Analysis';
      }

      return {
        signalId: signal.id,
        rootCause,
        frameworkUsed,
        confidence: 0.85
      };
    });
  }

  /**
   * Generates advisory guidance based on diagnoses.
   */
  public async generateAdvisory(diagnoses: Diagnosis[]): Promise<Advisory[]> {
    return diagnoses.map(diagnosis => ({
      diagnosisId: diagnosis.signalId,
      guidance: `Strategic recommendation based on ${diagnosis.frameworkUsed}: Address ${diagnosis.rootCause.toLowerCase()}`,
      priority: 1,
      actions: ['Review resource allocation', 'Adjust timeline', 'Align stakeholders']
    }));
  }

  /**
   * Proposes structural remedies for long-term improvement.
   */
  public async proposeRemedies(advisories: Advisory[]): Promise<StructuralRemedy[]> {
    return advisories.map(advisory => ({
      advisoryId: advisory.diagnosisId,
      remedyType: 'process_optimization',
      description: 'Implement a more rigorous initiative intake process to prevent capacity overloads.',
      impact: 'Reduces operational friction by 15% and improves delivery predictability.'
    }));
  }
}

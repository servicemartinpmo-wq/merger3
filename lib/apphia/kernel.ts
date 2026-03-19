/**
 * Apphia.Kernel
 * The core reasoning engine for MARTIN PMO-OPs.
 * Implements the four-stage pipeline: Signal Detection -> Diagnosis -> Advisory -> Structural Remedies.
 */

import { GoogleGenAI } from "@google/genai";
import { knowledgeService } from '../services/knowledge-service';

export interface Signal {
  id: string;
  type: 'capacity' | 'delay' | 'conflict' | 'risk' | 'performance' | 'strategic';
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
  analysis?: string;
}

export interface Advisory {
  diagnosisId: string;
  guidance: string;
  priority: number;
  actions: string[];
  rationale?: string;
}

export interface StructuralRemedy {
  advisoryId: string;
  remedyType: 'org_redesign' | 'process_optimization' | 'resource_reallocation' | 'strategic_pivot';
  description: string;
  impact: string;
}

export class ApphiaKernel {
  private static instance: ApphiaKernel;
  private ai: GoogleGenAI;

  private constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' });
  }

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

    // 4. AI-Powered Strategic Signal Detection
    try {
      const knowledge = await knowledgeService.getKnowledgeByModule('Signal');
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the following operational data and detect strategic signals based on these knowledge bases: ${JSON.stringify(knowledge)}.
        Data: ${JSON.stringify(data)}
        Return a JSON array of signals with fields: type, severity, message.`,
        config: { responseMimeType: "application/json" }
      });

      const aiSignals = JSON.parse(response.text || '[]');
      aiSignals.forEach((s: any) => {
        signals.push({
          id: crypto.randomUUID(),
          type: s.type || 'strategic',
          severity: s.severity || 'medium',
          message: s.message,
          metadata: { source: 'AI_REASONING' },
          timestamp: new Date()
        });
      });
    } catch (error) {
      console.error("AI Signal Detection failed:", error);
    }

    return signals;
  }

  /**
   * Diagnoses detected signals using management frameworks and AI.
   */
  public async diagnose(signals: Signal[]): Promise<Diagnosis[]> {
    const diagnoses: Diagnosis[] = [];

    for (const signal of signals) {
      try {
        const knowledge = await knowledgeService.getKnowledgeByModule('Diagnosis');
        const response = await this.ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Diagnose this operational signal: ${signal.message}. 
          Use these frameworks/knowledge: ${JSON.stringify(knowledge)}.
          Return JSON with fields: rootCause, frameworkUsed, confidence (0-1), analysis.`,
          config: { responseMimeType: "application/json" }
        });

        const result = JSON.parse(response.text || '{}');
        diagnoses.push({
          signalId: signal.id,
          rootCause: result.rootCause || 'Unknown root cause',
          frameworkUsed: result.frameworkUsed || 'General Analysis',
          confidence: result.confidence || 0.7,
          analysis: result.analysis
        });
      } catch (error) {
        console.error(`Diagnosis failed for signal ${signal.id}:`, error);
        // Fallback to basic logic
        diagnoses.push({
          signalId: signal.id,
          rootCause: 'Manual analysis required due to reasoning engine timeout.',
          frameworkUsed: 'Fallback Logic',
          confidence: 0.5
        });
      }
    }

    return diagnoses;
  }

  /**
   * Generates advisory guidance based on diagnoses.
   */
  public async generateAdvisory(diagnoses: Diagnosis[]): Promise<Advisory[]> {
    const advisories: Advisory[] = [];

    for (const diagnosis of diagnoses) {
      try {
        const knowledge = await knowledgeService.getKnowledgeByModule('Advisory');
        const response = await this.ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Generate a strategic advisory for this diagnosis: ${diagnosis.rootCause}.
          Context: ${diagnosis.analysis}.
          Knowledge: ${JSON.stringify(knowledge)}.
          Return JSON with fields: guidance, priority (1-5), actions (array of strings), rationale.`,
          config: { responseMimeType: "application/json" }
        });

        const result = JSON.parse(response.text || '{}');
        advisories.push({
          diagnosisId: diagnosis.signalId,
          guidance: result.guidance || 'Review operational parameters.',
          priority: result.priority || 3,
          actions: result.actions || ['Consult with department leads'],
          rationale: result.rationale
        });
      } catch (error) {
        console.error(`Advisory generation failed for diagnosis ${diagnosis.signalId}:`, error);
        advisories.push({
          diagnosisId: diagnosis.signalId,
          guidance: 'Standard operational review recommended.',
          priority: 3,
          actions: ['Manual review']
        });
      }
    }

    return advisories;
  }

  /**
   * Proposes structural remedies for long-term improvement.
   */
  public async proposeRemedies(advisories: Advisory[]): Promise<StructuralRemedy[]> {
    const remedies: StructuralRemedy[] = [];

    for (const advisory of advisories) {
      try {
        const knowledge = await knowledgeService.getKnowledgeByModule('Structural');
        const response = await this.ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Propose a structural remedy for this advisory: ${advisory.guidance}.
          Rationale: ${advisory.rationale}.
          Knowledge: ${JSON.stringify(knowledge)}.
          Return JSON with fields: remedyType (org_redesign, process_optimization, resource_reallocation, strategic_pivot), description, impact.`,
          config: { responseMimeType: "application/json" }
        });

        const result = JSON.parse(response.text || '{}');
        remedies.push({
          advisoryId: advisory.diagnosisId,
          remedyType: result.remedyType || 'process_optimization',
          description: result.description || 'General process improvement.',
          impact: result.impact || 'Long-term stability improvement.'
        });
      } catch (error) {
        console.error(`Remedy proposal failed for advisory ${advisory.diagnosisId}:`, error);
      }
    }

    return remedies;
  }
}

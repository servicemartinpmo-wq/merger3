import { GoogleGenAI, Type } from '@google/genai';
import { Initiative } from '@/lib/types';
import { KnowledgeBase } from '@/lib/engine/knowledgeBase';
import { DEPARTMENT_MODULES } from '@/lib/data/departmentModules';

export async function runDepartmentEngine(initiative: Initiative): Promise<{
  priority_score: number;
  dependency_blocker: string[];
  risk_alert: 'Green' | 'Yellow' | 'Red';
  next_action_recommendation: string;
}> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini API key not configured');

  const ai = new GoogleGenAI({ apiKey });
  const deptModule = DEPARTMENT_MODULES[initiative.department];
  
  const prompt = `
    You are an expert PMO Cognitive Engine. Analyze the following initiative based on the ${deptModule ? deptModule.name : 'General PMO'} module.
    
    ${deptModule ? `
    Core Responsibilities: ${deptModule.responsibilities.join(', ')}
    Key Functions: ${deptModule.functions.join(', ')}
    ` : 'General PMO best practices.'}
    
    Initiative: ${initiative.name}
    Description: ${initiative.description}
    
    Step 1: Analyze the initiative against the department's core responsibilities and functions.
    
    Step 2: Based on your analysis, evaluate:
    1. Priority scoring (impact × urgency × leverage)
    2. Dependencies (identify potential blockers)
    3. Risk evaluation (probability × impact)
    
    Return JSON with:
    - priority_score (number 0-100)
    - dependency_blocker (array of strings)
    - risk_alert (string: "Green" | "Yellow" | "Red")
    - next_action_recommendation (string)
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          priority_score: { type: Type.NUMBER },
          dependency_blocker: { type: Type.ARRAY, items: { type: Type.STRING } },
          risk_alert: { type: Type.STRING },
          next_action_recommendation: { type: Type.STRING },
        },
        required: ['priority_score', 'dependency_blocker', 'risk_alert', 'next_action_recommendation'],
      },
    },
  });

  const result = JSON.parse(response.text || '{}');
  
  // Record insights
  KnowledgeBase.recordDecision(initiative.id, result.next_action_recommendation);
  result.dependency_blocker.forEach((blocker: string) => KnowledgeBase.recordRisk(blocker, initiative.department));

  return result;
}

import { GoogleGenAI, Type } from '@google/genai';
import { Initiative } from '@/lib/types';
import { KnowledgeBase } from '@/lib/engine/knowledgeBase';

export interface StructuredPlan {
  raci: {
    responsible: string[];
    accountable: string;
    consulted: string[];
    informed: string[];
  };
  risk_register: {
    risk: string;
    probability: 'Low' | 'Medium' | 'High';
    impact: 'Low' | 'Medium' | 'High';
    mitigation: string;
  }[];
  task_breakdown: {
    task: string;
    department: string;
    owner: string;
  }[];
}

export async function generateStructuredPlan(initiative: Initiative): Promise<StructuredPlan> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini API key not configured');

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are an expert PMO Plan Builder. Create a structured execution plan for the following initiative:
    
    Initiative: ${initiative.name}
    Description: ${initiative.description}
    Department: ${initiative.department}
    
    Generate:
    1. RACI matrix (Responsible, Accountable, Consulted, Informed)
    2. Risk register (top 3 risks with probability, impact, and mitigation)
    3. Task breakdown (key tasks per department)
    
    Return JSON matching the StructuredPlan interface.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          raci: {
            type: Type.OBJECT,
            properties: {
              responsible: { type: Type.ARRAY, items: { type: Type.STRING } },
              accountable: { type: Type.STRING },
              consulted: { type: Type.ARRAY, items: { type: Type.STRING } },
              informed: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['responsible', 'accountable', 'consulted', 'informed'],
          },
          risk_register: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                risk: { type: Type.STRING },
                probability: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
                impact: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
                mitigation: { type: Type.STRING },
              },
              required: ['risk', 'probability', 'impact', 'mitigation'],
            },
          },
          task_breakdown: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                task: { type: Type.STRING },
                department: { type: Type.STRING },
                owner: { type: Type.STRING },
              },
              required: ['task', 'department', 'owner'],
            },
          },
        },
        required: ['raci', 'risk_register', 'task_breakdown'],
      },
    },
  });

  const plan = JSON.parse(response.text || '{}');
  
  // Record insights
  plan.risk_register.forEach((r: any) => KnowledgeBase.recordRisk(r.risk, initiative.department));

  return plan;
}

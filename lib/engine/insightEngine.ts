import { GoogleGenAI, Type } from '@google/genai';
import { Initiative } from '@/lib/types';
import { InsightCard } from '@/lib/types/pmo';
import { getMappingForFramework } from '@/lib/engine/frameworkMapper';

export async function generateInsights(initiatives: Initiative[], healthScore: number): Promise<InsightCard[]> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini API key not configured');

  const ai = new GoogleGenAI({ apiKey });

  // Determine relevant framework based on health score
  const framework = healthScore < 50 ? 'Lean Thinking' : 'OKRs';
  const mapping = getMappingForFramework(framework);

  const prompt = `
    You are the PMO Insight Engine. Analyze the following initiatives and provide executive-level insights.
    
    Context:
    - Current Health Score: ${healthScore}
    - Recommended Framework: ${framework}
    - Framework Mapping: ${JSON.stringify(mapping)}
    
    Initiatives: ${JSON.stringify(initiatives)}
    
    Analyze for:
    1. Supervisory Insights (operational alerts)
    2. Advisory Insights (recommended actions)
    3. Structural/Systems Remedies (organizational fixes)
    
    Return a JSON array of insight cards. Each card MUST have:
    - type: "Supervisory" | "Advisory" | "Structural"
    - situation: string
    - diagnosis: string
    - recommendation: string
    - systemRemedy: string
    - priorityScore: number (0-100)
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING },
            situation: { type: Type.STRING },
            diagnosis: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            systemRemedy: { type: Type.STRING },
            priorityScore: { type: Type.NUMBER },
          },
          required: ['type', 'situation', 'diagnosis', 'recommendation', 'systemRemedy', 'priorityScore'],
        },
      },
    },
  });

  return JSON.parse(response.text || '[]');
}

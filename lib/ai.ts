import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function processIntake(userMessage: string) {
  const prompt = `
    You are Apphia.Kernel, an autonomous Level 1/2 Tech Support AI.
    Analyze the following user issue.
    
    CRITICAL RULES:
    - Explain everything for a non-technical operator.
    - DO NOT use code terms.
    - ALWAYS translate issues into plain English.
    - Provide clear decisions.
    
    User Issue: "${userMessage}"
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ai_summary: { 
            type: Type.STRING, 
            description: "Plain English summary of the root cause." 
          },
          severity: { 
            type: Type.STRING, 
            description: "'low', 'medium', 'high', or 'critical'" 
          },
          risk_level: { 
            type: Type.STRING, 
            description: "'Low' (Safe, reversible), 'Medium' (Some impact), 'High' (Could break system)" 
          },
          confidence_score: { 
            type: Type.NUMBER, 
            description: "0 to 100" 
          },
          recommended_fix: { 
            type: Type.STRING, 
            description: "Plain English description of the fix." 
          },
          impact: { 
            type: Type.STRING, 
            description: "What will happen when this fix is applied." 
          }
        },
        required: ["ai_summary", "severity", "risk_level", "confidence_score", "recommended_fix", "impact"],
      },
    },
  });

  if (response.text) {
    const result = JSON.parse(response.text);
    
    // DECISION ENGINE LOGIC (From Tech-Ops Playbook)
    let action_type = 'continue_diagnosis';
    
    if (result.confidence_score >= 85 && result.risk_level === 'Low') {
      action_type = 'auto_execute_fix';
    } else if (result.confidence_score >= 60 && result.risk_level !== 'High') {
      action_type = 'suggest_fix_to_user';
    } else {
      action_type = 'escalate_to_human';
    }
    
    return { ...result, action_type };
  }
  return null;
}


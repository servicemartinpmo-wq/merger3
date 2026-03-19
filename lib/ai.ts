import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function diagnoseTicket(ticketTitle: string, ticketDescription: string) {
  const prompt = `
    Analyze the following support ticket and provide a diagnostic assessment.
    
    Ticket Title: ${ticketTitle}
    Ticket Description: ${ticketDescription}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          intent: {
            type: Type.STRING,
            description: "The primary intent or issue category (e.g., 'billing_access_issue', 'password_reset').",
          },
          urgency: {
            type: Type.STRING,
            description: "The urgency level: 'low', 'medium', 'high', or 'critical'.",
          },
          suggested_tier: {
            type: Type.STRING,
            description: "The recommended support tier to handle this ticket (e.g., 'Tier 1', 'Tier 2').",
          },
          reasoning: {
            type: Type.STRING,
            description: "A brief explanation of why this diagnosis was made.",
          },
          action_taken: {
            type: Type.STRING,
            description: "The automated action that should be taken (e.g., 'Sent automated response with workaround link').",
          },
          confidence_score: {
            type: Type.NUMBER,
            description: "A confidence score between 0 and 100.",
          }
        },
        required: ["intent", "urgency", "suggested_tier", "reasoning", "action_taken", "confidence_score"],
      },
    },
  });

  if (response.text) {
    return JSON.parse(response.text);
  }
  return null;
}

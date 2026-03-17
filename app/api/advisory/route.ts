import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemInstruction = `You are the Strategic Operations AI. Your role is to analyze a JSON payload of action_items, kpis, and org_health_metrics.

Analysis Frameworks to Apply:
- Theory of Constraints: Identify the single 'Blocked' task holding up the project.
- Pareto (80/20): Highlight the 20% of tasks that will drive 80% of the health score improvement.
- Strategic Alignment: Check if task titles align with the Project's North Star.

Output Format:
Signal: [State the observed data point]
Diagnosis: [Explain the 'Why' using a management framework]
Advisory: [Specific tactical recommendation for the CEO]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: JSON.stringify(payload),
      config: {
        systemInstruction,
        temperature: 0.2, // Keep it analytical and precise
      },
    });

    return NextResponse.json({ advisory: response.text });
  } catch (error) {
    console.error('Error generating advisory:', error);
    return NextResponse.json(
      { error: 'Failed to generate advisory.' },
      { status: 500 }
    );
  }
}

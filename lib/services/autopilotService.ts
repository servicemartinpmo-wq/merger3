import { GoogleGenAI, Type } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const autopilotService = {
  generateProjectPlan: async (goal: string, orgId: string) => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a project plan for the goal: "${goal}". Return JSON with: name (string), tasks (array of {title, description, timeline_start, timeline_end}), kpis (array of {name, target_value, unit}).`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  timeline_start: { type: Type.STRING },
                  timeline_end: { type: Type.STRING },
                },
                required: ['title', 'description', 'timeline_start', 'timeline_end'],
              },
            },
            kpis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  target_value: { type: Type.NUMBER },
                  unit: { type: Type.STRING },
                },
                required: ['name', 'target_value', 'unit'],
              },
            },
          },
          required: ['name', 'tasks', 'kpis'],
        },
      },
    });

    const plan = JSON.parse(response.text!);

    // Save to Supabase
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({ org_id: orgId, name: plan.name, goal })
      .select()
      .single();

    if (projectError) throw projectError;

    const tasks = plan.tasks.map((t: any) => ({ ...t, project_id: project.id }));
    const kpis = plan.kpis.map((k: any) => ({ ...k, project_id: project.id }));

    await supabase.from('project_tasks').insert(tasks);
    await supabase.from('project_kpis').insert(kpis);

    return project;
  },
};

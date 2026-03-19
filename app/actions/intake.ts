'use server';

import { processIntake } from '@/lib/ai';

export async function submitIntakeIssue(message: string) {
  try {
    const diagnosis = await processIntake(message);
    return { success: true, data: diagnosis };
  } catch (error) {
    console.error("Intake processing failed:", error);
    return { success: false, error: "Failed to process issue." };
  }
}

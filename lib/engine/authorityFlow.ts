import { Initiative } from '@/lib/types';

const STRATEGIC_OBJECTIVES = [
  'Accelerate customer portal v2 adoption',
  'Improve operational efficiency by 15%',
  'Expand market share in EMEA region'
];

export interface AuthorityCheckResult {
  isAligned: boolean;
  hasStructure: boolean;
  message: string;
}

export async function runAuthorityCheck(initiative: Initiative): Promise<AuthorityCheckResult> {
  // 1. Strategic Clarity Check (Simple keyword matching for MVP)
  const isAligned = STRATEGIC_OBJECTIVES.some(obj => 
    initiative.description.toLowerCase().includes(obj.toLowerCase()) ||
    initiative.name.toLowerCase().includes(obj.toLowerCase())
  );

  // 2. Structural Integrity Check
  const hasStructure = !!initiative.owner && (!!initiative.plan || initiative.status !== 'Pending');

  if (!isAligned) {
    return { isAligned, hasStructure, message: 'Initiative lacks strategic alignment with top objectives.' };
  }

  if (!hasStructure) {
    return { isAligned, hasStructure, message: 'Initiative lacks clear ownership or structural plan.' };
  }

  return { isAligned, hasStructure, message: 'Authority check passed.' };
}

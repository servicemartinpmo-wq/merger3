// server/frameworks/registry.ts
import { calculateBalancedScorecard } from './balanced-scorecard';

export const frameworkRegistry: { [key: string]: (data: any) => any } = {
  'balanced-scorecard': calculateBalancedScorecard,
  // Add other frameworks here as they are implemented
};

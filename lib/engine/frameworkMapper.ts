import { DiagnosticQuestion, DecisionRule } from '@/lib/types/pmo';

export interface FrameworkMapping {
  questions: DiagnosticQuestion[];
  rules: DecisionRule[];
}

export const FRAMEWORK_MAPPING: Record<string, FrameworkMapping> = {
  'Porter’s Five Forces': {
    questions: [
      { id: 'p5f-1', question: 'How high are the barriers to entry in your market?', framework: 'Porter’s Five Forces', department: 'strategy' },
      { id: 'p5f-2', question: 'How much power do your suppliers have?', framework: 'Porter’s Five Forces', department: 'operations' },
    ],
    rules: [
      { id: 'p5f-rule-1', condition: 'High supplier power', action: 'Diversify supplier base', framework: 'Porter’s Five Forces' },
    ]
  },
  'Lean Thinking': {
    questions: [
      { id: 'lean-1', question: 'What steps in your process do not add value to the customer?', framework: 'Lean Thinking', department: 'operations' },
    ],
    rules: [
      { id: 'lean-rule-1', condition: 'Value-add steps < 20%', action: 'Initiate process re-engineering', framework: 'Lean Thinking' },
    ]
  },
  'OKRs': {
    questions: [
      { id: 'okr-1', question: 'Are your objectives ambitious and measurable?', framework: 'OKRs', department: 'strategy' },
    ],
    rules: [
      { id: 'okr-rule-1', condition: 'Objective completion < 70%', action: 'Review resource allocation', framework: 'OKRs' },
    ]
  },
  'Customer Lifetime Value': {
    questions: [
      { id: 'cltv-1', question: 'What is your current Customer Acquisition Cost (CAC)?', framework: 'Customer Lifetime Value', department: 'marketing' },
      { id: 'cltv-2', question: 'What is your current Churn Rate?', framework: 'Customer Lifetime Value', department: 'marketing' },
      { id: 'cltv-3', question: 'What is your Net Revenue Retention (NRR)?', framework: 'Customer Lifetime Value', department: 'finance' },
    ],
    rules: [
      { id: 'cltv-rule-1', condition: 'LTV / CAC < 3', action: 'Optimize acquisition channels or increase ARPU', framework: 'Customer Lifetime Value' },
      { id: 'cltv-rule-2', condition: 'Churn Rate > 5% monthly', action: 'Investigate product-market fit and customer success', framework: 'Customer Lifetime Value' },
    ]
  }
};

export const getMappingForFramework = (framework: string): FrameworkMapping | undefined => {
  return FRAMEWORK_MAPPING[framework];
};

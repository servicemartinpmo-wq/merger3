export type RiskLevel = 'Green' | 'Yellow' | 'Red';

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

export interface Initiative {
  id: string;
  name: string;
  department: 'Executive' | 'Strategy' | 'Product' | 'Operations' | 'Finance' | 'HR' | 'Marketing' | 'Legal' | 'PM' | 'IT' | 'CX' | 'Sales' | 'Data' | 'Ops';
  priority_score: number;
  strategic_alignment: number;
  dependency_risk: number;
  estimated_impact: number;
  risk_alert: RiskLevel;
  dependency_blocker: string[];
  next_action_recommendation: string;
  owner: string;
  status: 'Pending' | 'In Progress' | 'Blocked' | 'Complete';
  description: string;
  plan?: StructuredPlan;
}

export type IndustryMode = 'creative' | 'freelancer' | 'SMB' | 'executive' | 'healthcare' | 'start-up';

export interface InsightCard {
  type: "Supervisory" | "Advisory" | "Structural";
  situation: string;
  diagnosis: string;
  recommendation: string;
  systemRemedy: string;
  priorityScore: number;
}

export interface MaturityScore {
  total: number;
  tier: string;
  strategicAlignment: number;
  executionDiscipline: number;
  operationalCapacity: number;
  processStructure: number;
  riskManagement: number;
}

export interface StrategicGoal {
  id: string;
  org_id: string;
  title: string;
  description: string;
  target_metric: string;
  target_value: number;
  deadline: string;
  status: string;
  created_at: string;
}

export interface StrategicInitiative {
  id: string;
  goal_id: string;
  title: string;
  description: string;
  priority_score: number;
  status: string;
  owner_id: string;
  created_at: string;
}

export interface OperationalMetric {
  id: string;
  org_id: string;
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  recorded_at: string;
}

export interface AlgorithmSignal {
  id: string;
  organization_id: string;
  campaign_id: string;
  platform: string;
  signal_type: string;
  metric_name: string;
  metric_value: number;
  recorded_at: string;
}

export interface AlgorithmScore {
  id: string;
  campaign_id: string;
  engagement_score: number;
  relevance_score: number;
  conversion_score: number;
  authority_score: number;
  freshness_score: number;
  network_score: number;
  efficiency_score: number;
  mega_algorithm_score: number;
  calculated_at: string;
}

export interface Project {
  id: string;
  org_id: string;
  name: string;
  goal: string;
  status: string;
  created_at: string;
}

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  description: string;
  dependency_ids: string[];
  timeline_start: string;
  timeline_end: string;
  status: string;
}

export interface ProjectKPI {
  id: string;
  project_id: string;
  name: string;
  target_value: number;
  unit: string;
}

export interface DiagnosticQuestion {
  id: string;
  question: string;
  framework: string;
  department: string;
}

export interface DecisionRule {
  id: string;
  condition: string;
  action: string;
  framework: string;
}

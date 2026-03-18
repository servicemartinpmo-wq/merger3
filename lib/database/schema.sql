-- STRATEGY INTELLIGENCE MODULE
CREATE TABLE strategic_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid,
  title text,
  description text,
  target_metric text,
  target_value numeric,
  deadline date,
  status text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE strategic_initiatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid REFERENCES strategic_goals(id),
  title text,
  description text,
  priority_score numeric,
  status text,
  owner_id uuid,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE industry_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid,
  industry text,
  competition_score numeric,
  supplier_power numeric,
  buyer_power numeric,
  substitute_threat numeric,
  entry_barrier numeric,
  analysis_summary text,
  created_at timestamptz DEFAULT now()
);

-- OPERATIONS INTELLIGENCE MODULE
CREATE TABLE operational_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid,
  metric_name text,
  metric_value numeric,
  metric_unit text,
  recorded_at timestamptz DEFAULT now()
);

CREATE TABLE process_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid,
  process_name text,
  issue_type text,
  severity text,
  description text,
  resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- MARKETING INTELLIGENCE MODULE
CREATE TABLE algorithm_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid,
  campaign_id text,
  platform text,
  signal_type text,
  metric_name text,
  metric_value numeric,
  recorded_at timestamp DEFAULT now()
);

CREATE TABLE algorithm_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id text,
  engagement_score numeric,
  relevance_score numeric,
  conversion_score numeric,
  authority_score numeric,
  freshness_score numeric,
  network_score numeric,
  efficiency_score numeric,
  mega_algorithm_score numeric,
  calculated_at timestamp DEFAULT now()
);

CREATE TABLE campaign_ai_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id text,
  mega_score numeric,
  diagnosis text,
  recommendation text,
  predicted_lead_change numeric,
  predicted_revenue_change numeric,
  created_at timestamp DEFAULT now()
);

-- FUNCTIONS AND TRIGGERS
-- Marketing Scoring Logic
CREATE OR REPLACE FUNCTION calculate_algorithm_score(campaign_id_in TEXT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
   engagement NUMERIC;
   relevance NUMERIC;
   conversion NUMERIC;
   authority NUMERIC;
   freshness NUMERIC;
   network NUMERIC;
   efficiency NUMERIC;
   mega_score NUMERIC;
BEGIN
   SELECT AVG(metric_value) INTO engagement FROM algorithm_signals WHERE campaign_id = campaign_id_in AND signal_type = 'engagement';
   SELECT AVG(metric_value) INTO relevance FROM algorithm_signals WHERE campaign_id = campaign_id_in AND signal_type = 'relevance';
   SELECT AVG(metric_value) INTO conversion FROM algorithm_signals WHERE campaign_id = campaign_id_in AND signal_type = 'conversion';
   SELECT AVG(metric_value) INTO authority FROM algorithm_signals WHERE campaign_id = campaign_id_in AND signal_type = 'authority';
   SELECT AVG(metric_value) INTO freshness FROM algorithm_signals WHERE campaign_id = campaign_id_in AND signal_type = 'freshness';
   SELECT AVG(metric_value) INTO network FROM algorithm_signals WHERE campaign_id = campaign_id_in AND signal_type = 'network';
   SELECT AVG(metric_value) INTO efficiency FROM algorithm_signals WHERE campaign_id = campaign_id_in AND signal_type = 'efficiency';

   mega_score := 0.20 * COALESCE(engagement,0) + 0.20 * COALESCE(relevance,0) + 0.20 * COALESCE(conversion,0) + 0.15 * COALESCE(authority,0) + 0.10 * COALESCE(freshness,0) + 0.10 * COALESCE(network,0) + 0.05 * COALESCE(efficiency,0);

   INSERT INTO algorithm_scores (campaign_id, engagement_score, relevance_score, conversion_score, authority_score, freshness_score, network_score, efficiency_score, mega_algorithm_score)
   VALUES (campaign_id_in, engagement, relevance, conversion, authority, freshness, network, efficiency, mega_score);
END;
$$;

CREATE OR REPLACE FUNCTION trigger_algorithm_score()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
 PERFORM calculate_algorithm_score(NEW.campaign_id);
 RETURN NEW;
END;
$$;

CREATE TRIGGER run_algorithm_scoring
AFTER INSERT ON algorithm_signals
FOR EACH ROW
EXECUTE FUNCTION trigger_algorithm_score();

-- AI PROJECT AUTOPILOT
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid,
  name text,
  goal text,
  status text DEFAULT 'planning',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE project_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id),
  title text,
  description text,
  dependency_ids uuid[],
  timeline_start date,
  timeline_end date,
  status text DEFAULT 'pending'
);

CREATE TABLE project_kpis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id),
  name text,
  target_value numeric,
  unit text
);

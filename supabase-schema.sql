-- Core Operational Tables
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid, -- REFERENCES organizations(id)
  title text NOT NULL,
  status text CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  priority text CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  start_date date,
  end_date date,
  budget numeric,
  health_score int DEFAULT 100
);

CREATE TABLE public.action_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id),
  organization_id uuid NOT NULL,
  owner_id uuid, -- REFERENCES auth.users(id)
  title text NOT NULL,
  status text DEFAULT 'pending', -- pending, in_progress, completed, blocked
  priority text,
  due_date date,
  task_time_estimate_minutes numeric,
  completed_at timestamptz,
  dependency_id uuid REFERENCES action_items(id) -- Simple dependency link
);

-- The Intelligence Layer Tables
CREATE TABLE public.kpis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  title text NOT NULL,
  target_value numeric,
  current_value numeric,
  recorded_month text
);

CREATE TABLE public.org_jobs (
  id text PRIMARY KEY,
  organization_id uuid NOT NULL,
  process_name text NOT NULL,
  status text CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  duration text,
  started_at timestamptz DEFAULT now()
);

CREATE TABLE public.algorithm_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id text, -- ID from external systems (Meta/Google)
  engagement_score numeric,
  relevance_score numeric,
  conversion_score numeric,
  authority_score numeric,
  freshness_score numeric,
  efficiency_score numeric,
  mega_algorithm_score numeric GENERATED ALWAYS AS (
    (engagement_score * 0.2) + (relevance_score * 0.15) + (freshness_score * 0.25) + (efficiency_score * 0.4)
  ) STORED,
  calculated_at timestamptz DEFAULT now()
);

CREATE TABLE public.org_health_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  completion_rate numeric,
  overdue_rate numeric,
  cycle_time_avg_seconds numeric,
  team_focus_score numeric, -- Calculated as (Completed Tasks / Active Tasks)
  overall_health_score int,
  recorded_at timestamptz DEFAULT now()
);

-- The "Health Intelligence" Routine (PL/pgSQL)
CREATE OR REPLACE FUNCTION compute_and_store_org_health_metrics(p_org_id uuid)
RETURNS void AS $$
DECLARE
  v_overdue_count int;
  v_active_count int;
  v_completed_count int;
  v_avg_cycle_time interval;
BEGIN
  -- 1. Calculate metrics
  SELECT count(*) INTO v_overdue_count FROM action_items 
  WHERE organization_id = p_org_id AND due_date < now() AND status != 'completed';

  SELECT count(*) INTO v_active_count FROM action_items 
  WHERE organization_id = p_org_id AND status != 'completed';

  -- 2. Insert into health table
  INSERT INTO org_health_metrics (org_id, overdue_rate, overall_health_score)
  VALUES (
    p_org_id, 
    (v_overdue_count::float / NULLIF(v_active_count, 0)),
    (100 - (v_overdue_count * 5)) -- Simplified health deduction
  );
END;
$$ LANGUAGE plpgsql;

-- Event-Driven: Supabase Triggers for real-time updates
CREATE OR REPLACE FUNCTION enqueue_update_notification_v2()
RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify(
    'table_update',
    json_build_object(
      'table', TG_TABLE_NAME,
      'action', TG_OP,
      'record', row_to_json(NEW)
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER action_items_notify_trigger
AFTER INSERT OR UPDATE ON action_items
FOR EACH ROW EXECUTE FUNCTION enqueue_update_notification_v2();

CREATE TRIGGER algorithm_scores_notify_trigger
AFTER INSERT OR UPDATE ON algorithm_scores
FOR EACH ROW EXECUTE FUNCTION enqueue_update_notification_v2();

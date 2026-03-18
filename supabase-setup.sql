-- Supabase Setup Script
-- Run this in your Supabase SQL Editor to create the necessary tables

-- Create Tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  subject TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL CHECK (status IN ('open', 'in-progress', 'closed')),
  agent TEXT DEFAULT 'Unassigned',
  user_id UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own tickets" ON tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tickets" ON tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tickets" ON tickets
  FOR UPDATE USING (auth.uid() = user_id);

-- Create Emails table (for Email Intelligence)
CREATE TABLE IF NOT EXISTS emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  subject TEXT NOT NULL,
  sender TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  extracted JSONB,
  user_id UUID REFERENCES auth.users(id)
);

ALTER TABLE emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own emails" ON emails
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own emails" ON emails
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create initiatives table
CREATE TABLE IF NOT EXISTS initiatives (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'on-track',
  owner TEXT NOT NULL,
  department TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for initiatives
ALTER TABLE initiatives ENABLE ROW LEVEL SECURITY;

-- Create policies for initiatives
CREATE POLICY "Users can only see their own initiatives" ON initiatives
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own initiatives" ON initiatives
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create action_items table
CREATE TABLE IF NOT EXISTS action_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  owner TEXT NOT NULL,
  date TEXT,
  directive TEXT,
  priority TEXT DEFAULT 'Medium',
  category TEXT DEFAULT 'Action Items',
  email_id UUID REFERENCES emails(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for action_items
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;

-- Create policies for action_items
CREATE POLICY "Users can only see their own action_items" ON action_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own action_items" ON action_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for meetings
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Create policies for meetings
CREATE POLICY "Users can only see their own meetings" ON meetings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own meetings" ON meetings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme JSONB DEFAULT '{"primary": "#3b82f6", "accent": "#10b981", "wallpaper": "https://picsum.photos/seed/command/1920/1080"}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for user_settings
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for user_settings
CREATE POLICY "Users can only see their own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Create plans table
CREATE TABLE IF NOT EXISTS plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  owner TEXT NOT NULL,
  outcome TEXT NOT NULL,
  cadence TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'green',
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for plans
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

-- Create policies for plans
CREATE POLICY "Users can only see their own plans" ON plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own plans" ON plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create systems table
CREATE TABLE IF NOT EXISTS systems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  purpose TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for systems
ALTER TABLE systems ENABLE ROW LEVEL SECURITY;

-- Create policies for systems
CREATE POLICY "Users can only see their own systems" ON systems
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own systems" ON systems
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create resource_hub table
CREATE TABLE IF NOT EXISTS resource_hub (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'template', 'workflow', 'sop'
  department TEXT NOT NULL,
  problem TEXT NOT NULL,
  purpose TEXT,
  past_use TEXT,
  relevance TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for resource_hub
ALTER TABLE resource_hub ENABLE ROW LEVEL SECURITY;

-- Create policies for resource_hub
CREATE POLICY "Users can only see their own resources" ON resource_hub
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own resources" ON resource_hub
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL, -- 'Manager', 'Owner', 'Consulted', 'Helped', 'Accountable'
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for team_members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create policies for team_members
CREATE POLICY "Users can only see their own team members" ON team_members
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own team members" ON team_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create team_updates table
CREATE TABLE IF NOT EXISTS team_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for team_updates
ALTER TABLE team_updates ENABLE ROW LEVEL SECURITY;

-- Create policies for team_updates
CREATE POLICY "Users can only see their own team updates" ON team_updates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own team updates" ON team_updates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

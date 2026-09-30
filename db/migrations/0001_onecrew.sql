CREATE SCHEMA IF NOT EXISTS onecrew;

CREATE TABLE IF NOT EXISTS onecrew.workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_key text NOT NULL UNIQUE,
  name text NOT NULL DEFAULT 'My company',
  theme text NOT NULL DEFAULT 'light' CHECK (theme IN ('light','dark')),
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS onecrew.agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES onecrew.workspaces(id) ON DELETE CASCADE,
  slug text NOT NULL,
  name text NOT NULL,
  role text NOT NULL,
  status text NOT NULL DEFAULT 'online',
  current_task text NOT NULL DEFAULT '',
  progress integer NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  accent text NOT NULL DEFAULT '#6B5CFF',
  avatar text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, slug)
);

CREATE TABLE IF NOT EXISTS onecrew.missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES onecrew.workspaces(id) ON DELETE CASCADE,
  title text NOT NULL,
  owner_slug text NOT NULL DEFAULT 'atlas',
  progress integer NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  status text NOT NULL DEFAULT 'planning',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS onecrew_missions_workspace_created_idx
ON onecrew.missions (workspace_id, created_at DESC);

CREATE TABLE IF NOT EXISTS onecrew.approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES onecrew.workspaces(id) ON DELETE CASCADE,
  agent_slug text NOT NULL,
  title text NOT NULL,
  action_type text NOT NULL DEFAULT 'External action',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','changes')),
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

CREATE INDEX IF NOT EXISTS onecrew_approvals_workspace_status_idx
ON onecrew.approvals (workspace_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS onecrew.activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES onecrew.workspaces(id) ON DELETE CASCADE,
  agent_slug text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS onecrew_activity_workspace_created_idx
ON onecrew.activity (workspace_id, created_at DESC);

CREATE TABLE IF NOT EXISTS onecrew.knowledge (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES onecrew.workspaces(id) ON DELETE CASCADE,
  title text NOT NULL,
  kind text NOT NULL DEFAULT 'Company knowledge',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS onecrew_knowledge_workspace_created_idx
ON onecrew.knowledge (workspace_id, created_at DESC);

CREATE TABLE IF NOT EXISTS onecrew.integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES onecrew.workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  connected boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, name)
);

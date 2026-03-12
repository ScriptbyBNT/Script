-- ============================================================
-- SCRIPT APP — Supabase Setup
-- Run this entire file in: Supabase → SQL Editor → New Query
-- ============================================================

-- 1. Create the main data table
CREATE TABLE IF NOT EXISTS script_data (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  section     text NOT NULL,
  value       jsonb,
  updated_at  timestamptz DEFAULT now(),
  UNIQUE(user_id, section)
);

-- 2. Enable Row Level Security (users only see their OWN data)
ALTER TABLE script_data ENABLE ROW LEVEL SECURITY;

-- 3. Policy: users can only read their own rows
CREATE POLICY "Users read own data"
  ON script_data FOR SELECT
  USING (auth.uid() = user_id);

-- 4. Policy: users can insert their own rows
CREATE POLICY "Users insert own data"
  ON script_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. Policy: users can update their own rows
CREATE POLICY "Users update own data"
  ON script_data FOR UPDATE
  USING (auth.uid() = user_id);

-- 6. Policy: users can delete their own rows
CREATE POLICY "Users delete own data"
  ON script_data FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- DONE! Your database is ready.
-- ============================================================

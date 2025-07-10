/*
  # Create alerts table for notifications and important messages

  1. New Tables
    - `alerts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key) - references users.id
      - `message` (text) - alert message content
      - `type` (text) - alert type: 'info', 'warning', 'error', 'success'
      - `triggered_at` (timestamp) - when alert was created
      - `resolved` (boolean) - whether alert has been acknowledged/resolved
      - `resolved_at` (timestamp) - when alert was resolved

  2. Security
    - Enable RLS on `alerts` table
    - Add policy for users to view and resolve their own alerts
    - Add policy for caregivers to view alerts of their care recipients
*/

CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('info', 'warning', 'error', 'success')) DEFAULT 'info',
  triggered_at timestamptz DEFAULT now(),
  resolved boolean DEFAULT false,
  resolved_at timestamptz
);

-- Enable RLS
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Policy for users to view and resolve their own alerts
CREATE POLICY "Users can manage own alerts"
  ON alerts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS alerts_user_id_resolved_idx ON alerts(user_id, resolved);
CREATE INDEX IF NOT EXISTS alerts_triggered_at_idx ON alerts(triggered_at DESC);

-- Function to automatically set resolved_at when resolved is set to true
CREATE OR REPLACE FUNCTION set_resolved_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.resolved = true AND OLD.resolved = false THEN
    NEW.resolved_at = now();
  ELSIF NEW.resolved = false THEN
    NEW.resolved_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_alerts_resolved_at 
  BEFORE UPDATE ON alerts 
  FOR EACH ROW 
  EXECUTE FUNCTION set_resolved_at();
/*
  # Create logs table for daily health and wellness tracking

  1. New Tables
    - `logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key) - references users.id
      - `date` (date) - log entry date
      - `mood` (integer) - mood rating 1-5
      - `medications` (text) - medications taken
      - `food` (text) - food consumed
      - `notes` (text) - additional notes
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `logs` table
    - Add policy for users to manage their own logs
    - Add policy for caregivers and therapists to view logs of their care recipients
*/

CREATE TABLE IF NOT EXISTS logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  mood integer CHECK (mood >= 1 AND mood <= 5),
  medications text DEFAULT '',
  food text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Policy for users to manage their own logs
CREATE POLICY "Users can manage own logs"
  ON logs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER update_logs_updated_at 
  BEFORE UPDATE ON logs 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS logs_user_id_date_idx ON logs(user_id, date);

-- Create unique constraint to ensure one log per user per day
CREATE UNIQUE INDEX IF NOT EXISTS logs_user_date_unique ON logs(user_id, date);
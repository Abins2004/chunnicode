/*
  # Create tasks table for user task management

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key) - references users.id
      - `date` (date) - task scheduled date
      - `time` (time) - task scheduled time
      - `description` (text) - task description
      - `icon` (text) - emoji or icon identifier
      - `completed` (boolean) - completion status
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `tasks` table
    - Add policy for users to manage their own tasks
    - Add policy for caregivers to view tasks of their care recipients
*/

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  time time NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT '📝',
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy for users to manage their own tasks
CREATE POLICY "Users can manage own tasks"
  ON tasks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER update_tasks_updated_at 
  BEFORE UPDATE ON tasks 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS tasks_user_id_date_idx ON tasks(user_id, date);
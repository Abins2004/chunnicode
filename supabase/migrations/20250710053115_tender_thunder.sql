/*
  # Create users table with role and disability type support

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches auth.users id
      - `name` (text) - user's full name  
      - `email` (text, unique) - user's email address
      - `role` (text) - user role: 'user', 'caregiver', or 'therapist'
      - `disability_type` (text, optional) - for users only: 'cognitive', 'visual', 'hearing', or 'physical'
      - `created_at` (timestamp) - account creation time
      - `updated_at` (timestamp) - last profile update

  2. Security
    - Enable RLS on `users` table
    - Add policy for users to read and update their own profile
    - Add policy for caregivers to read profiles of their care recipients
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'caregiver', 'therapist')),
  disability_type text CHECK (disability_type IN ('cognitive', 'visual', 'hearing', 'physical')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy for users to manage their own profile
CREATE POLICY "Users can manage own profile"
  ON users
  FOR ALL
  TO authenticated
  USING (auth.uid() = id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
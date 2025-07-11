/*
  # Add Sign Language Support for Hearing Impaired Users

  1. New Tables
    - `sign_language_gestures` - Store sign language gesture mappings
    - `user_preferences` - Store user interface preferences
  
  2. Updates
    - Add visual_feedback_enabled column to users table
    - Add gesture support for alerts and tasks
  
  3. Security
    - Enable RLS on new tables
    - Add policies for user access
*/

-- Add visual feedback preference to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'visual_feedback_enabled'
  ) THEN
    ALTER TABLE users ADD COLUMN visual_feedback_enabled boolean DEFAULT true;
  END IF;
END $$;

-- Create sign language gestures table
CREATE TABLE IF NOT EXISTS sign_language_gestures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gesture_key text UNIQUE NOT NULL,
  emoji text NOT NULL,
  description text NOT NULL,
  category text DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);

-- Create user preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  preference_key text NOT NULL,
  preference_value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, preference_key)
);

-- Enable RLS
ALTER TABLE sign_language_gestures ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sign_language_gestures (public read access)
CREATE POLICY "Anyone can view sign language gestures"
  ON sign_language_gestures
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_preferences
CREATE POLICY "Users can manage own preferences"
  ON user_preferences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert sign language gestures
INSERT INTO sign_language_gestures (gesture_key, emoji, description, category) VALUES
  ('hello', '👋', 'Greeting gesture', 'social'),
  ('good', '👍', 'Positive feedback', 'feedback'),
  ('bad', '👎', 'Negative feedback', 'feedback'),
  ('help', '🆘', 'Request for assistance', 'emergency'),
  ('medicine', '💊', 'Medication related', 'health'),
  ('food', '🍎', 'Food and nutrition', 'health'),
  ('water', '💧', 'Water and hydration', 'health'),
  ('sleep', '😴', 'Sleep and rest', 'health'),
  ('happy', '😊', 'Happy emotion', 'emotion'),
  ('sad', '😢', 'Sad emotion', 'emotion'),
  ('pain', '😣', 'Pain or discomfort', 'health'),
  ('ok', '👌', 'Everything is okay', 'feedback'),
  ('yes', '✅', 'Affirmative response', 'response'),
  ('no', '❌', 'Negative response', 'response'),
  ('emergency', '🚨', 'Emergency situation', 'emergency'),
  ('doctor', '👨‍⚕️', 'Medical professional', 'people'),
  ('family', '👨‍👩‍👧‍👦', 'Family members', 'people'),
  ('time', '⏰', 'Time related', 'general'),
  ('task', '📋', 'Task or activity', 'general'),
  ('complete', '✅', 'Task completed', 'status')
ON CONFLICT (gesture_key) DO NOTHING;

-- Add trigger for updated_at on user_preferences
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
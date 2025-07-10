/*
  # Add sample data for AbleLink application

  1. Sample Users
    - Create users with different roles and disability types
    - Include specially-abled users, caregivers, and therapists

  2. Sample Tasks
    - Daily tasks for users with different times and descriptions
    - Mix of completed and pending tasks

  3. Sample Logs
    - Health and wellness logs with mood, medications, food, and notes
    - Recent entries for tracking progress

  4. Sample Alerts
    - Various types of alerts (info, warning, error, success)
    - Mix of resolved and unresolved alerts
*/

-- Insert sample users
INSERT INTO users (id, name, email, role, disability_type) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Alex Johnson', 'alex@example.com', 'user', 'cognitive'),
  ('22222222-2222-2222-2222-222222222222', 'Sarah Williams', 'sarah@example.com', 'user', 'visual'),
  ('33333333-3333-3333-3333-333333333333', 'Mike Chen', 'mike@example.com', 'user', 'hearing'),
  ('44444444-4444-4444-4444-444444444444', 'Emma Davis', 'emma@example.com', 'user', 'physical'),
  ('55555555-5555-5555-5555-555555555555', 'Dr. Lisa Rodriguez', 'lisa@example.com', 'therapist', NULL),
  ('66666666-6666-6666-6666-666666666666', 'John Smith', 'john@example.com', 'caregiver', NULL),
  ('77777777-7777-7777-7777-777777777777', 'Maria Garcia', 'maria@example.com', 'caregiver', NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert sample tasks for today and recent days
INSERT INTO tasks (user_id, date, time, description, icon, completed) VALUES
  -- Alex Johnson (cognitive) - today's tasks
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE, '08:00:00', 'Take morning medication', '💊', true),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE, '08:30:00', 'Eat breakfast', '🍳', true),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE, '09:00:00', 'Brush teeth', '🦷', true),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE, '10:00:00', 'Morning exercise', '🏃', false),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE, '14:00:00', 'Lunch time', '🥗', false),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE, '18:00:00', 'Evening medication', '💊', false),
  
  -- Sarah Williams (visual) - today's tasks
  ('22222222-2222-2222-2222-222222222222', CURRENT_DATE, '07:30:00', 'Morning routine', '🌅', true),
  ('22222222-2222-2222-2222-222222222222', CURRENT_DATE, '09:00:00', 'Reading practice', '📖', true),
  ('22222222-2222-2222-2222-222222222222', CURRENT_DATE, '11:00:00', 'Mobility training', '🦯', false),
  ('22222222-2222-2222-2222-222222222222', CURRENT_DATE, '15:00:00', 'Audio book session', '🎧', false),
  
  -- Mike Chen (hearing) - today's tasks
  ('33333333-3333-3333-3333-333333333333', CURRENT_DATE, '08:00:00', 'Sign language practice', '👋', true),
  ('33333333-3333-3333-3333-333333333333', CURRENT_DATE, '10:00:00', 'Visual communication exercise', '👁️', false),
  ('33333333-3333-3333-3333-333333333333', CURRENT_DATE, '14:00:00', 'Technology training', '💻', false),
  
  -- Emma Davis (physical) - today's tasks
  ('44444444-4444-4444-4444-444444444444', CURRENT_DATE, '09:00:00', 'Physical therapy', '🏥', true),
  ('44444444-4444-4444-4444-444444444444', CURRENT_DATE, '11:00:00', 'Adaptive equipment practice', '🛠️', false),
  ('44444444-4444-4444-4444-444444444444', CURRENT_DATE, '16:00:00', 'Strength exercises', '💪', false)
ON CONFLICT DO NOTHING;

-- Insert sample logs
INSERT INTO logs (user_id, date, mood, medications, food, notes) VALUES
  -- Recent logs for Alex Johnson
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE, 4, 'Morning: Adderall 10mg', 'Breakfast: Oatmeal with berries', 'Feeling focused today, completed morning tasks well'),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '1 day', 3, 'Morning: Adderall 10mg, Evening: Melatonin 3mg', 'Regular meals throughout the day', 'Had some difficulty concentrating in the afternoon'),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '2 days', 5, 'Morning: Adderall 10mg, Evening: Melatonin 3mg', 'Healthy meals, extra protein', 'Excellent day! Completed all tasks ahead of schedule'),
  
  -- Recent logs for Sarah Williams
  ('22222222-2222-2222-2222-222222222222', CURRENT_DATE, 4, 'Eye drops as prescribed', 'Nutritious meals with vitamin A', 'Navigation training went well today'),
  ('22222222-2222-2222-2222-222222222222', CURRENT_DATE - INTERVAL '1 day', 3, 'Eye drops, pain medication', 'Light meals due to headache', 'Challenging day with mobility, but made progress'),
  
  -- Recent logs for Mike Chen
  ('33333333-3333-3333-3333-333333333333', CURRENT_DATE, 5, 'None required', 'Regular balanced meals', 'Great progress with new communication app'),
  ('33333333-3333-3333-3333-333333333333', CURRENT_DATE - INTERVAL '1 day', 4, 'None required', 'Tried new recipes', 'Enjoyed cooking class, learned new techniques'),
  
  -- Recent logs for Emma Davis
  ('44444444-4444-4444-4444-444444444444', CURRENT_DATE, 3, 'Pain management as needed', 'High-protein meals for recovery', 'Physical therapy session was intensive but productive'),
  ('44444444-4444-4444-4444-444444444444', CURRENT_DATE - INTERVAL '1 day', 4, 'Morning pain medication', 'Regular meals with supplements', 'Good mobility day, used new adaptive equipment successfully')
ON CONFLICT (user_id, date) DO NOTHING;

-- Insert sample alerts
INSERT INTO alerts (user_id, message, type, triggered_at, resolved) VALUES
  -- Active alerts
  ('11111111-1111-1111-1111-111111111111', 'Time for your afternoon medication', 'warning', NOW() - INTERVAL '30 minutes', false),
  ('11111111-1111-1111-1111-111111111111', 'Reminder: Therapy appointment tomorrow at 2 PM', 'info', NOW() - INTERVAL '2 hours', false),
  ('22222222-2222-2222-2222-222222222222', 'Low battery on assistive device', 'warning', NOW() - INTERVAL '1 hour', false),
  ('33333333-3333-3333-3333-333333333333', 'New message from your caregiver', 'info', NOW() - INTERVAL '15 minutes', false),
  ('44444444-4444-4444-4444-444444444444', 'Physical therapy session rescheduled', 'info', NOW() - INTERVAL '3 hours', false),
  
  -- Resolved alerts (for history)
  ('11111111-1111-1111-1111-111111111111', 'Morning medication reminder', 'success', NOW() - INTERVAL '4 hours', true),
  ('22222222-2222-2222-2222-222222222222', 'Navigation training completed successfully', 'success', NOW() - INTERVAL '6 hours', true),
  ('33333333-3333-3333-3333-333333333333', 'Communication device updated', 'success', NOW() - INTERVAL '1 day', true),
  ('44444444-4444-4444-4444-444444444444', 'Equipment maintenance completed', 'success', NOW() - INTERVAL '2 days', true)
ON CONFLICT DO NOTHING;

-- Add some historical tasks for progress tracking
INSERT INTO tasks (user_id, date, time, description, icon, completed) VALUES
  -- Yesterday's tasks (mostly completed for progress tracking)
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '1 day', '08:00:00', 'Take morning medication', '💊', true),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '1 day', '08:30:00', 'Eat breakfast', '🍳', true),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '1 day', '10:00:00', 'Morning exercise', '🏃', true),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '1 day', '14:00:00', 'Lunch time', '🥗', true),
  ('11111111-1111-1111-1111-111111111111', CURRENT_DATE - INTERVAL '1 day', '18:00:00', 'Evening medication', '💊', false),
  
  ('22222222-2222-2222-2222-222222222222', CURRENT_DATE - INTERVAL '1 day', '07:30:00', 'Morning routine', '🌅', true),
  ('22222222-2222-2222-2222-222222222222', CURRENT_DATE - INTERVAL '1 day', '09:00:00', 'Reading practice', '📖', true),
  ('22222222-2222-2222-2222-222222222222', CURRENT_DATE - INTERVAL '1 day', '11:00:00', 'Mobility training', '🦯', true),
  
  ('33333333-3333-3333-3333-333333333333', CURRENT_DATE - INTERVAL '1 day', '08:00:00', 'Sign language practice', '👋', true),
  ('33333333-3333-3333-3333-333333333333', CURRENT_DATE - INTERVAL '1 day', '10:00:00', 'Visual communication exercise', '👁️', true),
  
  ('44444444-4444-4444-4444-444444444444', CURRENT_DATE - INTERVAL '1 day', '09:00:00', 'Physical therapy', '🏥', true),
  ('44444444-4444-4444-4444-444444444444', CURRENT_DATE - INTERVAL '1 day', '11:00:00', 'Adaptive equipment practice', '🛠️', true)
ON CONFLICT DO NOTHING;
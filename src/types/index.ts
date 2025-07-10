export type UserRole = 'user' | 'caregiver' | 'therapist';

export type DisabilityType = 'cognitive' | 'visual' | 'hearing' | 'physical';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  disability_type?: DisabilityType;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  date: string;
  time: string;
  description: string;
  icon: string;
  completed: boolean;
  created_at: string;
}

export interface Log {
  id: string;
  user_id: string;
  date: string;
  mood: number;
  medications: string;
  food: string;
  notes: string;
  created_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  triggered_at: string;
  resolved: boolean;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeFonts: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
}
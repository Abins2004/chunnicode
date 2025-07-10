import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AccessibilitySettings, DisabilityType } from '../types';

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  disabilityType?: DisabilityType;
  setDisabilityType: (type?: DisabilityType) => void;
  speak: (text: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeFonts: false,
    reduceMotion: false,
    screenReader: false,
  });
  const [disabilityType, setDisabilityType] = useState<DisabilityType | undefined>();

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }

    // Detect user preferences
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      setSettings(prev => ({ ...prev, highContrast: true }));
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSettings(prev => ({ ...prev, reduceMotion: true }));
    }
  }, []);

  useEffect(() => {
    // Apply settings to document
    const root = document.documentElement;
    root.classList.toggle('high-contrast', settings.highContrast);
    root.classList.toggle('large-fonts', settings.largeFonts);
    root.classList.toggle('reduce-motion', settings.reduceMotion);
    
    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const speak = (text: string) => {
    if (settings.screenReader && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const value = {
    settings,
    updateSettings,
    disabilityType,
    setDisabilityType,
    speak,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}
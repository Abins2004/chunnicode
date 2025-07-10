import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { AccessibleButton } from '../ui/AccessibleButton';
import { AccessibleCard } from '../ui/AccessibleCard';
import { Volume2, Calendar, Clock, User, Settings } from 'lucide-react';

export function VisualInterface() {
  const { speak, settings, updateSettings } = useAccessibility();
  const [announcements, setAnnouncements] = useState<string[]>([]);

  useEffect(() => {
    // Auto-announce page content on load
    speak('Welcome to your dashboard. Use tab to navigate between elements.');
    setAnnouncements(['Page loaded. Dashboard ready.']);
  }, [speak]);

  const quickActions = [
    { name: 'Daily Schedule', description: 'View and manage your daily tasks', icon: Calendar },
    { name: 'Health Log', description: 'Record mood, medications, and meals', icon: User },
    { name: 'Accessibility Settings', description: 'Adjust interface preferences', icon: Settings },
  ];

  const handleQuickAction = (action: string) => {
    speak(`Navigating to ${action}`);
    setAnnouncements(prev => [...prev, `Activated: ${action}`]);
  };

  const toggleHighContrast = () => {
    const newValue = !settings.highContrast;
    updateSettings({ highContrast: newValue });
    speak(newValue ? 'High contrast mode enabled' : 'High contrast mode disabled');
  };

  const toggleLargeFonts = () => {
    const newValue = !settings.largeFonts;
    updateSettings({ largeFonts: newValue });
    speak(newValue ? 'Large fonts enabled' : 'Large fonts disabled');
  };

  return (
    <div className="space-y-8">
      {/* Skip to content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50"
      >
        Skip to main content
      </a>

      <header role="banner">
        <h1 className="text-4xl font-bold mb-4">Visual Interface Dashboard</h1>
        <p className="text-xl">Navigate using keyboard or screen reader</p>
      </header>

      {/* Accessibility Controls */}
      <AccessibleCard className="p-6" role="region" aria-label="Accessibility controls">
        <h2 className="text-2xl font-semibold mb-4">Accessibility Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AccessibleButton
            onClick={toggleHighContrast}
            variant={settings.highContrast ? "primary" : "secondary"}
            size="lg"
            aria-pressed={settings.highContrast}
            speakText={settings.highContrast ? "High contrast mode is on" : "High contrast mode is off"}
          >
            High Contrast: {settings.highContrast ? 'ON' : 'OFF'}
          </AccessibleButton>

          <AccessibleButton
            onClick={toggleLargeFonts}
            variant={settings.largeFonts ? "primary" : "secondary"}
            size="lg"
            aria-pressed={settings.largeFonts}
            speakText={settings.largeFonts ? "Large fonts are on" : "Large fonts are off"}
          >
            Large Fonts: {settings.largeFonts ? 'ON' : 'OFF'}
          </AccessibleButton>
        </div>
      </AccessibleCard>

      {/* Main Navigation */}
      <main id="main-content" role="main">
        <AccessibleCard className="p-6" role="region" aria-label="Quick actions">
          <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
          <nav role="navigation" aria-label="Main navigation">
            <ul className="space-y-4">
              {quickActions.map((action, index) => (
                <li key={action.name}>
                  <AccessibleButton
                    onClick={() => handleQuickAction(action.name)}
                    variant="secondary"
                    size="lg"
                    icon={<action.icon size={24} />}
                    className="w-full text-left justify-start"
                    speakText={`${action.name}. ${action.description}`}
                    aria-describedby={`action-${index}-desc`}
                  >
                    <div>
                      <div className="font-semibold">{action.name}</div>
                      <div id={`action-${index}-desc`} className="text-sm opacity-75">
                        {action.description}
                      </div>
                    </div>
                  </AccessibleButton>
                </li>
              ))}
            </ul>
          </nav>
        </AccessibleCard>

        {/* Live Region for Announcements */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
          role="status"
        >
          {announcements[announcements.length - 1]}
        </div>

        {/* Time and Date */}
        <AccessibleCard className="p-6" role="region" aria-label="Current time and date">
          <h2 className="text-2xl font-semibold mb-4">Current Time</h2>
          <div className="text-3xl font-mono">
            {new Date().toLocaleTimeString()}
          </div>
          <div className="text-xl mt-2">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </AccessibleCard>
      </main>

      {/* Instructions for screen reader users */}
      <div className="sr-only">
        <p>
          This page contains accessibility controls, quick action navigation, and current time information.
          Use Tab to navigate between elements, Enter or Space to activate buttons.
          All content is announced by screen readers.
        </p>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { AccessibleButton } from '../ui/AccessibleButton';
import { AccessibleCard } from '../ui/AccessibleCard';
import { Volume2, Calendar, Clock, User, Settings, Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Task, Log, Alert } from '../../types';

export function VisualInterface() {
  const { user } = useAuth();
  const { speak, settings, updateSettings } = useAccessibility();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todaysLog, setTodaysLog] = useState<Log | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReading, setIsReading] = useState(false);
  const [currentReadingIndex, setCurrentReadingIndex] = useState(0);
  const [announcements, setAnnouncements] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchData();
      // Auto-announce page content on load
      setTimeout(() => {
        announcePageContent();
      }, 1000);
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];

      // Fetch today's tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .order('time', { ascending: true });

      if (tasksError) throw tasksError;

      // Fetch today's log
      const { data: logData, error: logError } = await supabase
        .from('logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (logError && logError.code !== 'PGRST116') throw logError;

      // Fetch unresolved alerts
      const { data: alertsData, error: alertsError } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', user.id)
        .eq('resolved', false)
        .order('triggered_at', { ascending: false });

      if (alertsError) throw alertsError;

      setTasks(tasksData || []);
      setTodaysLog(logData || null);
      setAlerts(alertsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      speak('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const announcePageContent = () => {
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const alertCount = alerts.length;
    
    const announcement = `Welcome to your visual interface dashboard. You have ${totalTasks} tasks for today, ${completedTasks} completed. ${alertCount} active alerts. Use tab to navigate between elements, or use the reading controls to have content read aloud.`;
    
    speak(announcement);
    setAnnouncements(prev => [...prev, 'Dashboard loaded and announced']);
  };

  const readAllContent = () => {
    if (isReading) {
      speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    setIsReading(true);
    setCurrentReadingIndex(0);
    
    const contentToRead = [
      `Dashboard overview: ${tasks.length} tasks scheduled for today`,
      `Task completion: ${tasks.filter(t => t.completed).length} out of ${tasks.length} tasks completed`,
      `Active alerts: ${alerts.length} notifications require attention`,
      ...tasks.map((task, index) => 
        `Task ${index + 1}: ${task.description} scheduled for ${task.time}. Status: ${task.completed ? 'completed' : 'pending'}`
      ),
      ...alerts.map((alert, index) => 
        `Alert ${index + 1}: ${alert.message}. Type: ${alert.type}. Time: ${new Date(alert.triggered_at).toLocaleTimeString()}`
      )
    ];

    readContentSequentially(contentToRead, 0);
  };

  const readContentSequentially = (content: string[], index: number) => {
    if (index >= content.length || !isReading) {
      setIsReading(false);
      setCurrentReadingIndex(0);
      return;
    }

    setCurrentReadingIndex(index);
    const utterance = new SpeechSynthesisUtterance(content[index]);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    
    utterance.onend = () => {
      if (isReading) {
        setTimeout(() => readContentSequentially(content, index + 1), 500);
      }
    };

    speechSynthesis.speak(utterance);
  };

  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ));
      
      speak(`Task ${task.description} marked as ${task.completed ? 'incomplete' : 'complete'}`);
      setAnnouncements(prev => [...prev, `Task updated: ${task.description}`]);
    } catch (error) {
      console.error('Error updating task:', error);
      speak('Error updating task');
    }
  };

  const dismissAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ resolved: true })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(prev => prev.filter(a => a.id !== alertId));
      speak('Alert dismissed');
      setAnnouncements(prev => [...prev, 'Alert dismissed']);
    } catch (error) {
      console.error('Error dismissing alert:', error);
      speak('Error dismissing alert');
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

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
        <p className="text-xl">Navigate using keyboard or screen reader. Use reading controls for audio assistance.</p>
      </header>

      {/* Voice Reading Controls */}
      <AccessibleCard className="p-6" role="region" aria-label="Voice reading controls">
        <h2 className="text-2xl font-semibold mb-4">Voice Reading Controls</h2>
        <div className="flex flex-wrap gap-4">
          <AccessibleButton
            onClick={readAllContent}
            variant={isReading ? "danger" : "primary"}
            size="lg"
            icon={isReading ? <Pause size={24} /> : <Play size={24} />}
            speakText={isReading ? "Stop reading" : "Start reading all content"}
          >
            {isReading ? 'Stop Reading' : 'Read All Content'}
          </AccessibleButton>

          <AccessibleButton
            onClick={() => speak(`Current time is ${new Date().toLocaleTimeString()}`)}
            variant="secondary"
            size="lg"
            icon={<Clock size={24} />}
            speakText="Announce current time"
          >
            Announce Time
          </AccessibleButton>

          <AccessibleButton
            onClick={announcePageContent}
            variant="secondary"
            size="lg"
            icon={<Volume2 size={24} />}
            speakText="Announce page summary"
          >
            Page Summary
          </AccessibleButton>
        </div>
        
        {isReading && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              🔊 Reading content... (Item {currentReadingIndex + 1})
            </p>
          </div>
        )}
      </AccessibleCard>

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

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <AccessibleCard className="p-6" role="region" aria-label="Active alerts">
          <h2 className="text-2xl font-semibold mb-4">Active Alerts ({alerts.length})</h2>
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'error' ? 'border-red-500 bg-red-50' : 
                  alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  alert.type === 'success' ? 'border-green-500 bg-green-50' :
                  'border-blue-500 bg-blue-50'
                }`}
                role="alert"
                aria-describedby={`alert-${index}-desc`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{alert.message}</h3>
                    <p id={`alert-${index}-desc`} className="text-gray-600 mt-1">
                      {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} alert from {new Date(alert.triggered_at).toLocaleString()}
                    </p>
                  </div>
                  <AccessibleButton
                    onClick={() => dismissAlert(alert.id)}
                    variant="secondary"
                    size="sm"
                    speakText={`Dismiss ${alert.type} alert: ${alert.message}`}
                  >
                    Dismiss
                  </AccessibleButton>
                </div>
              </div>
            ))}
          </div>
        </AccessibleCard>
      )}

      {/* Main Content */}
      <main id="main-content" role="main">
        {/* Tasks Section */}
        <AccessibleCard className="p-6 mb-6" role="region" aria-label="Today's tasks">
          <h2 className="text-2xl font-semibold mb-6">Today's Tasks ({tasks.length})</h2>
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar size={48} className="mx-auto mb-4" />
              <p className="text-xl">No tasks scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border ${task.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
                  role="listitem"
                  aria-describedby={`task-${index}-desc`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl" aria-hidden="true">{task.icon}</span>
                      <div>
                        <h3 className="font-semibold text-lg">{task.description}</h3>
                        <p id={`task-${index}-desc`} className="text-gray-600">
                          Scheduled for {task.time} • Status: {task.completed ? 'Completed' : 'Pending'}
                        </p>
                      </div>
                    </div>
                    <AccessibleButton
                      onClick={() => toggleTask(task.id)}
                      variant={task.completed ? "secondary" : "primary"}
                      size="lg"
                      speakText={`${task.completed ? 'Mark incomplete' : 'Mark complete'}: ${task.description}`}
                    >
                      {task.completed ? 'Completed ✓' : 'Mark Done'}
                    </AccessibleButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AccessibleCard>

        {/* Health Status */}
        <AccessibleCard className="p-6" role="region" aria-label="Health status">
          <h2 className="text-2xl font-semibold mb-4">Today's Health Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Mood</h3>
              <p className="text-2xl">
                {todaysLog?.mood ? `${todaysLog.mood}/5` : 'Not logged'}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Medications</h3>
              <p className="text-lg">
                {todaysLog?.medications ? 'Logged' : 'Not logged'}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Meals</h3>
              <p className="text-lg">
                {todaysLog?.food ? 'Logged' : 'Not logged'}
              </p>
            </div>
          </div>
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
          This dashboard contains voice reading controls, accessibility options, active alerts, today's tasks, and health status information.
          Use Tab to navigate between elements, Enter or Space to activate buttons.
          All content can be read aloud using the voice controls at the top of the page.
        </p>
      </div>
    </div>
  );
}
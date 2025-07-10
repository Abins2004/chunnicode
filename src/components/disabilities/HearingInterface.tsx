import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AccessibleButton } from '../ui/AccessibleButton';
import { AccessibleCard } from '../ui/AccessibleCard';
import { Bell, Calendar, Heart, Utensils, MessageSquare, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Alert, Task, Log } from '../../types';

export function HearingInterface() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);
  const [todaysLog, setTodaysLog] = useState<Log | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];

      // Fetch unresolved alerts
      const { data: alertsData, error: alertsError } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', user.id)
        .eq('resolved', false)
        .order('triggered_at', { ascending: false });

      if (alertsError) throw alertsError;

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

      setAlerts(alertsData || []);
      setTodaysTasks(tasksData || []);
      setTodaysLog(logData || null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setFeedbackMessage('Error loading data');
      setTimeout(() => setFeedbackMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const dismissAlert = async (id: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ resolved: true })
        .eq('id', id);

      if (error) throw error;

      setAlerts(prev => prev.filter(a => a.id !== id));
      setFeedbackMessage('Alert dismissed');
      setTimeout(() => setFeedbackMessage(''), 3000);
    } catch (error) {
      console.error('Error dismissing alert:', error);
      setFeedbackMessage('Error dismissing alert');
      setTimeout(() => setFeedbackMessage(''), 3000);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="text-yellow-500" size={24} />;
      case 'error': return <AlertTriangle className="text-red-500" size={24} />;
      case 'success': return <CheckCircle className="text-green-500" size={24} />;
      default: return <Bell className="text-blue-500" size={24} />;
    }
  };

  const quickActions = [
    { name: 'Daily Tasks', icon: Calendar, color: 'bg-blue-500', description: 'View scheduled activities' },
    { name: 'Health Log', icon: Heart, color: 'bg-red-500', description: 'Record health information' },
    { name: 'Messages', icon: MessageSquare, color: 'bg-green-500', description: 'Check messages from caregivers' },
  ];

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-xl text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Visual Dashboard</h1>
        <p className="text-xl text-gray-600">All information displayed visually</p>
      </header>

      {/* Visual Feedback Area */}
      {feedbackMessage && (
        <AccessibleCard className="p-4 bg-green-50 border-green-200 animate-pulse">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle size={20} />
            <span className="font-medium">{feedbackMessage}</span>
          </div>
        </AccessibleCard>
      )}

      {/* Visual Notifications */}
      <AccessibleCard className="p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Bell size={24} />
          Active Notifications
        </h2>
        
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
            <p className="text-xl">All caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'error' ? 'border-red-500 bg-red-50' : 
                  alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  alert.type === 'success' ? 'border-green-500 bg-green-50' :
                  'border-blue-500 bg-blue-50'
                } animate-bounce`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <h3 className="font-semibold text-lg">{alert.message}</h3>
                      <div className="flex items-center gap-1 text-gray-600 mt-1">
                        <Clock size={16} />
                        <span>{new Date(alert.triggered_at).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {(alert.type === 'error' || alert.type === 'warning') && (
                      <div className="flex items-center gap-1 text-red-600 font-semibold">
                        <AlertTriangle size={20} />
                        <span>URGENT</span>
                      </div>
                    )}
                    
                    <AccessibleButton
                      onClick={() => dismissAlert(alert.id)}
                      variant="secondary"
                      size="sm"
                    >
                      Dismiss
                    </AccessibleButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </AccessibleCard>

      {/* Visual Quick Actions */}
      <AccessibleCard className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <AccessibleButton
              key={action.name}
              variant="secondary"
              size="lg"
              className="h-32 flex-col text-center hover:scale-105 transform transition-transform"
            >
              <div className={`w-16 h-16 rounded-full ${action.color} flex items-center justify-center mb-3`}>
                <action.icon size={32} className="text-white" />
              </div>
              <div className="font-semibold">{action.name}</div>
              <div className="text-sm text-gray-600 mt-1">{action.description}</div>
            </AccessibleButton>
          ))}
        </div>
      </AccessibleCard>

      {/* Visual Status Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AccessibleCard className="p-4 text-center">
          <div className="text-3xl mb-2">💊</div>
          <div className="font-semibold">Medications</div>
          <div className={todaysLog?.medications ? "text-green-600" : "text-yellow-600"}>
            {todaysLog?.medications ? "✓ Logged" : "⏰ Pending"}
          </div>
        </AccessibleCard>
        
        <AccessibleCard className="p-4 text-center">
          <div className="text-3xl mb-2">🍎</div>
          <div className="font-semibold">Meals</div>
          <div className={todaysLog?.food ? "text-green-600" : "text-yellow-600"}>
            {todaysLog?.food ? "✓ Logged" : "⏰ Pending"}
          </div>
        </AccessibleCard>
        
        <AccessibleCard className="p-4 text-center">
          <div className="text-3xl mb-2">😊</div>
          <div className="font-semibold">Mood</div>
          <div className="text-blue-600">
            {todaysLog?.mood ? `${todaysLog.mood}/5` : "Not logged"}
          </div>
        </AccessibleCard>
        
        <AccessibleCard className="p-4 text-center">
          <div className="text-3xl mb-2">📋</div>
          <div className="font-semibold">Tasks</div>
          <div className="text-gray-600">
            {todaysTasks.filter(t => t.completed).length}/{todaysTasks.length} done
          </div>
        </AccessibleCard>
      </div>
    </div>
  );
}
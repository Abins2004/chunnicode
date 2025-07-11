import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AccessibleButton } from '../ui/AccessibleButton';
import { AccessibleCard } from '../ui/AccessibleCard';
import { Bell, Calendar, Heart, Utensils, MessageSquare, AlertTriangle, CheckCircle, Clock, Hand } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Alert, Task, Log } from '../../types';

// Sign language gestures mapping
const signLanguageGestures = {
  hello: '👋',
  good: '👍',
  bad: '👎',
  help: '🆘',
  medicine: '💊',
  food: '🍎',
  water: '💧',
  sleep: '😴',
  happy: '😊',
  sad: '😢',
  pain: '😣',
  ok: '👌',
  yes: '✅',
  no: '❌',
  emergency: '🚨',
  doctor: '👨‍⚕️',
  family: '👨‍👩‍👧‍👦',
  time: '⏰',
  task: '📋',
  complete: '✅'
};

export function HearingInterface() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);
  const [todaysLog, setTodaysLog] = useState<Log | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showSignLanguage, setShowSignLanguage] = useState(true);
  const [currentGesture, setCurrentGesture] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchData();
      // Show welcome gesture
      showGesture('hello', 'Welcome to your dashboard');
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
      showFeedback('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setFeedbackMessage(message);
    
    // Show appropriate gesture
    if (type === 'success') showGesture('good', message);
    else if (type === 'error') showGesture('bad', message);
    else showGesture('ok', message);
    
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const showGesture = (gestureKey: keyof typeof signLanguageGestures, message: string) => {
    setCurrentGesture(`${signLanguageGestures[gestureKey]} ${message}`);
    setTimeout(() => setCurrentGesture(''), 3000);
  };

  const dismissAlert = async (id: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ resolved: true })
        .eq('id', id);

      if (error) throw error;

      setAlerts(prev => prev.filter(a => a.id !== id));
      showFeedback('Alert dismissed', 'success');
    } catch (error) {
      console.error('Error dismissing alert:', error);
      showFeedback('Error dismissing alert', 'error');
    }
  };

  const toggleTask = async (taskId: string) => {
    const task = todaysTasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', taskId);

      if (error) throw error;

      setTodaysTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ));
      
      showFeedback(`Task ${task.completed ? 'unmarked' : 'completed'}`, 'success');
    } catch (error) {
      console.error('Error updating task:', error);
      showFeedback('Error updating task', 'error');
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
    { 
      name: 'Daily Tasks', 
      icon: Calendar, 
      color: 'bg-blue-500', 
      description: 'View scheduled activities',
      gesture: 'task'
    },
    { 
      name: 'Health Log', 
      icon: Heart, 
      color: 'bg-red-500', 
      description: 'Record health information',
      gesture: 'medicine'
    },
    { 
      name: 'Messages', 
      icon: MessageSquare, 
      color: 'bg-green-500', 
      description: 'Check messages from caregivers',
      gesture: 'family'
    },
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
        <p className="text-xl text-gray-600">All information displayed visually with sign language support</p>
      </header>

      {/* Sign Language Display */}
      {showSignLanguage && currentGesture && (
        <AccessibleCard className="p-6 bg-blue-50 border-blue-200 text-center animate-pulse">
          <div className="flex items-center justify-center gap-4">
            <Hand size={32} className="text-blue-600" />
            <div>
              <h3 className="text-xl font-semibold text-blue-800">Sign Language</h3>
              <p className="text-2xl">{currentGesture}</p>
            </div>
          </div>
        </AccessibleCard>
      )}

      {/* Visual Feedback Area */}
      {feedbackMessage && (
        <AccessibleCard className="p-4 bg-green-50 border-green-200 animate-bounce">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle size={20} />
            <span className="font-medium">{feedbackMessage}</span>
          </div>
        </AccessibleCard>
      )}

      {/* Sign Language Toggle */}
      <AccessibleCard className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hand size={24} className="text-blue-600" />
            <span className="font-semibold">Sign Language Support</span>
          </div>
          <AccessibleButton
            onClick={() => setShowSignLanguage(!showSignLanguage)}
            variant={showSignLanguage ? "primary" : "secondary"}
            size="sm"
          >
            {showSignLanguage ? 'ON' : 'OFF'}
          </AccessibleButton>
        </div>
      </AccessibleCard>

      {/* Visual Notifications */}
      <AccessibleCard className="p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Bell size={24} />
          Active Notifications ({alerts.length})
        </h2>
        
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-6xl mb-4">{signLanguageGestures.good}</div>
            <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
            <p className="text-xl">All caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'error' ? 'border-red-500 bg-red-50' : 
                  alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  alert.type === 'success' ? 'border-green-500 bg-green-50' :
                  'border-blue-500 bg-blue-50'
                } animate-pulse`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div className="text-4xl">
                      {alert.type === 'error' ? signLanguageGestures.emergency : 
                       alert.type === 'warning' ? signLanguageGestures.help :
                       signLanguageGestures.ok}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{alert.message}</h3>
                      <div className="flex items-center gap-1 text-gray-600 mt-1">
                        <Clock size={16} />
                        <span>{new Date(alert.triggered_at).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 items-center">
                    {(alert.type === 'error' || alert.type === 'warning') && (
                      <div className="flex items-center gap-1 text-red-600 font-semibold animate-bounce">
                        <AlertTriangle size={20} />
                        <span className="text-2xl">{signLanguageGestures.emergency}</span>
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

      {/* Today's Tasks */}
      <AccessibleCard className="p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Calendar size={24} />
          Today's Tasks ({todaysTasks.length})
        </h2>
        
        {todaysTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-6xl mb-4">{signLanguageGestures.ok}</div>
            <Calendar size={48} className="mx-auto mb-4" />
            <p className="text-xl">No tasks scheduled for today</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todaysTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-lg border ${
                  task.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                } transition-all hover:shadow-md`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{task.icon}</span>
                    <div className="text-2xl">
                      {task.completed ? signLanguageGestures.complete : signLanguageGestures.task}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{task.description}</h3>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={16} />
                        <span>{task.time}</span>
                        <span className="ml-2">
                          {task.completed ? '✅ Completed' : '⏰ Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <AccessibleButton
                    onClick={() => toggleTask(task.id)}
                    variant={task.completed ? "secondary" : "primary"}
                    size="lg"
                    className="min-w-[120px]"
                  >
                    {task.completed ? 'Completed ✓' : 'Mark Done'}
                  </AccessibleButton>
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
              className="h-40 flex-col text-center hover:scale-105 transform transition-all"
              onClick={() => showGesture(action.gesture as keyof typeof signLanguageGestures, `Opening ${action.name}`)}
            >
              <div className={`w-16 h-16 rounded-full ${action.color} flex items-center justify-center mb-3`}>
                <action.icon size={32} className="text-white" />
              </div>
              <div className="text-3xl mb-2">
                {signLanguageGestures[action.gesture as keyof typeof signLanguageGestures]}
              </div>
              <div className="font-semibold">{action.name}</div>
              <div className="text-sm text-gray-600 mt-1">{action.description}</div>
            </AccessibleButton>
          ))}
        </div>
      </AccessibleCard>

      {/* Visual Status Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AccessibleCard className="p-4 text-center hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-2">💊</div>
          <div className="text-2xl mb-2">{signLanguageGestures.medicine}</div>
          <div className="font-semibold">Medications</div>
          <div className={todaysLog?.medications ? "text-green-600" : "text-yellow-600"}>
            {todaysLog?.medications ? "✅ Logged" : "⏰ Pending"}
          </div>
        </AccessibleCard>
        
        <AccessibleCard className="p-4 text-center hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-2">🍎</div>
          <div className="text-2xl mb-2">{signLanguageGestures.food}</div>
          <div className="font-semibold">Meals</div>
          <div className={todaysLog?.food ? "text-green-600" : "text-yellow-600"}>
            {todaysLog?.food ? "✅ Logged" : "⏰ Pending"}
          </div>
        </AccessibleCard>
        
        <AccessibleCard className="p-4 text-center hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-2">😊</div>
          <div className="text-2xl mb-2">
            {todaysLog?.mood ? 
              (todaysLog.mood >= 4 ? signLanguageGestures.happy : 
               todaysLog.mood <= 2 ? signLanguageGestures.sad : signLanguageGestures.ok) : 
              signLanguageGestures.help}
          </div>
          <div className="font-semibold">Mood</div>
          <div className="text-blue-600">
            {todaysLog?.mood ? `${todaysLog.mood}/5` : "Not logged"}
          </div>
        </AccessibleCard>
        
        <AccessibleCard className="p-4 text-center hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-2">📋</div>
          <div className="text-2xl mb-2">{signLanguageGestures.task}</div>
          <div className="font-semibold">Tasks</div>
          <div className="text-gray-600">
            {todaysTasks.filter(t => t.completed).length}/{todaysTasks.length} done
          </div>
        </AccessibleCard>
      </div>

      {/* Sign Language Reference */}
      <AccessibleCard className="p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Hand size={24} />
          Sign Language Quick Reference
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.entries(signLanguageGestures).map(([key, gesture]) => (
            <div key={key} className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="text-3xl mb-2">{gesture}</div>
              <div className="text-sm font-medium capitalize">{key}</div>
            </div>
          ))}
        </div>
      </AccessibleCard>
    </div>
  );
}
import React, { useState } from 'react';
import { AccessibleButton } from '../ui/AccessibleButton';
import { AccessibleCard } from '../ui/AccessibleCard';
import { Bell, Calendar, Heart, Utensils, MessageSquare, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export function HearingInterface() {
  const [notifications, setNotifications] = useState([
    { id: '1', type: 'medicine', message: 'Time for morning medication', time: '9:00 AM', urgent: true },
    { id: '2', type: 'meal', message: 'Breakfast scheduled', time: '9:30 AM', urgent: false },
    { id: '3', type: 'appointment', message: 'Therapy session today', time: '2:00 PM', urgent: false },
  ]);

  const [feedbackMessage, setFeedbackMessage] = useState('');

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setFeedbackMessage('Notification dismissed');
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'medicine': return <Heart className="text-red-500" size={24} />;
      case 'meal': return <Utensils className="text-green-500" size={24} />;
      case 'appointment': return <Calendar className="text-blue-500" size={24} />;
      default: return <Bell className="text-gray-500" size={24} />;
    }
  };

  const quickActions = [
    { name: 'Daily Tasks', icon: Calendar, color: 'bg-blue-500', description: 'View scheduled activities' },
    { name: 'Health Log', icon: Heart, color: 'bg-red-500', description: 'Record health information' },
    { name: 'Messages', icon: MessageSquare, color: 'bg-green-500', description: 'Check messages from caregivers' },
  ];

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
        
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
            <p className="text-xl">All caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border-l-4 ${
                  notification.urgent ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50'
                } animate-bounce`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div>
                      <h3 className="font-semibold text-lg">{notification.message}</h3>
                      <div className="flex items-center gap-1 text-gray-600 mt-1">
                        <Clock size={16} />
                        <span>{notification.time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {notification.urgent && (
                      <div className="flex items-center gap-1 text-red-600 font-semibold">
                        <AlertTriangle size={20} />
                        <span>URGENT</span>
                      </div>
                    )}
                    
                    <AccessibleButton
                      onClick={() => dismissNotification(notification.id)}
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
          <div className="text-green-600">✓ Taken</div>
        </AccessibleCard>
        
        <AccessibleCard className="p-4 text-center">
          <div className="text-3xl mb-2">🍎</div>
          <div className="font-semibold">Meals</div>
          <div className="text-yellow-600">⏰ Pending</div>
        </AccessibleCard>
        
        <AccessibleCard className="p-4 text-center">
          <div className="text-3xl mb-2">😊</div>
          <div className="font-semibold">Mood</div>
          <div className="text-blue-600">Good</div>
        </AccessibleCard>
        
        <AccessibleCard className="p-4 text-center">
          <div className="text-3xl mb-2">👨‍⚕️</div>
          <div className="font-semibold">Appointments</div>
          <div className="text-gray-600">None today</div>
        </AccessibleCard>
      </div>
    </div>
  );
}
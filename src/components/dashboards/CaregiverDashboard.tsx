import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AccessibleButton } from '../ui/AccessibleButton';
import { AccessibleCard } from '../ui/AccessibleCard';
import { Users, Calendar, Activity, MessageSquare, LogOut, Bell } from 'lucide-react';

export function CaregiverDashboard() {
  const { user, signOut } = useAuth();

  const careRecipients = [
    { name: 'John Doe', status: 'All tasks completed', mood: 'Good', lastActive: '2 hours ago' },
    { name: 'Jane Smith', status: '2 tasks pending', mood: 'Okay', lastActive: '30 minutes ago' },
  ];

  const recentActivities = [
    { user: 'John Doe', action: 'Completed morning medication', time: '9:00 AM' },
    { user: 'Jane Smith', action: 'Logged mood as "Good"', time: '8:30 AM' },
    { user: 'John Doe', action: 'Completed breakfast', time: '8:00 AM' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Caregiver Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <AccessibleButton
            onClick={signOut}
            variant="secondary"
            icon={<LogOut size={20} />}
          >
            Sign Out
          </AccessibleButton>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <AccessibleCard className="p-6 text-center">
            <Users size={32} className="mx-auto mb-3 text-blue-500" />
            <h3 className="font-semibold">Care Recipients</h3>
            <p className="text-2xl font-bold text-blue-600">{careRecipients.length}</p>
          </AccessibleCard>

          <AccessibleCard className="p-6 text-center">
            <Bell size={32} className="mx-auto mb-3 text-yellow-500" />
            <h3 className="font-semibold">Active Alerts</h3>
            <p className="text-2xl font-bold text-yellow-600">3</p>
          </AccessibleCard>

          <AccessibleCard className="p-6 text-center">
            <Calendar size={32} className="mx-auto mb-3 text-green-500" />
            <h3 className="font-semibold">Today's Tasks</h3>
            <p className="text-2xl font-bold text-green-600">8/10</p>
          </AccessibleCard>

          <AccessibleCard className="p-6 text-center">
            <MessageSquare size={32} className="mx-auto mb-3 text-purple-500" />
            <h3 className="font-semibold">Messages</h3>
            <p className="text-2xl font-bold text-purple-600">2</p>
          </AccessibleCard>
        </div>

        {/* Care Recipients */}
        <AccessibleCard className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Care Recipients</h2>
          <div className="space-y-4">
            {careRecipients.map((recipient, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-lg">{recipient.name}</h3>
                  <p className="text-gray-600">{recipient.status}</p>
                  <p className="text-sm text-gray-500">Mood: {recipient.mood} • Last active: {recipient.lastActive}</p>
                </div>
                <div className="flex gap-2">
                  <AccessibleButton variant="secondary" size="sm">
                    View Details
                  </AccessibleButton>
                  <AccessibleButton variant="primary" size="sm">
                    Send Message
                  </AccessibleButton>
                </div>
              </div>
            ))}
          </div>
        </AccessibleCard>

        {/* Recent Activity */}
        <AccessibleCard className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <Activity size={20} className="text-blue-500" />
                <div>
                  <p className="font-medium">{activity.user}</p>
                  <p className="text-gray-600">{activity.action}</p>
                </div>
                <span className="text-sm text-gray-500 ml-auto">{activity.time}</span>
              </div>
            ))}
          </div>
        </AccessibleCard>
      </div>
    </div>
  );
}
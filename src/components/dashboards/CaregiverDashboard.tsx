import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AccessibleButton } from '../ui/AccessibleButton';
import { AccessibleCard } from '../ui/AccessibleCard';
import { Users, Calendar, Activity, MessageSquare, LogOut, Bell } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { User, Task, Alert, Log } from '../../types';

interface CareRecipient extends User {
  taskStats: { completed: number; total: number };
  lastLog?: Log;
  lastActive: string;
}

export function CaregiverDashboard() {
  const { user, signOut } = useAuth();
  const [careRecipients, setCareRecipients] = useState<CareRecipient[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];

      // Fetch users with role 'user' (care recipients)
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'user')
        .order('name');

      if (usersError) throw usersError;

      // For each user, fetch their task stats and latest log
      const careRecipientsWithStats = await Promise.all(
        (usersData || []).map(async (recipient) => {
          // Fetch today's tasks
          const { data: tasksData } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', recipient.id)
            .eq('date', today);

          // Fetch latest log
          const { data: logData } = await supabase
            .from('logs')
            .select('*')
            .eq('user_id', recipient.id)
            .order('date', { ascending: false })
            .limit(1);

          const tasks = tasksData || [];
          const completedTasks = tasks.filter(t => t.completed);

          return {
            ...recipient,
            taskStats: {
              completed: completedTasks.length,
              total: tasks.length
            },
            lastLog: logData?.[0],
            lastActive: logData?.[0]?.created_at || recipient.created_at
          };
        })
      );

      // Fetch recent activities (tasks completed today)
      const { data: recentTasksData } = await supabase
        .from('tasks')
        .select(`
          *,
          users!inner(name)
        `)
        .eq('date', today)
        .eq('completed', true)
        .order('updated_at', { ascending: false })
        .limit(10);

      // Fetch active alerts
      const { data: alertsData } = await supabase
        .from('alerts')
        .select(`
          *,
          users!inner(name)
        `)
        .eq('resolved', false)
        .order('triggered_at', { ascending: false });

      setCareRecipients(careRecipientsWithStats);
      setRecentActivities(recentTasksData || []);
      setActiveAlerts(alertsData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
            <p className="text-2xl font-bold text-yellow-600">{activeAlerts.length}</p>
          </AccessibleCard>

          <AccessibleCard className="p-6 text-center">
            <Calendar size={32} className="mx-auto mb-3 text-green-500" />
            <h3 className="font-semibold">Today's Tasks</h3>
            <p className="text-2xl font-bold text-green-600">
              {careRecipients.reduce((acc, r) => acc + r.taskStats.completed, 0)}/
              {careRecipients.reduce((acc, r) => acc + r.taskStats.total, 0)}
            </p>
          </AccessibleCard>

          <AccessibleCard className="p-6 text-center">
            <MessageSquare size={32} className="mx-auto mb-3 text-purple-500" />
            <h3 className="font-semibold">Recent Activities</h3>
            <p className="text-2xl font-bold text-purple-600">{recentActivities.length}</p>
          </AccessibleCard>
        </div>

        {/* Care Recipients */}
        <AccessibleCard className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Care Recipients</h2>
          {careRecipients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users size={48} className="mx-auto mb-4" />
              <p className="text-xl">No care recipients found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {careRecipients.map((recipient) => (
                <div key={recipient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-lg">{recipient.name}</h3>
                    <p className="text-gray-600">
                      {recipient.taskStats.completed}/{recipient.taskStats.total} tasks completed
                    </p>
                    <p className="text-sm text-gray-500">
                      Mood: {recipient.lastLog?.mood ? `${recipient.lastLog.mood}/5` : 'Not logged'} • 
                      Last active: {formatLastActive(recipient.lastActive)}
                    </p>
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
          )}
        </AccessibleCard>

        {/* Recent Activity */}
        <AccessibleCard className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
          {recentActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity size={48} className="mx-auto mb-4" />
              <p className="text-xl">No recent activities</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <Activity size={20} className="text-blue-500" />
                  <div>
                    <p className="font-medium">{activity.users.name}</p>
                    <p className="text-gray-600">Completed: {activity.description}</p>
                  </div>
                  <span className="text-sm text-gray-500 ml-auto">
                    {new Date(activity.updated_at).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </AccessibleCard>
      </div>
    </div>
  );
}
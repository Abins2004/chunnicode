import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AccessibleButton } from '../ui/AccessibleButton';
import { AccessibleCard } from '../ui/AccessibleCard';
import { Users, BarChart, Calendar, FileText, LogOut, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { User, Task, Log } from '../../types';

interface Patient extends User {
  progress: number;
  recentLogs: Log[];
  completedTasks: number;
  totalTasks: number;
}

export function TherapistDashboard() {
  const { user, signOut } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPatients();
    }
  }, [user]);

  const fetchPatients = async () => {
    if (!user) return;

    try {
      // Fetch users with role 'user' (patients)
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'user')
        .order('name');

      if (usersError) throw usersError;

      // For each patient, calculate progress and fetch recent data
      const patientsWithProgress = await Promise.all(
        (usersData || []).map(async (patient) => {
          const today = new Date().toISOString().split('T')[0];
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

          // Fetch recent logs for progress calculation
          const { data: logsData } = await supabase
            .from('logs')
            .select('*')
            .eq('user_id', patient.id)
            .gte('date', weekAgo)
            .order('date', { ascending: false });

          // Fetch today's tasks
          const { data: tasksData } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', patient.id)
            .eq('date', today);

          const tasks = tasksData || [];
          const completedTasks = tasks.filter(t => t.completed).length;
          
          // Calculate progress based on task completion and mood trends
          const logs = logsData || [];
          const avgMood = logs.length > 0 
            ? logs.reduce((sum, log) => sum + (log.mood || 0), 0) / logs.length 
            : 0;
          
          const taskCompletionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
          const moodScore = (avgMood / 5) * 100;
          const progress = Math.round((taskCompletionRate + moodScore) / 2);

          return {
            ...patient,
            progress,
            recentLogs: logs.slice(0, 5),
            completedTasks,
            totalTasks: tasks.length
          };
        })
      );

      setPatients(patientsWithProgress);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBgColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-600';
    if (progress >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
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

  const avgProgress = patients.length > 0 
    ? Math.round(patients.reduce((sum, p) => sum + p.progress, 0) / patients.length)
    : 0;

  const totalTasksToday = patients.reduce((sum, p) => sum + p.totalTasks, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Therapist Dashboard</h1>
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
            <h3 className="font-semibold">Active Patients</h3>
            <p className="text-2xl font-bold text-blue-600">{patients.length}</p>
          </AccessibleCard>

          <AccessibleCard className="p-6 text-center">
            <Calendar size={32} className="mx-auto mb-3 text-green-500" />
            <h3 className="font-semibold">Today's Tasks</h3>
            <p className="text-2xl font-bold text-green-600">{totalTasksToday}</p>
          </AccessibleCard>

          <AccessibleCard className="p-6 text-center">
            <TrendingUp size={32} className="mx-auto mb-3 text-purple-500" />
            <h3 className="font-semibold">Avg Progress</h3>
            <p className={`text-2xl font-bold ${getProgressColor(avgProgress)}`}>{avgProgress}%</p>
          </AccessibleCard>

          <AccessibleCard className="p-6 text-center">
            <FileText size={32} className="mx-auto mb-3 text-orange-500" />
            <h3 className="font-semibold">Active Patients</h3>
            <p className="text-2xl font-bold text-orange-600">{patients.length}</p>
          </AccessibleCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Patient Progress */}
          <AccessibleCard className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Patient Progress</h2>
            {patients.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users size={48} className="mx-auto mb-4" />
                <p className="text-xl">No patients found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {patients.map((patient) => (
                  <div key={patient.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{patient.name}</h3>
                        <p className="text-sm text-gray-600">
                          {patient.disability_type && 
                            `${patient.disability_type.charAt(0).toUpperCase() + patient.disability_type.slice(1)} support`
                          }
                        </p>
                      </div>
                      <span className={`text-sm font-semibold ${getProgressColor(patient.progress)}`}>
                        {patient.progress}% progress
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div 
                        className={`h-2 rounded-full ${getProgressBgColor(patient.progress)}`}
                        style={{ width: `${patient.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>Tasks: {patient.completedTasks}/{patient.totalTasks} completed today</span>
                      <span>
                        Recent mood: {
                          patient.recentLogs[0]?.mood 
                            ? `${patient.recentLogs[0].mood}/5` 
                            : 'Not logged'
                        }
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AccessibleCard>
        </div>

        {/* Quick Actions */}
        <AccessibleCard className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AccessibleButton
              variant="primary"
              size="lg"
              icon={<FileText size={24} />}
              className="h-20 flex-col"
            >
              <span>Create Report</span>
              <span className="text-sm opacity-75">Generate patient progress report</span>
            </AccessibleButton>

            <AccessibleButton
              variant="secondary"
              size="lg"
              icon={<Calendar size={24} />}
              className="h-20 flex-col"
            >
              <span>Schedule Session</span>
              <span className="text-sm opacity-75">Book new therapy session</span>
            </AccessibleButton>

            <AccessibleButton
              variant="secondary"
              size="lg"
              icon={<BarChart size={24} />}
              className="h-20 flex-col"
            >
              <span>View Analytics</span>
              <span className="text-sm opacity-75">Review patient outcomes</span>
            </AccessibleButton>
          </div>
        </AccessibleCard>
      </div>
    </div>
  );
}
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AccessibleButton } from '../ui/AccessibleButton';
import { AccessibleCard } from '../ui/AccessibleCard';
import { Users, BarChart, Calendar, FileText, LogOut, TrendingUp } from 'lucide-react';

export function TherapistDashboard() {
  const { user, signOut } = useAuth();

  const patients = [
    { name: 'John Doe', progress: 85, nextSession: 'Tomorrow 2:00 PM', notes: 'Excellent progress on motor skills' },
    { name: 'Jane Smith', progress: 72, nextSession: 'Friday 10:00 AM', notes: 'Working on communication goals' },
    { name: 'Mike Johnson', progress: 90, nextSession: 'Monday 3:00 PM', notes: 'Ready for advanced exercises' },
  ];

  const todaysSessions = [
    { time: '9:00 AM', patient: 'Sarah Wilson', type: 'Physical Therapy' },
    { time: '11:00 AM', patient: 'Tom Brown', type: 'Speech Therapy' },
    { time: '2:00 PM', patient: 'Lisa Davis', type: 'Occupational Therapy' },
  ];

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
            <h3 className="font-semibold">Today's Sessions</h3>
            <p className="text-2xl font-bold text-green-600">{todaysSessions.length}</p>
          </AccessibleCard>

          <AccessibleCard className="p-6 text-center">
            <TrendingUp size={32} className="mx-auto mb-3 text-purple-500" />
            <h3 className="font-semibold">Avg Progress</h3>
            <p className="text-2xl font-bold text-purple-600">82%</p>
          </AccessibleCard>

          <AccessibleCard className="p-6 text-center">
            <FileText size={32} className="mx-auto mb-3 text-orange-500" />
            <h3 className="font-semibold">Reports Due</h3>
            <p className="text-2xl font-bold text-orange-600">5</p>
          </AccessibleCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Patient Progress */}
          <AccessibleCard className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Patient Progress</h2>
            <div className="space-y-4">
              {patients.map((patient, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{patient.name}</h3>
                    <span className="text-sm text-gray-500">{patient.progress}% complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${patient.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{patient.notes}</p>
                  <p className="text-xs text-gray-500">Next: {patient.nextSession}</p>
                </div>
              ))}
            </div>
          </AccessibleCard>

          {/* Today's Schedule */}
          <AccessibleCard className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Today's Schedule</h2>
            <div className="space-y-4">
              {todaysSessions.map((session, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">{session.time}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{session.patient}</h3>
                    <p className="text-gray-600">{session.type}</p>
                  </div>
                  <AccessibleButton variant="secondary" size="sm">
                    View Details
                  </AccessibleButton>
                </div>
              ))}
            </div>
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
import React, { useState } from 'react';
import { AccessibleButton } from '../ui/AccessibleButton';
import { AccessibleCard } from '../ui/AccessibleCard';
import { Calendar, Heart, Utensils, Settings, Home, User, Bell } from 'lucide-react';

export function PhysicalInterface() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const mainActions = [
    { id: 'schedule', name: 'Daily Schedule', icon: Calendar, color: 'bg-blue-500' },
    { id: 'health', name: 'Health & Wellness', icon: Heart, color: 'bg-red-500' },
    { id: 'meals', name: 'Meal Planning', icon: Utensils, color: 'bg-green-500' },
    { id: 'settings', name: 'Settings', icon: Settings, color: 'bg-gray-500' },
  ];

  const handleActionSelect = (actionId: string) => {
    setSelectedAction(actionId);
  };

  return (
    <div className="space-y-12">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">AbleLink Dashboard</h1>
        <p className="text-2xl text-gray-600">Large buttons for easy access</p>
      </header>

      {/* Large Navigation Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {mainActions.map((action) => (
          <AccessibleCard
            key={action.id}
            interactive
            className={`p-8 text-center cursor-pointer hover:shadow-xl transition-all min-h-[160px] ${
              selectedAction === action.id ? 'ring-4 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => handleActionSelect(action.id)}
            aria-label={`Open ${action.name}`}
          >
            <div className={`w-20 h-20 rounded-full ${action.color} flex items-center justify-center mx-auto mb-4`}>
              <action.icon size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{action.name}</h2>
          </AccessibleCard>
        ))}
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AccessibleCard className="p-6 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-xl font-semibold mb-2">Today's Tasks</h3>
          <p className="text-lg text-gray-600">3 of 5 completed</p>
        </AccessibleCard>

        <AccessibleCard className="p-6 text-center">
          <div className="text-5xl mb-4">💊</div>
          <h3 className="text-xl font-semibold mb-2">Medications</h3>
          <p className="text-lg text-green-600">All taken today</p>
        </AccessibleCard>

        <AccessibleCard className="p-6 text-center">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="text-xl font-semibold mb-2">Next Appointment</h3>
          <p className="text-lg text-gray-600">Tomorrow 2:00 PM</p>
        </AccessibleCard>
      </div>

      {/* Large Action Buttons */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AccessibleButton
            size="lg"
            variant="primary"
            className="h-20 text-xl"
            icon={<Bell size={32} />}
          >
            Check Notifications
          </AccessibleButton>

          <AccessibleButton
            size="lg"
            variant="secondary"
            className="h-20 text-xl"
            icon={<User size={32} />}
          >
            Update Profile
          </AccessibleButton>

          <AccessibleButton
            size="lg"
            variant="primary"
            className="h-20 text-xl"
            icon={<Home size={32} />}
          >
            Emergency Contact
          </AccessibleButton>

          <AccessibleButton
            size="lg"
            variant="secondary"
            className="h-20 text-xl"
            icon={<Heart size={32} />}
          >
            Log Mood
          </AccessibleButton>
        </div>
      </div>

      {/* Selected Action Content */}
      {selectedAction && (
        <AccessibleCard className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">
            {mainActions.find(a => a.id === selectedAction)?.name}
          </h2>
          <p className="text-xl text-center text-gray-600">
            Content for {selectedAction} would be displayed here with large, easy-to-interact elements.
          </p>
          <div className="text-center mt-6">
            <AccessibleButton
              onClick={() => setSelectedAction(null)}
              variant="secondary"
              size="lg"
            >
              ← Back to Dashboard
            </AccessibleButton>
          </div>
        </AccessibleCard>
      )}
    </div>
  );
}
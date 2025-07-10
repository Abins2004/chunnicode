import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { DisabilityLayout } from '../layouts/DisabilityLayout';
import { CognitiveInterface } from '../disabilities/CognitiveInterface';
import { VisualInterface } from '../disabilities/VisualInterface';
import { HearingInterface } from '../disabilities/HearingInterface';
import { PhysicalInterface } from '../disabilities/PhysicalInterface';
import { AccessibleButton } from '../ui/AccessibleButton';
import { LogOut } from 'lucide-react';

export function UserDashboard() {
  const { user, signOut } = useAuth();
  const { setDisabilityType } = useAccessibility();

  React.useEffect(() => {
    if (user?.disability_type) {
      setDisabilityType(user.disability_type);
    }
  }, [user, setDisabilityType]);

  const renderInterface = () => {
    if (!user?.disability_type) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Welcome to AbleLink!</h2>
          <p className="text-lg text-gray-600 mb-6">
            Please update your profile to select a disability type for a customized experience.
          </p>
          <AccessibleButton variant="primary" size="lg">
            Update Profile
          </AccessibleButton>
        </div>
      );
    }

    switch (user.disability_type) {
      case 'cognitive':
        return <CognitiveInterface />;
      case 'visual':
        return <VisualInterface />;
      case 'hearing':
        return <HearingInterface />;
      case 'physical':
        return <PhysicalInterface />;
      default:
        return <div>Interface not configured</div>;
    }
  };

  return (
    <DisabilityLayout disabilityType={user?.disability_type || 'cognitive'}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Hello, {user?.name}!</h1>
          <p className="text-gray-600">
            {user?.disability_type && `${user.disability_type.charAt(0).toUpperCase() + user.disability_type.slice(1)} Interface`}
          </p>
        </div>
        <AccessibleButton
          onClick={signOut}
          variant="secondary"
          icon={<LogOut size={20} />}
          speakText="Sign out"
        >
          Sign Out
        </AccessibleButton>
      </div>

      {renderInterface()}
    </DisabilityLayout>
  );
}
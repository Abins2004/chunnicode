import React from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import type { DisabilityType } from '../../types';

interface DisabilityLayoutProps {
  children: React.ReactNode;
  disabilityType: DisabilityType;
}

export function DisabilityLayout({ children, disabilityType }: DisabilityLayoutProps) {
  const { settings } = useAccessibility();

  const layoutClasses = {
    cognitive: 'max-w-2xl mx-auto space-y-8 p-6',
    visual: 'max-w-4xl mx-auto space-y-6 p-8',
    hearing: 'max-w-6xl mx-auto space-y-4 p-4',
    physical: 'max-w-3xl mx-auto space-y-12 p-8',
  };

  const containerClasses = `min-h-screen ${settings.highContrast ? 'bg-black text-white' : 'bg-gray-50'} ${settings.largeFonts ? 'text-xl' : 'text-base'}`;

  return (
    <div className={containerClasses}>
      <div className={layoutClasses[disabilityType]}>
        {children}
      </div>
    </div>
  );
}
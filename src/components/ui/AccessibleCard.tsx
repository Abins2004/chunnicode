import React from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface AccessibleCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  role?: string;
  'aria-label'?: string;
}

export function AccessibleCard({ 
  children, 
  className = '', 
  interactive = false,
  role,
  'aria-label': ariaLabel,
}: AccessibleCardProps) {
  const { disabilityType } = useAccessibility();

  const baseClasses = 'bg-white rounded-xl shadow-md border border-gray-200 transition-all';
  const interactiveClasses = interactive 
    ? 'hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer' 
    : '';
  
  const disabilityClasses = {
    visual: 'border-2 border-gray-900',
    physical: 'min-h-[80px]',
    cognitive: 'border-l-4 border-l-blue-500',
    hearing: '',
  };

  const Component = interactive ? 'button' : 'div';

  return (
    <Component
      className={`${baseClasses} ${interactiveClasses} ${disabilityType ? disabilityClasses[disabilityType] : ''} ${className}`}
      role={role}
      aria-label={ariaLabel}
      tabIndex={interactive ? 0 : undefined}
    >
      {children}
    </Component>
  );
}
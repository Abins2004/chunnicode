import React from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  speakText?: string;
}

export function AccessibleButton({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  speakText,
  onClick,
  className = '',
  ...props
}: AccessibleButtonProps) {
  const { speak, disabilityType } = useAccessibility();

  const baseClasses = 'font-semibold rounded-lg transition-all focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  };

  const sizeClasses = {
    sm: disabilityType === 'physical' ? 'px-4 py-3 text-sm min-h-[48px]' : 'px-3 py-2 text-sm',
    md: disabilityType === 'physical' ? 'px-6 py-4 text-base min-h-[56px]' : 'px-4 py-2 text-base',
    lg: disabilityType === 'physical' ? 'px-8 py-6 text-lg min-h-[64px]' : 'px-6 py-3 text-lg',
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (speakText) {
      speak(speakText);
    }
    onClick?.(e);
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={handleClick}
      {...props}
    >
      <span className="flex items-center justify-center gap-2">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </span>
    </button>
  );
}
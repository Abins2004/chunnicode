import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { AccessibleButton } from '../ui/AccessibleButton';
import { Heart } from 'lucide-react';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart size={48} className="text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AbleLink</h1>
          <p className="text-lg text-gray-600">Connecting abilities, empowering lives</p>
        </div>

        {/* Auth Form */}
        {isLogin ? <LoginForm /> : <SignUpForm />}

        {/* Toggle Form */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <AccessibleButton
            onClick={() => setIsLogin(!isLogin)}
            variant="secondary"
            speakText={isLogin ? "Switch to sign up" : "Switch to sign in"}
          >
            {isLogin ? 'Create Account' : 'Sign In'}
          </AccessibleButton>
        </div>

        {/* Accessibility Notice */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 text-center">
            🎯 This app adapts to your specific accessibility needs. 
            Select your disability type during signup for a customized experience.
          </p>
        </div>
      </div>
    </div>
  );
}
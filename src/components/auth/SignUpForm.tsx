import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { AccessibleButton } from '../ui/AccessibleButton';
import { AccessibleCard } from '../ui/AccessibleCard';
import { UserPlus } from 'lucide-react';
import type { UserRole, DisabilityType } from '../../types';

export function SignUpForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' as UserRole,
    disabilityType: undefined as DisabilityType | undefined,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signUp } = useAuth();
  const { speak } = useAccessibility();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await signUp(
        formData.email,
        formData.password,
        formData.name,
        formData.role,
        formData.disabilityType
      );
      speak('Account created successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setError(message);
      speak(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AccessibleCard className="w-full max-w-md p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Join AbleLink</h1>
        <p className="text-gray-600">Create your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-blue-500 text-lg"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) => updateFormData('role', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-blue-500 text-lg"
            required
          >
            <option value="user">Specially-abled User</option>
            <option value="caregiver">Caregiver</option>
            <option value="therapist">Therapist/School Staff</option>
          </select>
        </div>

        {formData.role === 'user' && (
          <div>
            <label htmlFor="disabilityType" className="block text-sm font-medium text-gray-700 mb-2">
              Disability Type (Optional)
            </label>
            <select
              id="disabilityType"
              value={formData.disabilityType || ''}
              onChange={(e) => updateFormData('disabilityType', e.target.value || undefined)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-blue-500 text-lg"
            >
              <option value="">Select disability type</option>
              <option value="cognitive">Cognitive (ADHD, Autism)</option>
              <option value="visual">Visual Impairment</option>
              <option value="hearing">Hearing Impairment</option>
              <option value="physical">Physical Disability</option>
            </select>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-blue-500 text-lg"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => updateFormData('password', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-blue-500 text-lg"
            placeholder="Create a password"
            required
            minLength={6}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => updateFormData('confirmPassword', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-blue-500 text-lg"
            placeholder="Confirm your password"
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
            {error}
          </div>
        )}

        <AccessibleButton
          type="submit"
          disabled={loading}
          icon={<UserPlus size={20} />}
          speakText="Creating account"
          className="w-full"
          size="lg"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </AccessibleButton>
      </form>
    </AccessibleCard>
  );
}
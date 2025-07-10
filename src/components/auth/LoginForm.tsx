import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { AccessibleButton } from '../ui/AccessibleButton';
import { AccessibleCard } from '../ui/AccessibleCard';
import { LogIn, Eye, EyeOff } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn } = useAuth();
  const { speak } = useAccessibility();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
      speak('Successfully signed in');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      speak(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccessibleCard className="w-full max-w-md p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to AbleLink</h1>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-blue-500 text-lg"
            placeholder="Enter your email"
            required
            aria-describedby={error ? 'error-message' : undefined}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-blue-500 text-lg pr-12"
              placeholder="Enter your password"
              required
              aria-describedby={error ? 'error-message' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {error && (
          <div id="error-message" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
            {error}
          </div>
        )}

        <AccessibleButton
          type="submit"
          disabled={loading}
          icon={<LogIn size={20} />}
          speakText="Signing in"
          className="w-full"
          size="lg"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </AccessibleButton>
      </form>
    </AccessibleCard>
  );
}
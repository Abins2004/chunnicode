import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { AuthPage } from './components/auth/AuthPage';
import { UserDashboard } from './components/dashboards/UserDashboard';
import { CaregiverDashboard } from './components/dashboards/CaregiverDashboard';
import { TherapistDashboard } from './components/dashboards/TherapistDashboard';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading AbleLink...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const getDashboard = () => {
    switch (user.role) {
      case 'user':
        return <UserDashboard />;
      case 'caregiver':
        return <CaregiverDashboard />;
      case 'therapist':
        return <TherapistDashboard />;
      default:
        return <Navigate to="/auth" replace />;
    }
  };

  return (
    <Routes>
      <Route path="/" element={getDashboard()} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AccessibilityProvider>
          <div className="app">
            <AppRoutes />
          </div>
        </AccessibilityProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
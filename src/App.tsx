import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import LoadingSpinner from './components/LoadingSpinner';

const AppContainer: React.FC = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return session ? <DashboardPage /> : <AuthPage />;
};

const App: React.FC = () => (
  <AuthProvider>
    <AppContainer />
  </AuthProvider>
);

export default App;

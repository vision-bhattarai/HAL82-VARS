import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { authService } from './services/api';
import Navbar from './components/Navbar';
import StartEaseLanding from './pages/StartEaseLanding';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyDashboard from './pages/MyDashboard';
import CampaignDetail from './pages/CampaignDetail';
import AddCampaign from './pages/AddCampaign';
import BecomeStartup from './pages/BecomeStartup';
import HowItWorks from './pages/HowItWorks';
import Settings from './pages/Settings';
import './App.css';

function AppContent({ isAuthenticated, user, loading, onLogout, onLoginSuccess }) {
  const location = useLocation();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Hide navbar for StartEase landing page
  const showNavbar = location.pathname !== '/';

  return (
    <>
      {showNavbar && (
        <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={onLogout} />
      )}
      <Routes>
        <Route path="/" element={<StartEaseLanding isAuthenticated={isAuthenticated} user={user} onLogout={onLogout} />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={onLoginSuccess} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register onRegisterSuccess={onLoginSuccess} />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/my-dashboard" element={isAuthenticated ? <MyDashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/campaign/:id" element={<CampaignDetail isAuthenticated={isAuthenticated} />} />
        <Route path="/create-campaign" element={isAuthenticated ? <AddCampaign /> : <Navigate to="/login" />} />
        <Route path="/become-startup" element={isAuthenticated ? <BecomeStartup onSuccess={() => window.location.href = '/dashboard'} /> : <Navigate to="/login" />} />
        <Route path="/settings" element={isAuthenticated ? <Settings user={user} /> : <Navigate to="/login" />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
      </Routes>
    </>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await authService.getCurrentUser();
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <AppContent 
        isAuthenticated={isAuthenticated} 
        user={user} 
        loading={loading}
        onLogout={handleLogout}
        onLoginSuccess={handleLoginSuccess}
      />
    </Router>
  );
}

export default App;

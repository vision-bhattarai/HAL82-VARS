import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/api';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CampaignDetail from './pages/CampaignDetail';
import AddCampaign from './pages/AddCampaign';
import BecomeStartup from './pages/BecomeStartup';
import './App.css';

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
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register onRegisterSuccess={handleLoginSuccess} />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/campaign/:id" element={<CampaignDetail isAuthenticated={isAuthenticated} />} />
        <Route path="/create-campaign" element={isAuthenticated ? <AddCampaign /> : <Navigate to="/login" />} />
        <Route path="/become-startup" element={isAuthenticated ? <BecomeStartup onSuccess={() => window.location.href = '/dashboard'} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

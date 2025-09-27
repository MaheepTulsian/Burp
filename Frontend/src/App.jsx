// Main App component with routing setup
// This handles the overall application structure and authentication state

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Import wallet provider
import { WalletConnectProvider } from './components/WalletConnectProvider';

// Import pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cluster from './pages/Cluster';
import ClusterInfo from './pages/ClusterInfo';
import CoinDetail from './pages/CoinDetail';

// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App = () => {
  // Authentication state - in a real app this would be managed by context/redux
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check authentication status on app load
  useEffect(() => {
    const authToken = localStorage.getItem('burp_auth_token');
    const userData = localStorage.getItem('burp_user_data');

    if (authToken && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  // Handle login
  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    // Note: JWT token and user data are stored in Login.jsx during authentication
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('burp_auth_token');
    localStorage.removeItem('burp_user_data');
  };

  return (
    <WalletConnectProvider>
      <Router>
        <div className="min-h-screen bg-background">
          {/* Navigation - only show on authenticated pages */}
          {isAuthenticated && (
            <Navbar user={user} onLogout={handleLogout} />
          )}

          {/* Main content with smooth page transitions */}
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/"
                element={
                  isAuthenticated ?
                  <Navigate to="/dashboard" replace /> :
                  <Landing />
                }
              />
              <Route
                path="/login"
                element={
                  isAuthenticated ?
                  <Navigate to="/dashboard" replace /> :
                  <Login onLogin={handleLogin} />
                }
              />
              <Route
                path="/dashboard"
                element={
                  isAuthenticated ?
                  <Dashboard /> :
                  <Navigate to="/login" replace />
                }
              />
              <Route
                path="/cluster/create"
                element={
                  isAuthenticated ?
                  <Cluster /> :
                  <Navigate to="/login" replace />
                }
              />
              <Route
                path="/coin/:id"
                element={
                  isAuthenticated ?
                  <CoinDetail /> :
                  <Navigate to="/login" replace />
                }
              />
              <Route
                path="/cluster-info/:id"
                element={
                  isAuthenticated ?
                  <ClusterInfo /> :
                  <Navigate to="/login" replace />
                }
              />
              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>

          {/* Footer - only show on public pages */}
          {!isAuthenticated && <Footer />}
        </div>
      </Router>
    </WalletConnectProvider>
  );
};

export default App;
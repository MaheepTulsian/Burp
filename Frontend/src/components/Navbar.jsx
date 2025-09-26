// Navigation bar for authenticated users
// Shows user wallet info and logout functionality

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border-b border-card-border sticky top-0 z-50 backdrop-blur-sm bg-card/95"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div 
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="w-10 h-10 bg-cta rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-2xl font-bold text-foreground">BURP</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => navigate('/dashboard')}
              className={`font-medium transition-colors duration-300 ${
                isActive('/dashboard') 
                  ? 'text-cta' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Dashboard
            </button>
            <button className="text-muted-foreground hover:text-foreground font-medium transition-colors duration-300">
              Portfolio
            </button>
            <button className="text-muted-foreground hover:text-foreground font-medium transition-colors duration-300">
              Analytics
            </button>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-muted transition-colors duration-300"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-medium text-sm">
                  {user?.address?.slice(2, 4).toUpperCase()}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">
                  {user?.address?.slice(0, 6)}...{user?.address?.slice(-4)}
                </p>
                <p className="text-xs text-muted-foreground">{user?.balance}</p>
              </div>
              <svg 
                className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
                  showUserMenu ? 'rotate-180' : ''
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-64 bg-card border border-card-border rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-4 border-b border-card-border">
                  <p className="text-sm font-medium text-foreground mb-1">Connected Wallet</p>
                  <p className="text-xs font-mono text-muted-foreground break-all">{user?.address}</p>
                  <p className="text-xs text-muted-foreground mt-1">{user?.network}</p>
                </div>
                
                <div className="p-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-200">
                    Account Settings
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-200">
                    Transaction History
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
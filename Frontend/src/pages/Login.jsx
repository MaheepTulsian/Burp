// Wallet connection page with MetaMask simulation
// Handles authentication flow and redirects to dashboard

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../mock/api';
import WalletConnect from '../components/WalletConnect';
import Modal from '../components/Modal';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState(null);

  // Handle wallet connection
  const handleWalletConnect = async (walletType) => {
    setIsConnecting(true);
    
    try {
      // Simulate wallet connection
      const walletData = await mockApi.connectWallet(walletType);
      setConnectedWallet(walletData);
      setShowModal(true);
      
      // Auto-login after successful connection
      setTimeout(() => {
        onLogin(walletData);
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-6">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={handleBackToHome}
        className="absolute top-6 left-6 flex items-center text-foreground hover:text-cta transition-colors duration-300"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </motion.button>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-16 bg-cta rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <span className="text-white font-bold text-2xl">B</span>
          </motion.div>
          
          <h1 className="text-3xl font-bold text-foreground mb-4">Connect Your Wallet</h1>
          <p className="text-muted-foreground">
            Connect your wallet to access AI-powered crypto investment clusters
          </p>
        </div>

        {/* Wallet Connection Component */}
        <WalletConnect 
          onConnect={handleWalletConnect}
          isConnecting={isConnecting}
        />

        {/* Security note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-4 bg-primary-light rounded-xl border border-card-border"
        >
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-cta mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-medium text-foreground mb-1">Secure Connection</h4>
              <p className="text-sm text-muted-foreground">
                Your wallet information is never stored on our servers. We only request access to view your public address.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Success Modal */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title="Wallet Connected Successfully!"
      >
        {connectedWallet && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Welcome to BURP!</h3>
            <div className="bg-muted rounded-xl p-4 mb-4">
              <p className="text-sm text-muted-foreground mb-2">Connected Address:</p>
              <p className="font-mono text-sm text-foreground break-all">{connectedWallet.address}</p>
              <p className="text-sm text-muted-foreground mt-2">Network: {connectedWallet.network}</p>
            </div>
            <p className="text-muted-foreground">Redirecting to dashboard...</p>
          </div>
        )}
      </Modal>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary-medium opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary-medium opacity-10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Login;
// SPDX-License-Identifier: MIT
// Wallet connection page with RainbowKit authentication only

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAccount, useSignMessage, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Modal from '../components/Modal';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [authError, setAuthError] = useState('');
  const [hasTriggeredAuth, setHasTriggeredAuth] = useState(false);

  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();

  // Redirect if already authenticated
  useEffect(() => {
    const authToken = localStorage.getItem('burp_auth_token');
    const userData = localStorage.getItem('burp_user_data');

    if (authToken && userData) {
      const parsedUserData = JSON.parse(userData);
      onLogin(parsedUserData);
      navigate('/dashboard');
    }
  }, [navigate, onLogin]);

  // Auto-trigger RainbowKit authentication
  useEffect(() => {
    if (isConnected && address && !isConnecting && !hasTriggeredAuth) {
      setHasTriggeredAuth(true);
      handleWalletConnect();
    }
  }, [isConnected, address, isConnecting, hasTriggeredAuth]);

  // Backend authentication flow
  const authenticateWithBackend = async (walletAddress) => {
    try {
      console.log('🔑 Starting authentication for:', walletAddress);
      
      const nonceResponse = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/auth/nonce`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress }),
        }
      );

      const nonceData = await nonceResponse.json();
      console.log('🎲 Nonce response:', { success: nonceData.success, hasNonce: !!nonceData.data?.nonce });
      
      if (!nonceData.success) throw new Error(nonceData.message);

      const { nonce, signMessage } = nonceData.data;
      console.log('📝 Signing message...');

      const signature = await signMessageAsync({ message: signMessage });
      console.log('✍️ Message signed, signature length:', signature?.length);

      console.log('🚀 Calling create-account endpoint...');
      const authResponse = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/auth/create-account`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress,
            signature,
            nonce,
            userProfile: {
              // Optional profile data can be added here
            }
          }),
        }
      );

      console.log('📡 Auth response status:', authResponse.status);
      const authData = await authResponse.json();
      console.log('📋 Auth response data:', { success: authData.success, hasUser: !!authData.data?.user, hasToken: !!authData.data?.token });
      
      if (!authData.success) throw new Error(authData.message);

      return authData.data;
    } catch (error) {
      console.error('❌ Backend authentication failed:', error);
      throw error;
    }
  };

  // Handle RainbowKit wallet connection
  const handleWalletConnect = async () => {
    setIsConnecting(true);
    setAuthError('');

    try {
      if (isConnected && address) {
        const authData = await authenticateWithBackend(address);

        const walletData = {
          address,
          network: 'Ethereum',
          walletType: 'RainbowKit',
          user: authData.user,
          token: authData.token,
        };

        setConnectedWallet(walletData);
        localStorage.setItem('burp_auth_token', authData.token);
        localStorage.setItem('burp_user_data', JSON.stringify(walletData));

        console.log('✅ Authentication successful, redirecting to dashboard...');
        onLogin(walletData);
        navigate('/dashboard');
      } else {
        throw new Error('Please connect your wallet using RainbowKit.');
      }
    } catch (error) {
      setAuthError(error.message || 'Authentication failed');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleDisconnect = () => {
    disconnect();
    setAuthError('');
    setConnectedWallet(null);
    setHasTriggeredAuth(false);
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

        {/* Error Display */}
        {authError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 font-medium">{authError}</p>
            </div>
          </motion.div>
        )}

        {/* RainbowKit Connect Button */}
        <div className="mb-6">
          <ConnectButton.Custom>
            {({ account, chain, openConnectModal, mounted }) => {
              const ready = mounted;
              const connected = ready && account && chain;

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    'style': {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {!connected ? (
                    <motion.button
                      onClick={openConnectModal}
                      className="w-full p-4 bg-gradient-to-r from-cta to-cta-hover text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      🌈 Connect with Rainbow Kit
                    </motion.button>
                  ) : (
                    <div className="w-full p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 font-medium">Connected</p>
                          <p className="text-green-800 font-mono text-sm">{account.displayName}</p>
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            onClick={handleDisconnect}
                            className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Disconnect
                          </motion.button>
                          <motion.button
                            onClick={handleWalletConnect}
                            disabled={isConnecting}
                            className="px-4 py-2 bg-cta text-white font-medium rounded-lg hover:bg-cta-hover transition-colors duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {isConnecting ? 'Authenticating...' : 'Sign In'}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>

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

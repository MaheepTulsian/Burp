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
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

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
      console.log('🔄 Wallet connected, starting authentication flow...');
      setHasTriggeredAuth(true);
      // Add a small delay to ensure wallet is fully ready
      setTimeout(() => {
        handleWalletConnect();
      }, 1000);
    }
  }, [isConnected, address, isConnecting, hasTriggeredAuth]);

  // Handle wallet disconnection
  useEffect(() => {
    if (!isConnected && !address) {
      // Wallet was disconnected externally
      setConnectedWallet(null);
      setHasTriggeredAuth(false);
      setAuthError('');
      setRetryCount(0);
      console.log('🔌 Wallet disconnected externally');
    }
  }, [isConnected, address]);

  // Reset retry count when wallet reconnects
  useEffect(() => {
    if (isConnected && address) {
      setRetryCount(0);
      setAuthError('');
    }
  }, [isConnected, address]);

  // Backend authentication flow
  const authenticateWithBackend = async (walletAddress) => {
    try {
      console.log('🔑 Starting authentication for:', walletAddress);
      
      // Step 1: Get nonce from backend
      const nonceResponse = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/auth/nonce`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress }),
        }
      );

      if (!nonceResponse.ok) {
        throw new Error(`Failed to get nonce: ${nonceResponse.status}`);
      }

      const nonceData = await nonceResponse.json();
      console.log('🎲 Nonce response:', { success: nonceData.success, hasNonce: !!nonceData.data?.nonce });
      
      if (!nonceData.success) {
        throw new Error(nonceData.message || 'Failed to get nonce');
      }

      const { nonce, signMessage } = nonceData.data;
      console.log('📝 Signing message...');

      // Step 2: Sign the message with wallet
      let signature;
      try {
        signature = await signMessageAsync({ message: signMessage });
        console.log('✍️ Message signed, signature length:', signature?.length);
      } catch (signError) {
        console.error('❌ Signature error:', signError);
        if (signError.message.includes('User rejected')) {
          throw new Error('User rejected the signature request');
        } else if (signError.message.includes('not been authorized')) {
          throw new Error('Wallet not authorized. Please reconnect your wallet.');
        } else {
          throw new Error(`Signature failed: ${signError.message}`);
        }
      }

      // Step 3: Send signature to backend
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
      
      if (!authResponse.ok) {
        throw new Error(`Authentication failed: ${authResponse.status}`);
      }

      const authData = await authResponse.json();
      console.log('📋 Auth response data:', { success: authData.success, hasUser: !!authData.data?.user, hasToken: !!authData.data?.token });
      
      if (!authData.success) {
        throw new Error(authData.message || 'Authentication failed');
      }

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
      // Check if wallet is properly connected and authorized
      if (!isConnected || !address) {
        throw new Error('Wallet not connected. Please connect your wallet first.');
      }

      console.log('🔑 Starting authentication for wallet:', address);
      
      // Ensure wallet is ready before proceeding
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
    } catch (error) {
      console.error('❌ Authentication error:', error);
      
      // Handle specific error types
      if (error.message.includes('User rejected')) {
        setAuthError('Transaction was rejected. Please try again.');
      } else if (error.message.includes('not been authorized')) {
        setAuthError('Wallet not authorized. Please reconnect your wallet.');
      } else if (error.message.includes('Signature verification failed')) {
        setAuthError('Signature verification failed. Please try again.');
      } else {
        setAuthError(error.message || 'Authentication failed. Please try again.');
      }
      
      // Reset auth state on error
      setHasTriggeredAuth(false);
      
      // Add retry mechanism for authorization errors
      if (error.message.includes('not been authorized') && retryCount < 2) {
        console.log(`🔄 Retrying authentication (attempt ${retryCount + 1}/3)...`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          handleWalletConnect();
        }, 2000);
        return;
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleDisconnect = () => {
    setShowDisconnectConfirm(true);
  };

  const confirmDisconnect = () => {
    // Clear all local state
    setAuthError('');
    setConnectedWallet(null);
    setHasTriggeredAuth(false);
    
    // Clear localStorage
    localStorage.removeItem('burp_auth_token');
    localStorage.removeItem('burp_user_data');
    
    // Disconnect from wagmi
    disconnect();
    
    // Close confirmation dialog
    setShowDisconnectConfirm(false);
    
    console.log('🔌 Wallet disconnected and state cleared');
  };

  const cancelDisconnect = () => {
    setShowDisconnectConfirm(false);
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-800 font-medium">{authError}</p>
              </div>
              {authError.includes('not been authorized') && (
                <motion.button
                  onClick={() => {
                    setRetryCount(0);
                    setAuthError('');
                    handleWalletConnect();
                  }}
                  className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Retry
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* RainbowKit Connect Button */}
        <div className="mb-6">
          <ConnectButton.Custom>
            {({ account, chain, openConnectModal, openAccountModal, mounted }) => {
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
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-green-600 font-medium">Connected</p>
                            <p className="text-green-800 font-mono text-sm">{account.displayName}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            onClick={openAccountModal}
                            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Account
                          </motion.button>
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
                            className="px-4 py-2 bg-cta text-white font-medium rounded-lg hover:bg-cta-hover transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Disconnect Confirmation Modal */}
      <Modal 
        isOpen={showDisconnectConfirm} 
        onClose={cancelDisconnect}
        title="Disconnect Wallet"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Disconnect Wallet?</h3>
          <p className="text-muted-foreground mb-6">
            Are you sure you want to disconnect your wallet? You'll need to reconnect to access your account.
          </p>
          <div className="flex gap-3 justify-center">
            <motion.button
              onClick={cancelDisconnect}
              className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={confirmDisconnect}
              className="px-6 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Disconnect
            </motion.button>
          </div>
        </div>
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

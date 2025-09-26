// Wallet connection component with multiple wallet options
// Simulates MetaMask and other wallet connection flows

import React from 'react';
import { motion } from 'framer-motion';

const WalletConnect = ({ onConnect, isConnecting }) => {
  // Available wallet options
  const wallets = [
    {
      name: 'MetaMask',
      icon: '🦊',
      description: 'Connect using MetaMask wallet',
      popular: true
    },
    {
      name: 'WalletConnect',
      icon: '🔗',
      description: 'Connect using WalletConnect protocol',
      popular: false
    },
    {
      name: 'Coinbase Wallet',
      icon: '🔵',
      description: 'Connect using Coinbase Wallet',
      popular: false
    },
    {
      name: 'Trust Wallet',
      icon: '🛡️',
      description: 'Connect using Trust Wallet',
      popular: false
    }
  ];

  const handleWalletSelect = (walletName) => {
    if (!isConnecting) {
      onConnect(walletName);
    }
  };

  return (
    <div className="space-y-4">
      {wallets.map((wallet, index) => (
        <motion.button
          key={wallet.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          onClick={() => handleWalletSelect(wallet.name)}
          disabled={isConnecting}
          className={`w-full p-4 bg-card border border-card-border rounded-xl hover:border-cta hover:bg-primary-light transition-all duration-300 group ${
            isConnecting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">{wallet.icon}</div>
              <div className="text-left">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-foreground">{wallet.name}</h3>
                  {wallet.popular && (
                    <span className="px-2 py-1 bg-cta text-cta-foreground text-xs rounded-full font-medium">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{wallet.description}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              {isConnecting ? (
                <div className="w-5 h-5 border-2 border-cta border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg 
                  className="w-5 h-5 text-muted-foreground group-hover:text-cta transition-colors duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              )}
            </div>
          </div>
        </motion.button>
      ))}

      {isConnecting && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-6"
        >
          <div className="inline-flex items-center space-x-3 text-muted-foreground">
            <div className="w-4 h-4 border-2 border-cta border-t-transparent rounded-full animate-spin"></div>
            <span>Connecting to wallet...</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Please approve the connection in your wallet
          </p>
        </motion.div>
      )}

      {/* Help text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-8"
      >
        <p className="text-sm text-muted-foreground mb-2">
          Don't have a wallet?
        </p>
        <a 
          href="https://metamask.io/download/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-cta hover:text-cta-hover font-medium transition-colors duration-300"
        >
          Download MetaMask →
        </a>
      </motion.div>
    </div>
  );
};

export default WalletConnect;
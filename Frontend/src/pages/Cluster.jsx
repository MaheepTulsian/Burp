// Create cluster chat UI - Interactive chat to create a new investment cluster
// Features smooth 6-7 second treasure box animation when user confirms investment

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Chat from '../components/Chat';
import ClusterSummary from '../components/ClusterSummary';
import TreasureReveal from '../components/TreasureReveal';

const Cluster = () => {
  const navigate = useNavigate();
  
  const [cluster, setCluster] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [animationPhase, setAnimationPhase] = useState('initial'); // initial, treasure, summary
  const [showSummary, setShowSummary] = useState(false);
  const [chatComplete, setChatComplete] = useState(false);

  // Initialize chat with hardcoded data (will be replaced with API calls later)
  useEffect(() => {
    // Hardcoded initial chat messages for cluster creation
    const initialMessages = [
      {
        id: 1,
        sender: 'ai',
        message: "Hello! I'm your AI investment advisor. I'll help you create a personalized investment cluster. What's your risk tolerance?",
        timestamp: new Date(Date.now() - 300000),
        isSystem: true
      },
      {
        id: 2,
        sender: 'user',
        message: "I'm looking for moderate risk investments",
        timestamp: new Date(Date.now() - 240000)
      },
      {
        id: 3,
        sender: 'ai',
        message: "Great! I'll create a balanced portfolio for you. What investment amount are you considering?",
        timestamp: new Date(Date.now() - 180000),
        isSystem: true
      },
      {
        id: 4,
        sender: 'user',
        message: "$5000",
        timestamp: new Date(Date.now() - 120000)
      },
      {
        id: 5,
        sender: 'ai',
        message: "Perfect! Based on your preferences, I've created a diversified cluster with DeFi blue chips, Layer 2 tokens, and stable yields. Would you like to proceed with this investment cluster?",
        timestamp: new Date(Date.now() - 60000),
        isSystem: true,
        isFinal: true
      }
    ];

    setChatMessages(initialMessages);
    setChatComplete(true);
    
    // Set hardcoded cluster data that will be created at the end of chat
    const newCluster = {
      id: 'new-cluster-' + Date.now(),
      name: 'AI Moderate Risk Cluster',
      description: 'A balanced portfolio of DeFi and Layer 2 tokens with stable yields',
      tokens: [
        { symbol: 'ETH', percentage: 30, name: 'Ethereum' },
        { symbol: 'MATIC', percentage: 25, name: 'Polygon' },
        { symbol: 'AAVE', percentage: 20, name: 'Aave' },
        { symbol: 'UNI', percentage: 15, name: 'Uniswap' },
        { symbol: 'USDC', percentage: 10, name: 'USD Coin' }
      ],
      expectedReturn: '12-18%',
      riskLevel: 'Moderate',
      minInvestment: '$100',
      totalValue: '$1.2M'
    };

    // Simulate cluster creation after chat completion
    setTimeout(() => {
      setCluster(newCluster);
    }, 1000);
    
  }, []);

  // Handle user decision to create cluster (Yes/No)
  const handleUserDecision = (decision) => {
    if (decision === 'yes') {
      // User wants to create the cluster, start treasure reveal animation
      setAnimationPhase('treasure');
    } else {
      // User doesn't want to create cluster, go back to dashboard
      navigate('/dashboard');
    }
  };

  // Handle treasure animation complete
  const handleTreasureComplete = () => {
    setShowSummary(true);
  };

  // Handle investment after treasure reveal
  const handleInvestment = () => {
    console.log(`Creating and investing in cluster: ${cluster?.name}`);
    // In a real app, this would trigger the cluster creation and investment transaction
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {animationPhase === 'initial' ? (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto px-6 py-8"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-8"
            >
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Create Investment Cluster</h1>
                <p className="text-muted-foreground">Chat with AI to build your personalized investment portfolio</p>
              </div>
              
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
            </motion.div>

            {/* Chat Interface */}
            <Chat 
              messages={chatMessages}
              onUserDecision={handleUserDecision}
              showDecision={chatComplete}
              clusterName="Your AI Investment Cluster"
            />
          </motion.div>
        ) : animationPhase === 'treasure' && !showSummary ? (
          <motion.div
            key="treasure"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <TreasureReveal 
              cluster={cluster}
              onComplete={handleTreasureComplete}
            />
          </motion.div>
        ) : (
          <motion.div
            key="summary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <ClusterSummary 
              cluster={cluster}
              onInvest={handleInvestment}
              onViewDetails={() => navigate(`/cluster-info/${cluster.id}`)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cluster;
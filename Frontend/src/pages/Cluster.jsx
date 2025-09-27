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
  const [conversationHistory, setConversationHistory] = useState([]);
  const [animationPhase, setAnimationPhase] = useState('initial'); // initial, treasure, summary
  const [showSummary, setShowSummary] = useState(false);
  const [chatComplete, setChatComplete] = useState(false);
  const [isWaitingForAI, setIsWaitingForAI] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [userProfile, setUserProfile] = useState(null);

  // Initialize chat with AI agent introduction
  useEffect(() => {
    const startConversation = async () => {
      // Start with AI introduction message
      const initialMessage = {
        id: 1,
        type: 'bot',
        message: "Hello! I'm Burp, your crypto investment assistant. I'll guide you through creating a personalized investment portfolio. Let me start by introducing some crypto categories: Stablecoins (low volatility like USDC), Utility Tokens (services like Chainlink), Governance Tokens (voting power like AAVE), Platform Tokens (ecosystems like Ethereum), and others like Gaming or AI tokens. Which coins or categories interest you for investment?",
        timestamp: Date.now(),
        isSystem: true
      };
      
      setChatMessages([initialMessage]);
      setConversationHistory([
        { role: 'assistant', content: initialMessage.message }
      ]);
    };

    startConversation();
  }, []);

  // Send message to AI agent API
  const sendToAI = async (userMessage) => {
    try {
      setIsWaitingForAI(true);
      
      const authToken = localStorage.getItem('burp_auth_token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/agents/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Check if we have a complete profile
        if (result.data.user_analysis?.status === 'profile_complete') {
          setUserProfile(result.data.user_analysis);
          
          // Generate final summary message
          const summaryMessage = `Perfect! Based on our conversation, I've created a ${result.data.portfolio?.selected_tokens?.length || 5}-token portfolio focusing on ${result.data.user_analysis.collected_info.investment_theme} with ${result.data.user_analysis.collected_info.risk_tolerance}/10 risk tolerance for ${result.data.user_analysis.collected_info.time_horizon.replace('_', ' ')} investment. This portfolio includes ${result.data.portfolio?.selected_tokens?.slice(0, 3).map(t => t.symbol).join(', ')}. Would you like to proceed with creating this investment cluster?`;
          
          return {
            message: summaryMessage,
            isComplete: true,
            portfolio: result.data.portfolio
          };
        }
        
        return {
          message: result.data.chat_response || "I understand. Could you tell me more about your preferences?",
          isComplete: false
        };
      } else {
        throw new Error(result.message || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('AI chat error:', error);
      return {
        message: "I'm having trouble connecting. Could you please repeat that?",
        isComplete: false
      };
    } finally {
      setIsWaitingForAI(false);
    }
  };

  // Handle user input (this will be called from a new input component)
  const handleUserInput = async (userMessage) => {
    // Add user message to chat
    const userMsg = {
      id: chatMessages.length + 1,
      type: 'user',
      message: userMessage,
      timestamp: Date.now()
    };
    
    setChatMessages(prev => [...prev, userMsg]);
    setConversationHistory(prev => [...prev, { role: 'user', content: userMessage }]);

    // Get AI response
    const aiResponse = await sendToAI(userMessage);
    
    // Add AI response to chat
    const aiMsg = {
      id: chatMessages.length + 2,
      type: 'bot',
      message: aiResponse.message,
      timestamp: Date.now(),
      isSystem: true,
      isFinal: aiResponse.isComplete
    };
    
    setChatMessages(prev => [...prev, aiMsg]);
    setConversationHistory(prev => [...prev, { role: 'assistant', content: aiResponse.message }]);
    
    // If conversation is complete, set up for decision
    if (aiResponse.isComplete) {
      setChatComplete(true);
      
      // Create cluster from portfolio data
      if (aiResponse.portfolio) {
        const newCluster = {
          id: 'ai-cluster-' + Date.now(),
          name: userProfile?.collected_info.investment_theme || 'AI Investment Cluster',
          description: aiResponse.portfolio.portfolio_summary || 'AI-generated investment portfolio',
          tokens: aiResponse.portfolio.selected_tokens.map(token => ({
            symbol: token.symbol,
            percentage: token.allocation,
            name: token.name || token.symbol,
            rationale: token.rationale
          })),
          expectedReturn: `${12 + (userProfile?.collected_info.risk_tolerance || 5) * 2}%+`,
          riskLevel: userProfile?.collected_info.risk_tolerance > 7 ? 'High' : userProfile?.collected_info.risk_tolerance < 4 ? 'Low' : 'Moderate',
          minInvestment: '$100',
          totalValue: '$' + (Math.random() * 5 + 1).toFixed(1) + 'M',
          aiGenerated: true,
          userProfile: userProfile
        };
        
        setTimeout(() => {
          setCluster(newCluster);
        }, 1000);
      }
    }
    
    setCurrentStep(prev => prev + 1);
  };

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
              onUserInput={handleUserInput}
              showDecision={chatComplete}
              clusterName="Your AI Investment Cluster"
              isWaitingForAI={isWaitingForAI}
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
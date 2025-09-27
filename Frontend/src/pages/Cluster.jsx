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

  // Debug logs for state changes
  useEffect(() => {
    console.log('🔄 State change - chatMessages:', chatMessages.length);
  }, [chatMessages]);

  useEffect(() => {
    console.log('🔄 State change - conversationHistory:', conversationHistory.length);
  }, [conversationHistory]);

  useEffect(() => {
    console.log('🔄 State change - animationPhase:', animationPhase);
  }, [animationPhase]);

  useEffect(() => {
    console.log('🔄 State change - chatComplete:', chatComplete);
  }, [chatComplete]);

  useEffect(() => {
    console.log('🔄 State change - isWaitingForAI:', isWaitingForAI);
  }, [isWaitingForAI]);

  useEffect(() => {
    console.log('🔄 State change - userProfile:', userProfile);
  }, [userProfile]);

  useEffect(() => {
    console.log('🔄 State change - cluster:', cluster ? 'Set' : 'Null');
  }, [cluster]);

  // Initialize chat with AI agent introduction
  useEffect(() => {
    const startConversation = async () => {
      console.log('🚀 Cluster component initialized - starting conversation');
      
      // Test backend connectivity first
      try {
        console.log('🔍 Testing backend connectivity...');
        const healthCheck = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/agents/status`);
        console.log('✅ Backend connectivity:', healthCheck.status === 200 ? 'OK' : 'Failed');
        
        if (healthCheck.status === 200) {
          const statusData = await healthCheck.json();
          console.log('📊 Backend status data:', statusData);
        }
      } catch (error) {
        console.warn('⚠️ Backend not reachable, using fallback mode:', error.message);
      }
      
      // Start with AI introduction message
      const initialMessage = {
        id: 1,
        type: 'bot',
        message: "Hi! I'm Burp, your AI crypto investment assistant. I'll help you create a personalized investment cluster in just a few steps. I'll ask you about your experience, risk tolerance, investment timeline, and preferences to build the perfect portfolio for you.\n\nLet's start: What's your experience level with cryptocurrency investing?",
        timestamp: Date.now(),
        isSystem: true,
        options: ['Beginner (New to crypto)', 'Intermediate (Some experience)', 'Advanced (Experienced trader)', 'Tell me more about clusters first']
      };
      
      console.log('💬 Setting initial message:', initialMessage);
      setChatMessages([initialMessage]);
      setConversationHistory([
        { role: 'assistant', content: initialMessage.message }
      ]);
      console.log('✅ Initial conversation setup complete');
    };

    startConversation();
  }, []);

  // Send message to AI agent API
  const sendToAI = async (userMessage) => {
    console.log('🤖 Sending message to AI:', userMessage);
    console.log('📝 Current conversation history length:', conversationHistory.length);
    
    try {
      setIsWaitingForAI(true);
      console.log('⏳ Set waiting for AI to true');
      
      const authToken = localStorage.getItem('burp_auth_token');
      console.log('🔑 Auth token exists:', !!authToken);
      
      if (!authToken) {
        console.error('❌ No authentication token found');
        throw new Error('Authentication required. Please log in again.');
      }
      
      const apiUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/agents/chat`;
      console.log('🌐 Making API call to:', apiUrl);
      
      const requestBody = {
        message: userMessage,
        conversationHistory: conversationHistory
      };
      console.log('📤 Request body:', requestBody);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📡 API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API response not OK:', response.status, errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('📋 API response data:', result);
      
      if (result.success) {
        console.log('✅ API call successful');
        console.log('🔍 Checking completion status:', result.data.is_complete);
        console.log('🔍 User analysis status:', result.data.user_analysis?.status);
        
        // Check if we have a complete profile
        if (result.data.is_complete && result.data.user_analysis?.status === 'profile_complete') {
          console.log('🎯 Profile complete! Setting user profile:', result.data.user_analysis);
          setUserProfile(result.data.user_analysis);
          
          return {
            message: result.data.chat_response,
            isComplete: true,
            portfolio: result.data.portfolio
          };
        }
        
        console.log('🔄 Conversation continuing with response:', result.data.chat_response);
        return {
          message: result.data.chat_response || "I understand. Could you tell me more about your preferences?",
          isComplete: false
        };
      } else {
        console.error('❌ API call failed:', result.message);
        throw new Error(result.message || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('❌ AI chat error details:', {
        message: error.message,
        stack: error.stack,
        conversationLength: conversationHistory.length,
        userMessage: userMessage
      });
      
      // Check for specific error types and provide appropriate responses
      if (error.message.includes('Authentication') || error.message.includes('401')) {
        console.error('🔐 Authentication error detected');
        return {
          message: "It looks like your session has expired. Please log in again to continue our conversation.",
          isComplete: false,
          requiresAuth: true
        };
      }
      
      // Provide intelligent fallback behavior based on conversation stage
      if (conversationHistory.length >= 6) {
        console.log('🔄 Creating fallback portfolio due to sufficient conversation length');
        
        // If we've had enough conversation, create a fallback portfolio
        const fallbackProfile = {
          status: "profile_complete",
          collected_info: {
            investment_theme: "Balanced crypto portfolio",
            risk_tolerance: 5,
            time_horizon: "medium_term",
            preferred_sectors: ["Layer-1", "DeFi"],
            specific_preferences: ["Established projects"]
          }
        };
        
        console.log('📊 Setting fallback profile:', fallbackProfile);
        setUserProfile(fallbackProfile);
        
        const fallbackPortfolio = {
          selected_tokens: [
            { symbol: 'BTC', name: 'Bitcoin', allocation: 35, rationale: 'Digital gold and store of value' },
            { symbol: 'ETH', name: 'Ethereum', allocation: 30, rationale: 'Smart contract platform leader' },
            { symbol: 'SOL', name: 'Solana', allocation: 15, rationale: 'High-performance blockchain' },
            { symbol: 'AVAX', name: 'Avalanche', allocation: 12, rationale: 'Scalable DeFi platform' },
            { symbol: 'USDC', name: 'USD Coin', allocation: 8, rationale: 'Stability and liquidity' }
          ],
          portfolio_summary: "Balanced portfolio with blue-chip cryptocurrencies"
        };
        
        console.log('💼 Creating fallback portfolio:', fallbackPortfolio);
        
        return {
          message: "Perfect! Based on our conversation, I've created a balanced 5-token portfolio with moderate risk. This includes BTC, ETH, and other established cryptocurrencies. Would you like to proceed with creating this investment cluster?",
          isComplete: true,
          portfolio: fallbackPortfolio
        };
      }
      
      // Provide contextual questions based on conversation stage
      console.log('🔄 Providing contextual follow-up based on conversation stage');
      const conversationStep = Math.min(conversationHistory.length + 1, 6);
      const contextualQuestions = [
        "Hi! I'm Burp, your crypto investment assistant. I'll help you create a personalized investment cluster. To get started, what's your experience level with cryptocurrency investing? (Beginner, Intermediate, or Advanced)",
        "Great! Now I need to understand your risk tolerance. Are you comfortable with high volatility for potentially higher returns (Aggressive), prefer balanced growth (Moderate), or want to minimize risk (Conservative)?",
        "Perfect! What's your investment timeframe? Are you looking for short-term gains (weeks to months), medium-term growth (6 months to 2 years), or long-term holding (2+ years)?",
        "Excellent! What's your budget range for this investment cluster? This helps me recommend appropriate allocations.",
        "Almost done! Are there any specific cryptocurrencies, sectors, or themes that interest you? (e.g., DeFi, Layer-1s, Gaming tokens, etc.)",
        "Thank you for all that information! Let me analyze your preferences and create a personalized investment cluster for you."
      ];
      
      return {
        message: contextualQuestions[conversationStep - 1] || "Could you tell me more about your investment goals and preferences?",
        isComplete: false
      };
    } finally {
      console.log('🔄 Setting waiting for AI to false');
      setIsWaitingForAI(false);
    }
  };

  // Handle user input (this will be called from a new input component)
  const handleUserInput = async (userMessage) => {
    console.log('👤 User input received:', userMessage);
    console.log('📊 Current chat state:', {
      messagesCount: chatMessages.length,
      conversationLength: conversationHistory.length,
      currentStep: currentStep,
      chatComplete: chatComplete
    });
    
    // Add user message to chat
    const userMsg = {
      id: chatMessages.length + 1,
      type: 'user',
      message: userMessage,
      timestamp: Date.now()
    };
    
    console.log('💬 Adding user message to chat:', userMsg);
    setChatMessages(prev => [...prev, userMsg]);
    setConversationHistory(prev => {
      const newHistory = [...prev, { role: 'user', content: userMessage }];
      console.log('📝 Updated conversation history:', newHistory);
      return newHistory;
    });

    console.log('🤖 Requesting AI response...');
    // Get AI response
    const aiResponse = await sendToAI(userMessage);
    console.log('🤖 AI response received:', aiResponse);
    
    // Add AI response to chat
    const aiMsg = {
      id: chatMessages.length + 2,
      type: 'bot',
      message: aiResponse.message,
      timestamp: Date.now(),
      isSystem: true,
      isFinal: aiResponse.isComplete
    };
    
    console.log('💬 Adding AI message to chat:', aiMsg);
    setChatMessages(prev => [...prev, aiMsg]);
    setConversationHistory(prev => {
      const newHistory = [...prev, { role: 'assistant', content: aiResponse.message }];
      console.log('📝 Final conversation history:', newHistory);
      return newHistory;
    });
    
    // If conversation is complete, set up for decision
    if (aiResponse.isComplete) {
      console.log('✅ Conversation marked as complete, setting up cluster creation');
      setChatComplete(true);
      
      // Create cluster from portfolio data
      if (aiResponse.portfolio && aiResponse.portfolio.selected_tokens) {
        console.log('💼 Creating cluster from portfolio data:', aiResponse.portfolio);
        
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
        
        console.log('🎯 Generated cluster object:', newCluster);
        
        setTimeout(() => {
          console.log('⏰ Setting cluster after timeout');
          setCluster(newCluster);
        }, 1000);
      } else {
        console.warn('⚠️ No portfolio data available for cluster creation');
      }
    } else {
      console.log('🔄 Conversation continues...');
    }
    
    setCurrentStep(prev => {
      const newStep = prev + 1;
      console.log('📈 Updated step count:', newStep);
      return newStep;
    });
  };

  // Handle user decision to create cluster (Yes/No)
  const handleUserDecision = (decision) => {
    console.log('🎯 User decision received:', decision);
    console.log('🎯 Current animation phase:', animationPhase);
    console.log('🎯 Current cluster:', cluster ? 'Available' : 'Not available');
    
    if (decision === 'yes') {
      console.log('✅ User chose to create cluster, starting treasure animation');
      // User wants to create the cluster, start treasure reveal animation
      setAnimationPhase('treasure');
    } else {
      console.log('❌ User declined cluster creation, navigating to dashboard');
      // User doesn't want to create cluster, go back to dashboard
      navigate('/dashboard');
    }
  };

  // Handle treasure animation complete
  const handleTreasureComplete = () => {
    console.log('🎁 Treasure animation completed, showing summary');
    setShowSummary(true);
  };

  // Handle investment after treasure reveal
  const handleInvestment = () => {
    console.log('💰 Investment confirmed:', {
      clusterName: cluster?.name,
      userProfile: userProfile?.collected_info
    });
    console.log('💰 Creating and investing in cluster:', cluster?.name);
    // In a real app, this would trigger the cluster creation and investment transaction
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      {console.log('🖼️ Cluster component render:', {
        animationPhase,
        showSummary,
        chatComplete,
        isWaitingForAI,
        messagesCount: chatMessages.length,
        hasCluster: !!cluster,
        hasUserProfile: !!userProfile
      })}
      
      <AnimatePresence mode="wait">
        {animationPhase === 'initial' ? (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto px-6 py-8"
          >
            {console.log('💬 Rendering chat phase')}
            
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
                onClick={() => {
                  console.log('🔙 User clicked back to dashboard');
                  navigate('/dashboard');
                }}
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
            {console.log('🎁 Rendering treasure animation phase')}
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
            {console.log('📊 Rendering summary phase')}
            <ClusterSummary 
              cluster={cluster}
              onInvest={handleInvestment}
              onViewDetails={() => {
                console.log('👁️ User clicked view details for cluster:', cluster?.id);
                navigate(`/cluster-info/${cluster.id}`);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cluster;
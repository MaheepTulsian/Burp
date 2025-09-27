// Cluster detail page with chat interface and treasure reveal animation
// Features smooth 6-7 second treasure box animation when user confirms investment

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { mockApi } from '../mock/api';
import Chat from '../components/Chat';
import ClusterSummary from '../components/ClusterSummary';
import TreasureReveal from '../components/TreasureReveal';

const Cluster = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [cluster, setCluster] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animationPhase, setAnimationPhase] = useState('initial'); // initial, treasure, summary
  const [showSummary, setShowSummary] = useState(false);
  const [chatComplete, setChatComplete] = useState(false);

  // Load cluster data and chat messages
  useEffect(() => {
    const loadClusterData = async () => {
      try {
        setLoading(true);
        const [clusterData, chatData] = await Promise.all([
          mockApi.getCluster(id),
          mockApi.getClusterChat(id)
        ]);
        
        setCluster(clusterData);
        setChatMessages(chatData);
        
        // Check if chat is complete (has final message)
        const hasFinalMessage = chatData.some(msg => msg.isFinal);
        setChatComplete(hasFinalMessage);
        
      } catch (error) {
        console.error('Failed to load cluster data:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadClusterData();
    }
  }, [id, navigate]);

  // Handle user decision (Yes/No)
  const handleUserDecision = (decision) => {
    if (decision === 'yes') {
      setAnimationPhase('treasure');
    } else {
      navigate('/dashboard');
    }
  };

  // Handle treasure animation complete
  const handleTreasureComplete = () => {
    setShowSummary(true);
  };

  // Handle investment after treasure reveal
  const handleInvestment = () => {
    console.log(`Investing in cluster: ${cluster?.name}`);
    // In a real app, this would trigger the investment transaction
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading cluster analysis...</p>
        </div>
      </div>
    );
  }

  if (!cluster) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Cluster Not Found</h1>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-cta hover:bg-cta-hover text-cta-foreground rounded-xl font-medium transition-colors duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

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
                <h1 className="text-3xl font-bold text-foreground mb-2">{cluster.name}</h1>
                <p className="text-muted-foreground">{cluster.description}</p>
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
              clusterName={cluster.name}
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
// Fancy cluster showcase component displayed after treasure animation
// Features enhanced visuals, performance metrics, and detailed token breakdown

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TokenBadge from './TokenBadge';

const ClusterSummary = ({ cluster, onInvest, onViewDetails }) => {
  const [selectedToken, setSelectedToken] = useState(null);
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const handleTokenClick = (token) => {
    navigate(`/coin/${token.symbol}`);
  };

  // Get performance color
  const getPerformanceColor = (change) => {
    const value = parseFloat(change.replace('%', '').replace('+', ''));
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto p-6 space-y-8"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-24 h-24 bg-gradient-to-br from-cta to-primary-dark rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
        >
          <span className="text-3xl font-bold text-white">
            {cluster.name.split(' ').map(word => word[0]).join('')}
          </span>
        </motion.div>
        
        <h1 className="text-4xl font-bold text-foreground mb-4">{cluster.name}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {cluster.description}
        </p>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div 
        variants={itemVariants}
        className="grid md:grid-cols-4 gap-6"
      >
        <div className="card-gradient rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-primary-medium rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Value</h3>
          <p className="text-2xl font-bold text-foreground">{cluster.stats.totalValue}</p>
        </div>

        <div className="card-gradient rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Annual Yield</h3>
          <p className="text-2xl font-bold text-green-600">{cluster.stats.apy}</p>
        </div>

        <div className="card-gradient rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Risk Level</h3>
          <p className="text-2xl font-bold text-orange-600">{cluster.stats.risk}</p>
        </div>

        <div className="card-gradient rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-cta rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Assets</h3>
          <p className="text-2xl font-bold text-foreground">{cluster.stats.tokens}</p>
        </div>
      </motion.div>

      {/* Token Allocation Visualization */}
      <motion.div variants={itemVariants} className="card-gradient rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Asset Allocation</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cluster.tokens.map((token, index) => (
            <motion.div
              key={token.symbol}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleTokenClick(token)}
              className="bg-muted rounded-xl p-4 cursor-pointer hover:bg-accent transition-colors duration-300 border border-transparent hover:border-cta"
            >
              <div className="flex items-center space-x-3 mb-3">
                <TokenBadge symbol={token.symbol} size="md" />
                <div>
                  <h4 className="font-semibold text-foreground">{token.symbol}</h4>
                  <p className="text-sm text-muted-foreground">{token.allocation}%</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="font-medium text-foreground">{token.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">24h Change</span>
                  <span className={`font-medium ${getPerformanceColor(token.change)}`}>
                    {token.change}
                  </span>
                </div>
              </div>
              
              {/* Allocation Bar */}
              <div className="mt-3">
                <div className="w-full bg-border rounded-full h-2">
                  <motion.div
                    className="bg-cta h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${token.allocation}%` }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-primary-light rounded-xl p-6 border border-primary"
        >
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-cta rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">AI Optimization Insights</h3>
              <p className="text-muted-foreground leading-relaxed">
                This cluster has been optimized by our AI algorithm for maximum risk-adjusted returns. 
                The allocation weights are dynamically adjusted based on market volatility, correlation patterns, 
                and momentum indicators across the selected assets.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onInvest}
          className="px-8 py-4 bg-cta hover:bg-cta-hover text-cta-foreground text-lg font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl"
        >
          Invest in {cluster.name}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onViewDetails}
          className="px-8 py-4 bg-secondary hover:bg-accent text-secondary-foreground text-lg font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg"
        >
          View Detailed Analysis
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ClusterSummary;
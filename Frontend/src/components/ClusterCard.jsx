// Cluster card component for dashboard
// Shows cluster info with overlapping token icons and hover effects

import React from 'react';
import { motion } from 'framer-motion';
import TokenBadge from './TokenBadge';

const ClusterCard = ({ cluster, onClick }) => {
  // Get risk color
  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'medium-high': return 'text-orange-600 bg-orange-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cluster-card rounded-2xl p-6 cursor-pointer h-full min-h-[300px] flex flex-col"
    >
      {/* Header with tokens */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex -space-x-2">
          {cluster.tokens.slice(0, 4).map((token, index) => (
            <TokenBadge 
              key={token.symbol} 
              symbol={token.symbol} 
              size="sm"
              className={`border-2 border-card ${index > 0 ? 'z-10' : 'z-20'}`}
              style={{ marginLeft: index > 0 ? '-8px' : '0' }}
            />
          ))}
          {cluster.tokens.length > 4 && (
            <div className="w-8 h-8 bg-muted border-2 border-card rounded-full flex items-center justify-center text-xs font-medium text-muted-foreground z-10">
              +{cluster.tokens.length - 4}
            </div>
          )}
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(cluster.stats.risk)}`}>
          {cluster.stats.risk}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-xl font-bold text-foreground mb-3">{cluster.name}</h3>
        <p className="text-muted-foreground mb-6 leading-relaxed">{cluster.description}</p>
        
        {/* Stats */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Value</span>
            <span className="font-semibold text-foreground">{cluster.stats.totalValue}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">APY</span>
            <span className="font-semibold text-green-600">{cluster.stats.apy}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Tokens</span>
            <span className="font-semibold text-foreground">{cluster.stats.tokens}</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 pt-4 border-t border-card-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Click to analyze</span>
          <svg className="w-5 h-5 text-cta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export default ClusterCard;
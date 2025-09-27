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
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="cluster-card rounded-3xl p-8 cursor-pointer h-full min-h-[350px] flex flex-col relative group"
    >
      {/* Premium Circular Cluster Representation */}
      <div className="flex items-center justify-center mb-8">
        <motion.div 
          className="relative w-32 h-32"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          {/* Central Core */}
          <div className="absolute inset-1/2 w-12 h-12 -ml-6 -mt-6 bg-gradient-to-br from-gold to-gold-dark rounded-full shadow-lg flex items-center justify-center z-20 group-hover:animate-glow">
            <span className="text-foreground font-bold text-lg">
              {cluster.name.split(' ').map(word => word[0]).join('')}
            </span>
          </div>
          
          {/* Orbiting Token Elements */}
          {cluster.tokens.slice(0, 6).map((token, index) => {
            const angle = (index * 60) - 90;
            const radius = 45;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            
            return (
              <motion.div
                key={token.symbol}
                className="absolute w-8 h-8 bg-gradient-to-br from-gold-light to-gold rounded-full border-2 border-gold shadow-md flex items-center justify-center"
                style={{
                  left: '50%',
                  top: '50%',
                  marginLeft: x - 16,
                  marginTop: y - 16,
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }
                }}
              >
                <span className="text-foreground text-xs font-bold">
                  {token.symbol.slice(0, 2)}
                </span>
              </motion.div>
            );
          })}
          
          {/* Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 128 128">
            {cluster.tokens.slice(0, 6).map((_, index) => {
              const angle = (index * 60) - 90;
              const radius = 45;
              const x = 64 + Math.cos((angle * Math.PI) / 180) * radius;
              const y = 64 + Math.sin((angle * Math.PI) / 180) * radius;
              
              return (
                <motion.line
                  key={index}
                  x1="64"
                  y1="64"
                  x2={x}
                  y2={y}
                  stroke="hsl(42, 50%, 70%)"
                  strokeWidth="1"
                  opacity="0.3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              );
            })}
          </svg>
        </motion.div>
      </div>

      {/* Risk Badge */}
      <div className="absolute top-6 right-6">
        <div className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getRiskColor(cluster.stats.risk)}`}>
          {cluster.stats.risk}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 text-center">
        <h3 className="text-2xl font-bold text-foreground mb-4">{cluster.name}</h3>
        <p className="text-muted-foreground mb-8 leading-relaxed text-lg">{cluster.description}</p>
        
        {/* Premium Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-gold-light to-gold p-4 rounded-2xl border border-gold shadow-md">
            <div className="text-xs font-medium text-foreground opacity-80 mb-1">Total Value</div>
            <div className="font-bold text-foreground text-lg">{cluster.stats.totalValue}</div>
          </div>
          
          <div className="bg-gradient-to-br from-gold-light to-gold p-4 rounded-2xl border border-gold shadow-md">
            <div className="text-xs font-medium text-foreground opacity-80 mb-1">APY</div>
            <div className="font-bold text-green-700 text-lg">{cluster.stats.apy}</div>
          </div>
          
          <div className="bg-gradient-to-br from-gold-light to-gold p-4 rounded-2xl border border-gold shadow-md">
            <div className="text-xs font-medium text-foreground opacity-80 mb-1">Assets</div>
            <div className="font-bold text-foreground text-lg">{cluster.stats.tokens}</div>
          </div>
        </div>
      </div>

      {/* Premium CTA */}
      <motion.div 
        className="mt-auto"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="btn-premium w-full py-4 rounded-2xl text-center font-bold text-lg flex items-center justify-center group">
          <span>Analyze Cluster</span>
          <motion.svg 
            className="ml-3 w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </motion.svg>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ClusterCard;
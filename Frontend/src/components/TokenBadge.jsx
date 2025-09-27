// Token badge component for displaying cryptocurrency tokens
// Shows token symbol with colored background and responsive sizing

import React from 'react';
import { motion } from 'framer-motion';

const TokenBadge = ({ symbol, size = 'md', className = '', style = {} }) => {
  // Get token color based on symbol (simple hash-based coloring)
  const getTokenColor = (symbol) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500', 
      'bg-green-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-orange-500',
      'bg-teal-500',
      'bg-cyan-500'
    ];
    
    let hash = 0;
    for (let i = 0; i < symbol.length; i++) {
      hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Size variants
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm', 
    lg: 'w-16 h-16 text-lg'
  };

  const colorClass = getTokenColor(symbol);
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center font-bold text-white shadow-lg ${className}`}
      style={style}
    >
      {symbol.slice(0, size === 'lg' ? 3 : 2)}
    </motion.div>
  );
};

export default TokenBadge;
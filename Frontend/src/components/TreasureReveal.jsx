// Treasure reveal animation component with 6-7 second smooth opening animation
// Features 6 sections opening like a treasure box with particle effects

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TokenBadge from './TokenBadge';

const TreasureReveal = ({ cluster, onComplete }) => {
  const [animationPhase, setAnimationPhase] = useState('initial'); // initial, opening, revealing, complete
  const [openedSections, setOpenedSections] = useState([]);

  useEffect(() => {
    // Start animation sequence
    const sequence = async () => {
      // Phase 1: Initial state (0.5s)
      await new Promise(resolve => setTimeout(resolve, 500));
      setAnimationPhase('opening');

      // Phase 2: Open sections one by one (4s total)
      for (let i = 0; i < 6; i++) {
        await new Promise(resolve => setTimeout(resolve, 600));
        setOpenedSections(prev => [...prev, i]);
      }

      // Phase 3: Reveal contents (1s)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnimationPhase('revealing');

      // Phase 4: Complete animation (1s)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnimationPhase('complete');
    };

    sequence();
  }, []);

  // Generate premium particle positions for enhanced sparkle effect
  const generateParticles = (count) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 3,
      size: 2 + Math.random() * 4
    }));
  };

  const particles = generateParticles(30);

  // Section animation variants
  const sectionVariants = {
    closed: {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      opacity: 1
    },
    opening: (index) => ({
      rotateX: index < 3 ? -90 : 90,
      rotateY: index % 2 === 0 ? -45 : 45,
      scale: 0.8,
      opacity: 0.7,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: index * 0.15
      }
    }),
    opened: {
      rotateX: 0,
      rotateY: 0,
      scale: 0,
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const contentVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
      rotateZ: -180
    },
    visible: {
      scale: 1,
      opacity: 1,
      rotateZ: 0,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.5
      }
    }
  };

  const tokenListVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.8
      }
    }
  };

  const tokenItemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Premium Particle Effects */}
      {animationPhase !== 'initial' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute bg-gradient-to-r from-gold to-gold-light rounded-full shadow-lg"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
              }}
              animate={{
                scale: [0, 1.2, 0.8, 0],
                opacity: [0, 0.8, 0.6, 0],
                rotate: [0, 720],
                x: [0, Math.sin(particle.id) * 50, 0],
                y: [0, Math.cos(particle.id) * 50, 0]
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                repeatDelay: 4,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Premium Glow Effects */}
          <div className="absolute inset-0 bg-gradient-radial from-gold/20 via-transparent to-transparent blur-xl"></div>
          <div className="absolute inset-0 bg-gradient-conic from-gold-light/30 via-gold/20 to-gold-light/30 animate-spin" style={{animationDuration: '20s'}}></div>
        </div>
      )}

      {/* Treasure Box Container */}
      <div className="relative flex items-center justify-center min-h-[600px]">
        {animationPhase === 'initial' || animationPhase === 'opening' ? (
          /* Treasure Box Sections */
          <div className="relative w-80 h-80">
            {/* Premium Center Glow Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-radial from-gold to-gold-dark rounded-full opacity-30 blur-3xl"
              animate={{
                scale: animationPhase === 'opening' ? [1, 2, 1.5, 1] : 1,
                opacity: animationPhase === 'opening' ? [0.3, 0.7, 0.5, 0.3] : 0.3,
                rotate: [0, 360]
              }}
              transition={{
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 8, repeat: Infinity, ease: "linear" }
              }}
            />
            
            {/* Additional Premium Glow Layers */}
            <motion.div
              className="absolute inset-4 bg-gold-light rounded-full opacity-40 blur-2xl"
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Six treasure box sections */}
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const isOpened = openedSections.includes(index);
              const angle = (index * 60) - 90; // Position sections in a circle
              const radius = 120;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;

              return (
                <motion.div
                  key={index}
                  className="absolute w-24 h-24 bg-gradient-to-br from-gold-light via-gold to-gold-dark rounded-3xl border-4 border-gold shadow-2xl"
                  style={{
                    left: '50%',
                    top: '50%',
                    marginLeft: '-48px',
                    marginTop: '-48px',
                    transformOrigin: 'center center'
                  }}
                  initial="closed"
                  animate={isOpened ? "opened" : animationPhase === 'opening' ? "opening" : "closed"}
                  variants={sectionVariants}
                  custom={index}
                >
                  {/* Premium Section Content */}
                  <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{
                        x: ["-100%", "100%"]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                      className="w-12 h-12 bg-gradient-to-br from-gold to-gold-dark rounded-2xl flex items-center justify-center shadow-lg border-2 border-gold-light z-10"
                    >
                      <span className="text-foreground font-bold text-sm">
                        {cluster.tokens[index]?.symbol.slice(0, 2) || '✨'}
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}

            {/* Premium Central Core */}
            <motion.div
              className="absolute inset-1/2 w-20 h-20 -ml-10 -mt-10 bg-gradient-to-br from-gold via-gold-light to-gold-dark rounded-full shadow-2xl border-4 border-gold-light relative overflow-hidden"
              animate={{
                scale: animationPhase === 'opening' ? [1, 1.4, 1.2, 1] : 1,
                rotate: [0, 360],
                boxShadow: animationPhase === 'opening' 
                  ? [
                      "0 0 0 hsl(42, 100%, 50%, 0.5)", 
                      "0 0 40px hsl(42, 100%, 50%, 0.9)", 
                      "0 0 60px hsl(42, 100%, 50%, 0.7)",
                      "0 0 20px hsl(42, 100%, 50%, 0.5)"
                    ]
                  : "0 0 20px hsl(42, 100%, 50%, 0.5)"
              }}
              transition={{
                rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              {/* Premium Core Shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"
                animate={{
                  x: ["-100%", "100%"]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <div className="w-full h-full flex items-center justify-center relative z-10">
                <motion.span 
                  className="text-foreground font-bold text-2xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    textShadow: ["0 0 0px hsl(42, 100%, 30%)", "0 0 10px hsl(42, 100%, 30%)", "0 0 0px hsl(42, 100%, 30%)"]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  B
                </motion.span>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Revealed Content */
          <AnimatePresence>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={contentVariants}
              className="text-center"
            >
              {/* Success Icon */}
              <motion.div
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>

              <motion.h2
                className="text-4xl font-bold text-foreground mb-4"
                animate={{
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {cluster.name} Unlocked!
              </motion.h2>

              <motion.p className="text-xl text-muted-foreground mb-8">
                Your AI-optimized portfolio is ready for investment
              </motion.p>

              {/* Token List */}
              <motion.div
                variants={tokenListVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
              >
                {cluster.tokens.map((token, index) => (
                  <motion.div
                    key={token.symbol}
                    variants={tokenItemVariants}
                    className="bg-card border border-card-border rounded-xl p-4 text-center hover:border-cta transition-colors duration-300"
                  >
                    <TokenBadge symbol={token.symbol} size="lg" className="mx-auto mb-2" />
                    <h4 className="font-semibold text-foreground">{token.symbol}</h4>
                    <p className="text-sm text-muted-foreground">{token.allocation}%</p>
                    <p className="text-xs text-green-600 font-medium">{token.change}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Investment Button */}
              {animationPhase === 'complete' && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  onClick={onComplete}
                  className="px-12 py-4 bg-cta hover:bg-cta-hover text-cta-foreground text-lg font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  Continue to Cluster Summary
                </motion.button>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default TreasureReveal;
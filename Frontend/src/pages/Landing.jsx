// Landing page with hero section and platform overview
// Features light-blue gradient background and smooth animations

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  // Animation variants for smooth entrance effects
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
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

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen hero-gradient">
      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-cta rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-2xl font-bold text-foreground">BURP</span>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onClick={handleGetStarted}
            className="px-6 py-2 bg-cta hover:bg-cta-hover text-cta-foreground rounded-xl font-medium transition-all duration-300 hover:shadow-lg"
          >
            Connect Wallet
          </motion.button>
        </div>
      </header>

      {/* Hero Section */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 px-6 py-20"
      >
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Headline */}
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold text-foreground mb-8 leading-tight"
          >
            Blockchain Unified
            <br />
            <span className="text-cta">Rebalancing Platform</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Decentralized AI-powered crypto investment platform with AI-managed thematic baskets, 
            PYUSD settlement, privacy-preserving KYC via Self Protocol, best-execution via 1inch, 
            and price feeds via Pyth Network.
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={itemVariants}>
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center px-12 py-4 bg-cta hover:bg-cta-hover text-cta-foreground text-lg font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <span>Get Started</span>
              <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </motion.div>

          {/* Feature Grid */}
          <motion.div 
            variants={itemVariants}
            className="grid md:grid-cols-3 gap-8 mt-20"
          >
            <div className="card-gradient rounded-2xl p-8 hover-lift">
              <div className="w-12 h-12 bg-primary-medium rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">AI-Powered Rebalancing</h3>
              <p className="text-muted-foreground leading-relaxed">
                Advanced algorithms continuously optimize your portfolio allocation based on market conditions and risk tolerance.
              </p>
            </div>

            <div className="card-gradient rounded-2xl p-8 hover-lift">
              <div className="w-12 h-12 bg-primary-medium rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Privacy-First KYC</h3>
              <p className="text-muted-foreground leading-relaxed">
                Secure identity verification through Self Protocol ensures your privacy while maintaining regulatory compliance.
              </p>
            </div>

            <div className="card-gradient rounded-2xl p-8 hover-lift">
              <div className="w-12 h-12 bg-primary-medium rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Best Execution</h3>
              <p className="text-muted-foreground leading-relaxed">
                Integrated with 1inch for optimal trade routing and Pyth Network for real-time, accurate price feeds.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.main>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-medium opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-medium opacity-20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Landing;
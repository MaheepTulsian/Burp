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
    <div className="min-h-screen hero-gradient relative">
      {/* Floating Gold Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gold opacity-20 rounded-full blur-2xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gold-light opacity-30 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-gold-dark opacity-15 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-4"
          >
            <motion.div 
              className="w-12 h-12 bg-gradient-to-br from-gold to-gold-dark rounded-2xl flex items-center justify-center shadow-lg animate-glow"
              whileHover={{ scale: 1.1 }}
            >
              <span className="text-foreground font-bold text-xl">B</span>
            </motion.div>
            <span className="text-3xl font-bold text-foreground tracking-wide">BURP</span>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onClick={handleGetStarted}
            className="btn-premium px-8 py-3 rounded-2xl font-semibold text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
        className="relative z-10 px-6 py-24"
      >
        <div className="max-w-7xl mx-auto text-center">
          {/* Premium Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-gold-light to-gold rounded-full text-foreground font-semibold mb-8 shadow-lg"
          >
            <span className="w-2 h-2 bg-gold-dark rounded-full mr-3 animate-pulse"></span>
            Premium AI-Powered Investment Platform
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            variants={itemVariants}
            className="text-6xl md:text-8xl font-bold text-foreground mb-8 leading-tight"
          >
            Blockchain Unified
            <br />
            <span className="bg-gradient-to-r from-gold to-gold-dark bg-clip-text text-transparent">Rebalancing Platform</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-5xl mx-auto leading-relaxed"
          >
            Experience the future of decentralized investing with our AI-powered platform featuring 
            thematic baskets, PYUSD settlement, privacy-preserving KYC, and best-execution routing.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <motion.button
              onClick={handleGetStarted}
              className="btn-premium inline-flex items-center px-16 py-5 text-xl font-bold rounded-3xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Get Started</span>
              <svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.button>
            
            <motion.button
              className="inline-flex items-center px-12 py-5 bg-transparent border-2 border-gold text-foreground text-xl font-semibold rounded-3xl hover:bg-gold hover:bg-opacity-10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="mr-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Learn More
            </motion.button>
          </motion.div>

          {/* Feature Grid */}
          <motion.div 
            variants={itemVariants}
            className="grid md:grid-cols-3 gap-8 mt-32"
          >
            <motion.div 
              className="premium-card rounded-3xl p-10 hover-lift group"
              whileHover={{ y: -8 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-dark rounded-2xl flex items-center justify-center mb-8 group-hover:animate-float">
                <svg className="w-8 h-8 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-6">AI-Powered Rebalancing</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Advanced algorithms continuously optimize your portfolio allocation based on market conditions and risk tolerance.
              </p>
            </motion.div>

            <motion.div 
              className="premium-card rounded-3xl p-10 hover-lift group"
              whileHover={{ y: -8 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-dark rounded-2xl flex items-center justify-center mb-8 group-hover:animate-float">
                <svg className="w-8 h-8 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Privacy-First KYC</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Secure identity verification through Self Protocol ensures your privacy while maintaining regulatory compliance.
              </p>
            </motion.div>

            <motion.div 
              className="premium-card rounded-3xl p-10 hover-lift group"
              whileHover={{ y: -8 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-dark rounded-2xl flex items-center justify-center mb-8 group-hover:animate-float">
                <svg className="w-8 h-8 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Best Execution</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Integrated with 1inch for optimal trade routing and Pyth Network for real-time, accurate price feeds.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.main>

      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-60 -right-60 w-96 h-96 bg-gold opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-60 -left-60 w-96 h-96 bg-gold-light opacity-15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-gold to-gold-light opacity-5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Landing;
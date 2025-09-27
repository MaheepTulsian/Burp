// Chat interface component for cluster analysis
// Features bot messages and user decision (Yes/No) at the end

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = ({ messages, onUserDecision, showDecision, clusterName }) => {
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showDecisionButtons, setShowDecisionButtons] = useState(false);
  const [userChoice, setUserChoice] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Display messages with typing effect
  useEffect(() => {
    if (messages.length === 0) return;

    const timer = setTimeout(() => {
      if (currentMessageIndex < messages.length) {
        setVisibleMessages(prev => [...prev, messages[currentMessageIndex]]);
        setCurrentMessageIndex(prev => prev + 1);
      } else if (showDecision && !showDecisionButtons) {
        // Show decision buttons after all messages
        setTimeout(() => {
          setShowDecisionButtons(true);
        }, 1000);
      }
    }, currentMessageIndex === 0 ? 500 : 2000); // First message faster, then delay between messages

    return () => clearTimeout(timer);
  }, [currentMessageIndex, messages.length, showDecision, showDecisionButtons]);

  // Auto-scroll when new messages appear
  useEffect(() => {
    scrollToBottom();
  }, [visibleMessages]);

  const handleDecision = (decision) => {
    setUserChoice(decision);
    
    // Add user message to chat
    const userMessage = {
      type: 'user',
      message: decision === 'yes' ? 'Yes, let\'s proceed with this investment!' : 'No, I\'ll pass on this one.',
      timestamp: Date.now()
    };
    
    setVisibleMessages(prev => [...prev, userMessage]);
    
    // Call parent handler after a short delay
    setTimeout(() => {
      onUserDecision(decision);
    }, 1000);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-[700px] premium-card rounded-3xl overflow-hidden shadow-2xl">
      {/* Premium Chat Header */}
      <div className="bg-gradient-to-r from-gold-light to-gold border-b-2 border-gold p-6">
        <div className="flex items-center space-x-4">
          <motion.div 
            className="w-12 h-12 bg-gradient-to-br from-gold to-gold-dark rounded-2xl flex items-center justify-center shadow-lg"
            animate={{ 
              boxShadow: ["0 0 10px hsl(42, 100%, 50%, 0.3)", "0 0 20px hsl(42, 100%, 50%, 0.6)", "0 0 10px hsl(42, 100%, 50%, 0.3)"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-foreground font-bold text-lg">AI</span>
          </motion.div>
          <div>
            <h3 className="font-bold text-foreground text-xl">BURP AI Advisor</h3>
            <p className="text-foreground opacity-80 font-medium">Analyzing {clusterName}</p>
          </div>
          <div className="ml-auto">
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gold to-gold-dark rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-foreground text-sm font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gradient-to-b from-background to-primary-light">
        <AnimatePresence>
          {visibleMessages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                {message.type === 'bot' && (
                  <div className="flex items-center space-x-3 mb-3">
                    <motion.div 
                      className="w-8 h-8 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center shadow-md"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      <span className="text-foreground text-xs font-bold">AI</span>
                    </motion.div>
                    <span className="text-sm text-muted-foreground font-medium">{formatTime(message.timestamp)}</span>
                  </div>
                )}
                
                <motion.div 
                  className={`rounded-3xl p-6 shadow-lg ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-br from-gold to-gold-dark text-foreground ml-auto border-2 border-gold-dark' 
                      : 'bg-gradient-to-br from-card to-primary-light text-foreground border-2 border-gold'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="leading-relaxed text-lg font-medium">{message.message}</p>
                </motion.div>
                
                {message.type === 'user' && (
                  <div className="flex items-center justify-end space-x-3 mt-3">
                    <span className="text-sm text-muted-foreground font-medium">{formatTime(message.timestamp)}</span>
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-md">
                      <span className="text-primary-foreground text-xs font-bold">You</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Premium Typing Indicator */}
        {currentMessageIndex < messages.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gold-light to-gold rounded-2xl border-2 border-gold shadow-lg">
              <motion.div 
                className="w-8 h-8 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{ 
                  scale: { duration: 1, repeat: Infinity },
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" }
                }}
              >
                <span className="text-foreground text-xs font-bold">AI</span>
              </motion.div>
              <div className="flex items-center space-x-2">
                <span className="text-foreground font-semibold">AI is analyzing</span>
                <motion.div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-gold-dark rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Premium Decision Buttons */}
      {showDecisionButtons && !userChoice && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="p-8 bg-gradient-to-r from-gold-light to-gold border-t-2 border-gold"
        >
          <motion.p 
            className="text-center text-foreground font-bold text-xl mb-6"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Ready to proceed with this premium investment opportunity?
          </motion.p>
          <div className="flex space-x-6">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDecision('yes')}
              className="flex-1 py-5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg border-2 border-green-400"
            >
              ✨ Yes, Invest Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDecision('no')}
              className="flex-1 py-5 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg border-2 border-gray-300"
            >
              🔄 No, Go Back
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Chat;
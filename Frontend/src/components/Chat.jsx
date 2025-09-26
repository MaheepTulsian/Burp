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
    <div className="flex flex-col h-[600px] card-gradient rounded-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="bg-primary-light border-b border-card-border p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-cta rounded-lg flex items-center justify-center">
            <span className="text-white font-medium text-sm">AI</span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">BURP AI Advisor</h3>
            <p className="text-sm text-muted-foreground">Analyzing {clusterName}</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {visibleMessages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                {message.type === 'bot' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-cta rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">AI</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                  </div>
                )}
                
                <div className={`rounded-2xl p-4 ${
                  message.type === 'user' 
                    ? 'bg-cta text-cta-foreground ml-auto' 
                    : 'bg-muted text-foreground'
                }`}>
                  <p className="leading-relaxed">{message.message}</p>
                </div>
                
                {message.type === 'user' && (
                  <div className="flex items-center justify-end space-x-2 mt-2">
                    <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-xs font-medium">You</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {currentMessageIndex < messages.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-cta rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">AI</span>
              </div>
              <span className="text-xs text-muted-foreground">AI is typing...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Decision Buttons */}
      {showDecisionButtons && !userChoice && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 bg-primary-light border-t border-card-border"
        >
          <p className="text-center text-foreground font-medium mb-4">
            Ready to proceed with this investment?
          </p>
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDecision('yes')}
              className="flex-1 py-3 bg-cta hover:bg-cta-hover text-cta-foreground rounded-xl font-semibold transition-colors duration-300"
            >
              Yes, Invest Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDecision('no')}
              className="flex-1 py-3 bg-secondary hover:bg-accent text-secondary-foreground rounded-xl font-semibold transition-colors duration-300"
            >
              No, Go Back
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Chat;
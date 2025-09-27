// Chat interface component for cluster analysis
// Features bot messages, user input, and decision (Yes/No) at the end

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = ({ messages, onUserDecision, onUserInput, showDecision, clusterName, isWaitingForAI }) => {
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showDecisionButtons, setShowDecisionButtons] = useState(false);
  const [showInputBox, setShowInputBox] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [userChoice, setUserChoice] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Update visible messages when messages prop changes
  useEffect(() => {
    setVisibleMessages(messages);
    if (showDecision && messages.length > 0) {
      setShowDecisionButtons(true);
      setShowInputBox(false);
    }
  }, [messages, showDecision]);

  // Auto-scroll when new messages appear
  useEffect(() => {
    scrollToBottom();
  }, [visibleMessages]);

  const handleSendMessage = () => {
    if (userInput.trim() && onUserInput) {
      onUserInput(userInput);
      setUserInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
            <h3 className="font-bold text-foreground text-xl">{getAdvisorTitle()}</h3>
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
                  {/* Render message content, supporting simple Markdown from AI */}
                  <div className="leading-relaxed text-lg font-medium">
                    {message && typeof message.message === 'string' ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: markdownToHtml(message.message) }}
                      />
                    ) : (
                      <p className="leading-relaxed text-lg font-medium">{String(message.message)}</p>
                    )}
                  </div>

                  {/* Show cluster ready button */}
                  {message.isClusterReady && message.cluster && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl border border-gold"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-lg text-foreground">{message.cluster.name}</h4>
                          <p className="text-sm text-muted-foreground">{message.cluster.subtitle}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {message.cluster.tokens.length} tokens • {message.cluster.riskLevel} risk
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onUserDecision('yes')}
                          className="px-6 py-3 bg-gradient-to-r from-gold to-gold-dark text-foreground rounded-xl font-bold shadow-lg border-2 border-gold-dark"
                        >
                          ✨ Show Cluster
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
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
        {isWaitingForAI && (
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

      {/* Premium Input Box */}
      {showInputBox && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-gradient-to-r from-primary-light to-background border-t-2 border-gold"
        >
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isWaitingForAI}
                className="w-full p-4 bg-card border-2 border-gold rounded-2xl resize-none focus:outline-none focus:border-gold-dark text-foreground placeholder-muted-foreground"
                rows="2"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!userInput.trim() || isWaitingForAI}
              className="px-6 py-4 bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-foreground rounded-2xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isWaitingForAI ? (
                <div className="w-5 h-5 border-2 border-foreground border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}

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
            {getDecisionPrompt()}
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

// Helper functions to replace hardcoded values
function getAdvisorTitle() {
  return "BURP AI Advisor";
}

function getDecisionPrompt() {
  return "Ready to proceed with this premium investment opportunity?";
}

// Minimal markdown renderer (safe): converts a subset of Markdown to HTML.
// Escapes HTML first, then converts code blocks, inline code, bold, italics, links, and line breaks.
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function markdownToHtml(md) {
  if (!md) return '';
  // Escape first
  let out = escapeHtml(md);

  // Code block ```lang\n...```
  out = out.replace(/```([\s\S]*?)```/g, (m, code) => {
    const escaped = escapeHtml(code);
    return `<pre class="rounded-md bg-black/70 p-3 overflow-auto text-sm"><code>${escaped}</code></pre>`;
  });

  // Inline code `code`
  out = out.replace(/`([^`]+)`/g, (m, c) => `<code class="bg-black/10 px-1 rounded">${c}</code>`);

  // Bold **text** or __text__
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/__([^_]+)__/g, '<strong>$1</strong>');

  // Italic *text* or _text_
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  out = out.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Links [text](url)
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, text, url) => {
    const safeUrl = escapeHtml(url);
    const safeText = text;
    return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline">${safeText}</a>`;
  });

  // Convert two or more newlines to paragraph breaks
  out = out.replace(/\n{2,}/g, '</p><p>');

  // Convert remaining single newlines to <br>
  out = out.replace(/\n/g, '<br/>');

  // Wrap in paragraph
  return `<p>${out}</p>`;
}

export default Chat;
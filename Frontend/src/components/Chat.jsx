// Compact Chat interface component for cluster analysis
// Features bot messages, user input, and decision (Yes/No) at the end

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = ({ messages, onUserDecision, onUserInput, showDecision, clusterName, isWaitingForAI }) => {
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [showDecisionButtons, setShowDecisionButtons] = useState(false);
  const [showInputBox, setShowInputBox] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [userChoice, setUserChoice] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [userInput]);

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
    const userMessage = {
      type: 'user',
      message: decision === 'yes' ? "Yes, let's proceed with this investment!" : "No, I'll pass on this one.",
      timestamp: Date.now()
    };
    setVisibleMessages(prev => [...prev, userMessage]);
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
    <div className="flex flex-col h-[650px] premium-card rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-gold-light to-gold border-b border-gold p-4">
        <div className="flex items-center space-x-3">
          <motion.div
            className="w-10 h-15 bg-gradient-to-br from-gold to-gold-dark rounded-xl flex items-center justify-center shadow-md"
            animate={{
              boxShadow: [
                "0 0 6px hsl(42, 100%, 50%, 0.3)",
                "0 0 12px hsl(42, 100%, 50%, 0.6)",
                "0 0 6px hsl(42, 100%, 50%, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-foreground font-bold text-sm">AI</span>
          </motion.div>
          <div>
            <h3 className="font-bold text-foreground text-lg">{getAdvisorTitle()}</h3>
            <p className="text-foreground opacity-80 text-sm">Analyzing {clusterName}</p>
          </div>
          <div className="ml-auto">
            <div className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-gold to-gold-dark rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-foreground text-xs font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-background to-primary-light text-base">
        <AnimatePresence>
          {visibleMessages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                {message.type === 'bot' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <motion.div
                      className="w-6 h-6 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center shadow-sm"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      <span className="text-foreground text-[10px] font-bold">AI</span>
                    </motion.div>
                    <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                  </div>
                )}

                <motion.div
                  className={`rounded-2xl p-4 shadow-md ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-gold to-gold-dark text-foreground ml-auto border border-gold-dark'
                      : 'bg-gradient-to-br from-card to-primary-light text-foreground border border-gold'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="leading-relaxed text-sm font-medium">
                    {message && typeof message.message === 'string' ? (
                      <div dangerouslySetInnerHTML={{ __html: markdownToHtml(message.message) }} />
                    ) : (
                      <p>{String(message.message)}</p>
                    )}
                  </div>
                </motion.div>

                {message.type === 'user' && (
                  <div className="flex items-center justify-end space-x-2 mt-2">
                    <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                    <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-primary-foreground text-[10px] font-bold">You</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isWaitingForAI && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gold-light to-gold rounded-xl border border-gold shadow-md">
              <motion.div
                className="w-6 h-6 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                transition={{ scale: { duration: 1, repeat: Infinity }, rotate: { duration: 2, repeat: Infinity, ease: "linear" } }}
              >
                <span className="text-foreground text-[10px] font-bold">AI</span>
              </motion.div>
              <span className="text-foreground text-xs font-semibold">AI is analyzing...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      {showInputBox && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-gradient-to-r from-primary-light to-background border-t border-gold">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isWaitingForAI}
                className="w-full p-3 bg-card border border-gold rounded-xl resize-none focus:outline-none focus:border-gold-dark text-foreground placeholder-muted-foreground text-sm"
                rows="2"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!userInput.trim() || isWaitingForAI}
              className="px-5 py-3 bg-gradient-to-r from-gold to-gold-dark border hover:from-gold-dark hover:to-gold text-foreground rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isWaitingForAI ? (
                <div className="w-4 h-3 border-2 border-foreground border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Decision Buttons */}
      {showDecisionButtons && !userChoice && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-6 bg-gradient-to-r from-gold-light to-gold border-t border-gold">
          <motion.p className="text-center text-foreground font-bold text-lg mb-4" animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            {getDecisionPrompt()}
          </motion.p>
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDecision('yes')}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-sm shadow-md border border-green-400"
            >
              ✨ Yes, Invest Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDecision('no')}
              className="flex-1 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl font-bold text-sm shadow-md border border-gray-300"
            >
              🔄 No, Go Back
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Helper functions
function getAdvisorTitle() {
  return "BURP AI Advisor";
}

function getDecisionPrompt() {
  return "Ready to proceed with this premium investment opportunity?";
}

// Minimal markdown renderer
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function markdownToHtml(md) {
  if (!md) return '';
  let out = escapeHtml(md);
  out = out.replace(/```([\s\S]*?)```/g, (m, code) => `<pre class="rounded bg-black/70 p-2 overflow-auto text-xs"><code>${escapeHtml(code)}</code></pre>`);
  out = out.replace(/`([^`]+)`/g, (m, c) => `<code class="bg-black/10 px-1 rounded">${c}</code>`);
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/_([^_]+)_/g, '<em>$1</em>');
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, text, url) => `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline">${text}</a>`);
  out = out.replace(/\n{2,}/g, '</p><p>');
  out = out.replace(/\n/g, '<br/>');
  return `<p>${out}</p>`;
}

export default Chat;

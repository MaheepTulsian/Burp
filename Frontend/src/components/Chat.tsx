import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import mockAPI from "../mock/api";

/**
 * Chat Component for Cluster Detail Page
 * Handles conversation flow with dummy responses and final Yes/No choice
 */
interface Message {
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatProps {
  cluster: any;
  onComplete: (choice: 'yes' | 'no') => void;
}

const Chat = ({ cluster, onComplete }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showFinalChoice, setShowFinalChoice] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatFlow = mockAPI.getChatFlow();

  useEffect(() => {
    // Initialize chat with first bot message
    addBotMessage(chatFlow[0].botMessage);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = (content: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'bot',
        content,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1000);
  };

  const addUserMessage = (content: string) => {
    setMessages(prev => [...prev, {
      type: 'user',
      content,
      timestamp: new Date()
    }]);
  };

  const handleUserResponse = (response: string) => {
    if (!response.trim()) return;
    
    addUserMessage(response);
    setUserInput("");
    
    const nextStep = currentStep + 1;
    
    if (nextStep < chatFlow.length) {
      setCurrentStep(nextStep);
      addBotMessage(chatFlow[nextStep].botMessage);
    } else {
      // Chat flow completed, show final choice
      setTimeout(() => {
        addBotMessage("Based on our conversation, I think this cluster aligns well with your investment goals. Would you like me to reveal the detailed composition and proceed with the investment analysis?");
        setShowFinalChoice(true);
      }, 1500);
    }
  };

  const handleSendMessage = () => {
    handleUserResponse(userInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleFinalChoice = (choice: 'yes' | 'no') => {
    addUserMessage(choice === 'yes' ? 'Yes, show me the details!' : 'No, let me think about it.');
    setShowFinalChoice(false);
    onComplete(choice);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <Card className="gradient-card shadow-strong border border-burp-blue/10 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-burp-blue" />
            </motion.div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-burp-gray to-burp-blue bg-clip-text text-transparent">
              AI Investment Advisor
            </h2>
          </div>
          
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto mb-6 space-y-4 pr-2 bg-gradient-to-b from-transparent to-burp-blue-light/10 rounded-lg p-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      max-w-xs lg:max-w-sm px-4 py-3 rounded-2xl shadow-medium backdrop-blur-sm
                      ${message.type === 'user' 
                        ? 'bg-gradient-to-r from-burp-blue to-burp-blue-dark text-white border border-white/20' 
                        : 'bg-white/80 text-burp-gray border border-burp-blue/20 shadow-soft'
                      }
                    `}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`
                      text-xs mt-2 opacity-70
                      ${message.type === 'user' ? 'text-white/80' : 'text-burp-gray-light'}
                    `}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white/80 text-burp-gray border border-burp-blue/20 px-4 py-3 rounded-2xl shadow-soft">
                  <div className="flex space-x-1">
                    <motion.div
                      className="w-2 h-2 bg-burp-blue rounded-full"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-burp-blue rounded-full"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-burp-blue rounded-full"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat Input */}
          {currentStep < chatFlow.length && !showFinalChoice && !isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <p className="text-sm font-medium text-burp-gray mb-3 px-2">
                {chatFlow[currentStep]?.question}
              </p>
              <div className="flex gap-2">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your response..."
                  className="flex-1 bg-white/80 border-burp-blue/30 focus:border-burp-blue focus:ring-burp-blue/20 backdrop-blur-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim()}
                  size="icon"
                  className="gradient-button text-white shadow-medium hover:shadow-strong transition-all duration-300"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
          
          {/* Final Choice */}
          {showFinalChoice && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <p className="text-sm font-medium text-burp-gray text-center mb-4">
                Ready to proceed?
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleFinalChoice('yes')}
                  className="gradient-button text-white p-4 font-semibold shadow-medium hover:shadow-strong transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Yes, Show Details
                </Button>
                <Button
                  onClick={() => handleFinalChoice('no')}
                  variant="outline"
                  className="border-burp-blue text-burp-blue hover:bg-burp-blue hover:text-white p-4 transition-all duration-300"
                >
                  No, Not Yet
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default Chat;
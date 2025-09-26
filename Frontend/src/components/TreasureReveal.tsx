import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, stagger } from "framer-motion";
import { Sparkles, TrendingUp, Zap, Shield, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface Token {
  symbol: string;
  name: string;
  color: string;
  allocation: number;
}

interface Cluster {
  name: string;
  tokens: Token[];
  tvl: string;
  return30d: string;
}

interface TreasureRevealProps {
  cluster: Cluster;
  onInvest: () => void;
  onBack: () => void;
}

const TreasureReveal = ({ cluster, onInvest, onBack }: TreasureRevealProps) => {
  const [revealStep, setRevealStep] = useState(0);
  const [showCoins, setShowCoins] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const sections = [
    { id: 1, delay: 0 },
    { id: 2, delay: 200 },
    { id: 3, delay: 400 },
    { id: 4, delay: 600 },
    { id: 5, delay: 800 },
    { id: 6, delay: 1000 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    try {
      setIsLoading(true);
      sections.forEach((section, index) => {
        setTimeout(() => {
          setRevealStep(index + 1);
        }, section.delay);
      });

      setTimeout(() => {
        setShowCoins(true);
        setIsLoading(false);
      }, 1800);
    } catch (err) {
      setError("Failed to load portfolio composition");
      setIsLoading(false);
    }
  }, []);

  const handleCoinClick = useCallback((coinId: string) => {
    navigate(`/coin/${coinId}`);
  }, [navigate]);

  if (error) {
    return (
      <div className="container mx-auto px-6 py-12 min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-burp-gray">{error}</p>
          <Button onClick={onBack} className="mt-6">Try Again</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 min-h-screen bg-gradient-to-br from-background via-burp-blue-light/5 to-burp-blue/5">
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-full bg-burp-blue/20"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>

      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 sm:mb-16"
          role="region"
          aria-label="Portfolio reveal animation"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-burp-gray via-burp-blue to-burp-blue-dark bg-clip-text text-transparent mb-4"
          >
            Revealing {cluster.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base sm:text-lg text-burp-gray-light mb-8 sm:mb-12"
          >
            Unlocking your personalized portfolio composition
          </motion.p>

          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md h-64 sm:h-80 md:h-96 mx-auto mb-8 sm:mb-12">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-burp-blue/20 via-burp-blue-dark/30 to-yellow-400/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-burp-blue rounded-full"
                style={{
                  left: `${20 + (i * 10)}%`,
                  top: `${15 + (i * 8)}%`,
                }}
                animate={{
                  y: [-10, -30, -10],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2 + (i * 0.2),
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
            <div className="grid grid-cols-3 grid-rows-2 gap-2 sm:gap-3 h-full p-4 sm:p-6 relative z-10">
              {sections.map((section) => (
                <motion.div
                  key={section.id}
                  initial={{ scale: 1, rotateY: 0 }}
                  animate={{
                    scale: revealStep >= section.id ? 1.15 : 1,
                    rotateY: revealStep >= section.id ? 180 : 0,
                    z: revealStep >= section.id ? 50 : 0,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "backOut",
                    delay: section.delay / 1000,
                  }}
                  className="bg-gradient-to-br from-burp-blue via-burp-blue-dark to-burp-blue rounded-2xl flex items-center justify-center shadow-strong border border-white/20 backdrop-blur-sm"
                  role="presentation"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{
                      scale: revealStep >= section.id ? 1 : 0.8,
                      rotate: revealStep >= section.id ? 360 : 0,
                    }}
                    transition={{
                      duration: 0.8,
                      ease: "backOut",
                      delay: (section.delay / 1000) + 0.2,
                    }}
                    className="w-10 sm:w-12 h-10 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-medium"
                  >
                    {revealStep >= section.id ? (
                      <Sparkles className="w-5 sm:w-6 h-5 sm:h-6 text-burp-blue" />
                    ) : (
                      <span className="text-burp-blue font-bold text-base sm:text-lg">{section.id}</span>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <p className="text-lg text-burp-gray">Loading portfolio...</p>
            </motion.div>
          ) : showCoins && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h2
                variants={childVariants}
                className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-burp-gray to-burp-blue bg-clip-text text-transparent mb-8 sm:mb-12"
              >
                Portfolio Composition
              </motion.h2>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16"
                variants={containerVariants}
              >
                {cluster.tokens.map((token: Token, index: number) => (
                  <motion.div
                    key={token.symbol}
                    variants={childVariants}
                    whileHover={{
                      scale: 1.05,
                      rotateY: 5,
                      z: 50,
                    }}
                    className="cursor-pointer"
                    onClick={() => handleCoinClick(token.symbol.toLowerCase())}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleCoinClick(token.symbol.toLowerCase())}
                    aria-label={`View details for ${token.name}`}
                  >
                    <Card className="gradient-card p-6 sm:p-8 shadow-strong hover:shadow-glow border border-burp-blue/10 backdrop-blur-sm group transition-all duration-300">
                      <div className="text-center">
                        <motion.div
                          className="relative w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4 sm:mb-6"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <div 
                            className="w-full h-full rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-strong group-hover:shadow-glow transition-all duration-300"
                            style={{ backgroundColor: token.color }}
                          >
                            {token.symbol[0]}
                          </div>
                          <motion.div
                            className="absolute -inset-2 rounded-full border-2 border-burp-blue/30"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          />
                        </motion.div>
                        <h3 className="text-lg sm:text-xl font-semibold text-burp-gray mb-2 group-hover:text-burp-blue transition-colors">
                          {token.name}
                        </h3>
                        <p className="text-sm text-burp-gray-light mb-3 sm:mb-4 font-medium">
                          {token.symbol}
                        </p>
                        <motion.div
                          className="bg-gradient-to-r from-burp-blue-light to-burp-blue/20 rounded-xl p-3 sm:p-4 backdrop-blur-sm"
                          whileHover={{ scale: 1.05 }}
                        >
                          <p className="text-2xl sm:text-3xl font-bold text-burp-gray mb-1">
                            {token.allocation}%
                          </p>
                          <p className="text-xs text-burp-gray-light uppercase tracking-wide">
                            Portfolio Weight
                          </p>
                        </motion.div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={childVariants}>
                <Card className="gradient-card p-6 sm:p-8 md:p-10 shadow-strong mb-8 sm:mb-10 border border-burp-blue/10 backdrop-blur-sm">
                  <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-burp-gray to-burp-blue bg-clip-text text-transparent mb-6 sm:mb-8">
                    Investment Analytics
                  </h3>
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8"
                    variants={containerVariants}
                  >
                    <motion.div
                      className="text-center p-4 sm:p-6 rounded-xl bg-white/50 backdrop-blur-sm"
                      whileHover={{ scale: 1.05, y: -5 }}
                      variants={childVariants}
                    >
                      <Shield className="w-6 sm:w-8 h-6 sm:h-8 text-burp-blue mx-auto mb-3" />
                      <p className="text-3xl sm:text-4xl font-bold text-burp-gray mb-2">{cluster.tvl}</p>
                      <p className="text-burp-gray-light font-medium">Total Value Locked</p>
                    </motion.div>
                    <motion.div
                      className="text-center p-4 sm:p-6 rounded-xl bg-green-50 backdrop-blur-sm"
                      whileHover={{ scale: 1.05, y: -5 }}
                      variants={childVariants}
                    >
                      <TrendingUp className="w-6 sm:w-8 h-6 sm:h-8 text-green-600 mx-auto mb-3" />
                      <p className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">{cluster.return30d}</p>
                      <p className="text-burp-gray-light font-medium">30-Day Performance</p>
                    </motion.div>
                    <motion.div
                      className="text-center p-4 sm:p-6 rounded-xl bg-burp-blue-light/50 backdrop-blur-sm"
                      whileHover={{ scale: 1.05, y: -5 }}
                      variants={childVariants}
                    >
                      <Zap className="w-6 sm:w-8 h-6 sm:h-8 text-burp-blue mx-auto mb-3" />
                      <p className="text-3xl sm:text-4xl font-bold text-burp-gray mb-2">{cluster.tokens.length}</p>
                      <p className="text-burp-gray-light font-medium">Digital Assets</p>
                    </motion.div>
                  </motion.div>
                </Card>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center"
                variants={childVariants}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={onInvest}
                    size="lg"
                    className="gradient-button text-white px-6 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-semibold shadow-strong hover:shadow-glow transition-all duration-300 relative overflow-hidden group"
                    aria-label="Invest in this portfolio cluster"
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3 relative z-10" />
                    <span className="relative z-10">Invest in This Cluster</span>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={onBack}
                    variant="outline"
                    size="lg"
                    className="border-2 border-burp-blue text-burp-blue hover:bg-burp-blue hover:text-white px-6 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl transition-all duration-300 backdrop-blur-sm"
                    aria-label="Return to dashboard"
                  >
                    Back to Dashboard
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TreasureReveal;
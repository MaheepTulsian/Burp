import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Chat from "../components/Chat";
import TreasureReveal from "../components/TreasureReveal";
import { Button } from "@/components/ui/button";
import mockAPI from "../mock/api";

/**
 * Cluster Detail Page with Chat Interface
 * Left column: chat UI, Right column: cluster info
 * Handles chat flow and treasure reveal animation
 */
const Cluster = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cluster, setCluster] = useState(null);
  const [showTreasure, setShowTreasure] = useState(false);
  const [chatCompleted, setChatCompleted] = useState(false);

  useEffect(() => {
    const clusterData = mockAPI.getClusterById(id);
    setCluster(clusterData);
  }, [id]);

  const handleChatComplete = (userChoice) => {
    setChatCompleted(true);
    if (userChoice === 'yes') {
      setShowTreasure(true);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleInvest = () => {
    console.log("Investment flow initiated");
    // This would typically open an investment modal or navigate to investment page
  };

  if (!cluster) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-burp-blue-dark"></div>
      </div>
    );
  }

  if (showTreasure) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <TreasureReveal 
          cluster={cluster}
          onInvest={handleInvest}
          onBack={handleBackToDashboard}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Column - Chat */}
          <div className="animate-fade-in">
            <Chat 
              cluster={cluster}
              onComplete={handleChatComplete}
            />
          </div>
          
          {/* Right Column - Cluster Info */}
          <div className="animate-slide-up">
            <div className="gradient-card p-8 rounded-xl shadow-medium sticky top-24">
              <div className="text-center mb-8">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  {/* Cluster Icon - Multiple overlapping token circles */}
                  <div className="absolute inset-0 bg-burp-blue rounded-full flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-1 p-2">
                      {cluster.tokens.slice(0, 4).map((token, index) => (
                        <div 
                          key={token.symbol}
                          className="w-4 h-4 bg-white rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ 
                            backgroundColor: token.color,
                            animationDelay: `${index * 0.1}s`
                          }}
                        >
                          {token.symbol[0]}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-burp-gray mb-2">
                  {cluster.name}
                </h1>
                <p className="text-burp-gray-light">
                  {cluster.description}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-burp-gray-light">Total Value Locked</span>
                  <span className="font-semibold text-burp-gray">{cluster.tvl}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-burp-gray-light">30-day Return</span>
                  <span className="font-semibold text-green-600">{cluster.return30d}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-burp-gray-light">Number of Assets</span>
                  <span className="font-semibold text-burp-gray">{cluster.tokens.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-burp-gray-light">Risk Level</span>
                  <span className="font-semibold text-burp-gray capitalize">{cluster.riskLevel}</span>
                </div>
              </div>

              {/* Token Preview */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-burp-gray mb-4">Top Holdings</h3>
                <div className="space-y-3">
                  {cluster.tokens.slice(0, 3).map((token) => (
                    <div key={token.symbol} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{ backgroundColor: token.color }}
                        >
                          {token.symbol[0]}
                        </div>
                        <span className="font-medium text-burp-gray">{token.name}</span>
                      </div>
                      <span className="text-burp-gray-light">{token.allocation}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {chatCompleted && (
                <div className="text-center">
                  <Button 
                    onClick={handleBackToDashboard}
                    variant="outline"
                    className="border-burp-blue text-burp-blue hover:bg-burp-blue hover:text-white"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cluster;
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

/**
 * Landing Page - Hero section with light-blue gradient background
 * Features platform overview and CTA to connect wallet
 */
const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-burp-gray mb-8 animate-slide-up">
              BURP
            </h1>
            <p className="text-xl md:text-2xl text-burp-gray-light mb-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              Blockchain Unified Rebalancing Platform
            </p>
            <p className="text-lg text-burp-gray-light mb-12 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: "0.4s" }}>
              Decentralized AI-powered crypto investment platform with AI-managed thematic baskets, 
              PYUSD settlement, privacy-preserving KYC via Self Protocol, best-execution via 1inch, 
              and price feeds via Pyth Network.
            </p>
            <Button 
              onClick={handleGetStarted}
              size="lg"
              className="gradient-button text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-medium hover:shadow-strong transition-all duration-300 hover:scale-105 animate-scale-in"
              style={{ animationDelay: "0.6s" }}
            >
              Connect Wallet / Login
            </Button>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-burp-blue rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-32 right-10 w-32 h-32 bg-burp-blue rounded-full opacity-10 animate-float" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-20 w-16 h-16 bg-burp-blue-dark rounded-full opacity-15 animate-float" style={{ animationDelay: "2s" }}></div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-burp-gray mb-6">
              Powered by Leading DeFi Protocols
            </h2>
            <p className="text-xl text-burp-gray-light max-w-2xl mx-auto">
              BURP integrates the best-in-class decentralized infrastructure for secure, 
              efficient, and transparent crypto investment management.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Baskets",
                description: "Intelligent thematic investment clusters managed by advanced algorithms"
              },
              {
                title: "PYUSD Settlement",
                description: "Fast and stable settlements using PayPal's USD stablecoin"
              },
              {
                title: "Privacy-First KYC",
                description: "Secure identity verification via Self Protocol's zero-knowledge infrastructure"
              }
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className="gradient-card p-8 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${0.2 * index}s` }}
              >
                <h3 className="text-xl font-semibold text-burp-gray mb-4">
                  {feature.title}
                </h3>
                <p className="text-burp-gray-light">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
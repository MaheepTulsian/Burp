import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "../App";
import WalletConnect from "../components/WalletConnect";

/**
 * Login Page - Wallet connection simulation
 * Handles MetaMask-style wallet connection flow
 */
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const handleWalletConnect = async () => {
    setIsConnecting(true);
    
    // Simulate wallet connection delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock wallet address
    const mockAddress = "0x742d35Cc6634C0532925a3b8D5Ac4A1234567890";
    setWalletAddress(mockAddress);
    setIsConnected(true);
    setIsConnecting(false);
    
    // Login user
    login({
      address: mockAddress,
      balance: "1.234 ETH"
    });
  };

  const handleProceedToDashboard = () => {
    navigate("/dashboard");
  };

  if (isConnected) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center px-6">
        <Card className="w-full max-w-md p-8 gradient-card shadow-strong animate-scale-in">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-burp-gray mb-4">
              Wallet Connected!
            </h2>
            <p className="text-sm text-burp-gray-light mb-2">Connected Address:</p>
            <p className="text-xs font-mono bg-burp-blue-light px-3 py-2 rounded-lg mb-6 break-all">
              {walletAddress}
            </p>
            <Button 
              onClick={handleProceedToDashboard}
              className="w-full gradient-button text-white"
            >
              Proceed to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-6">
      <Card className="w-full max-w-md p-8 gradient-card shadow-strong animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-burp-gray mb-2">
            Connect Wallet
          </h1>
          <p className="text-burp-gray-light mb-8">
            Connect your wallet to access BURP platform
          </p>
          
          <WalletConnect 
            onConnect={handleWalletConnect}
            isConnecting={isConnecting}
          />
          
          <div className="mt-8 text-xs text-burp-gray-light">
            <p>
              By connecting your wallet, you agree to BURP's Terms of Service 
              and Privacy Policy.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
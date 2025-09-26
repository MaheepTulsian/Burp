import { Button } from "@/components/ui/button";

/**
 * Wallet Connect Component
 * Simulates MetaMask-style wallet connection with loading state
 */
interface WalletConnectProps {
  onConnect: () => void;
  isConnecting: boolean;
}

const WalletConnect = ({ onConnect, isConnecting }: WalletConnectProps) => {
  return (
    <div className="space-y-4">
      {/* Primary Wallet Option - MetaMask */}
      <Button
        onClick={onConnect}
        disabled={isConnecting}
        className="w-full gradient-button text-white p-6 text-lg font-semibold rounded-xl shadow-medium hover:shadow-strong transition-all duration-300 disabled:opacity-50"
      >
        {isConnecting ? (
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Connecting...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.46 12.52L21.16 8.08C20.86 7.26 20.14 6.68 19.28 6.68H4.72C3.86 6.68 3.14 7.26 2.84 8.08L1.54 12.52C1.38 13.02 1.56 13.56 1.96 13.86L12 20.68L22.04 13.86C22.44 13.56 22.62 13.02 22.46 12.52Z"/>
              </svg>
            </div>
            <span>Connect with MetaMask</span>
          </div>
        )}
      </Button>
      
      {/* Alternative Wallet Options */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          disabled={isConnecting}
          className="p-4 border-burp-blue text-burp-blue hover:bg-burp-blue hover:text-white disabled:opacity-50"
        >
          <div className="text-center">
            <div className="w-6 h-6 bg-blue-500 rounded-full mx-auto mb-2"></div>
            <span className="text-sm">WalletConnect</span>
          </div>
        </Button>
        
        <Button
          variant="outline"
          disabled={isConnecting}
          className="p-4 border-burp-blue text-burp-blue hover:bg-burp-blue hover:text-white disabled:opacity-50"
        >
          <div className="text-center">
            <div className="w-6 h-6 bg-purple-500 rounded-full mx-auto mb-2"></div>
            <span className="text-sm">Coinbase</span>
          </div>
        </Button>
      </div>
      
      {/* Connection Steps */}
      {isConnecting && (
        <div className="mt-6 p-4 bg-burp-blue-light rounded-lg animate-fade-in">
          <div className="text-sm text-burp-gray-light text-center">
            <p className="mb-2">🦊 MetaMask will open shortly</p>
            <p>Please approve the connection request</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
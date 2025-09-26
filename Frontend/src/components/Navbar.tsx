import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../App";

/**
 * Navigation Bar Component
 * Shows BURP logo, navigation links, and wallet connection status
 */
const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-burp-blue/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleLogoClick}
          >
            <div className="w-10 h-10 bg-gradient-button rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-2xl font-bold text-burp-gray">BURP</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <button 
                  onClick={() => navigate("/dashboard")}
                  className="text-burp-gray hover:text-burp-blue-dark transition-colors"
                >
                  Dashboard
                </button>
                <span className="text-sm text-burp-gray-light">
                  Portfolio
                </span>
                <span className="text-sm text-burp-gray-light">
                  Analytics
                </span>
              </>
            ) : (
              <>
                <span className="text-burp-gray-light">Features</span>
                <span className="text-burp-gray-light">About</span>
                <span className="text-burp-gray-light">Support</span>
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-burp-gray">
                      {user?.address?.slice(0, 6)}...{user?.address?.slice(-4)}
                    </p>
                    <p className="text-xs text-burp-gray-light">{user?.balance}</p>
                  </div>
                </div>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-burp-blue text-burp-blue hover:bg-burp-blue hover:text-white"
                >
                  Disconnect
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => navigate("/login")}
                className="gradient-button text-white"
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import mockAPI from "../mock/api";

/**
 * Coin Detail Page - Shows individual coin information
 * Historical data, returns, market data, and tech integrations
 */
const CoinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState(null);

  useEffect(() => {
    const coinData = mockAPI.getCoinById(id);
    setCoin(coinData);
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (!coin) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-burp-blue-dark"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Button 
            onClick={handleBack}
            variant="outline"
            className="mb-6 border-burp-blue text-burp-blue hover:bg-burp-blue hover:text-white"
          >
            ← Back
          </Button>
          
          <div className="flex items-center space-x-6 mb-6">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-medium"
              style={{ backgroundColor: coin.color }}
            >
              {coin.symbol[0]}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-burp-gray">{coin.name}</h1>
              <p className="text-xl text-burp-gray-light">{coin.symbol}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-8">
            <div>
              <span className="text-3xl font-bold text-burp-gray">${coin.price}</span>
              <span className={`ml-4 text-lg ${coin.change24h.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                {coin.change24h}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Market Data */}
          <div className="space-y-6 animate-slide-up">
            {/* Price Chart Placeholder */}
            <Card className="p-6 gradient-card shadow-medium">
              <h3 className="text-xl font-semibold text-burp-gray mb-4">Price Chart (7 Days)</h3>
              <div className="h-64 bg-burp-blue-light rounded-lg flex items-center justify-center">
                <p className="text-burp-gray-light">Chart visualization would be here</p>
              </div>
            </Card>

            {/* Historical Returns */}
            <Card className="p-6 gradient-card shadow-medium">
              <h3 className="text-xl font-semibold text-burp-gray mb-4">Historical Returns</h3>
              <div className="space-y-4">
                {[
                  { period: "24 Hours", return: coin.change24h },
                  { period: "7 Days", return: "+5.67%" },
                  { period: "30 Days", return: "+12.34%" },
                  { period: "90 Days", return: "+28.91%" },
                  { period: "1 Year", return: "+45.23%" }
                ].map((data) => (
                  <div key={data.period} className="flex justify-between items-center">
                    <span className="text-burp-gray-light">{data.period}</span>
                    <span className={`font-semibold ${data.return.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                      {data.return}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Market Info & Tech */}
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            {/* Market Data */}
            <Card className="p-6 gradient-card shadow-medium">
              <h3 className="text-xl font-semibold text-burp-gray mb-4">Market Data</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-burp-gray-light">Market Cap</span>
                  <span className="font-semibold text-burp-gray">${coin.marketCap}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-burp-gray-light">24h Volume</span>
                  <span className="font-semibold text-burp-gray">${coin.volume24h}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-burp-gray-light">Circulating Supply</span>
                  <span className="font-semibold text-burp-gray">{coin.circulatingSupply}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-burp-gray-light">All-Time High</span>
                  <span className="font-semibold text-burp-gray">${coin.ath}</span>
                </div>
              </div>
            </Card>

            {/* Technology Integration */}
            <Card className="p-6 gradient-card shadow-medium">
              <h3 className="text-xl font-semibold text-burp-gray mb-4">Technology Partners</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-burp-blue-light rounded-lg">
                  <div>
                    <h4 className="font-semibold text-burp-gray">Pyth Network</h4>
                    <p className="text-sm text-burp-gray-light">Price Feed Provider</p>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-burp-blue-light rounded-lg">
                  <div>
                    <h4 className="font-semibold text-burp-gray">1inch Network</h4>
                    <p className="text-sm text-burp-gray-light">Best Execution Route</p>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
            </Card>

            {/* Investment Actions */}
            <Card className="p-6 gradient-card shadow-medium">
              <h3 className="text-xl font-semibold text-burp-gray mb-4">Investment Actions</h3>
              <div className="space-y-3">
                <Button className="w-full gradient-button text-white">
                  Add to Portfolio
                </Button>
                <Button variant="outline" className="w-full border-burp-blue text-burp-blue hover:bg-burp-blue hover:text-white">
                  Create Custom Cluster
                </Button>
                <Button variant="outline" className="w-full">
                  Set Price Alert
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetail;
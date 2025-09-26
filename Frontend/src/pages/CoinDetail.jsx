// Coin detail page showing historical data and market information
// Features integration info with Pyth Network and 1inch

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { mockApi } from '../mock/api';

const CoinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coinData, setCoinData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCoinData = async () => {
      try {
        setLoading(true);
        const data = await mockApi.getCoinDetail(id);
        setCoinData(data);
      } catch (error) {
        console.error('Failed to load coin data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCoinData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading coin data...</p>
        </div>
      </div>
    );
  }

  if (!coinData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Coin Not Found</h1>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-cta hover:bg-cta-hover text-cta-foreground rounded-xl font-medium transition-colors duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">{coinData.symbol[0]}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{coinData.name}</h1>
              <p className="text-muted-foreground text-lg">{coinData.symbol}</p>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </motion.div>

        {/* Price and Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          <div className="card-gradient rounded-2xl p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Price</h3>
            <p className="text-3xl font-bold text-foreground">{coinData.price}</p>
            <p className={`text-sm mt-1 ${coinData.change24h.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {coinData.change24h} (24h)
            </p>
          </div>
          
          <div className="card-gradient rounded-2xl p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Market Cap</h3>
            <p className="text-2xl font-bold text-foreground">{coinData.marketCap}</p>
          </div>
          
          <div className="card-gradient rounded-2xl p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">24h Volume</h3>
            <p className="text-2xl font-bold text-foreground">{coinData.volume24h}</p>
          </div>
          
          <div className="card-gradient rounded-2xl p-6 text-center">
            <button className="w-full px-4 py-3 bg-cta hover:bg-cta-hover text-cta-foreground rounded-xl font-medium transition-colors duration-300">
              Add to Watchlist
            </button>
          </div>
        </motion.div>

        {/* Historical Returns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-gradient rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Historical Returns</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(coinData.historicalReturns).map(([period, return_value]) => (
              <div key={period} className="text-center p-4 bg-muted rounded-xl">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">{period}</h4>
                <p className={`text-lg font-bold ${return_value.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {return_value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card-gradient rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">About {coinData.name}</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">{coinData.description}</p>
        </motion.div>

        {/* Tech Integrations */}
        {coinData.techIntegrations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="card-gradient rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">Technology Integrations</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {coinData.techIntegrations.map((integration, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-muted rounded-xl">
                  <div className="w-12 h-12 bg-cta rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">{integration.name[0]}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{integration.name}</h3>
                    <p className="text-muted-foreground">{integration.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CoinDetail;
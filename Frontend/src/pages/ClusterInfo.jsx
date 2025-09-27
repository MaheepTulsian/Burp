// Detailed cluster information page with comprehensive analysis
// Features market analysis, historical performance, and investment strategy

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { mockApi } from '../mock/api';
import TokenBadge from '../components/TokenBadge';

const ClusterInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cluster, setCluster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadClusterData = async () => {
      try {
        setLoading(true);
        const clusterData = await mockApi.getCluster(id);
        setCluster(clusterData);
      } catch (error) {
        console.error('Failed to load cluster data:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadClusterData();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading cluster analysis...</p>
        </div>
      </div>
    );
  }

  if (!cluster) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Cluster Not Found</h1>
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'strategy', label: 'Strategy', icon: '🎯' },
    { id: 'performance', label: 'Performance', icon: '📈' },
    { id: 'risks', label: 'Risk Analysis', icon: '⚠️' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Cluster Summary */}
            <div className="card-gradient rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">Cluster Overview</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-4">Investment Thesis</h4>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {cluster.description} This cluster represents a carefully curated selection of 
                    assets that demonstrate strong fundamentals, technological innovation, and 
                    market positioning within their respective sectors.
                  </p>
                  
                  <h4 className="text-lg font-semibold text-foreground mb-4">Key Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Assets</span>
                      <span className="font-semibold text-foreground">{cluster.stats.tokens}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Target APY</span>
                      <span className="font-semibold text-green-600">{cluster.stats.apy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Risk Rating</span>
                      <span className="font-semibold text-orange-600">{cluster.stats.risk}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Minimum Investment</span>
                      <span className="font-semibold text-foreground">$100</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-4">Asset Breakdown</h4>
                  <div className="space-y-4">
                    {cluster.tokens.slice(0, 6).map((token) => (
                      <div key={token.symbol} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                        <div className="flex items-center space-x-3">
                          <TokenBadge symbol={token.symbol} size="sm" />
                          <span className="font-medium text-foreground">{token.symbol}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-foreground">{token.allocation}%</div>
                          <div className="text-sm text-muted-foreground">{token.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'strategy':
        return (
          <div className="space-y-8">
            <div className="card-gradient rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">Investment Strategy</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">AI-Driven Allocation</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Our proprietary AI algorithm analyzes over 200 market indicators including volatility patterns, 
                    correlation matrices, momentum signals, and fundamental metrics to optimize asset allocation 
                    weights dynamically.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">Rebalancing Strategy</h4>
                  <div className="bg-primary-light rounded-xl p-6">
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start space-x-3">
                        <span className="w-2 h-2 bg-cta rounded-full mt-2 flex-shrink-0"></span>
                        <span>Weekly rebalancing based on volatility and correlation changes</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="w-2 h-2 bg-cta rounded-full mt-2 flex-shrink-0"></span>
                        <span>Threshold-based rebalancing when allocations drift beyond 5%</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="w-2 h-2 bg-cta rounded-full mt-2 flex-shrink-0"></span>
                        <span>Market sentiment integration for tactical adjustments</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="w-2 h-2 bg-cta rounded-full mt-2 flex-shrink-0"></span>
                        <span>Gas-optimized execution via 1inch for best prices</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">Technology Stack</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-xl">
                      <h5 className="font-semibold text-foreground mb-2">Price Feeds</h5>
                      <p className="text-sm text-muted-foreground">Pyth Network provides high-frequency, low-latency price data</p>
                    </div>
                    <div className="p-4 bg-muted rounded-xl">
                      <h5 className="font-semibold text-foreground mb-2">Execution</h5>
                      <p className="text-sm text-muted-foreground">1inch Protocol ensures optimal trade routing and MEV protection</p>
                    </div>
                    <div className="p-4 bg-muted rounded-xl">
                      <h5 className="font-semibold text-foreground mb-2">Settlement</h5>
                      <p className="text-sm text-muted-foreground">PYUSD stablecoin for efficient settlement and reduced slippage</p>
                    </div>
                    <div className="p-4 bg-muted rounded-xl">
                      <h5 className="font-semibold text-foreground mb-2">Privacy</h5>
                      <p className="text-sm text-muted-foreground">Self Protocol enables privacy-preserving KYC compliance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-8">
            <div className="card-gradient rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">Historical Performance</h3>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-muted rounded-xl">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">7 Days</h4>
                  <p className="text-2xl font-bold text-green-600">+8.5%</p>
                </div>
                <div className="text-center p-6 bg-muted rounded-xl">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">30 Days</h4>
                  <p className="text-2xl font-bold text-green-600">+12.3%</p>
                </div>
                <div className="text-center p-6 bg-muted rounded-xl">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">90 Days</h4>
                  <p className="text-2xl font-bold text-green-600">+28.7%</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">Performance vs Benchmarks</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-primary-light rounded-xl">
                      <span className="font-medium text-foreground">BURP {cluster.name}</span>
                      <span className="font-bold text-green-600">+{cluster.stats.apy}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-muted rounded-xl">
                      <span className="font-medium text-foreground">Bitcoin (BTC)</span>
                      <span className="font-bold text-green-600">+8.2%</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-muted rounded-xl">
                      <span className="font-medium text-foreground">S&P 500</span>
                      <span className="font-bold text-green-600">+6.1%</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-muted rounded-xl">
                      <span className="font-medium text-foreground">DeFi Pulse Index</span>
                      <span className="font-bold text-green-600">+11.4%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'risks':
        return (
          <div className="space-y-8">
            <div className="card-gradient rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">Risk Analysis</h3>
              
              <div className="space-y-6">
                <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                  <h4 className="text-lg font-semibold text-red-800 mb-3">Market Risks</h4>
                  <ul className="space-y-2 text-red-700">
                    <li>• Cryptocurrency markets are highly volatile and can experience significant price swings</li>
                    <li>• Regulatory changes could impact the value and legality of digital assets</li>
                    <li>• Market manipulation and liquidity issues may affect asset prices</li>
                  </ul>
                </div>
                
                <div className="p-6 bg-orange-50 border border-orange-200 rounded-xl">
                  <h4 className="text-lg font-semibold text-orange-800 mb-3">Technology Risks</h4>
                  <ul className="space-y-2 text-orange-700">
                    <li>• Smart contract vulnerabilities could lead to loss of funds</li>
                    <li>• Network congestion may result in higher transaction costs</li>
                    <li>• Protocol upgrades might introduce unexpected behaviors</li>
                  </ul>
                </div>
                
                <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <h4 className="text-lg font-semibold text-yellow-800 mb-3">Operational Risks</h4>
                  <ul className="space-y-2 text-yellow-700">
                    <li>• AI algorithm performance may vary under different market conditions</li>
                    <li>• Rebalancing frequency could be affected by gas costs</li>
                    <li>• Third-party service dependencies (Pyth, 1inch) may experience downtime</li>
                  </ul>
                </div>
                
                <div className="p-6 bg-primary-light border border-primary rounded-xl">
                  <h4 className="text-lg font-semibold text-foreground mb-3">Risk Mitigation</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Diversification across multiple assets and sectors</li>
                    <li>• Regular security audits of smart contracts</li>
                    <li>• Conservative position sizing and risk limits</li>
                    <li>• Multiple oracle and execution venue integrations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
            <div className="w-16 h-16 bg-gradient-to-br from-cta to-primary-dark rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {cluster.name.split(' ').map(word => word[0]).join('')}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{cluster.name}</h1>
              <p className="text-muted-foreground">Detailed Analysis & Information</p>
            </div>
          </div>
          
          <button
            onClick={() => navigate(`/cluster/${cluster.id}`)}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Cluster
          </button>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-muted rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>

        {/* Investment CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center card-gradient rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Invest?</h3>
          <p className="text-muted-foreground mb-6">
            Start building your diversified crypto portfolio with AI-optimized allocation
          </p>
          <button
            onClick={() => navigate(`/cluster/${cluster.id}`)}
            className="px-12 py-4 bg-cta hover:bg-cta-hover text-cta-foreground text-lg font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            Invest in {cluster.name}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ClusterInfo;
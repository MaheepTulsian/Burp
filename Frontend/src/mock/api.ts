/**
 * Mock API for BURP Platform
 * Simulates backend responses for clusters, chat flow, and coin data
 * Ready to be replaced with real API endpoints
 */

// Mock cluster data
const clusters = [
  {
    id: 'defi-giants',
    name: 'DeFi Giants',
    description: 'Blue-chip decentralized finance protocols with proven track records and strong fundamentals.',
    tvl: '$2.4M',
    return30d: '+12.5%',
    riskLevel: 'medium',
    tokens: [
      { symbol: 'UNI', name: 'Uniswap', color: '#FF007A', allocation: 25 },
      { symbol: 'AAVE', name: 'Aave', color: '#B6509E', allocation: 20 },
      { symbol: 'COMP', name: 'Compound', color: '#00D395', allocation: 18 },
      { symbol: 'MKR', name: 'MakerDAO', color: '#1AAB9B', allocation: 15 },
      { symbol: 'SNX', name: 'Synthetix', color: '#5FCDF0', allocation: 12 },
      { symbol: 'CRV', name: 'Curve', color: '#40E0D0', allocation: 10 }
    ]
  },
  {
    id: 'ai-revolution',
    name: 'AI Revolution',
    description: 'Cutting-edge artificial intelligence and machine learning blockchain projects.',
    tvl: '$1.8M',
    return30d: '+18.7%',
    riskLevel: 'high',
    tokens: [
      { symbol: 'FET', name: 'Fetch.ai', color: '#0B1426', allocation: 30 },
      { symbol: 'OCEAN', name: 'Ocean Protocol', color: '#7B1AF7', allocation: 25 },
      { symbol: 'AGI', name: 'SingularityNET', color: '#5A20CB', allocation: 20 },
      { symbol: 'NMR', name: 'Numeraire', color: '#25292E', allocation: 15 },
      { symbol: 'RLC', name: 'iExec RLC', color: '#FFD800', allocation: 10 }
    ]
  },
  {
    id: 'layer2-scaling',
    name: 'Layer 2 Scaling',
    description: 'Next-generation scaling solutions for Ethereum and other blockchain networks.',
    tvl: '$3.1M',
    return30d: '+8.3%',
    riskLevel: 'medium',
    tokens: [
      { symbol: 'MATIC', name: 'Polygon', color: '#8247E5', allocation: 28 },
      { symbol: 'ARB', name: 'Arbitrum', color: '#28A0F0', allocation: 22 },
      { symbol: 'OP', name: 'Optimism', color: '#FF0420', allocation: 20 },
      { symbol: 'IMX', name: 'Immutable X', color: '#0F2A44', allocation: 15 },
      { symbol: 'LRC', name: 'Loopring', color: '#1C60FF', allocation: 15 }
    ]
  },
  {
    id: 'green-crypto',
    name: 'Green Crypto',
    description: 'Environmentally sustainable and carbon-neutral blockchain projects.',
    tvl: '$890K',
    return30d: '+15.2%',
    riskLevel: 'low',
    tokens: [
      { symbol: 'ALGO', name: 'Algorand', color: '#000000', allocation: 35 },
      { symbol: 'ADA', name: 'Cardano', color: '#0033AD', allocation: 30 },
      { symbol: 'XTZ', name: 'Tezos', color: '#2C7DF7', allocation: 20 },
      { symbol: 'HBAR', name: 'Hedera', color: '#000000', allocation: 15 }
    ]
  }
];

// Mock chat flow data
const chatFlow = [
  {
    question: "What's your primary investment goal?",
    options: [
      "Long-term wealth building",
      "Generate passive income",
      "High growth potential",
      "Portfolio diversification"
    ],
    botMessage: "Welcome! I'm your AI investment advisor. Let's find the perfect cluster for your goals. What's your primary investment objective?"
  },
  {
    question: "How would you describe your risk tolerance?",
    options: [
      "Conservative - Steady, predictable returns",
      "Moderate - Balanced growth with some volatility",
      "Aggressive - High risk for potentially high returns"
    ],
    botMessage: "Great choice! Understanding your risk tolerance helps me recommend suitable investments. How comfortable are you with market volatility?"
  },
  {
    question: "What's your investment timeframe?",
    options: [
      "Short-term (3-12 months)",
      "Medium-term (1-3 years)",
      "Long-term (3+ years)"
    ],
    botMessage: "Perfect! Your investment horizon is crucial for strategy selection. What timeframe are you considering?"
  },
  {
    question: "Any specific sectors that interest you?",
    options: [
      "DeFi and traditional finance",
      "AI and emerging technology",
      "Scaling and infrastructure",
      "Sustainable and green projects"
    ],
    botMessage: "Excellent! Now, are there any particular blockchain sectors that excite you or align with your interests?"
  }
];

// Mock coin data
const coins = {
  'uni': {
    id: 'uni',
    symbol: 'UNI',
    name: 'Uniswap',
    color: '#FF007A',
    price: '6.47',
    change24h: '+3.21%',
    marketCap: '4.87B',
    volume24h: '142.3M',
    circulatingSupply: '753.77M UNI',
    ath: '$44.97'
  },
  'aave': {
    id: 'aave',
    symbol: 'AAVE',
    name: 'Aave',
    color: '#B6509E',
    price: '89.34',
    change24h: '+1.87%',
    marketCap: '1.34B',
    volume24h: '67.8M',
    circulatingSupply: '14.99M AAVE',
    ath: '$666.86'
  },
  'matic': {
    id: 'matic',
    symbol: 'MATIC',
    name: 'Polygon',
    color: '#8247E5',
    price: '0.42',
    change24h: '+5.12%',
    marketCap: '3.97B',
    volume24h: '234.5M',
    circulatingSupply: '9.44B MATIC',
    ath: '$2.92'
  }
};

export const mockAPI = {
  // Get all clusters for dashboard
  getClusters: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(clusters), 300);
    });
  },

  // Get specific cluster by ID
  getClusterById: (id: string) => {
    return clusters.find(cluster => cluster.id === id) || null;
  },

  // Get chat flow for cluster interaction
  getChatFlow: () => {
    return chatFlow;
  },

  // Get coin data by ID
  getCoinById: (id: string) => {
    return coins[id as keyof typeof coins] || null;
  },

  // Simulate investment transaction
  investInCluster: async (clusterId: string, amount: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `tx_${Math.random().toString(36).substr(2, 9)}`,
          amount,
          clusterId,
          timestamp: new Date().toISOString()
        });
      }, 2000);
    });
  },

  // Get user portfolio data
  getUserPortfolio: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalValue: 12456.78,
          activeClusters: 3,
          return24h: 2.34,
          returnAllTime: 18.92,
          positions: [
            { clusterId: 'defi-giants', value: 4500, allocation: 36.2 },
            { clusterId: 'ai-revolution', value: 3200, allocation: 25.7 },
            { clusterId: 'layer2-scaling', value: 4756.78, allocation: 38.1 }
          ]
        });
      }, 500);
    });
  }
};

// Synchronous version for immediate access
export default {
  getClusters: () => clusters,
  getClusterById: (id: string) => clusters.find(cluster => cluster.id === id) || null,
  getChatFlow: () => chatFlow,
  getCoinById: (id: string) => coins[id as keyof typeof coins] || null
};
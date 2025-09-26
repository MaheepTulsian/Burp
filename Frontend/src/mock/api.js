// Mock API for BURP platform
// This simulates backend responses for development
// Replace with real API endpoints when integrating with Node.js backend

// Utility function to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock cluster data
const mockClusters = [
  {
    id: 'defi-titans',
    name: 'DeFi Titans',
    description: 'Blue-chip DeFi protocols with proven track records',
    stats: {
      totalValue: '$2.4M',
      apy: '12.5%',
      risk: 'Medium',
      tokens: 8
    },
    tokens: [
      { symbol: 'UNI', allocation: 25, price: '$6.42', change: '+2.1%' },
      { symbol: 'AAVE', allocation: 20, price: '$89.50', change: '+1.8%' },
      { symbol: 'COMP', allocation: 15, price: '$45.20', change: '-0.5%' },
      { symbol: 'MKR', allocation: 15, price: '$1,245', change: '+3.2%' },
      { symbol: 'SNX', allocation: 10, price: '$2.85', change: '+1.1%' },
      { symbol: 'CRV', allocation: 8, price: '$0.95', change: '+0.8%' },
      { symbol: 'BAL', allocation: 4, price: '$4.12', change: '+2.5%' },
      { symbol: 'YFI', allocation: 3, price: '$6,789', change: '+4.1%' }
    ]
  },
  {
    id: 'ai-revolution',
    name: 'AI Revolution',
    description: 'Next-generation AI and machine learning tokens',
    stats: {
      totalValue: '$1.8M',
      apy: '18.7%',
      risk: 'High',
      tokens: 6
    },
    tokens: [
      { symbol: 'RENDER', allocation: 30, price: '$3.45', change: '+5.2%' },
      { symbol: 'OCEAN', allocation: 25, price: '$0.62', change: '+3.8%' },
      { symbol: 'FET', allocation: 20, price: '$1.28', change: '+2.9%' },
      { symbol: 'AGIX', allocation: 15, price: '$0.34', change: '+4.5%' },
      { symbol: 'TAO', allocation: 6, price: '$189.50', change: '+6.7%' },
      { symbol: 'RNDR', allocation: 4, price: '$2.89', change: '+3.1%' }
    ]
  },
  {
    id: 'gaming-metaverse',
    name: 'Gaming & Metaverse',
    description: 'Virtual worlds and blockchain gaming ecosystems',
    stats: {
      totalValue: '$3.1M',
      apy: '15.3%',
      risk: 'Medium-High',
      tokens: 7
    },
    tokens: [
      { symbol: 'SAND', allocation: 25, price: '$0.45', change: '+1.9%' },
      { symbol: 'MANA', allocation: 20, price: '$0.38', change: '+2.4%' },
      { symbol: 'AXS', allocation: 18, price: '$6.78', change: '+0.8%' },
      { symbol: 'ENJ', allocation: 15, price: '$0.28', change: '+1.5%' },
      { symbol: 'GALA', allocation: 10, price: '$0.025', change: '+3.2%' },
      { symbol: 'ILV', allocation: 7, price: '$52.30', change: '+2.8%' },
      { symbol: 'FLOW', allocation: 5, price: '$0.72', change: '+1.1%' }
    ]
  },
  {
    id: 'layer2-scaling',
    name: 'Layer 2 Scaling',
    description: 'Ethereum scaling solutions and optimistic rollups',
    stats: {
      totalValue: '$1.9M',
      apy: '14.2%',
      risk: 'Medium',
      tokens: 5
    },
    tokens: [
      { symbol: 'MATIC', allocation: 35, price: '$0.85', change: '+2.7%' },
      { symbol: 'ARB', allocation: 25, price: '$1.12', change: '+1.8%' },
      { symbol: 'OP', allocation: 20, price: '$1.89', change: '+3.1%' },
      { symbol: 'LRC', allocation: 12, price: '$0.24', change: '+0.9%' },
      { symbol: 'IMX', allocation: 8, price: '$1.34', change: '+2.2%' }
    ]
  }
];

// Mock chat responses for cluster interaction
const mockChatResponses = {
  'defi-titans': [
    {
      type: 'bot',
      message: "Welcome to DeFi Titans analysis! I'm your AI investment advisor. This cluster focuses on established DeFi protocols with strong fundamentals. What's your risk tolerance?",
      timestamp: Date.now() - 8000
    },
    {
      type: 'user',
      message: "I'm comfortable with medium risk investments. I'm looking for steady growth with some upside potential.",
      timestamp: Date.now() - 6500
    },
    {
      type: 'bot', 
      message: "Based on current market conditions, DeFi Titans shows strong momentum with 12.5% APY. The cluster includes blue-chip protocols like UNI, AAVE, and MKR. What's your investment timeline?",
      timestamp: Date.now() - 5000
    },
    {
      type: 'user',
      message: "I'm planning to hold for 6-12 months. I want to benefit from the DeFi growth but not looking for day trading.",
      timestamp: Date.now() - 3500
    },
    {
      type: 'bot',
      message: "Perfect! For a medium-term horizon, this cluster offers excellent risk-adjusted returns. The AI rebalancing algorithm has optimized allocations based on recent performance and volatility metrics. Ready to proceed with this investment?",
      timestamp: Date.now() - 1000,
      isFinal: true
    }
  ],
  'ai-revolution': [
    {
      type: 'bot',
      message: "Welcome to AI Revolution! This is our highest-growth potential cluster focusing on artificial intelligence and machine learning tokens. How familiar are you with AI crypto projects?",
      timestamp: Date.now() - 8000
    },
    {
      type: 'user',
      message: "I have some knowledge about AI projects. I've been following the space and believe in the long-term potential of AI in crypto.",
      timestamp: Date.now() - 6500
    },
    {
      type: 'bot',
      message: "Great! The AI sector is experiencing massive growth. This cluster includes RENDER for GPU computing, OCEAN for data marketplaces, and emerging AI agents. The risk is higher but so is the potential return at 18.7% APY. What's your risk appetite?",
      timestamp: Date.now() - 5000
    },
    {
      type: 'user',
      message: "I'm willing to take higher risks for higher returns. I understand the volatility and I'm prepared for it.",
      timestamp: Date.now() - 3500
    },
    {
      type: 'bot',
      message: "Excellent choice for aggressive growth! Our AI has identified strong correlation patterns and momentum indicators across these tokens. The cluster is optimally balanced for maximum growth potential. Shall we proceed with this high-growth investment?",
      timestamp: Date.now() - 1000,
      isFinal: true
    }
  ],
  'gaming-metaverse': [
    {
      type: 'bot',
      message: "Welcome to Gaming & Metaverse analysis! This cluster captures the growing intersection of gaming, NFTs, and virtual worlds. Are you interested in the gaming and metaverse sectors?",
      timestamp: Date.now() - 8000
    },
    {
      type: 'user',
      message: "Yes, I'm very interested in the metaverse. I think virtual worlds and blockchain gaming have huge potential as adoption grows.",
      timestamp: Date.now() - 6500
    },
    {
      type: 'bot',
      message: "The gaming and metaverse space is rapidly evolving with major brands entering virtual worlds. This cluster includes SAND, MANA, and other leading metaverse tokens with 15.3% APY. How much exposure do you want to this sector?",
      timestamp: Date.now() - 5000
    },
    {
      type: 'user',
      message: "I'd like moderate exposure - maybe 10-20% of my portfolio. I want to participate in the growth but not overexpose myself.",
      timestamp: Date.now() - 3500
    },
    {
      type: 'bot',
      message: "Smart approach! This cluster provides diversified exposure across gaming, virtual land, and NFT ecosystems. The allocation is balanced to capture growth while managing sector concentration risk. Ready to enter the metaverse?",
      timestamp: Date.now() - 1000,
      isFinal: true
    }
  ],
  'layer2-scaling': [
    {
      type: 'bot',
      message: "Welcome to Layer 2 Scaling analysis! This cluster focuses on Ethereum scaling solutions and layer 2 protocols. Do you understand the importance of scaling solutions for blockchain adoption?",
      timestamp: Date.now() - 8000
    },
    {
      type: 'user',
      message: "Yes, I know that high gas fees and slow transactions are major issues. Layer 2 solutions seem crucial for mainstream adoption.",
      timestamp: Date.now() - 6500
    },
    {
      type: 'bot',
      message: "Exactly right! Layer 2 solutions are essential infrastructure for blockchain scalability. This cluster includes Polygon, Arbitrum, and Optimism with 14.2% APY. These protocols are seeing massive adoption growth. What's your investment thesis on infrastructure plays?",
      timestamp: Date.now() - 5000
    },
    {
      type: 'user',
      message: "I believe infrastructure investments are solid long-term plays. They're like investing in the internet backbone - essential for everything built on top.",
      timestamp: Date.now() - 3500
    },
    {
      type: 'bot',
      message: "Perfect analogy! Layer 2 infrastructure is indeed the backbone of the next generation of dApps. Our cluster captures the best-positioned scaling solutions with strong tokenomics and adoption. Shall we invest in the infrastructure layer?",
      timestamp: Date.now() - 1000,
      isFinal: true
    }
  ]
};

// Mock coin detail data
const mockCoinDetails = {
  'UNI': {
    name: 'Uniswap',
    symbol: 'UNI',
    price: '$6.42',
    change24h: '+2.1%',
    marketCap: '$4.8B',
    volume24h: '$156M',
    description: 'Uniswap is a decentralized exchange protocol built on Ethereum that allows users to swap ERC-20 tokens without the need for a centralized intermediary.',
    techIntegrations: [
      { name: 'Pyth Network', description: 'Real-time price feeds' },
      { name: '1inch', description: 'Best execution routing' }
    ],
    historicalReturns: {
      '1D': '+2.1%',
      '7D': '+8.5%',
      '30D': '+12.3%',
      '90D': '+28.7%',
      '1Y': '+145.2%'
    }
  }
};

// API Functions
export const mockApi = {
  // Get all clusters for dashboard
  getClusters: async () => {
    await delay(800);
    return mockClusters;
  },

  // Get specific cluster details
  getCluster: async (id) => {
    await delay(600);
    const cluster = mockClusters.find(c => c.id === id);
    if (!cluster) throw new Error('Cluster not found');
    return cluster;
  },

  // Get chat responses for a cluster
  getClusterChat: async (clusterId) => {
    await delay(1000);
    return mockChatResponses[clusterId] || [
      {
        type: 'bot',
        message: "Hello! I'm analyzing this cluster for you. Please wait while I gather the latest data...",
        timestamp: Date.now() - 2000
      },
      {
        type: 'bot',
        message: "Based on my analysis, this cluster shows promising potential. Would you like to proceed with this investment?",
        timestamp: Date.now() - 500,
        isFinal: true
      }
    ];
  },

  // Simulate wallet connection
  connectWallet: async (walletType = 'MetaMask') => {
    await delay(2000);
    
    // Simulate wallet connection success
    return {
      address: '0x742d35Cc6634C0532925a3b8D6C8c6b7c8c8c8c8',
      balance: '1.245 ETH',
      network: 'Ethereum Mainnet',
      walletType
    };
  },

  // Get coin details
  getCoinDetail: async (symbol) => {
    await delay(500);
    return mockCoinDetails[symbol] || {
      name: symbol,
      symbol,
      price: '$0.00',
      change24h: '0%',
      marketCap: 'N/A',
      volume24h: 'N/A',
      description: 'No data available for this token.',
      techIntegrations: [],
      historicalReturns: {}
    };
  },

  // Simulate investment transaction
  investInCluster: async (clusterId, amount) => {
    await delay(3000);
    
    return {
      transactionHash: '0xabcd1234567890abcd1234567890abcd12345678',
      status: 'confirmed',
      amount,
      clusterId,
      timestamp: Date.now()
    };
  }
};

export default mockApi;
const mongoose = require('mongoose');
const Basket = require('../database/models/Basket');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/burp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Default cluster data based on mock API
const defaultClusters = [
  {
    name: 'DeFi Titans',
    description: 'Blue-chip DeFi protocols with proven track records and strong fundamentals for steady growth',
    tokens: [
      { symbol: 'UNI', name: 'Uniswap', address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', weight: 25, rationale: 'Leading DEX with strong liquidity and governance' },
      { symbol: 'AAVE', name: 'Aave', address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', weight: 20, rationale: 'Premier lending protocol with innovative features' },
      { symbol: 'COMP', name: 'Compound', address: '0xc00e94Cb662C3520282E6f5717214004A7f26888', weight: 15, rationale: 'Established lending protocol with strong adoption' },
      { symbol: 'MKR', name: 'Maker', address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', weight: 15, rationale: 'Decentralized stablecoin protocol with proven stability' },
      { symbol: 'SNX', name: 'Synthetix', address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F', weight: 10, rationale: 'Innovative synthetic assets platform' },
      { symbol: 'CRV', name: 'Curve', address: '0xD533a949740bb3306d119CC777fa900bA034cd52', weight: 8, rationale: 'Leading stablecoin DEX with high yields' },
      { symbol: 'BAL', name: 'Balancer', address: '0xba100000625a3754423978a60c9317c58a424e3D', weight: 4, rationale: 'Automated portfolio manager and DEX' },
      { symbol: 'YFI', name: 'Yearn Finance', address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e', weight: 3, rationale: 'Yield optimization and DeFi aggregation' }
    ],
    riskLevel: 'moderate',
    category: 'defi',
    visibility: 'public',
    featured: true,
    createdBy: 'ai',
    aiGenerated: true,
    popularity: {
      score: 50,
      views: 250,
      investments: 25
    },
    aiMetadata: {
      model: 'BURP-AI-v1',
      confidence: 0.85,
      marketConditions: 'bullish',
      generatedAt: new Date()
    },
    performance: {
      returns: {
        daily: 1.2,
        weekly: 8.5,
        monthly: 12.3,
        yearly: 145.2
      }
    }
  },
  {
    name: 'AI Revolution',
    description: 'Next-generation AI and machine learning tokens positioned for explosive growth in the AI sector',
    tokens: [
      { symbol: 'RENDER', name: 'Render Token', address: '0x6De037ef9aD2725EB40118Bb1702EBb27e4Aeb24', weight: 30, rationale: 'Leading GPU computing network for AI and graphics' },
      { symbol: 'OCEAN', name: 'Ocean Protocol', address: '0x967da4048cD07aB37855c090aAF366e4ce1b9F48', weight: 25, rationale: 'Decentralized data marketplace for AI training' },
      { symbol: 'FET', name: 'Fetch.ai', address: '0xaea46A60368A7bD060eec7DF8CBa43b7EF41Ad85', weight: 20, rationale: 'Autonomous AI agents and machine learning platform' },
      { symbol: 'AGIX', name: 'SingularityNET', address: '0x5B7533812759B45C2B44C19e320ba2cD2681b542', weight: 15, rationale: 'Decentralized AI marketplace and AGI development' },
      { symbol: 'TAO', name: 'Bittensor', address: '0x77E06c9eCCf2E797fd462A92B6D7642EF85b0A44', weight: 6, rationale: 'Decentralized machine learning network protocol' },
      { symbol: 'RNDR', name: 'Render Network', address: '0x6De037ef9aD2725EB40118Bb1702EBb27e4Aeb24', weight: 4, rationale: 'Distributed GPU rendering network for AI workloads' }
    ],
    riskLevel: 'aggressive',
    category: 'ai',
    visibility: 'public',
    featured: true,
    createdBy: 'ai',
    aiGenerated: true,
    popularity: {
      score: 75,
      views: 350,
      investments: 35
    },
    aiMetadata: {
      model: 'BURP-AI-v1',
      confidence: 0.78,
      marketConditions: 'bullish',
      generatedAt: new Date()
    },
    performance: {
      returns: {
        daily: 2.8,
        weekly: 15.2,
        monthly: 28.7,
        yearly: 287.5
      }
    }
  },
  {
    name: 'Gaming & Metaverse',
    description: 'Virtual worlds and blockchain gaming ecosystems capturing the future of digital entertainment',
    tokens: [
      { symbol: 'SAND', name: 'The Sandbox', address: '0x3845badAde8e6dFF049820680d1F14bD3903a5d0', weight: 25, rationale: 'Leading metaverse platform with major partnerships' },
      { symbol: 'MANA', name: 'Decentraland', address: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942', weight: 20, rationale: 'Pioneer virtual world with established economy' },
      { symbol: 'AXS', name: 'Axie Infinity', address: '0xBB0E17EF65F82Ab018d8EDd776e8DD940327B28b', weight: 18, rationale: 'Top play-to-earn game with strong tokenomics' },
      { symbol: 'ENJ', name: 'Enjin Coin', address: '0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c', weight: 15, rationale: 'Gaming-focused NFT platform and ecosystem' },
      { symbol: 'GALA', name: 'Gala', address: '0x15D4c048F83bd7e37d49eA4C83a07267Ec4203dA', weight: 10, rationale: 'Blockchain gaming platform with multiple titles' },
      { symbol: 'ILV', name: 'Illuvium', address: '0x767FE9EDC9E0dF98E07454847909b5E959D7ca0E', weight: 7, rationale: 'AAA open-world RPG with auto-battler mechanics' },
      { symbol: 'FLOW', name: 'Flow', address: '0x5C147e19CaEaE34adA113b114Bb78c5C19EB17C5', weight: 5, rationale: 'Blockchain built for NFTs and consumer applications' }
    ],
    riskLevel: 'moderate',
    category: 'gaming',
    visibility: 'public',
    featured: true,
    createdBy: 'ai',
    aiGenerated: true,
    popularity: {
      score: 60,
      views: 280,
      investments: 28
    },
    aiMetadata: {
      model: 'BURP-AI-v1',
      confidence: 0.72,
      marketConditions: 'neutral',
      generatedAt: new Date()
    },
    performance: {
      returns: {
        daily: 0.8,
        weekly: 5.2,
        monthly: 15.3,
        yearly: 89.7
      }
    }
  },
  {
    name: 'Layer 2 Scaling',
    description: 'Ethereum scaling solutions and optimistic rollups driving blockchain mass adoption',
    tokens: [
      { symbol: 'MATIC', name: 'Polygon', address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0', weight: 35, rationale: 'Leading Ethereum sidechain with massive adoption' },
      { symbol: 'ARB', name: 'Arbitrum', address: '0x912CE59144191C1204E64559FE8253a0e49E6548', weight: 25, rationale: 'Optimistic rollup with strong ecosystem growth' },
      { symbol: 'OP', name: 'Optimism', address: '0x4200000000000000000000000000000000000042', weight: 20, rationale: 'Leading optimistic rollup with retroactive funding' },
      { symbol: 'LRC', name: 'Loopring', address: '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD', weight: 12, rationale: 'zkRollup protocol with DEX and payment solutions' },
      { symbol: 'IMX', name: 'Immutable X', address: '0xF57e7e7C23978C3cAEC3C3548E3D615c346e79fF', weight: 8, rationale: 'NFT-focused L2 with zero gas fees' }
    ],
    riskLevel: 'moderate',
    category: 'layer2',
    visibility: 'public',
    featured: true,
    createdBy: 'ai',
    aiGenerated: true,
    popularity: {
      score: 45,
      views: 220,
      investments: 20
    },
    aiMetadata: {
      model: 'BURP-AI-v1',
      confidence: 0.88,
      marketConditions: 'bullish',
      generatedAt: new Date()
    },
    performance: {
      returns: {
        daily: 1.5,
        weekly: 7.2,
        monthly: 14.2,
        yearly: 156.8
      }
    }
  },
  {
    name: 'Meme Revolution',
    description: 'Community-driven meme tokens with viral potential and strong social momentum',
    tokens: [
      { symbol: 'DOGE', name: 'Dogecoin', address: '0x4206931337dc273a630d328dA6441786BfaD668f', weight: 40, rationale: 'Original meme coin with mainstream adoption' },
      { symbol: 'SHIB', name: 'Shiba Inu', address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', weight: 25, rationale: 'Ethereum-based meme token with DeFi ecosystem' },
      { symbol: 'PEPE', name: 'Pepe', address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933', weight: 20, rationale: 'Viral meme token with strong community support' },
      { symbol: 'FLOKI', name: 'Floki Inu', address: '0xcf0C122c6b73ff809C693DB761e7BaeBe62b6a2E', weight: 10, rationale: 'Meme coin with gaming and NFT utility' },
      { symbol: 'BONK', name: 'Bonk', address: '0x1151CB3d861920e07a38e03eEAd12C32178567F6', weight: 5, rationale: 'Solana meme coin with community focus' }
    ],
    riskLevel: 'aggressive',
    category: 'meme',
    visibility: 'public',
    featured: false,
    createdBy: 'ai',
    aiGenerated: true,
    popularity: {
      score: 35,
      views: 180,
      investments: 15
    },
    aiMetadata: {
      model: 'BURP-AI-v1',
      confidence: 0.45,
      marketConditions: 'volatile',
      generatedAt: new Date()
    },
    performance: {
      returns: {
        daily: 5.2,
        weekly: 25.8,
        monthly: 45.3,
        yearly: 325.7
      }
    }
  },
  {
    name: 'Blue Chip Bundle',
    description: 'Conservative portfolio of established cryptocurrencies for stable long-term growth',
    tokens: [
      { symbol: 'BTC', name: 'Bitcoin', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', weight: 50, rationale: 'Digital gold and store of value' },
      { symbol: 'ETH', name: 'Ethereum', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', weight: 30, rationale: 'Leading smart contract platform' },
      { symbol: 'SOL', name: 'Solana', address: '0xD31a59c85aE9D8edEFeC411D448f90841571b89c', weight: 10, rationale: 'High-performance blockchain for dApps' },
      { symbol: 'ADA', name: 'Cardano', address: '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47', weight: 5, rationale: 'Research-driven proof-of-stake blockchain' },
      { symbol: 'DOT', name: 'Polkadot', address: '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402', weight: 5, rationale: 'Interoperable multi-chain protocol' }
    ],
    riskLevel: 'conservative',
    category: 'layer1',
    visibility: 'public',
    featured: true,
    createdBy: 'ai',
    aiGenerated: true,
    popularity: {
      score: 80,
      views: 400,
      investments: 40
    },
    aiMetadata: {
      model: 'BURP-AI-v1',
      confidence: 0.92,
      marketConditions: 'bullish',
      generatedAt: new Date()
    },
    performance: {
      returns: {
        daily: 0.8,
        weekly: 4.2,
        monthly: 8.5,
        yearly: 78.3
      }
    }
  }
];

// Function to populate default clusters
const populateDefaultClusters = async () => {
  try {
    console.log('Starting to populate default clusters...');

    // Clear existing clusters (optional - comment out if you want to keep existing ones)
    // await Basket.deleteMany({ createdBy: 'ai', aiGenerated: true });
    // console.log('Cleared existing AI-generated baskets');

    let created = 0;
    let skipped = 0;

    for (const clusterData of defaultClusters) {
      // Check if cluster already exists
      const existingCluster = await Basket.findOne({
        name: clusterData.name,
        createdBy: 'ai'
      });

      if (existingCluster) {
        console.log(`Cluster "${clusterData.name}" already exists, skipping...`);
        skipped++;
        continue;
      }

      // Create new cluster
      const cluster = new Basket(clusterData);
      await cluster.save();
      console.log(`✅ Created cluster: "${clusterData.name}"`);
      created++;
    }

    console.log(`\n🎉 Population complete!`);
    console.log(`📊 Created: ${created} clusters`);
    console.log(`⏭️  Skipped: ${skipped} clusters (already exist)`);
    console.log(`📈 Total clusters in database: ${await Basket.countDocuments()}`);

  } catch (error) {
    console.error('❌ Error populating clusters:', error);
  }
};

// Function to update existing clusters with new fields
const updateExistingClusters = async () => {
  try {
    console.log('Updating existing clusters with new visibility fields...');

    const result = await Basket.updateMany(
      { visibility: { $exists: false } },
      {
        $set: {
          visibility: 'private',
          featured: false,
          'popularity.score': 0,
          'popularity.views': 0,
          'popularity.investments': 0
        }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} existing clusters with visibility fields`);
  } catch (error) {
    console.error('❌ Error updating existing clusters:', error);
  }
};

// Main execution function
const main = async () => {
  await connectDB();
  await updateExistingClusters();
  await populateDefaultClusters();
  await mongoose.connection.close();
  console.log('Database connection closed');
};

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { populateDefaultClusters, updateExistingClusters };
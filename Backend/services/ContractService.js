const BaseService = require('./BaseService');
// const { ethers } = require('ethers'); // Commented out - contracts integration disabled for now

class ContractService extends BaseService {
  constructor() {
    super();
    this.provider = null;
    this.signer = null;
    this.contracts = {};

    this.addresses = {
      clusterBasket: process.env.CLUSTER_BASKET_ADDRESS,
      clusterDEX: process.env.CLUSTER_DEX_ADDRESS,
      clusterPricing: process.env.CLUSTER_PRICING_ADDRESS
    };

    this.rpcUrl = process.env.ETHEREUM_RPC_URL;
    this.privateKey = process.env.PRIVATE_KEY;
    this.chainId = process.env.CHAIN_ID || '137';

    this.initializeProvider();
  }

  initializeProvider() {
    // Contract integration disabled for now
    // if (this.rpcUrl) {
    //   this.provider = new ethers.JsonRpcProvider(this.rpcUrl);

    //   if (this.privateKey) {
    //     this.signer = new ethers.Wallet(this.privateKey, this.provider);
    //   }
    // }
  }

  async getContract(contractName, address, abi) {
    // Contract integration disabled for now
    throw new Error('Contract integration disabled - using API-only mode');
    // try {
    //   if (!this.provider) {
    //     throw new Error('Provider not initialized');
    //   }

    //   if (!this.contracts[contractName]) {
    //     this.contracts[contractName] = new ethers.Contract(
    //       address,
    //       abi,
    //       this.signer || this.provider
    //     );
    //   }

    //   return this.contracts[contractName];
    // } catch (error) {
    //   throw new Error(`Failed to get contract ${contractName}: ${error.message}`);
    // }
  }

  async getClusterBasketContract() {
    const abi = [
      "function createBasketFromAI(string memory basketName, address[] memory tokens, uint256[] memory weights, bytes memory aiSignature) external returns (uint256)",
      "function investInBasket(uint256 basketId, uint256 amount) external payable",
      "function updateBasketWeights(uint256 basketId, uint256[] memory newWeights, bytes memory aiSignature) external",
      "function calculateUserShare(uint256 basketId, address user) external view returns (uint256)",
      "function getBasketInfo(uint256 basketId) external view returns (tuple(string name, address[] tokens, uint256[] weights, uint256 totalValue, bool isActive))",
      "function getUserBaskets(address user) external view returns (uint256[] memory)",
      "event BasketCreated(uint256 indexed basketId, string name, address indexed creator)",
      "event Investment(uint256 indexed basketId, address indexed investor, uint256 amount)",
      "event Rebalanced(uint256 indexed basketId, uint256[] newWeights)"
    ];

    return await this.getContract('clusterBasket', this.addresses.clusterBasket, abi);
  }

  async getClusterDEXContract() {
    const abi = [
      "function executeSwapVia1inch(address tokenIn, address tokenOut, uint256 amountIn, uint256 minAmountOut, bytes calldata oneInchData) external returns (uint256)",
      "function batchSwapForBasket(address[] memory tokensIn, address[] memory tokensOut, uint256[] memory amountsIn, uint256[] memory minAmountsOut, bytes[] calldata oneInchDataArray) external returns (uint256[] memory)",
      "function setSlippageProtection(uint256 newSlippage) external",
      "function getSlippageProtection() external view returns (uint256)",
      "event SwapExecuted(address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut)",
      "event BatchSwapCompleted(uint256 indexed basketId, uint256 swapCount)"
    ];

    return await this.getContract('clusterDEX', this.addresses.clusterDEX, abi);
  }

  async getClusterPricingContract() {
    const abi = [
      "function getPythPrice(bytes32 priceId) external view returns (int64 price, uint64 publishTime)",
      "function isPriceStale(bytes32 priceId, uint256 maxAge) external view returns (bool)",
      "function updateAllPrices(bytes[] calldata updateData) external payable",
      "function calculateBasketTotalValue(uint256 basketId) external view returns (uint256)",
      "function getTokenPrice(address token) external view returns (uint256)",
      "function setTokenPriceId(address token, bytes32 priceId) external",
      "event PriceUpdated(address indexed token, uint256 price, uint256 timestamp)",
      "event PriceFeedStale(address indexed token, bytes32 priceId)"
    ];

    return await this.getContract('clusterPricing', this.addresses.clusterPricing, abi);
  }

  async createBasket(basketName, tokens, weights, aiSignature) {
    try {
      const contract = await this.getClusterBasketContract();

      const tx = await contract.createBasketFromAI(basketName, tokens, weights, aiSignature);
      const receipt = await tx.wait();

      const basketCreatedEvent = receipt.logs.find(log =>
        log.topics[0] === ethers.id("BasketCreated(uint256,string,address)")
      );

      let basketId = null;
      if (basketCreatedEvent) {
        basketId = parseInt(basketCreatedEvent.topics[1], 16);
      }

      return this.formatSuccess({
        transactionHash: receipt.hash,
        basketId,
        basketName,
        tokens,
        weights,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      }, 'Basket created successfully');

    } catch (error) {
      return this.formatError(error, 400, 'Failed to create basket');
    }
  }

  async investInBasket(basketId, amount, userAddress) {
    try {
      const contract = await this.getClusterBasketContract();

      const tx = await contract.investInBasket(basketId, amount, { value: amount });
      const receipt = await tx.wait();

      return this.formatSuccess({
        transactionHash: receipt.hash,
        basketId,
        investmentAmount: amount.toString(),
        investor: userAddress,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      }, 'Investment completed successfully');

    } catch (error) {
      return this.formatError(error, 400, 'Failed to invest in basket');
    }
  }

  async executeSwap(tokenIn, tokenOut, amountIn, minAmountOut, oneInchData) {
    try {
      const contract = await this.getClusterDEXContract();

      const tx = await contract.executeSwapVia1inch(tokenIn, tokenOut, amountIn, minAmountOut, oneInchData);
      const receipt = await tx.wait();

      return this.formatSuccess({
        transactionHash: receipt.hash,
        tokenIn,
        tokenOut,
        amountIn: amountIn.toString(),
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      }, 'Swap executed successfully');

    } catch (error) {
      return this.formatError(error, 400, 'Failed to execute swap');
    }
  }

  async getBasketInfo(basketId) {
    try {
      const contract = await this.getClusterBasketContract();
      const basketInfo = await contract.getBasketInfo(basketId);

      return this.formatSuccess({
        basketId,
        name: basketInfo.name,
        tokens: basketInfo.tokens,
        weights: basketInfo.weights.map(w => w.toString()),
        totalValue: basketInfo.totalValue.toString(),
        isActive: basketInfo.isActive
      }, 'Basket info retrieved successfully');

    } catch (error) {
      return this.formatError(error, 404, 'Failed to get basket info');
    }
  }

  async getUserBaskets(userAddress) {
    try {
      const contract = await this.getClusterBasketContract();
      const basketIds = await contract.getUserBaskets(userAddress);

      const baskets = [];
      for (const basketId of basketIds) {
        const basketInfo = await this.getBasketInfo(parseInt(basketId.toString()));
        if (basketInfo.success) {
          baskets.push(basketInfo.data);
        }
      }

      return this.formatSuccess({
        userAddress,
        basketCount: baskets.length,
        baskets
      }, 'User baskets retrieved successfully');

    } catch (error) {
      return this.formatError(error, 404, 'Failed to get user baskets');
    }
  }

  async getTokenPrice(tokenAddress) {
    try {
      const contract = await this.getClusterPricingContract();
      const price = await contract.getTokenPrice(tokenAddress);

      return this.formatSuccess({
        tokenAddress,
        price: price.toString(),
        timestamp: new Date().toISOString()
      }, 'Token price retrieved successfully');

    } catch (error) {
      return this.formatError(error, 404, 'Failed to get token price');
    }
  }

  async calculateBasketValue(basketId) {
    try {
      const contract = await this.getClusterPricingContract();
      const totalValue = await contract.calculateBasketTotalValue(basketId);

      return this.formatSuccess({
        basketId,
        totalValue: totalValue.toString(),
        timestamp: new Date().toISOString()
      }, 'Basket value calculated successfully');

    } catch (error) {
      return this.formatError(error, 404, 'Failed to calculate basket value');
    }
  }

  async getBlockchainStatus() {
    try {
      if (!this.provider) {
        throw new Error('Provider not available');
      }

      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();
      const gasPrice = await this.provider.getFeeData();

      return this.formatSuccess({
        network: {
          name: network.name,
          chainId: network.chainId.toString()
        },
        blockNumber,
        gasPrice: {
          gasPrice: gasPrice.gasPrice ? gasPrice.gasPrice.toString() : null,
          maxFeePerGas: gasPrice.maxFeePerGas ? gasPrice.maxFeePerGas.toString() : null,
          maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas ? gasPrice.maxPriorityFeePerGas.toString() : null
        },
        contracts: {
          clusterBasket: this.addresses.clusterBasket || 'Not deployed',
          clusterDEX: this.addresses.clusterDEX || 'Not deployed',
          clusterPricing: this.addresses.clusterPricing || 'Not deployed'
        },
        timestamp: new Date().toISOString()
      }, 'Blockchain status retrieved successfully');

    } catch (error) {
      return this.formatError(error, 500, 'Failed to get blockchain status');
    }
  }
}

module.exports = ContractService;
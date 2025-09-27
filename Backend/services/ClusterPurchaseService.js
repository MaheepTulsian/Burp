const BaseService = require('./BaseService');
const axios = require('axios');

class ClusterPurchaseService extends BaseService {
  constructor() {
    super();
    this.apiKey = process.env.ONEINCH_API_KEY;
    this.baseUrl = process.env.ONEINCH_API_URL || 'https://api.1inch.dev';
    this.chainId = process.env.ONEINCH_CHAIN_ID || '137';
    this.pyusdAddress = process.env.PYUSD_CONTRACT_ADDRESS || '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';

    this.tokens = {
      PYUSD: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      WETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      WBTC: '0x1BFD67037B42Cf2047067bd4F2C47D9BfD6',
      MATIC: '0x0000000000000000000000000000000000001010',
      USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
    };
  }

  async getQuote(tokenIn, tokenOut, amount) {
    try {
      const params = new URLSearchParams({
        src: tokenIn,
        dst: tokenOut,
        amount: amount.toString(),
        includeTokensInfo: true,
        includeProtocols: true,
        includeGas: true
      });

      const response = await axios.get(
        `${this.baseUrl}/swap/v5.2/${this.chainId}/quote?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'accept': 'application/json'
          }
        }
      );

      return this.formatSuccess(response.data, 'Quote retrieved successfully');
    } catch (error) {
      return this.formatError(error, 400, 'Failed to get quote from 1inch');
    }
  }

  async executeSwap(tokenIn, tokenOut, amount, walletAddress, slippage = 1) {
    try {
      const params = new URLSearchParams({
        src: tokenIn,
        dst: tokenOut,
        amount: amount.toString(),
        from: walletAddress,
        slippage: slippage.toString(),
        disableEstimate: false,
        allowPartialFill: false
      });

      const response = await axios.get(
        `${this.baseUrl}/swap/v5.2/${this.chainId}/swap?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'accept': 'application/json'
          }
        }
      );

      return this.formatSuccess(response.data, 'Swap transaction prepared successfully');
    } catch (error) {
      return this.formatError(error, 400, 'Failed to prepare swap transaction');
    }
  }

  async buyClusterTokens(userWallet, pyusdAmount, clusterTokens) {
    try {
      const transactions = [];
      const quotes = [];

      for (const token of clusterTokens) {
        const targetAmount = this.calculateTokenAmount(pyusdAmount, token.percentage);

        const quote = await this.getQuote(
          this.pyusdAddress,
          token.address,
          targetAmount
        );

        if (!quote.success) {
          throw new Error(`Failed to get quote for ${token.symbol}: ${quote.message}`);
        }

        const swapData = await this.executeSwap(
          this.pyusdAddress,
          token.address,
          targetAmount,
          userWallet,
          1
        );

        if (!swapData.success) {
          throw new Error(`Failed to prepare swap for ${token.symbol}: ${swapData.message}`);
        }

        transactions.push({
          token: token.symbol,
          address: token.address,
          percentage: token.percentage,
          inputAmount: targetAmount,
          expectedOutput: quote.data.toTokenAmount,
          transaction: swapData.data.tx
        });

        quotes.push({
          token: token.symbol,
          quote: quote.data
        });
      }

      return this.formatSuccess({
        transactions,
        quotes,
        totalPyusdAmount: pyusdAmount,
        userWallet,
        summary: {
          totalTokens: clusterTokens.length,
          totalTransactions: transactions.length,
          estimatedGasCost: quotes.reduce((sum, q) => sum + (q.quote.estimatedGas || 0), 0)
        }
      }, 'Cluster token purchase transactions prepared successfully');

    } catch (error) {
      return this.formatError(error, 400, 'Failed to prepare cluster token purchases');
    }
  }

  calculateTokenAmount(totalAmount, percentage) {
    return Math.floor(totalAmount * (percentage / 100));
  }

  async getTokenPrice(tokenAddress) {
    try {
      const quote = await this.getQuote(
        this.pyusdAddress,
        tokenAddress,
        '1000000000000000000'
      );

      if (!quote.success) {
        throw new Error('Failed to get token price');
      }

      return this.formatSuccess({
        tokenAddress,
        priceInPyusd: quote.data.toTokenAmount,
        timestamp: new Date().toISOString()
      }, 'Token price retrieved successfully');

    } catch (error) {
      return this.formatError(error, 400, 'Failed to get token price');
    }
  }

  async validateClusterTokens(clusterTokens) {
    try {
      const validationResults = [];
      let totalPercentage = 0;

      for (const token of clusterTokens) {
        totalPercentage += token.percentage;

        const priceCheck = await this.getTokenPrice(token.address);

        validationResults.push({
          symbol: token.symbol,
          address: token.address,
          percentage: token.percentage,
          isValid: priceCheck.success,
          priceData: priceCheck.success ? priceCheck.data : null,
          error: priceCheck.success ? null : priceCheck.message
        });
      }

      const isValidPortfolio = totalPercentage === 100 && validationResults.every(r => r.isValid);

      return this.formatSuccess({
        isValid: isValidPortfolio,
        totalPercentage,
        tokens: validationResults,
        errors: validationResults.filter(r => !r.isValid).map(r => r.error)
      }, isValidPortfolio ? 'Cluster tokens validated successfully' : 'Cluster token validation failed');

    } catch (error) {
      return this.formatError(error, 400, 'Failed to validate cluster tokens');
    }
  }

  async getSupportedTokens() {
    try {
      return this.formatSuccess({
        supportedTokens: this.tokens,
        chainId: this.chainId,
        baseCurrency: 'PYUSD',
        baseCurrencyAddress: this.pyusdAddress
      }, 'Supported tokens retrieved successfully');
    } catch (error) {
      return this.formatError(error, 500, 'Failed to get supported tokens');
    }
  }
}

module.exports = ClusterPurchaseService;
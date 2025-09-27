const BaseService = require('./BaseService');

class OneInchService extends BaseService {
  constructor() {
    super();
    this.baseURL = 'https://api.1inch.dev';
    this.apiKey = process.env.ONEINCH_API_KEY;
    this.defaultChainId = 1; // Ethereum mainnet
  }

  async getQuote(fromToken, toToken, amount, chainId = this.defaultChainId) {
    try {
      if (!this.apiKey) {
        return this.formatError(new Error('1inch API key not configured'), 400);
      }

      const params = new URLSearchParams({
        src: fromToken,
        dst: toToken,
        amount: amount.toString(),
        includeTokensInfo: true,
        includeProtocols: true,
        includeGas: true
      });

      const response = await fetch(
        `${this.baseURL}/swap/v6.0/${chainId}/quote?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return this.formatError(new Error(error.description || 'Quote request failed'), response.status);
      }

      const quoteData = await response.json();

      return this.formatSuccess({
        fromToken: {
          address: quoteData.fromToken.address,
          symbol: quoteData.fromToken.symbol,
          name: quoteData.fromToken.name,
          decimals: quoteData.fromToken.decimals
        },
        toToken: {
          address: quoteData.toToken.address,
          symbol: quoteData.toToken.symbol,
          name: quoteData.toToken.name,
          decimals: quoteData.toToken.decimals
        },
        fromAmount: quoteData.fromAmount,
        toAmount: quoteData.toAmount,
        protocols: quoteData.protocols,
        gas: quoteData.gas,
        estimatedGas: quoteData.estimatedGas
      }, 'Quote retrieved successfully');

    } catch (error) {
      return this.formatError(error, 500, 'Failed to get 1inch quote');
    }
  }

  async getSwapData(fromToken, toToken, amount, fromAddress, slippage = 1, chainId = this.defaultChainId) {
    try {
      if (!this.apiKey) {
        return this.formatError(new Error('1inch API key not configured'), 400);
      }

      const params = new URLSearchParams({
        src: fromToken,
        dst: toToken,
        amount: amount.toString(),
        from: fromAddress,
        slippage: slippage.toString(),
        disableEstimate: false,
        allowPartialFill: false
      });

      const response = await fetch(
        `${this.baseURL}/swap/v6.0/${chainId}/swap?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return this.formatError(new Error(error.description || 'Swap request failed'), response.status);
      }

      const swapData = await response.json();

      return this.formatSuccess({
        fromToken: swapData.fromToken,
        toToken: swapData.toToken,
        fromAmount: swapData.fromAmount,
        toAmount: swapData.toAmount,
        protocols: swapData.protocols,
        tx: {
          from: swapData.tx.from,
          to: swapData.tx.to,
          data: swapData.tx.data,
          value: swapData.tx.value,
          gas: swapData.tx.gas,
          gasPrice: swapData.tx.gasPrice
        }
      }, 'Swap data retrieved successfully');

    } catch (error) {
      return this.formatError(error, 500, 'Failed to get 1inch swap data');
    }
  }

  async getSupportedTokens(chainId = this.defaultChainId) {
    try {
      const response = await fetch(
        `${this.baseURL}/swap/v6.0/${chainId}/tokens`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        return this.formatError(new Error('Failed to fetch supported tokens'), response.status);
      }

      const tokens = await response.json();

      return this.formatSuccess({
        tokens: Object.values(tokens.tokens),
        chainId: chainId,
        count: Object.keys(tokens.tokens).length
      }, 'Supported tokens retrieved successfully');

    } catch (error) {
      return this.formatError(error, 500, 'Failed to get supported tokens');
    }
  }

  async getSpender(chainId = this.defaultChainId) {
    try {
      const response = await fetch(
        `${this.baseURL}/swap/v6.0/${chainId}/approve/spender`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        return this.formatError(new Error('Failed to get spender address'), response.status);
      }

      const spenderData = await response.json();

      return this.formatSuccess({
        spender: spenderData.address
      }, 'Spender address retrieved successfully');

    } catch (error) {
      return this.formatError(error, 500, 'Failed to get spender address');
    }
  }

  async getApproveCalldata(tokenAddress, amount, chainId = this.defaultChainId) {
    try {
      const spenderResult = await this.getSpender(chainId);
      if (!spenderResult.success) {
        return spenderResult;
      }

      const params = new URLSearchParams({
        tokenAddress: tokenAddress,
        amount: amount.toString()
      });

      const response = await fetch(
        `${this.baseURL}/swap/v6.0/${chainId}/approve/transaction?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        return this.formatError(new Error('Failed to get approve calldata'), response.status);
      }

      const approveData = await response.json();

      return this.formatSuccess({
        to: approveData.to,
        data: approveData.data,
        value: approveData.value,
        gas: approveData.gas,
        gasPrice: approveData.gasPrice,
        spender: spenderResult.data.spender
      }, 'Approve transaction data retrieved successfully');

    } catch (error) {
      return this.formatError(error, 500, 'Failed to get approve calldata');
    }
  }
}

module.exports = OneInchService;
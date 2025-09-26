const BaseService = require('./BaseService');
const axios = require('axios');

class PricingService extends BaseService {
  constructor() {
    super();
    this.pythUrl = process.env.PYTH_NETWORK_URL || 'https://hermes.pyth.network';
    this.pythApiUrl = process.env.PYTH_PRICE_SERVICE_URL || 'https://hermes.pyth.network/api';
    this.maxPriceAge = 300; // 5 minutes in seconds

    this.priceIds = {
      'ETH': '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
      'BTC': '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
      'MATIC': '0x5de33a9112c2b700b8d30b8a3402c103578ccfa2765696471cc672bd5cf6ac52',
      'USDC': '0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a',
      'USDT': '0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b'
    };

    this.cache = new Map();
    this.cacheExpiry = 30000; // 30 seconds cache
  }

  async getPythPrice(symbol) {
    try {
      const priceId = this.priceIds[symbol.toUpperCase()];
      if (!priceId) {
        throw new Error(`Price ID not found for symbol: ${symbol}`);
      }

      const cacheKey = `price_${symbol}`;
      const cached = this.cache.get(cacheKey);

      if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
        return this.formatSuccess(cached.data, 'Price retrieved from cache');
      }

      const response = await axios.get(`${this.pythApiUrl}/latest_price_feeds`, {
        params: {
          ids: [priceId]
        }
      });

      if (!response.data || response.data.length === 0) {
        throw new Error('No price data received from Pyth');
      }

      const priceData = response.data[0];
      const price = priceData.price;

      const priceInfo = {
        symbol: symbol.toUpperCase(),
        priceId,
        price: parseFloat(price.price) * Math.pow(10, price.expo),
        confidence: parseFloat(price.conf) * Math.pow(10, price.expo),
        publishTime: new Date(priceData.price.publish_time * 1000),
        isStale: this.isPriceStale(priceData.price.publish_time),
        expo: price.expo,
        rawPrice: price.price
      };

      this.cache.set(cacheKey, {
        data: priceInfo,
        timestamp: Date.now()
      });

      return this.formatSuccess(priceInfo, 'Price retrieved successfully from Pyth');

    } catch (error) {
      return this.formatError(error, 400, 'Failed to get price from Pyth Network');
    }
  }

  async getMultiplePrices(symbols) {
    try {
      const pricePromises = symbols.map(symbol => this.getPythPrice(symbol));
      const results = await Promise.allSettled(pricePromises);

      const prices = {};
      const errors = {};

      results.forEach((result, index) => {
        const symbol = symbols[index];
        if (result.status === 'fulfilled' && result.value.success) {
          prices[symbol] = result.value.data;
        } else {
          errors[symbol] = result.reason || result.value.message;
        }
      });

      return this.formatSuccess({
        prices,
        errors,
        successCount: Object.keys(prices).length,
        errorCount: Object.keys(errors).length,
        timestamp: new Date().toISOString()
      }, 'Multiple prices retrieved');

    } catch (error) {
      return this.formatError(error, 400, 'Failed to get multiple prices');
    }
  }

  async calculateBasketValue(tokens, amounts) {
    try {
      if (tokens.length !== amounts.length) {
        throw new Error('Tokens and amounts arrays must have the same length');
      }

      const symbols = tokens.map(token => this.getSymbolFromAddress(token));
      const pricesResult = await this.getMultiplePrices(symbols);

      if (!pricesResult.success) {
        throw new Error('Failed to get prices for basket calculation');
      }

      const { prices, errors } = pricesResult.data;
      let totalValue = 0;
      const tokenValues = [];

      for (let i = 0; i < tokens.length; i++) {
        const symbol = symbols[i];
        const amount = amounts[i];

        if (prices[symbol]) {
          const tokenValue = amount * prices[symbol].price;
          totalValue += tokenValue;

          tokenValues.push({
            token: tokens[i],
            symbol,
            amount,
            price: prices[symbol].price,
            value: tokenValue,
            confidence: prices[symbol].confidence
          });
        } else {
          tokenValues.push({
            token: tokens[i],
            symbol,
            amount,
            price: null,
            value: 0,
            error: errors[symbol] || 'Price not available'
          });
        }
      }

      return this.formatSuccess({
        totalValue,
        tokenValues,
        currency: 'USD',
        timestamp: new Date().toISOString(),
        priceErrors: errors
      }, 'Basket value calculated successfully');

    } catch (error) {
      return this.formatError(error, 400, 'Failed to calculate basket value');
    }
  }

  async getHistoricalPrices(symbol, fromTime, toTime) {
    try {
      const priceId = this.priceIds[symbol.toUpperCase()];
      if (!priceId) {
        throw new Error(`Price ID not found for symbol: ${symbol}`);
      }

      const response = await axios.get(`${this.pythApiUrl}/price_feeds`, {
        params: {
          ids: [priceId],
          start_time: Math.floor(fromTime / 1000),
          end_time: Math.floor(toTime / 1000)
        }
      });

      const historicalData = response.data.map(feed => ({
        price: parseFloat(feed.price.price) * Math.pow(10, feed.price.expo),
        confidence: parseFloat(feed.price.conf) * Math.pow(10, feed.price.expo),
        timestamp: new Date(feed.price.publish_time * 1000),
        publishTime: feed.price.publish_time
      }));

      return this.formatSuccess({
        symbol: symbol.toUpperCase(),
        data: historicalData,
        count: historicalData.length,
        fromTime: new Date(fromTime),
        toTime: new Date(toTime)
      }, 'Historical prices retrieved successfully');

    } catch (error) {
      return this.formatError(error, 400, 'Failed to get historical prices');
    }
  }

  async getPricePerformance(symbol, timeframe = '24h') {
    try {
      const now = Date.now();
      let fromTime;

      switch (timeframe) {
        case '1h':
          fromTime = now - (60 * 60 * 1000);
          break;
        case '24h':
          fromTime = now - (24 * 60 * 60 * 1000);
          break;
        case '7d':
          fromTime = now - (7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          fromTime = now - (30 * 24 * 60 * 60 * 1000);
          break;
        default:
          fromTime = now - (24 * 60 * 60 * 1000);
      }

      const currentPrice = await this.getPythPrice(symbol);
      const historicalPrices = await this.getHistoricalPrices(symbol, fromTime, now);

      if (!currentPrice.success || !historicalPrices.success) {
        throw new Error('Failed to get price data for performance calculation');
      }

      const current = currentPrice.data.price;
      const historical = historicalPrices.data.data;

      if (historical.length === 0) {
        throw new Error('No historical data available');
      }

      const startPrice = historical[0].price;
      const endPrice = current;
      const change = endPrice - startPrice;
      const changePercent = (change / startPrice) * 100;

      const high = Math.max(...historical.map(h => h.price), current);
      const low = Math.min(...historical.map(h => h.price), current);

      return this.formatSuccess({
        symbol: symbol.toUpperCase(),
        timeframe,
        currentPrice: current,
        startPrice,
        change,
        changePercent,
        high,
        low,
        dataPoints: historical.length,
        timestamp: new Date().toISOString()
      }, 'Price performance calculated successfully');

    } catch (error) {
      return this.formatError(error, 400, 'Failed to calculate price performance');
    }
  }

  isPriceStale(publishTime) {
    const now = Math.floor(Date.now() / 1000);
    return (now - publishTime) > this.maxPriceAge;
  }

  getSymbolFromAddress(address) {
    const addressMap = {
      '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619': 'ETH',
      '0x1BFD67037B42Cf2047067bd4F2C47D9BfD6': 'BTC',
      '0x0000000000000000000000000000000000001010': 'MATIC',
      '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174': 'USDC',
      '0xc2132D05D31c914a87C6611C10748AEb04B58e8F': 'USDT'
    };

    return addressMap[address] || address.slice(2, 8).toUpperCase();
  }

  async getPriceStats() {
    try {
      const symbols = Object.keys(this.priceIds);
      const prices = await this.getMultiplePrices(symbols);

      if (!prices.success) {
        throw new Error('Failed to get price statistics');
      }

      const stats = {
        totalSymbols: symbols.length,
        successfulPrices: Object.keys(prices.data.prices).length,
        failedPrices: Object.keys(prices.data.errors).length,
        cacheSize: this.cache.size,
        timestamp: new Date().toISOString(),
        priceIds: this.priceIds,
        stalePrices: Object.values(prices.data.prices).filter(p => p.isStale).length
      };

      return this.formatSuccess(stats, 'Price statistics retrieved successfully');

    } catch (error) {
      return this.formatError(error, 500, 'Failed to get price statistics');
    }
  }

  clearCache() {
    this.cache.clear();
    return this.formatSuccess({ message: 'Price cache cleared' }, 'Cache cleared successfully');
  }
}

module.exports = PricingService;
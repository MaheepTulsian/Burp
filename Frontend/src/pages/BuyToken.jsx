import React, { useEffect, useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

// Simple utility to convert a decimal string amount into token units (string of integer)
function parseUnits(amountStr, decimals) {
  if (!amountStr) return '0';
  const parts = amountStr.split('.');
  const whole = parts[0] || '0';
  const fraction = parts[1] || '';
  if (fraction.length > decimals) {
    // truncate (not rounding) to avoid overflow
    const truncated = fraction.slice(0, decimals);
    return whole + truncated.padEnd(decimals, '0');
  }
  return whole + fraction.padEnd(decimals, '0');
}

const CHAINS = [
  { id: 1, name: 'Ethereum Mainnet' },
  { id: 137, name: 'Polygon' },
  { id: 11155111, name: 'Sepolia' }
];

const API_BASE = (chainId) => `https://api.1inch.io/v5.0/${chainId}`;
const PYUSD_ADDRESS = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'; // common PyUSD/USDC address on Polygon (fallback)

export default function BuyToken() {
  const [chainId, setChainId] = useState(137);
  const [tokens, setTokens] = useState({});
  const [fromAddr, setFromAddr] = useState('');
  const [fromToken, setFromToken] = useState('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'); // native
  const [toToken, setToToken] = useState('0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'); // default receive token (USDC/PyUSD)
  const [amount, setAmount] = useState('100');
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [preset, setPreset] = useState('custom');

  useEffect(() => {
    loadTokens(chainId);
  }, [chainId]);

  // when tokens load or chain changes, prefer PyUSD as the default pay-with token when available
  useEffect(() => {
    if (!tokens || Object.keys(tokens).length === 0) return;
    // prefer token with symbol PYUSD or the known PYUSD address
    const foundSymbol = Object.entries(tokens).find(([, meta]) => meta.symbol === 'PYUSD' || meta.symbol === 'USDP' || meta.symbol === 'USDC');
    if (foundSymbol) {
      const addr = foundSymbol[0];
      setFromToken(addr);
    } else if (tokens[PYUSD_ADDRESS]) {
      setFromToken(PYUSD_ADDRESS);
    }
  }, [tokens]);

  async function loadTokens(chain) {
    setTokens({});
    try {
      const res = await fetch(`${API_BASE(chain)}/tokens`);
      const data = await res.json();
      if (data && data.tokens) setTokens(data.tokens);
    } catch (err) {
      console.error('Failed to load tokens', err);
    }
  }

  const handleGetQuote = async () => {
    setMessage('');
    if (!amount || Number(amount) <= 0) {
      setMessage('Enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const to = toToken;
      const from = fromToken;
      const tokenMeta = tokens[from === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' ? 'native' : from];
      const decimals = tokenMeta ? tokenMeta.decimals : 18;
      const amountUnits = parseUnits(amount, decimals);

      const url = new URL(`${API_BASE(chainId)}/quote`);
      url.searchParams.set('fromTokenAddress', from);
      url.searchParams.set('toTokenAddress', to);
      url.searchParams.set('amount', amountUnits);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data && data.toTokenAmount) {
        setQuote(data);
      } else {
        setMessage(data.description || 'Failed to get quote');
        setQuote(null);
      }
    } catch (err) {
      console.error(err);
      setMessage('Quote request failed');
      setQuote(null);
    } finally {
      setLoading(false);
    }
  };

  const ensureWallet = async () => {
    if (!window.ethereum) throw new Error('No injected wallet found');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0];
  };

  const hex = (v) => (typeof v === 'string' && v.startsWith('0x') ? v : `0x${BigInt(v).toString(16)}`);

  const handleSwap = async () => {
    setMessage('');
    try {
      const fromAddress = await ensureWallet();
      setFromAddr(fromAddress);
      setLoading(true);

      // If from token is ERC20, ensure allowance
      if (fromToken !== '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') {
        // Check allowance
        const allowanceUrl = new URL(`${API_BASE(chainId)}/approve/allowance`);
        allowanceUrl.searchParams.set('tokenAddress', fromToken);
        allowanceUrl.searchParams.set('walletAddress', fromAddress);
        const allowanceRes = await fetch(allowanceUrl.toString());
        const allowanceData = await allowanceRes.json();
        // parse big ints as strings
        const needed = parseUnits(amount, tokens[fromToken].decimals);
        if (BigInt(allowanceData.allowance || '0') < BigInt(needed)) {
          // get approval tx
          const approveUrl = new URL(`${API_BASE(chainId)}/approve/transaction`);
          approveUrl.searchParams.set('tokenAddress', fromToken);
          const approveRes = await fetch(approveUrl.toString());
          const approveTx = await approveRes.json();
          if (approveTx && approveTx.data) {
            setMessage('Sending approval transaction...');
            const txParams = {
              from: fromAddress,
              to: approveTx.to,
              data: approveTx.data,
              value: approveTx.value || '0x0'
            };
            const txHash = await window.ethereum.request({
              method: 'eth_sendTransaction',
              params: [txParams]
            });
            setMessage(`Approval sent: ${txHash}. Waiting a few seconds...`);
            // Not waiting for mining; small delay to allow mempool
            await new Promise((r) => setTimeout(r, 4000));
          } else {
            throw new Error('Approval transaction data not available');
          }
        }
      }

      // Build swap
      const swapUrl = new URL(`${API_BASE(chainId)}/swap`);
      swapUrl.searchParams.set('fromTokenAddress', fromToken);
      swapUrl.searchParams.set('toTokenAddress', toToken);
      const tokenMeta = fromToken === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' ? { decimals: 18 } : tokens[fromToken];
      const amountUnits = parseUnits(amount, tokenMeta.decimals);
      swapUrl.searchParams.set('amount', amountUnits);
      swapUrl.searchParams.set('fromAddress', fromAddress);
      swapUrl.searchParams.set('slippage', '1');

      const swapRes = await fetch(swapUrl.toString());
      const swapData = await swapRes.json();
      if (!swapData || !swapData.tx) {
        setMessage(swapData.description || 'Swap failed to prepare');
        setLoading(false);
        return;
      }

      // Send swap tx via injected wallet
      const tx = {
        from: fromAddress,
        to: swapData.tx.to,
        data: swapData.tx.data,
        value: swapData.tx.value || '0x0'
      };

      setMessage('Sending swap transaction...');
      const txHash = await window.ethereum.request({ method: 'eth_sendTransaction', params: [tx] });
      setMessage(`Swap sent: ${txHash}`);
      setQuote(null);
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Swap failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Buy / Swap Tokens (1inch)</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <label className="col-span-1">Chain</label>
        <select value={chainId} onChange={(e) => setChainId(Number(e.target.value))} className="col-span-2 p-2 border rounded">
          {CHAINS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>


        <label>Pay with</label>
        <select value={fromToken} onChange={(e) => setFromToken(e.target.value)} className="p-2 border rounded col-span-2">
          <option value={'0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'}>Native (ETH/MATIC)</option>
          {Object.keys(tokens).map(addr => (
            <option key={addr} value={addr}>{tokens[addr].symbol} — {tokens[addr].name}</option>
          ))}
        </select>

        <label>To Token</label>
        <select value={toToken} onChange={(e) => setToToken(e.target.value)} className="p-2 border rounded col-span-2">
          {Object.keys(tokens).map(addr => (
            <option key={addr} value={addr}>{tokens[addr].symbol} — {tokens[addr].name}</option>
          ))}
        </select>

        <label>Preset Amount</label>
        <select value={preset} onChange={(e) => { setPreset(e.target.value); if (e.target.value !== 'custom') setAmount(e.target.value); }} className="p-2 border rounded col-span-2">
          <option value="custom">Custom</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="250">250</option>
          <option value="500">500</option>
          <option value="1000">1000</option>
        </select>

        <label>Amount</label>
        <input value={amount} onChange={(e) => { setAmount(e.target.value); setPreset('custom'); }} className="p-2 border rounded col-span-2" />
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={handleGetQuote} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={loading}>
          {loading ? <span className="flex items-center gap-2"><ArrowPathIcon className="w-4 h-4 animate-spin" /> Getting...</span> : 'Get Quote'}
        </button>
        <button onClick={handleSwap} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" disabled={loading || !quote}>
          Swap / Buy
        </button>
      </div>

      {message && <div className="mb-4 text-sm text-gray-700">{message}</div>}

      {quote && (
        <div className="bg-gray-50 p-4 rounded">
          <div className="text-sm text-gray-600">Estimated Receive:</div>
          <div className="text-lg font-medium">
            {Number(quote.toTokenAmount) ? (Number(quote.toTokenAmount) / (10 ** (tokens[quote.toToken.address]?.decimals || 18))).toFixed(6) : quote.toTokenAmount} {quote.toToken.symbol || ''}
          </div>
          <div className="text-xs text-gray-500 mt-2">From: {quote.fromToken.symbol} — To: {quote.toToken.symbol}</div>
        </div>
      )}
    </div>
  );
}

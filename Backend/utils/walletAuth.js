const { ethers } = require('ethers');
const crypto = require('crypto');

const nonceStore = new Map();

const generateNonce = () => {
  return crypto.randomBytes(32).toString('hex');
};

const createNonce = (walletAddress) => {
  const nonce = generateNonce();
  const expiresAt = Date.now() + (5 * 60 * 1000);

  nonceStore.set(walletAddress.toLowerCase(), {
    nonce,
    expiresAt
  });

  return nonce;
};

const getNonce = (walletAddress) => {
  const nonceData = nonceStore.get(walletAddress.toLowerCase());

  if (!nonceData) {
    return null;
  }

  if (Date.now() > nonceData.expiresAt) {
    nonceStore.delete(walletAddress.toLowerCase());
    return null;
  }

  return nonceData.nonce;
};

const clearNonce = (walletAddress) => {
  nonceStore.delete(walletAddress.toLowerCase());
};

const cleanupExpiredNonces = () => {
  const now = Date.now();
  for (const [address, data] of nonceStore.entries()) {
    if (now > data.expiresAt) {
      nonceStore.delete(address);
    }
  }
};

const isValidEthereumAddress = (address) => {
  try {
    return ethers.isAddress(address);
  } catch (error) {
    return false;
  }
};

const createSignMessage = (nonce, walletAddress) => {
  return `Welcome to BURP - Blockchain Unified Rebalancing Platform!

Please sign this message to authenticate your wallet.

Wallet: ${walletAddress}
Nonce: ${nonce}
Timestamp: ${new Date().toISOString()}

This request will not trigger a blockchain transaction or cost any gas fees.`;
};

const verifySignature = async (walletAddress, signature, nonce) => {
  try {
    if (!isValidEthereumAddress(walletAddress)) {
      throw new Error('Invalid Ethereum address');
    }

    const storedNonce = getNonce(walletAddress);
    if (!storedNonce || storedNonce !== nonce) {
      throw new Error('Invalid or expired nonce');
    }

    const message = createSignMessage(nonce, walletAddress);

    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new Error('Signature verification failed');
    }

    clearNonce(walletAddress);

    return {
      isValid: true,
      walletAddress: recoveredAddress.toLowerCase()
    };
  } catch (error) {
    return {
      isValid: false,
      error: error.message
    };
  }
};

const verifyTypedSignature = async (walletAddress, signature, nonce, domain) => {
  try {
    if (!isValidEthereumAddress(walletAddress)) {
      throw new Error('Invalid Ethereum address');
    }

    const storedNonce = getNonce(walletAddress);
    if (!storedNonce || storedNonce !== nonce) {
      throw new Error('Invalid or expired nonce');
    }

    const types = {
      Authentication: [
        { name: 'walletAddress', type: 'address' },
        { name: 'nonce', type: 'string' },
        { name: 'timestamp', type: 'uint256' }
      ]
    };

    const value = {
      walletAddress: walletAddress,
      nonce: nonce,
      timestamp: Math.floor(Date.now() / 1000)
    };

    const recoveredAddress = ethers.verifyTypedData(domain, types, value, signature);

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new Error('Typed signature verification failed');
    }

    clearNonce(walletAddress);

    return {
      isValid: true,
      walletAddress: recoveredAddress.toLowerCase()
    };
  } catch (error) {
    return {
      isValid: false,
      error: error.message
    };
  }
};

setInterval(cleanupExpiredNonces, 60000);

module.exports = {
  createNonce,
  getNonce,
  clearNonce,
  isValidEthereumAddress,
  createSignMessage,
  verifySignature,
  verifyTypedSignature,
  cleanupExpiredNonces
};
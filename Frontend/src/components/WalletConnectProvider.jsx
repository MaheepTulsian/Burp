import React from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mainnet, polygon, optimism, arbitrum, sepolia } from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'BURP Platform',
  projectId: '2dd70e742673c48f486e6af86ce6695c', // get it from https://cloud.walletconnect.com
  chains: [mainnet, polygon, optimism, arbitrum, sepolia],
  ssr: false,
  // Add better wallet connection options
  walletConnectOptions: {
    metadata: {
      name: 'BURP Platform',
      description: 'Blockchain Unified Rebalancing Platform',
      url: window.location.origin,
      icons: ['/favicon.ico']
    }
  }
});

const queryClient = new QueryClient();

export function WalletConnectProvider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default WalletConnectProvider;
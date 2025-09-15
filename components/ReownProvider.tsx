import { AppKit, createAppKit, defaultWagmiConfig } from '@reown/appkit-wagmi-react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { arbitrum, mainnet, polygon } from '@wagmi/core/chains';
import React from 'react';
import { WagmiProvider } from 'wagmi';

// Create a client
const queryClient = new QueryClient();

// Reown Project ID - you need to replace this with your actual Project ID from the Reown dashboard
// Sign up at https://dashboard.reown.com to get your Project ID
const projectId = '69a707270e85426363932965ab26ed21'; // TODO: Replace with your actual Project ID

// Metadata for your app
const metadata = {
  name: 'Glass App',
  description: 'Crypto Fantasy Trading App',
  url: 'https://your-app-url.com',
  icons: ['https://your-app-icon-url.com/icon.png'],
  redirect: {
    native: 'glassapp://',
    universal: 'https://your-app-url.com',
  },
};

// Supported chains
const chains = [mainnet, polygon, arbitrum];

// Create wagmi config
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// Create AppKit
createAppKit({
  projectId,
  metadata,
  wagmiConfig,
  defaultChain: mainnet,
  enableAnalytics: true,
  features: {
    onramp: true,
    swaps: true,
    socials: ['google', 'x', 'discord', 'farcaster', 'github', 'apple', 'facebook'],
  },
});

export default function ReownProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
        <AppKit />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
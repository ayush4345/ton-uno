'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { config } from "../lib/wagmi";
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { TelegramProvider } from './telegramProvider';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { TonClientProvider } from '@/context/ton-client-context.tsx';

const queryClient = new QueryClient();

export function Providers({ children }) {

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: 'light',
          accentColor: '#ed5f1c',
          logo: 'https://www.zkuno.xyz/logo.jpg',
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <TonConnectUIProvider manifestUrl="https://ton-uno.vercel.app/tonconnect-manifest.json">
        <TonClientProvider>
          <QueryClientProvider client={queryClient}>
            <WagmiProvider config={config}>
              <TelegramProvider>
                {children}
              </TelegramProvider>
            </WagmiProvider>
          </QueryClientProvider>
        </TonClientProvider>
      </TonConnectUIProvider>
    </PrivyProvider>
  );
}
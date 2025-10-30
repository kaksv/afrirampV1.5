import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider, useAccount } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


import { projectId, metadata, networks, wagmiAdapter , solanaWeb3JsAdapter} from './config';
import App from './App'

const queryClient = new QueryClient();

const generalConfig = {
  projectId,
  metadata,
  networks,
  themeMode: 'light' as const,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  },
  themeVariables: {
    '--w3m-accent': '#000000',
  }
}

// Create modal
createAppKit({
  adapters: [wagmiAdapter, solanaWeb3JsAdapter],
  ...generalConfig,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)

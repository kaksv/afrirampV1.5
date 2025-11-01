import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider,
  //  useAccount 
  } from 'wagmi';
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
    featuredWalletIds: [
    "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369",
    "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
    "107bb20463699c4e614d3a2fb7b961e66f48774cb8f6d6c1aee789853280972c",
    "b4678fefcc469583ed4ef58a5bd90ce86208b82803f3c45f2de3e0973d268835",
    "a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393",
    "1ca0bdd4747578705b1939af023d120677c64fe6ca76add81fda36e350605e79",
    "43fd1a0aeb90df53ade012cca36692a46d265f0b99b7561e645af42d752edb92",
    "9ce87712b99b3eb57396cc8621db8900ac983c712236f48fb70ad28760be3f6a",
    "6adb6082c909901b9e7189af3a4a0223102cd6f8d5c39e39f3d49acb92b578bb",
    "bc949c5d968ae81310268bf9193f9c9fb7bb4e1283e1284af8f2bd4992535fd6",
  ],

  
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

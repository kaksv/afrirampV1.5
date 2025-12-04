import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import {
  bsc,
   mainnet, 
  //  arbitrum, 
   base,
   celo,
   flare,
   solana, 
  //  solanaDevnet, 
  //  solanaTestnet, 
  unichain } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'


// Get projectId from https://dashboard.reown.com
export const projectId = import.meta.env.VITE_PROJECT_ID || "bbc117a377efd964e8d5025164ffabf2" // this is a public projectId only to use on localhost

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const metadata = {
    name: 'AfriRamp',
    description: 'Get access to fiat and crypto assets seamlessly.',
    url: 'https://afriramp.xyz', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/179229932']
  }

// for custom networks visit -> https://docs.reown.com/appkit/react/core/custom-networks
export const networks = [ bsc, base,mainnet, celo, flare, unichain, solana] as [AppKitNetwork, ...AppKitNetwork[]]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks
})

// Set up Solana Adapter
export const solanaWeb3JsAdapter = new SolanaAdapter()

// set up Bitcoin Adapter


export const config = wagmiAdapter.wagmiConfig
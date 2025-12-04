import { 
  // useAccount,
   useBalance, 
  //  useChainId 
  } from 'wagmi';
// import { formatEther,  formatUnits  } from 'viem';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Token addresses for different networks
type TokenAddresses = Record<number, { USDC?: `0x${string}`; USDT?: `0x${string}`; OFT?: `0x${string}` }>;

const TOKEN_ADDRESSES: TokenAddresses = {
  // Ethereum Mainnet
  1: {
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
  },
  // Ethereum Sepolia
  11155111: {
    USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    USDT: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06'
  },
  // Base Mainnet
  8453: {
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    USDT: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2' //TODO // Dai Stable coin address 0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb
  },
  // Base Sepolia
  84532: {
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    USDT: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06'
  },
  // Celo Mainnet
  42220: {
    USDC: '0xcebA9300f2b948710d2653dD7B07f33A8B32118C',
    USDT: '0x617f3112bf5397D0467D315cC709EF968D9ba546'
  },
  // Celo Alfajores
  44787: {
    USDC: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B',
    USDT: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06'
  },
  // Lisk
  1135: {
    USDC: '0x1234567890123456789012345678901234567890', // Replace with actual address when available
    USDT: '0x0987654321098765432109876543210987654321'  // Replace with actual address when available
  },
  // Flare
  14: {
    // USDC: '0x1234567890123456789012345678901234567890', // Replace with actual address when available
    // USDT: '0xe7cd86e13AC4309349F30B3435a9d337750fC82D',  // Replace with actual address when available
    OFT: '0xe7cd86e13AC4309349F30B3435a9d337750fC82D'
  }
};

// ERC20 ABI for token balance queries
// const ERC20_ABI = [
//   {
//     constant: true,
//     inputs: [{ name: '_owner', type: 'address' }],
//     name: 'balanceOf',
//     outputs: [{ name: 'balance', type: 'uint256' }],
//     type: 'function'
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: 'decimals',
//     outputs: [{ name: '', type: 'uint8' }],
//     type: 'function'
//   }
// ] as const;

export default function BalanceCard() {
  // const { address } = useAccount();
  // const chainId = useChainId();
  
  // Get ETH balance
  const {
    //  data: ethBalance,
      isLoading: isEthLoading } = useBalance({
    // address,
  });
  
  // Get USDC balance if available on the current network
  // const { data: usdcBalance, isLoading: isUsdcLoading } = useBalance({
  //   address,
  //   token: chainId ? TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES]?.USDC : undefined,
  //   unit: 'wei', // 6 decimals for USDC
    
  // });
  
  // Get USDT balance if available on the current network
  // const { data: usdtBalance, isLoading: isUsdtLoading } = useBalance({
  //   address,
  //   token: chainId ? TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES]?.USDT : undefined,
  //   // unit: 'mwei', // 6 decimals for USDT
  //   unit: 'wei',
  // });

   // Get USDT balance if available on the current network
  // const { data: oftBalance, isLoading: isOftLoading } = useBalance({
  //   address,
  //   token: chainId ? TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES]?.OFT : undefined,
  //   unit: 'wei', // 6 decimals for USDT
  // });
  
  // const formatBalance = (balance: bigint | undefined, decimals: number = 18) => {
  //   if (!balance) return '0.00';
  //   return parseFloat(formatUnits(balance, decimals)).toFixed(decimals === 18 ? 4 : 2);
  // };
  
  // const isTokenSupported = (token: 'USDC' | 'USDT' | 'OFT') => {
  //   return chainId && TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES]?.[token];
  // };
  
  return (
    <div className="card overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary-500 to-accent-500" />
      
      <h2 className="text-lg font-semibold mb-6">Utilities.</h2>
      
      {isEthLoading ? (
        <div className="flex flex-col items-center py-6">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400">Loading balances...</p>
        </div>
      ) : (
        <>

          <div className="space-y-4 mb-6">
            {/* ETH Balance */}
            {/* <Link to="/eth">
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-dark-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center mr-3">
                    <span className="text-lg">Ξ</span>
                  </div>
                  <div>
                    <p className="font-medium">{chainId === 8453 ? 'ETH' : chainId === 42220 ? 'CELO' : chainId === 14 ? 'FLR' : 'ETH'}</p> */}
                    {/* <p className="text-sm text-slate-500 dark:text-slate-400">{formatBalance(ethBalance?.value)}</p> */}
                  {/* </div>
                </div>
                <p className="text-xl font-bold">{formatBalance(ethBalance?.value)}</p>
              </div>
            </div>
            </Link> */}
            
            {/* USDC Balance */}
            {/* {isTokenSupported('USDC') && (
              <Link to="/usdc">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-dark-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400 flex items-center justify-center mr-3">
                      <span className="text-lg">$</span>
                    </div>
                    <div>
                      <p className="font-medium">USD Coin</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">USDC</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold">{formatBalance(usdcBalance?.value, 6)}</p>
                </div>
              </div>
              </Link>
            )} */}
            
            {/* USDT Balance */}
            {/* {isTokenSupported('USDT') && (
              <Link to="/usdt">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-dark-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400 flex items-center justify-center mr-3">
                      <span className="text-lg">₮</span>
                    </div>
                    <div>
                      <p className="font-medium">Tether</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">USDT</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold">{formatBalance(usdtBalance?.value, 6)}</p>
                </div>
              </div>
              </Link>
            )} */}

            {/* OFT Balance */}
            {/* {isTokenSupported('OFT') && (
              <Link to="/oft">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-dark-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400 flex items-center justify-center mr-3">
                      <span className="text-lg">₮0</span>
                    </div>
                    <div>
                      <p className="font-medium">OFT Token</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">OFT</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold">{formatBalance(oftBalance?.value, 6)}</p>
                </div>
              </div>
              </Link>
            )} */}
          </div>
          
          {/* <div className="grid grid-cols-2 gap-4">
            <Link 
              to="/send" 
              className="btn btn-primary flex items-center justify-center"
            >
              <ArrowUpRight size={18} className="mr-2" />
              Send Tokens
            </Link>
            <Link 
              to="/receive" 
              className="btn btn-outline flex items-center justify-center"
            >
              <ArrowDownLeft size={18} className="mr-2" />
              Receive Tokens
            </Link>
          </div> */}
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Link 
              to="/onramp" 
              className="flex flex-col items-center p-3 rounded-lg border border-slate-200 dark:border-dark-600 hover:bg-slate-50 dark:hover:bg-dark-600 transition-colors"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-full bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400 flex items-center justify-center mb-2"
              >
                <span className="text-lg">💵</span>
              </motion.div>
              <span className="text-sm font-medium">Buy Stable Coins</span>
            </Link>
            <Link 
              to="/offramp" 
              className="flex flex-col items-center p-3 rounded-lg border border-slate-200 dark:border-dark-600 hover:bg-slate-50 dark:hover:bg-dark-600 transition-colors"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-full bg-warning-100 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400 flex items-center justify-center mb-2"
              >
                <span className="text-lg">💰</span>
              </motion.div>
              <span className="text-sm font-medium">Sell Stable Coins</span>
            </Link>
            <Link 
              to="/buyairtime" 
              className="flex flex-col items-center p-3 rounded-lg border border-slate-200 dark:border-dark-600 hover:bg-slate-50 dark:hover:bg-dark-600 transition-colors"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-full bg-warning-100 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400 flex items-center justify-center mb-2"
              >
                <span className="text-lg">📱</span>
              </motion.div>
              <span className="text-sm font-medium">Airtime</span>
            </Link>
                        <Link 
              to="/buyairtime" 
              className="flex flex-col items-center p-3 rounded-lg border border-slate-200 dark:border-dark-600 hover:bg-slate-50 dark:hover:bg-dark-600 transition-colors"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-full bg-warning-100 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400 flex items-center justify-center mb-2"
              >
                <span className="text-lg">🔌</span>
              </motion.div>
              <span className="text-sm font-medium">Electricity</span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
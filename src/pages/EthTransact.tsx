import { 
  useAccount, 
  useBalance, 
  // useChainId 
 } from 'wagmi';
import {
  //  formatEther, 
  //  formatUnits 
  } from 'viem';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SwapTokens from '../components/SwapTokens';



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

export default function EthTransact() {
  const { address } = useAccount();
  // const chainId = useChainId();
  
  // Get ETH balance
  const { 
    // data: ethBalance, 
    isLoading: isEthLoading } = useBalance({
    address,
  });

  

  
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="card overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary-500 to-accent-500" />
            
            <h2 className="text-lg font-semibold mb-6">Explore.</h2>
            
            {isEthLoading ? (
              <div className="flex flex-col items-center py-6">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 dark:text-slate-400">Loading balances...</p>
              </div>
            ) : (
              <>

                <div className="grid grid-cols-2 gap-4">
                  {/* <Link 
                    to="/receive" 
                    className="btn btn-outline flex items-center justify-center"
                  >
                    <ArrowDownLeft size={18} className="mr-2" />
                    Receive Eth
                  </Link>
                  <Link 
                    to="/send" 
                    className="btn btn-primary flex items-center justify-center"
                  >
                    <ArrowUpRight size={18} className="mr-2" />
                    Send Eth
                  </Link> */}

                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <Link 
                    to="/onramp" 
                    className="flex flex-col items-center p-3 rounded-lg border border-slate-200 dark:border-dark-600 hover:bg-slate-50 dark:hover:bg-dark-600 transition-colors"
                  >
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 rounded-full bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400 flex items-center justify-center mb-2"
                    >
                      <span className="text-lg">Ξ</span>
                    </motion.div>
                    <span className="text-sm font-medium">Buy</span>
                  </Link>
                  <Link 
                    to="/offramp" 
                    className="flex flex-col items-center p-3 rounded-lg border border-slate-200 dark:border-dark-600 hover:bg-slate-50 dark:hover:bg-dark-600 transition-colors"
                  >
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 rounded-full bg-warning-100 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400 flex items-center justify-center mb-2"
                    >
                      <span className="text-lg">⟠</span>
                    </motion.div>
                    <span className="text-sm font-medium">Sell </span>
                  </Link>
                  <Link 
                    to="/receive" 
                    className="flex flex-col items-center p-3 rounded-lg border border-slate-200 dark:border-dark-600 hover:bg-slate-50 dark:hover:bg-dark-600 transition-colors"
                  >
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 rounded-full bg-warning-100 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400 flex items-center justify-center mb-2"
                    >
                      <span className="text-lg"><ArrowDownLeft size={18} className="mr-2" /></span>
                    </motion.div>
                    <span className="text-sm font-medium">Receive </span>
                  </Link>
                  <Link 
                    to="/send" 
                    className="flex flex-col items-center p-3 rounded-lg border border-slate-200 dark:border-dark-600 hover:bg-slate-50 dark:hover:bg-dark-600 transition-colors"
                  >
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 rounded-full bg-warning-100 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400 flex items-center justify-center mb-2"
                    >
                      <span className="text-lg"><ArrowUpRight size={18} className="mr-2" /></span>
                    </motion.div>
                    <span className="text-sm font-medium">Send </span>
                  </Link>

                </div>
              </>
            )}
          </div>
        </motion.div>

                <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <SwapTokens />
        </motion.div>
      </div>
    </div>
  );
}
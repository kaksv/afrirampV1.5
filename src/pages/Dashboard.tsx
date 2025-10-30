import { motion } from 'framer-motion';
import { useAppKitAccount } from '@reown/appkit/react';
import { usePublicClient, useConfig, useTransactionCount } from 'wagmi';
import { useEffect, useState } from 'react';
import BalanceCard from '../components/BalanceCard';
import TransactionHistory from '../components/TransactionHistory';
import { ArrowRightLeft, Network, PieChart, BellRing } from 'lucide-react';

export default function Dashboard() {
    const { address, isConnected } = useAppKitAccount();
  const publicClient = usePublicClient();
  const config = useConfig();

    // const { data: block } = useBlock();

    // useTransactionCount expects an Address type (`0x${string}`); cast address to that type or pass undefined
    const { data: transactionCountData } = useTransactionCount({ address: address as `0x${string}` | undefined });


    const [transactionCount, setTransactionCount] = useState(0);
  const [weeklyChange, setWeeklyChange] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);
  const [ethPriceChange, setEthPriceChange] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPriceLoading, setIsPriceLoading] = useState(true);

    // Get the number of supported chains from the config
    const supportedChains = config.chains.length;

      // Fetch ETH price
  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        setIsPriceLoading(true);
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true');
        const data = await response.json();
        
        setEthPrice(data.ethereum.usd);
        setEthPriceChange(data.ethereum.usd_24h_change);
      } catch (error) {
        console.error('Error fetching ETH price:', error);
      } finally {
        setIsPriceLoading(false);
      }
    };
    fetchEthPrice();

    // Fetch price every 60 seconds
    const interval = setInterval(fetchEthPrice, 60000);
    return () => clearInterval(interval);
  }, []);

    // Fetch Transaction count
      useEffect(() => {
    const fetchTransactionCount = async () => {
      if (!address || !isConnected || !publicClient) return;
      
      try {
        setIsLoading(true);
        
        // Get current block
        const currentBlock = await publicClient.getBlockNumber();
        
        // Get transactions count
        const nonce = await publicClient.getTransactionCount({
          address : address as `0x${string}`,
        });
        
        // Get block from a week ago (approximate)
        const blocksPerWeek = 7 * 24 * 60 * 4; // ~4 blocks per minute
        const weekAgoBlock = currentBlock - BigInt(blocksPerWeek);
        
        // Get historical nonce
        const historicalNonce = await publicClient.getTransactionCount({
          address: address as `0x${string}`,
          blockNumber: weekAgoBlock
        });
        
        // Calculate weekly change
        const change = nonce - historicalNonce;
        
        setTransactionCount(Number(nonce));
        setWeeklyChange(Number(change));
      } catch (error) {
        console.error('Error fetching transaction count:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionCount();
  }, [address, isConnected, publicClient, transactionCountData]);

    // Metrics data with real values
  const metrics = [
    { 
      name: 'Total Transactions', 
      value: isLoading ? '...' : transactionCount.toString(), 
      change: weeklyChange > 0 ? `+${weeklyChange}` : weeklyChange.toString(), 
      icon: <ArrowRightLeft size={18} />, 
      color: 'primary',
      isLoading
    },
    { 
      // name: 'Supported Chains', 
      name: 'Supported Tokens', 
      // value: supportedChainsCount.toString(), 
      value: 2, 
      // change: 'Networks', 
      change: 'Tokens', 
      icon: <Network size={18} />, 
      color: 'secondary',
      isLoading: false
    },
    { 
      name: 'ETH Price', 
      value: isPriceLoading ? '...' : `$${ethPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      change: isPriceLoading ? '...' : `${ethPriceChange > 0 ? '+' : ''}${ethPriceChange.toFixed(2)}%`,
      icon: <PieChart size={18} />, 
      color: 'accent',
      isLoading: isPriceLoading
    },
  ];

    return (
    <div className="space-y-8">
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="card"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
                  {metric.name}
                </h3>
                <p className="text-2xl font-bold">
                  {metric.isLoading ? (
                    <span className="inline-block w-16 h-8 bg-slate-200 dark:bg-dark-600 rounded animate-pulse" />
                  ) : (
                    metric.value
                  )}
                </p>
              </div>
              <div className={`w-8 h-8 rounded-lg bg-${metric.color}-100 dark:bg-${metric.color}-900/20 text-${metric.color}-600 dark:text-${metric.color}-400 flex items-center justify-center`}>
                {metric.icon}
              </div>
            </div>
            
            <div className="mt-4">
              {metric.isLoading ? (
                <span className="inline-block w-12 h-4 bg-slate-200 dark:bg-dark-600 rounded animate-pulse" />
              ) : (
                <span className={`text-sm font-medium ${
                  metric.change.startsWith('+') 
                    ? 'text-success-500 dark:text-success-400' 
                    : metric.change.startsWith('-')
                      ? 'text-error-500 dark:text-error-400'
                      : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {metric.change} {metric.change !== '0' && metric.change !== 'Networks' && '24h'}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div> */}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <BalanceCard />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <TransactionHistory limit={4} showCount={true} />
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="card"
      >
        <div className="flex items-start">
          <div className="w-10 h-10 rounded-full bg-warning-100 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400 flex items-center justify-center mr-4">
            <BellRing size={20} />
          </div>
          {/* <div>
            <h3 className="font-semibold mb-1">Important Notice</h3>
            <p className="text-slate-600 dark:text-slate-300">
              This is a demo application. In a production environment, you would be interacting with a real Ethereum wallet and blockchain.
            </p>
          </div> */}
        </div>
      </motion.div>
    </div>
  );
  
}
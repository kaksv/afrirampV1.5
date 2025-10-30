import { useState, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, Filter, Search, ExternalLink, Loader2 } from 'lucide-react';

// Transaction interface
interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'onramp' | 'offramp';
  amount: string;
  address: string;
  timestamp: Date;
  status: string;
  hash: string;
  fiat_amount?: string;
  fiat_currency?: string;
  token?: string;
  tx_hash?: string;
}

// Mock transaction data (fallback when no wallet is connected)
const mockTransactions: Transaction[] = [
  { 
    id: '1', 
    type: 'send', 
    amount: '0.05', 
    address: '0x1234...5678', 
    timestamp: new Date(Date.now() - 1000 * 60 * 30), 
    status: 'confirmed',
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  },
  { 
    id: '2', 
    type: 'receive', 
    amount: '0.2', 
    address: '0x8765...4321', 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), 
    status: 'confirmed',
    hash: '0x0987654321fedcba0987654321fedcba0987654321fedcba0987654321fedcba'
  },
  { 
    id: '3', 
    type: 'send', 
    amount: '0.01', 
    address: '0x9876...5432', 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), 
    status: 'confirmed',
    hash: '0x1122334455667788990011223344556677889900112233445566778899001122'
  },
  { 
    id: '4', 
    type: 'receive', 
    amount: '0.15', 
    address: '0x2345...6789', 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), 
    status: 'confirmed',
    hash: '0x3344556677889900112233445566778899001122334455667788990011223344'
  },
];

export default function History() {
  const { address } = useAccount();
  const [filter, setFilter] = useState<'all' | 'send' | 'receive' | 'onramp' | 'offramp'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch transactions from backend API
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!address) {
        setTransactions(mockTransactions);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch onramp transactions
        const onrampUrl = `https://afriramp-backend2.onrender.com/api/onramp/${address}`;
        const onrampResponse = await fetch(onrampUrl);
        const onrampData = onrampResponse.ok
          ? await onrampResponse.json().catch(() => [])
          : [];
        console.log("onrampData", onrampData);
        // Fetch offramp transactions
        const offrampUrl = `https://afriramp-backend2.onrender.com/api/offramp/${address}`;
        const offrampResponse = await fetch(offrampUrl);
        const offrampData = offrampResponse.ok
          ? await offrampResponse.json().catch(() => [])
          : [];
        console.log("offrampData", offrampData);
        // Transform onramp data
        const onrampTransactions: Transaction[] = Array.isArray(onrampData)
          ? onrampData[0].map((tx: any) => ({
              id: tx.id?.toString() || Math.random().toString(),
              type: 'onramp',
              amount: tx.amount || '0',
              address: 'Fiat Purchase',
              timestamp: new Date(tx.created_at || Date.now()),
              status: tx.status || 'unknown',
              hash: tx.tx_hash || '',
              fiat_amount: tx.fiat_amount,
              fiat_currency: tx.fiat_currency,
              token: tx.payout_network,
            }))
          : [];
        console.log("onrampTransactions", onrampTransactions);
        // Transform offramp data
        const offrampTransactions: Transaction[] = Array.isArray(offrampData)
          ? offrampData.map((tx: any) => ({
              id: tx.id?.toString() || Math.random().toString(),
              type: 'offramp',
              amount: tx.amount || '0',
              address: 'Fiat Sale',
              timestamp: new Date(tx.created_at || Date.now()),
              status: tx.status || 'unknown',
              hash: tx.tx_hash || '',
              fiat_amount: tx.fiat_amount,
              fiat_currency: tx.fiat_currency,
              token: tx.token,
            }))
          : [];
            console.log("offrampTransactions", offrampTransactions);
        // Combine and sort by timestamp (newest first)
        const allTransactions = [...onrampTransactions, ...offrampTransactions]
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        setTransactions(allTransactions);
        console.log(allTransactions);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transaction history');
        setTransactions(mockTransactions);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [address]);

  // Filter and search transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      // Filter by type
      if (filter !== 'all' && tx.type !== filter) {
        return false;
      }

      // Filter by search query
      if (!debouncedQuery) return true;

      const lowerQuery = debouncedQuery.toLowerCase();
      return (
        tx.address.toLowerCase().includes(lowerQuery) ||
        tx.amount.includes(debouncedQuery) ||
        (tx.hash && tx.hash.toLowerCase().includes(lowerQuery)) ||
        (tx.token && tx.token.toLowerCase().includes(lowerQuery)) ||
        (tx.fiat_amount && tx.fiat_amount.includes(debouncedQuery)) ||
        (tx.fiat_currency && tx.fiat_currency.toLowerCase().includes(lowerQuery))
      );
    });
  }, [transactions, filter, debouncedQuery]);

  // Format date to relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
  };

  // Get transaction icon
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send': return <ArrowUpRight size={18} />;
      case 'receive': return <ArrowDownLeft size={18} />;
      case 'onramp': return <ArrowDownLeft size={18} />;
      case 'offramp': return <ArrowUpRight size={18} />;
      default: return null;
    }
  };

  // Get transaction color class
  const getTransactionColorClass = (type: string) => {
    switch (type) {
      case 'send':
      case 'offramp':
        return 'bg-error-100 dark:bg-error-900/20 text-error-600 dark:text-error-400';
      case 'receive':
      case 'onramp':
        return 'bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400';
      default:
        return 'bg-slate-100 dark:bg-dark-600 text-slate-600 dark:text-slate-400';
    }
  };

  // Get transaction type label
  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'send': return 'Sent ';
      case 'receive': return 'Received ';
      case 'onramp': return 'Bought ';
      case 'offramp': return 'Sold ';
      default: return 'Transaction';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Transaction List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Transaction History</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 py-2 text-sm w-48 md:w-64"
              />
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            </div>
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="input appearance-none pr-10 py-2 text-sm"
              >
                <option value="all">All Types</option>
                <option value="send">Sent</option>
                <option value="receive">Received</option>
                <option value="onramp">Bought</option>
                <option value="offramp">Sold</option>
              </select>
              <Filter size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex p-4 border border-slate-200 dark:border-dark-600 rounded-lg">
                <div className="w-10 h-10 bg-slate-200 dark:bg-dark-500 rounded-full"></div>
                <div className="ml-3 flex-1">
                  <div className="h-5 bg-slate-200 dark:bg-dark-500 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-slate-200 dark:bg-dark-500 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-error-50 dark:bg-error-900/20 rounded-lg p-6 text-center">
            <p className="text-error-600 dark:text-error-400 mb-2">{error}</p>
            <p className="text-sm text-error-500 dark:text-error-500">
              Showing sample transactions instead.
            </p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="bg-slate-50 dark:bg-dark-600 rounded-lg p-6 text-center">
            <p className="text-slate-500 dark:text-slate-400 mb-2">No transactions found</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              {debouncedQuery 
                ? 'Try adjusting your search or filter criteria.' 
                : address 
                  ? 'Your transactions will appear here once you start using AfriRamp.'
                  : 'Connect your wallet to view your transaction history.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((tx, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={tx.id}
                className="flex items-center p-4 rounded-lg border border-slate-200 dark:border-dark-600 hover:bg-slate-50 dark:hover:bg-dark-600"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTransactionColorClass(tx.type)}`}>
                  {getTransactionIcon(tx.type)}
                </div>

                <div className="ml-3 flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <p className="font-medium">
                        {getTransactionTypeLabel(tx.type)}
                        {tx.token && <span> {tx.token}</span>}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {tx.address !== '-' ? tx.address : (tx.type === 'onramp' ? 'Fiat Purchase' : 'Fiat Sale')}
                        {tx.fiat_amount && tx.fiat_currency && (
                          <span className="ml-2">
                            ({tx.fiat_amount} {tx.fiat_currency})
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0 md:text-right">
                      <p className={`font-semibold ${
                        tx.type === 'send' || tx.type === 'offramp'
                          ? 'text-error-600 dark:text-error-400'
                          : 'text-success-600 dark:text-success-400'
                      }`}>
                        {tx.type === 'send' || tx.type === 'offramp' ? '-' : '+'}
                        {tx.amount} {tx.token || 'ETH'}
                      </p>
                      <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1 md:mt-0">
                        <span className="md:hidden">{formatRelativeTime(new Date(tx.timestamp))}</span>
                        <span
                          className="hidden md:inline"
                          title={new Date(tx.timestamp).toLocaleString()}
                        >
                          {formatRelativeTime(new Date(tx.timestamp))}
                        </span>
                        {tx.status && (
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            tx.status === 'confirmed'
                              ? 'bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400'
                              : tx.status === 'pending'
                                ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                                : 'bg-error-100 dark:bg-error-900/20 text-error-600 dark:text-error-400'
                          }`}>
                            {tx.status}
                          </span>
                        )}
                        {tx.hash && tx.hash.length > 10 && (
                          <a
                            href={`https://basescan.org/tx/${tx.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 p-1 rounded-md hover:bg-slate-200 dark:hover:bg-dark-500 transition-colors"
                            title="View on BaseScan"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Security Notice Based on BaseScan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="card"
      >
        <h3 className="font-semibold mb-3">Security Notice</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
          <strong>Private Note:</strong> A private note (up to 500 characters) can be attached to this address.{' '}
          <span className="text-error-600 dark:text-error-400 font-medium">
            Please DO NOT store any passwords or private keys here.
          </span>
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          All transactions are public on the blockchain. For more details, visit{' '}
          <a
            href="https://basescan.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 dark:text-primary-400 underline"
          >
            BaseScan
          </a>.
        </p>
      </motion.div>
    </div>
  );
}
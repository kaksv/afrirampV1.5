// import { useAppKitAccount } from "@reown/appkit/react";
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock transaction data (in a real app, this would come from a blockchain API)
const mockTransactions = [
  { 
    id: '1', 
    type: 'send', 
    amount: '0.05', 
    address: '0x1234...5678', 
    timestamp: new Date(Date.now() - 1000 * 60 * 30), 
    status: 'confirmed' 
  },
  { 
    id: '2', 
    type: 'receive', 
    amount: '0.2', 
    address: '0x8765...4321', 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), 
    status: 'confirmed' 
  },
  { 
    id: '3', 
    type: 'send', 
    amount: '0.01', 
    address: '0x9876...5432', 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), 
    status: 'confirmed' 
  },
  { 
    id: '4', 
    type: 'receive', 
    amount: '0.15', 
    address: '0x2345...6789', 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), 
    status: 'confirmed' 
  },
];

interface TransactionHistoryProps {
  limit?: number;
  showCount?: boolean;
}

export default function TransactionHistory({ limit, showCount = false }: TransactionHistoryProps) {
    // const address = useAppKitAccount().address;
      
  // Filter transactions by address and limit them if needed
  const transactions = mockTransactions.slice(0, limit);

    // Get transaction counts by type
  const transactionCounts = mockTransactions.reduce((acc, tx) => {
    acc[tx.type] = (acc[tx.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

    // Format date to relative time
  const formatRelativeTime = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

    return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
        {limit && (
          <a href="/history" className="text-sm text-primary-600 dark:text-primary-400 font-medium">
            View All
          </a>
        )}
      </div>
      
      {showCount && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-50 dark:bg-dark-600 rounded-lg p-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total</p>
            <p className="text-2xl font-bold">{mockTransactions.length}</p>
          </div>
          <div className="bg-slate-50 dark:bg-dark-600 rounded-lg p-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Sent</p>
            <p className="text-2xl font-bold text-error-600 dark:text-error-400">
              {transactionCounts.send || 0}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-dark-600 rounded-lg p-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Received</p>
            <p className="text-2xl font-bold text-success-600 dark:text-success-400">
              {transactionCounts.receive || 0}
            </p>
          </div>
        </div>
      )}
      
      {transactions.length === 0 ? (
        <div className="bg-slate-50 dark:bg-dark-600 rounded-lg p-6 text-center">
          <Clock className="mx-auto mb-3 text-slate-400 dark:text-slate-500" size={24} />
          <p className="text-slate-500 dark:text-slate-400 mb-2">No transactions yet</p>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Your transactions will appear here once you start sending or receiving Crypto on Base.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={tx.id}
              className="flex items-center p-3 rounded-lg border border-slate-200 dark:border-dark-600 hover:bg-slate-50 dark:hover:bg-dark-600"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                tx.type === 'send' 
                  ? 'bg-error-100 dark:bg-error-900/20 text-error-600 dark:text-error-400' 
                  : 'bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400'
              }`}>
                {tx.type === 'send' ? (
                  <ArrowUpRight size={18} />
                ) : (
                  <ArrowDownLeft size={18} />
                )}
              </div>
              
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <p className="font-medium">
                    {tx.type === 'send' ? 'Sent ' : 'Received '}
                  </p>
                  <p className={`font-semibold ${
                    tx.type === 'send' ? 'text-error-600 dark:text-error-400' : 'text-success-600 dark:text-success-400'
                  }`}>
                    {tx.type === 'send' ? '-' : '+'}{tx.amount} 
                  </p>
                </div>
                <div className="flex justify-between mt-1">
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                    {tx.address}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {formatRelativeTime(tx.timestamp)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

}
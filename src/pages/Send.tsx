import { useState } from 'react';
import { useAccount, useSendTransaction, useBalance, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { motion } from 'framer-motion';
import { ArrowUpRight, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';

export default function Send() {
  const { address } = useAccount();
  const { data: balanceData } = useBalance({ address });
  
  // Form state
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Transaction state
  const [isConfirming, setIsConfirming] = useState(false);
  
  // Send transaction hook
  const { 
    sendTransaction, 
    isPending, 
    // isError, 
    data: txHash 
} = useSendTransaction();
  
  // Wait for transaction receipt
  const { 
    // data: txReceipt, 
    isLoading: isWaitingForReceipt,
    isSuccess: isTransactionSuccessful
  } = useWaitForTransactionReceipt({ 
    hash: txHash,
    // enabled: !!txHash,
  });
  
  // Available balance for sending
  const availableBalance = balanceData?.value ? parseFloat(formatEther(balanceData.value)) : 0;
  
  // Validate the transaction
  const validateTransaction = () => {
    // Reset error message
    setErrorMessage('');
    
    // Validate recipient address
    if (!recipientAddress) {
      setErrorMessage('Please enter a recipient address');
      return false;
    }
    
    // Basic address validation (this is simple validation - could be improved)
    if (!recipientAddress.startsWith('0x') || recipientAddress.length !== 42) {
      setErrorMessage('Invalid Ethereum address format');
      return false;
    }
    
    // Validate amount
    if (!amount || parseFloat(amount) <= 0) {
      setErrorMessage('Please enter a valid amount');
      return false;
    }
    
    // Check if user has enough balance
    if (parseFloat(amount) > availableBalance) {
      setErrorMessage('Insufficient balance');
      return false;
    }
    
    return true;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateTransaction()) return;
    
    // Show confirmation step
    setIsConfirming(true);
  };
  
  // Handle send transaction
  const handleSendTransaction = () => {
    try {
      sendTransaction({
        to: recipientAddress as `0x${string}`,
        value: parseEther(amount),
      });
    } catch (error) {
      console.error('Transaction error:', error);
      setErrorMessage('Failed to send transaction. Please try again.');
      setIsConfirming(false);
    }
  };
  
  // Handle reset after transaction
  const handleReset = () => {
    setRecipientAddress('');
    setAmount('');
    setIsConfirming(false);
    setErrorMessage('');
  };
  
  // Handle amount change with validation
  const handleAmountChange = (value: string) => {
    // Remove any non-numeric characters except decimal point
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = sanitizedValue.split('.');
    if (parts.length > 2) {
      return;
    }
    
    // Limit to 18 decimal places (ETH precision)
    if (parts.length === 2 && parts[1].length > 18) {
      return;
    }
    
    setAmount(sanitizedValue);
  };
  
  // Use percentage of available balance
  const applyPercentage = (percentage: number) => {
    if (availableBalance > 0) {
      // Calculate the amount based on percentage, and format to 6 decimal places
      const calculatedAmount = (availableBalance * percentage / 100).toFixed(6);
      // Remove trailing zeros
      setAmount(calculatedAmount.replace(/\.?0+$/, ''));
    }
  };
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card"
      >
        <h2 className="text-xl font-semibold mb-6">Send ETH</h2>
        
        {isTransactionSuccessful ? (
          <div className="py-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400 flex items-center justify-center mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Transaction Successful!</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                You have successfully sent {amount} ETH to:
              </p>
              <p className="text-sm bg-slate-100 dark:bg-dark-600 p-2 rounded-lg mb-6 break-all">
                {recipientAddress}
              </p>
              <div className="mb-4">
                <a 
                  href={`https://etherscan.io/tx/${txHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
                >
                  View on Etherscan
                </a>
              </div>
              <button 
                onClick={handleReset}
                className="btn btn-primary"
              >
                Send Another Transaction
              </button>
            </div>
          </div>
        ) : isPending || isWaitingForReceipt ? (
          <div className="py-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center mb-4">
                <Loader2 size={32} className="animate-spin text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {isWaitingForReceipt ? 'Processing Transaction' : 'Confirm in Wallet'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {isWaitingForReceipt 
                  ? 'Your transaction is being processed. Please wait...' 
                  : 'Please confirm the transaction in your wallet.'
                }
              </p>
              {isWaitingForReceipt && txHash && (
                <div className="mt-4">
                  <a 
                    href={`https://etherscan.io/tx/${txHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
                  >
                    View on Etherscan
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : isConfirming ? (
          <div className="py-4">
            <div className="bg-slate-50 dark:bg-dark-600 p-4 rounded-lg mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-slate-500 dark:text-slate-400">Amount:</span>
                <span className="font-semibold">{amount} ETH</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-500 dark:text-slate-400">To:</span>
                <span className="font-semibold truncate max-w-[200px]">{recipientAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Network Fee:</span>
                <span className="font-semibold">~0.0005 ETH</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setIsConfirming(false)}
                className="btn btn-outline"
              >
                Edit
              </button>
              <button 
                onClick={handleSendTransaction}
                className="btn btn-primary"
              >
                Confirm
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="recipientAddress" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Recipient Address
              </label>
              <input
                id="recipientAddress"
                type="text"
                placeholder="0x..."
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="input"
              />
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <label htmlFor="amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Amount (ETH)
                </label>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Available: {availableBalance.toFixed(4)} ETH
                </span>
              </div>
              <input
                id="amount"
                type="text"
                placeholder="0.0"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="input"
              />
              
              <div className="flex justify-between mt-2 gap-2">
                {[25, 50, 75, 100].map((percentage) => (
                  <button
                    key={percentage}
                    type="button"
                    onClick={() => applyPercentage(percentage)}
                    className="flex-1 text-sm py-1 px-2 rounded-md bg-slate-100 dark:bg-dark-600 hover:bg-slate-200 dark:hover:bg-dark-500 transition-colors"
                  >
                    {percentage}%
                  </button>
                ))}
              </div>
            </div>
            
            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-error-50 dark:bg-error-900/20 text-error-600 dark:text-error-400 flex items-start">
                <AlertTriangle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}
            
            <button 
              type="submit"
              className="btn btn-primary w-full flex items-center justify-center"
            >
              <ArrowUpRight size={18} className="mr-2" />
              Review Transaction
            </button>
          </form>
        )}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="card"
      >
        <h3 className="font-semibold mb-4">Transaction Tips</h3>
        <ul className="space-y-2 text-slate-600 dark:text-slate-300">
          <li className="flex items-start">
            <span className="inline-block w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center mr-2 mt-0.5">•</span>
            Always double-check the recipient address before sending.
          </li>
          <li className="flex items-start">
            <span className="inline-block w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center mr-2 mt-0.5">•</span>
            Consider sending a small test amount first for large transfers.
          </li>
          <li className="flex items-start">
            <span className="inline-block w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center mr-2 mt-0.5">•</span>
            Transactions cannot be reversed once confirmed on the blockchain.
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
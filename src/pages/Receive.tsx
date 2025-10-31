import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, CheckCircle2, Shield } from 'lucide-react';
import { useState } from 'react';

export default function Receive() {
  const { address } = useAccount();
  const [copied, setCopied] = useState(false);
  
  // Format address for display
//   const formatAddress = (address: string | undefined) => {
//     if (!address) return '';
//     return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
//   };
  
  // Copy address to clipboard
  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      
      // Reset copied state after 3 seconds
      setTimeout(() => {
        setCopied(false);
      }, 3000);
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
        <h2 className="text-xl font-semibold mb-6">Receive Eth</h2>
        
        <div className="flex flex-col items-center mb-6">
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Share your address.
          </p>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-3 rounded-xl shadow-md mb-6"
          >
            <QRCodeSVG 
              value={address || ''} 
              size={200}
              className="rounded-lg"
              includeMargin
              level="H"
            />
          </motion.div>
          
          <div className="w-full relative">
            <div className="input flex items-center justify-between py-3 px-4 cursor-pointer" onClick={copyToClipboard}>
              <span className="font-mono truncate overflow-x-auto whitespace-nowrap max-w-[140px] sm:max-w-xs block">{address || 'Loading...'}</span>
              <button 
                className="ml-2 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-dark-600 transition-colors"
                aria-label="Copy address"
              >
                {copied ? (
                  <CheckCircle2 size={18} className="text-success-500" />
                ) : (
                  <Copy size={18} />
                )}
              </button>
            </div>
            
            {copied && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-success-500 text-white px-3 py-1 rounded-md text-sm"
              >
                Address copied!
              </motion.div>
            )}
          </div>
        </div>
        
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 rounded-lg p-4">
          <div className="flex items-start">
            <Shield size={20} className="text-primary-600 dark:text-primary-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium mb-1 text-primary-800 dark:text-primary-300">Security Tip</h3>
              <p className="text-sm text-primary-700 dark:text-primary-400">
                Sharing your public address is safe, but never share your private keys or seed phrase with anyone. 
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="card">
          <h3 className="font-semibold mb-4">What Can You Receive?</h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            This address can receive:
          </p>
          <ul className="space-y-3">
            <li className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center mr-3">
                <span className="text-lg">Ξ</span>
              </div>
              <div>
                <p className="font-medium">ETH</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">The native cryptocurrency of Ethereum</p>
              </div>
            </li>
            <li className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-secondary-100 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400 flex items-center justify-center mr-3">
                <span className="text-lg">⟠</span>
              </div>
              <div>
                <p className="font-medium">Ethereum Tokens</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Standard tokens on Ethereum</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="card">
          <h3 className="font-semibold mb-4">How to Receive Sonic</h3>
          <ol className="space-y-3">
            <li className="flex">
              <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-dark-600 text-slate-700 dark:text-slate-300 flex items-center justify-center mr-3 flex-shrink-0">1</span>
              <p className="text-slate-600 dark:text-slate-300">Share your address or QR code with the sender</p>
            </li>
            <li className="flex">
              <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-dark-600 text-slate-700 dark:text-slate-300 flex items-center justify-center mr-3 flex-shrink-0">2</span>
              <p className="text-slate-600 dark:text-slate-300">The sender will input your address on their end</p>
            </li>
            <li className="flex">
              <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-dark-600 text-slate-700 dark:text-slate-300 flex items-center justify-center mr-3 flex-shrink-0">3</span>
              <p className="text-slate-600 dark:text-slate-300">Once the transaction is confirmed, Ethereum will appear in your wallet</p>
            </li>
            <li className="flex">
              <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-dark-600 text-slate-700 dark:text-slate-300 flex items-center justify-center mr-3 flex-shrink-0">4</span>
              <p className="text-slate-600 dark:text-slate-300">No action is required from you to receive funds</p>
            </li>
          </ol>
        </div>
      </motion.div>
    </div>
  );
}
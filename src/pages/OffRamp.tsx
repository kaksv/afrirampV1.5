import { useState, useEffect } from 'react';
import { useAccount, useChainId, useWriteContract, useBalance,  } from 'wagmi';
import { formatUnits, erc20Abi, parseEther, parseUnits } from 'viem';
import { motion } from 'framer-motion';
import { Phone, Smartphone, ArrowRight, ChevronDown, Loader2, CheckCircle2, Currency } from 'lucide-react';

const RECIPIENT_ADDRESS = '0xDD463C81cb2fA0e95b55c5d7696d8a9755cb1Af2';
const POLL_INTERVAL = 5000; // 5 seconds

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
    USDT: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2' //TODO // Dai Stable coin address 
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
    OFT: '0xe7cd86e13AC4309349F30B3435a9d337750fC82D'
  }
};

type TokenSymbol = 'ETH' | 'USDC' | 'USDT' | 'OFT' | 'FLR';

export default function OffRamp() {
  const { address } = useAccount();
  const chainId = useChainId();
  console.log(chainId);
// Define which tokens (including native) are supported per chain
const TOKEN_CONFIG: Record<number, TokenSymbol[]> = {
  1:      [ 'USDC', 'USDT', 'ETH'],     // Ethereum
  11155111: [ 'USDC', 'USDT', 'ETH'], // Sepolia
  8453:   [ 'USDC', 'USDT', 'ETH'],     // Base
  84532:  ['USDC', 'USDT', 'ETH'],     // Base Sepolia
  42220:  [ 'USDC', 'USDT', 'ETH'],     // Celo (uses CELO, but ETH alias often works in wagmi)
  44787:  [ 'USDC', 'USDT', 'ETH'],     // Celo Alfajores
  1135:   [ 'USDC', 'USDT', 'ETH'],     // Lisk
  14:     ['OFT', 'FLR'],                     // Flare — ETH NOT supported
};

// Helper to get available tokens
const getAvailableTokens = (chainId: number): TokenSymbol[] => {
  return TOKEN_CONFIG[chainId] || []; // fallback to empty if unknown chain
};

// Get available tokens for current chain
const availableTokens = getAvailableTokens(chainId);
  
  // Form State
  const [amount, setAmount] = useState('');
//   const [amountFull, setAmountFull] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('mtn');
  const [payoutExpanded, setPayoutExpanded] = useState(false);
  const [fiatCurrency, setFiatCurrency] = useState('UGX');
  const [fiatExpanded, setFiatExpanded] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenSymbol>(availableTokens[0] as TokenSymbol || 'USDC');
  const [tokenExpanded, setTokenExpanded] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setIsSuccess] = useState(false);
  const [, setErrorMessage] = useState('');
  const [, ] = useState('created');
   const [currentTx, setCurrentTx] = useState<any>(null);

  //  Rates use states
  const [exchangeRate, setExchangeRate] = useState<string | null>(null);
  const [, setError] = useState<string | null>(null);
  // const [selectedPair, setSelectedPair] = useState("UGX") //This works interchangably with fiatCurrency but we are to use it to get prices


  const { writeContract, isSuccess: isWriteSuccess, data: writeData } = useWriteContract();

// Fiat currencies
const fiatCurrencies = [
  { 
    uiCode: 'UGX', 
    apiCode: 'UGX', 
    symbol: 'USh', 
    name: 'Ugandan Shilling' 
  },
  { 
    uiCode: 'KSH',   // ← what users see
    apiCode: 'KES',  // ← what the API expects
    symbol: 'KSh', 
    name: 'Kenyan Shilling' 
  },
  { 
    uiCode: 'RWF', 
    apiCode: 'RWF', 
    symbol: 'Rwf', 
    name: 'Rwandan Franc' 
  },
];

// Helper to get API code
const getApiCurrencyCode = (uiCode: string): string => {
  const currency = fiatCurrencies.find(c => c.uiCode === uiCode);
  return currency ? currency.apiCode : uiCode; // fallback
};
  // Reset selection when chain changes
useEffect(() => {
  const tokens = getAvailableTokens(chainId);
  if (tokens.length === 0) return;

  // If current selection is invalid on this chain, reset
  if (!tokens.includes(selectedToken)) {
    setSelectedToken(tokens[0]);
  }
}, [chainId, selectedToken]);


  // useEffect to handle exchangeRate
  useEffect(() => {
    const apiCode = getApiCurrencyCode(fiatCurrency);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    fetch("https://open.er-api.com/v6/latest/USD")
    .then((response) => {
      if(!response.ok) {
        throw new Error("Failed to fetch exchange Rate");
      }
      return response.json();
    })
    .then(data => {
      if (data?.rates && typeof data.rates[apiCode] === 'number') {
        setExchangeRate(data.rates[apiCode].toFixed(2));
        setError(null);
      } else {
        setError(`Exchange rate for ${fiatCurrency} not available`);
        setExchangeRate(null);
      }
    })
    .catch((err) => setError(err instanceof Error ? err.message : String(err)))
    .finally(() => console.log("Exchange rate fetched"));
  }, [fiatCurrency]);

  
  // centralized helper to send transaction info to backend
  const sendToBackend = async (txHashParam: string, amountParam: number) => {
    try {
      const response = await fetch('https://afriramp-backend2.onrender.com/api/offramp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tx_hash: txHashParam,
          amount: amountParam,
          token: selectedToken,
          fiat_amount: getFinalReceiveAmount(),
          fiat_currency: fiatCurrency,
          payout_method: payoutMethod,
          mobile_number: mobileNumber,
          sender_address: address,
          recipient_address: RECIPIENT_ADDRESS,
          chain_id: chainId,
          sender_email: email
        }),
      });

      console.log(response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Backend response:', responseData);
      setIsSuccess(true);
    } catch (error) {
      console.error('Full error details:', {
        error,
        request: {
          url: 'https://afriramp-backend.onrender.com/api/offramp',
          method: 'POST',
          body: JSON.stringify({
            tx_hash: txHashParam,
            amount: amountParam,
            token: selectedToken,
            fiat_amount: calculateFiatAmount(),
            fiat_currency: fiatCurrency,
            payout_method: payoutMethod,
            mobile_number: mobileNumber,
            sender_address: address,
            recipient_address: RECIPIENT_ADDRESS,
            chain_id: chainId
          }),
        }
      });
      setErrorMessage('Failed to save transaction. Please check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add useEffect to handle transaction success & polling
  useEffect(() => {
    if (currentTx?.id) {
      const intervalId = setInterval(async () => {
        try {
          const response = await fetch(`https://afriramp-backend2.onrender.com/api/offramp/${currentTx.id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch transaction status');
          }
          const txData = await response.json();
          setCurrentTx(txData);
        } catch (error) {
          console.error('Error polling transaction status:', error);
        }
      }, POLL_INTERVAL);

      return () => clearInterval(intervalId);
    }

    if (isWriteSuccess && writeData) {
      // writeData from useWriteContract is used as the tx hash / data to persist
      setTxHash(writeData as unknown as string);
      // send data to backend using centralized helper
      sendToBackend(writeData as unknown as string, parseFloat(amount));
    }
  }, [isWriteSuccess, writeData]);

  // After a successful transaction submission, reset page after 10s
  useEffect(() => {
    if (txHash && writeData) {
      const timeout = setTimeout(() => {
        resetPage();
      }, 10000); // 10 seconds
      return () => clearTimeout(timeout);
    }
  }, [txHash, writeData]);

    // Get ETH balance
  const { data: nativeBalance, isLoading: isEthLoading } = useBalance({
    address,
  });
  
    // Get USDC balance if available on the current network
    const { data: usdcBalance, isLoading: isUsdcLoading } = useBalance({
      address,
      token: chainId ? TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES]?.USDC : undefined,
      unit: 'wei', // 6 decimals for USDC
      
    });

      // Get USDT balance if available on the current network
      const { data: usdtBalance, isLoading: isUsdtLoading } = useBalance({
        address,
        token: chainId ? TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES]?.USDT : undefined,
        // unit: 'mwei', // 6 decimals for USDT
        unit: 'wei',
      });

         // Get USDT balance if available on the current network
        const { data: oftBalance, isLoading: isOftLoading } = useBalance({
          address,
          token: chainId ? TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES]?.OFT : undefined,
          unit: 'wei', // 6 decimals for USDT
        });
  

    const getTokenDecimals = (token: TokenSymbol): number => {
      if (token === 'ETH' || token === 'FLR') return 18;
      return 6; // USDC, USDT, OFT
    };
  
const formatBalance = (balance: bigint | undefined, token: TokenSymbol): string => {
  if (!balance) return '0.00';
  const decimals = getTokenDecimals(token);
  const formatted = parseFloat(formatUnits(balance, decimals));
  return formatted.toFixed(decimals === 18 ? 4 : 2);
};

  const tokenBalances = {
    ETH: nativeBalance,
    FLR: nativeBalance,
    USDC: usdcBalance,
    USDT: usdtBalance,
    OFT: oftBalance,
  };

    // Get available balance as a JS number (for validation & % buttons)
  const getAvailableBalanceNumber = (): number => {
    const balanceData = tokenBalances[selectedToken];
    if (!balanceData?.value) return 0;

    const decimals = getTokenDecimals(selectedToken);
    return parseFloat(formatUnits(balanceData.value, decimals));
  };

  const availableBalanceNum = getAvailableBalanceNumber();


  
  // Exchange rates (1 USD = X local currency)
  const exchangeRates = {
    // KSH: 143.50, // 1 USD = 143.50 KSH
    KSH: `${exchangeRate}`, // 1 USD = 143.50 KSH
    UGX: `${exchangeRate}`, // 1 USD = 3850.75 UGX
    RWF: `${exchangeRate}`, // 1 USD = 143.50 KSH
  };
  
  // Get payment methods based on currency
  const getPaymentMethods = (currency: string) => {
    if (currency === 'UGX') {
      return [
        { id: 'mtn', name: 'MTN Mobile Money', icon: <Smartphone size={18} /> },
        { id: 'airtel', name: 'Airtel Money', icon: <Phone size={18} /> },
      ];
    } else
    if (currency === 'KSH') {
      return [
        { id: 'mpesa', name: 'M-PESA', icon: <Phone size={18} /> },
      ];
    } 
    if (currency === 'RWF') {
      return [
        { id: 'rwanda', name: 'Rwanda Mobile Money', icon: <Phone size={18} /> },
        { id: 'airtel', name: 'Airtel Money', icon: <Phone size={18} /> },
      ]
    }
    return [];
  };
  
  // Use percentage of available balance
const applyPercentage = (percentage: number) => {
  const max = availableBalanceNum;
  if (max <= 0) return;

  const calculated = (max * percentage) / 100;
  // Round to appropriate decimals (2 for stablecoins, 4 for ETH/FLR)
  const decimals = getTokenDecimals(selectedToken) === 18 ? 4 : 2;
  const formatted = calculated.toFixed(decimals).replace(/\.?0+$/, '');
  setAmount(formatted);
};
  
  const isAmountValid = (): boolean => {
    if (!amount) return false;
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0 && num <= availableBalanceNum;
  };
  // Calculate fiat amount based on token amount
    const calculateFiatAmount = () => {
      if (!amount || isNaN(parseFloat(amount))) return '0.00';
      const token = tokens.find(t => t.symbol === selectedToken);
      if (!token) return '0.00';
      
      // Convert token amount to local currency
      const usdAmount = parseFloat(amount) * token.price;
      const rate = Number(exchangeRates[fiatCurrency as keyof typeof exchangeRates]) || 0;
      const localAmount = usdAmount * rate;
      return localAmount.toFixed(2);
    };

  // Returns the final fiat amount user receives after both 2% deductions
const getFinalReceiveAmount = () => {
  if (!amount || isNaN(parseFloat(amount)) || !exchangeRate) return 0;

  const numAmount = parseFloat(amount);
  const numRate = parseFloat(exchangeRate);
  
  // Apply first 2% (volatility buffer) → * 0.98
  // Apply second 2% (profit margin) → * 0.98 again
  const finalAmount = numRate * numAmount * 0.98 * 0.98;

  return finalAmount;
};
  
  // Validate mobile number format
const validateMobileNumber = (number: string) => {
  const cleaned = number.replace(/\D/g, '');
  if (fiatCurrency === 'KSH') {
    return /^(?:254|0)[17]\d{8}$/.test(cleaned);
  } else if (fiatCurrency === 'UGX') {
    return /^(?:256|0)[7]\d{8}$/.test(cleaned);
  } else if (fiatCurrency === 'RWF') {
    // Rwanda: +250 7xxx xxxxx or 07xxx xxxxx (10 digits after 0 or 250)
    return /^(?:250|0)7\d{8}$/.test(cleaned);
  }
  return false;
};
  
  // Format mobile number display
const formatMobileNumber = (number: string) => {
  if (!number) return '';
  const cleaned = number.replace(/\D/g, '');
  
  if (fiatCurrency === 'KSH') {
    if (cleaned.startsWith('254')) {
      return `+254 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
    }
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  } 
  else if (fiatCurrency === 'UGX') {
    if (cleaned.startsWith('256')) {
      return `+256 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
    }
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  else if (fiatCurrency === 'RWF') {
    if (cleaned.startsWith('250')) {
      return `+250 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
    }
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  return number;
};
  
  // Handle mobile number input
  const handleMobileNumberChange = (value: string) => {
    // Remove any non-digit characters
    const cleaned = value.replace(/\D/g, '');
    setMobileNumber(cleaned);
  };
  
  // Handle currency change
  const handleCurrencyChange = (currency: string) => {
    setFiatCurrency(currency);
  // Get available payment methods for the new currency
  const methods = getPaymentMethods(currency);
  if (methods.length > 0) {
    setPayoutMethod(methods[0].id); // auto-select first
  } else {
    setPayoutMethod(''); // fallback
  }

  setMobileNumber(''); // reset number
  };

  const getNetworkName = (chainId: number) => {
    switch(chainId) {
      case 1: return 'Ethereum Mainnet';
      case 11155111: return 'Sepolia Testnet';
      case 8453: return 'Base Mainnet';
      case 84532: return 'Base Sepolia';
      case 42220: return 'Celo Mainnet';
      case 44787: return 'Celo Alfajores';
      case 1135: return 'Lisk';
      case 14: return 'Flare';
      default: return `Network (${chainId})`;
    }
  };
  
  // Handle sell action
const handleSell = async () => {
  if (!address || !chainId || !isAmountValid()) return;

  setIsSubmitting(true);

  try {
    const amountNum = parseFloat(amount);
    const token = selectedToken;

    // Handle native token (ETH or FLR)
    if (token === 'ETH' || token === 'FLR') {
      // Native transfer: send ETH/FLR directly
      const value = parseEther(amount); // 18 decimals
      const { hash } = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: RECIPIENT_ADDRESS,
          value: `0x${value.toString(16)}`,
          gas: '0x5208', // 21000 gas minimum
        }],
      });

      setTxHash(hash);
      await sendToBackend(hash, amountNum);
      return;
    }

    // Handle ERC20 tokens (USDC, USDT, OFT)
    // Handle ERC20 tokens (USDC, USDT, OFT)
    const tokenConfig = TOKEN_ADDRESSES[chainId];
    const tokenAddress = tokenConfig?.[token as keyof typeof tokenConfig];

    if (!tokenAddress) {
      throw new Error(`Token ${token} not supported on chain ${chainId}`);
    }

    const decimals = getTokenDecimals(token); // 6 for USDC/USDT/OFT
    const amountInWei = parseUnits(amount, decimals); // Use viem's helper

    // Use wagmi's writeContract (may not return a hash directly); await it and
    // rely on useWriteContract's writeData / isWriteSuccess handled in the effect above.
    await writeContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'transfer',
      args: [RECIPIENT_ADDRESS, amountInWei],
    });

    // writeData/isWriteSuccess will update and trigger the effect to set txHash and notify backend
    return;
  } catch (err: unknown) {
    console.error('Transaction Error:', err);
    setIsSubmitting(false);

    let message = 'Transaction failed. Please try again.';
    if (err instanceof Error) {
      if (err.message.includes('User rejected')) {
        message = 'You canceled the transaction.';
      } else if (err.message.includes('insufficient funds')) {
        message = 'Insufficient funds. Please top up your wallet.';
      }
    }
    alert(message);
  }
};

    // Add a resetPage function
  const resetPage = () => {
    setAmount('');
    setPayoutMethod('mtn');
    setPayoutExpanded(false);
    setFiatCurrency('UGX');
    setFiatExpanded(false);
    setSelectedToken('USDC');
    setTokenExpanded(false);
    setMobileNumber('');
    setEmail('');
    setTxHash(null);
    setIsSubmitting(false);
    setIsSuccess(false);
    setErrorMessage('');
    setCurrentTx(null);
    // Reset any other state as needed
  };
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card"
      >
        <h2 className="text-xl font-semibold mb-6">Sell Tokens</h2>
        
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              You Sell
            </label>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Available: {formatBalance(tokenBalances[selectedToken]?.value, selectedToken)} {selectedToken}
            </span>
          </div>
          
          <div className="flex mb-4">
            <div className="relative flex-grow">
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                className="input pl-12 pr-20"
                placeholder="0.00"
              />
              {amount && !isAmountValid() && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                  Amount must be between 0 and {availableBalanceNum.toLocaleString(undefined, {
                    maximumFractionDigits: getTokenDecimals(selectedToken) === 18 ? 4 : 2
                  })} {selectedToken}
                </p>
              )}
              {/* Dropdown */}
              
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div
                  onClick={() => setTokenExpanded(!tokenExpanded)}
                  className="px-3 py-1 rounded-lg border border-slate-300 dark:border-dark-500 bg-white dark:bg-dark-600 text-slate-900 dark:text-white flex items-center"
                >
                <select
                  value={selectedToken}
                  onChange={(e) => setSelectedToken(e.target.value as TokenSymbol)}
                  className="bg-transparent outline-none cursor-pointer appearance-none text-slate-900 dark:text-white"
                >
                  {availableTokens.map((token) => (
                    <option key={token} value={token}>
                      {token}
                    </option>
                  ))}
                </select>
                </div>
              </div>
            </div>
          </div>
          
            <div className="flex justify-between mt-2 gap-2 mb-4">
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
          
          <div className="flex justify-between">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              You Receive (Estimated)
            </label>
          </div>
          
          <div className="mt-1 p-4 rounded-lg bg-slate-50 dark:bg-dark-600 flex items-center justify-between">
            <div className="flex items-center">

              <div>
                <p className="font-medium">
                  {(((Number(exchangeRate)) - Number(exchangeRate) * (2/100)) * Number(amount)).toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
                  {/* {calculateFiatAmount()} */}
                   {fiatCurrency}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  1 {selectedToken} ≈ 
                  {((Number(exchangeRate)) - Number(exchangeRate) * (2/100)).toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
                  {/* // The 2% is a defacto fee for the exchange */} 
                  {/* Sometimes used to cover transactional fees on mobile money */}
                  
                  {fiatCurrency}
                </p>
              </div>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setFiatExpanded(!fiatExpanded)}
                className="px-3 py-1 rounded-lg border border-slate-300 dark:border-dark-500 bg-white dark:bg-dark-600 text-slate-900 dark:text-white flex items-center"
              >
                <span>{fiatCurrency}</span>
                <ChevronDown size={16} className={`ml-2 transition-transform ${fiatExpanded ? 'rotate-180' : ''}`} />
              </button>
              
              {fiatExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-1 w-48 bg-white dark:bg-dark-700 rounded-lg shadow-lg border border-slate-200 dark:border-dark-600 z-20"
                >
                  <div className="py-1">
                    {fiatCurrencies.map(currency => (
                      <button
                        key={currency.uiCode}
                        onClick={() => {
                        handleCurrencyChange(currency.uiCode); // store uiCode
                        setFiatExpanded(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-dark-600 transition-colors flex items-center"
                      >
                        <span className="w-12">{currency.symbol}</span>
                        <span>{currency.uiCode}</span>
                        <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">{currency.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Payout Method
          </label>
          
          <div className="relative">
            <button
              onClick={() => setPayoutExpanded(!payoutExpanded)}
              className="w-full input flex items-center justify-between"
            >
              <div className="flex items-center">
                {getPaymentMethods(fiatCurrency).find(m => m.id === payoutMethod)?.icon}
                <span className="ml-2">{getPaymentMethods(fiatCurrency).find(m => m.id === payoutMethod)?.name}</span>
              </div>
              <ChevronDown size={16} className={`transition-transform ${payoutExpanded ? 'rotate-180' : ''}`} />
            </button>
            
            {payoutExpanded && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 right-0 mt-1 bg-white dark:bg-dark-700 rounded-lg shadow-lg border border-slate-200 dark:border-dark-600 z-20"
              >
                <div className="py-1">
                  {getPaymentMethods(fiatCurrency).map(method => (
                    <button
                      key={method.id}
                      onClick={() => {
                        setPayoutMethod(method.id);
                        setPayoutExpanded(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-dark-600 transition-colors flex items-center"
                    >
                      {method.icon}
                      <span className="ml-2">{method.name}</span>
                    </button> 
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Mobile Number
          </label>
          <div className="relative">
            <input
              type="tel"
              value={formatMobileNumber(mobileNumber)}
              onChange={(e) => handleMobileNumberChange(e.target.value)}
              className="input pl-12 ml-2"
              placeholder={fiatCurrency === 'KSH' ? ' 0712 345 678' : 
              fiatCurrency === 'RWF' ? ' 0788 123 456' : ' 0775 123 456'}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
              {fiatCurrency === 'UGX' ? '+256' :
              fiatCurrency === 'KSH' ? '+254' :
              fiatCurrency === 'RWF' ? '+250' : '+...'}
            </div>
          </div>
          {mobileNumber && !validateMobileNumber(mobileNumber) && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">
              Please enter a valid {fiatCurrency === 'KSH' ? 'Safaricom' : 'Ugandan'} mobile number
            </p>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="you@example.com"
              required
            />
          </div>
          {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
            <p className="mt-1 text-sm text-error-600 dark:text-error-400">
              Please enter a valid email address
            </p>
          )}
        </div>

        <div className="mb-6 p-4 rounded-lg bg-slate-50 dark:bg-dark-600">
          <div className="flex justify-between mb-2">
            <span>Amount</span>
            <span>
              {(((Number(exchangeRate))  * (98/100)) * Number(amount)).toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
              {/* {calculateFiatAmount()}  */}
              {fiatCurrency}
              </span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Service Fee (2%)</span>
            <span>
              -
              {((((Number(exchangeRate))  * (98/100)) * Number(amount)) * 0.02).toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
              {/* {(parseFloat(calculateFiatAmount()) * 0.01).toFixed(2)}  */}
              {fiatCurrency}
              </span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>You Receive</span>
            <span>
              {getFinalReceiveAmount().toLocaleString(undefined, { maximumFractionDigits: 2 })}
              {" "}
              {fiatCurrency}
            </span>
          </div> 
        </div>
        
        <button 
          onClick={handleSell}
          className="btn btn-primary w-full flex items-center justify-center"
          disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > availableBalanceNum || !validateMobileNumber(mobileNumber) || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
        >
          Continue
          <ArrowRight size={18} className="ml-2" />
        </button>

        {/* <button 
  onClick={handleSell}
  disabled={!isAmountValid() || !validateMobileNumber(mobileNumber) || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
  className="btn btn-primary w-full flex items-center justify-center"
>
  Continue
  <ArrowRight size={18} className="ml-2" />
</button> */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1}}
            className={'card p-6 text-center mt-3'}
            >
              {isSubmitting ? (
                <div>
                  <Loader2 className='animate-spin h-12 w-12 mx-auto mb-4 text-primary-500' />
                  <p className='text-lg font-semibold mb-2'>Processing Transaction</p>
                  <p className='text-slate-500 dark:text-slate-400'>
                    Please confirm the transaction in your wallet.
                  </p>
                </div>
              ) : txHash && writeData ? (
                <div>
                  <CheckCircle2 className='h-12 w-12 mx-auto mb-4 text-success-500' />
                  <p className='text-lg font-semibold mb-2'>Transaction Succesful!</p>
                  <p className='text-slate-500 dark:text-slate-400 mb-4'>
                    {amount} {selectedToken} has been sent on {getNetworkName(chainId)}
                  </p>
                    <a href={`https://basescan.org/tx/${txHash}`}
                      target="_blank"
                      rel='noopener noreferrer'
                      className='text-primary-600 dark:text-primary-400 hover:underline'
                      >
                        View on Etherscan
                      </a>
                </div>
              ) : ''
              }

              {isSubmitting && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white dark:bg-dark-700 p-6 rounded-xl text-center">
                    <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4 text-primary-500" />
                    <p className="text-lg font-semibold">Confirm in Wallet</p>
                    <p className="text-sm text-slate-500 mt-2">
                      Please check your mobile wallet app to approve the transaction. 
                      <br/>
                          <div className="block md:hidden mb-2 text-xs text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/30 rounded px-3 py-2">
                            <strong>Note:</strong> Ensure that Notifications are activated in your mobile Wallet.
                          </div>
                    </p>
                  </div>
                </div>
              )}

            </motion.div>
        
        {/* {parseFloat(amount) > availableBalance && (
          <div className="mt-2 text-sm text-error-600 dark:text-error-400">
            Insufficient balance. Maximum amount: {availableBalance.toFixed(2)} {selectedToken}
          </div>
        )} */}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="card"
      >
        <h3 className="font-semibold mb-3">Mobile Money Guide</h3>
        <ul className="space-y-3">
          {fiatCurrency === 'KSH' ? (
            <>
              <li className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-lg">1</span>
                </div>
                <div>
                  <p className="font-medium">Enter M-PESA Number</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Use your registered Safaricom M-PESA number</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-lg">2</span>
                </div>
                <div>
                  <p className="font-medium">Watch for STK Push</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">You'll receive an M-PESA prompt on your phone</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-lg">3</span>
                </div>
                <div>
                  <p className="font-medium">Enter PIN</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Enter your M-PESA PIN to complete the payment</p>
                </div>
              </li>
            </>
          ) : (
            <>
              <li className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-lg">1</span>
                </div>
                <div>
                  <p className="font-medium">Enter Mobile Money Number</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Use your registered {payoutMethod === 'mtn' ? 'MTN' : 'Airtel'} number</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-lg">2</span>
                </div>
                <div>
                  <p className="font-medium">Check Your Phone</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">You'll receive a USSD prompt to authorize payment</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-lg">3</span>
                </div>
                <div>
                  <p className="font-medium">Confirm Payment</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Enter your {payoutMethod === 'mtn' ? 'MTN MoMo' : 'Airtel Money'} PIN</p>
                </div>
              </li>
            </>
          )}
        </ul>
      </motion.div>
    </div>
  );
}
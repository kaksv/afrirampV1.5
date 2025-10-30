import { useState, useEffect } from 'react';
import { useAccount, useChainId, useWriteContract } from 'wagmi';
import { formatUnits, erc20Abi } from 'viem';
import { motion } from 'framer-motion';
import { Phone, Smartphone, ArrowRight, ChevronDown, Loader2, CheckCircle2 } from 'lucide-react';

const RECIPIENT_ADDRESS = '0xDD463C81cb2fA0e95b55c5d7696d8a9755cb1Af2';
const POLL_INTERVAL = 5000; // 5 seconds

  const TOKEN_ADDRESSES = {
    USDC: {
      1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', //Eth mainnet
      8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', //Base mainnet
      42220: '0xcebA9300f2b948710d2653dD7B07f33A8B32118C', //Celo mainnet
      //testnetworks
      84532: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', //Base testnet
      11155111: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', //Eth testnet
      44787: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B', //Celo testnet
      // Add other chain IDs as needed
    },
    USDT: {
      1: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      8453: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
      42220: '0x88eeC49252c8cbc039DCdB394c0c2BA2f1637EA0',
      84532: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
      11155111: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
      44787: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B',
    }
  };



export default function BuyAirtime() {
  const { address } = useAccount();
  const chainId = useChainId();
  console.log(chainId);
  
  
  // Form State
  const [amount, setAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('mtn');
  const [payoutExpanded, setPayoutExpanded] = useState(false);
  const [fiatCurrency, setFiatCurrency] = useState('UGX');
  const [fiatExpanded, setFiatExpanded] = useState(false);
  const [selectedToken, setSelectedToken] = useState<keyof typeof TOKEN_ADDRESSES>('USDC');
  const [tokenExpanded, setTokenExpanded] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setIsSuccess] = useState(false);
  const [, setErrorMessage] = useState('');
  const [, ] = useState('created');
   const [currentTx, setCurrentTx] = useState<unknown>(null);

  //  Rates use states
  const [exchangeRate, setExchangeRate] = useState<string | null>(null);
  const [, setError] = useState<string | null>(null);
  // const [selectedPair, setSelectedPair] = useState("UGX") //This works interchangably with fiatCurrency but we are to use it to get prices


  const { writeContract, isSuccess: isWriteSuccess, data: writeData } = useWriteContract();


  // useEffect to handle exchangeRate
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    fetch("https://open.er-api.com/v6/latest/USD")
    .then((response) => {
      if(!response.ok) {
        throw new Error("Failed to fetch exchange Rate");
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.rates && data.rates.UGX) {
        // setExchangeRate(data.rates.UGX.toFixed(2));
        // setExchangeRate(data.rates[selectedPair].toFixed(2));
        setExchangeRate(data.rates[fiatCurrency].toFixed(2));
      }else {
        setError(`Rate for {fiatCurrency} not found `);
        setExchangeRate(null)
      }
    })
    .catch((err) => setError(err.message))
    .finally(() => console.log("Exchange rate fetched"));
  }, [fiatCurrency]);

  
  // Add useEffect to handle transaction success
  useEffect(() => {
    if (currentTx ) {
      const intervalId = setInterval(async() => {
        try {
          const response = await fetch(`https://afriramp-backend2.onrender.com/api/buyairtime/${currentTx}`);
          if(!response.ok) {
            throw new Error('Failed to fetch transaction status');
          } 
          const txData = await response.json();
          setCurrentTx(txData);
        }catch (error) {
          console.error('Error polling transaction status:', error);
        }
      }, POLL_INTERVAL)
      
      return () => clearInterval(intervalId);
    }

    if(isWriteSuccess && writeData) {
      setTxHash(writeData);
      // send data to backend
      const sendToBackend = async () => {
        try {
          const response =  await fetch('https://afriramp-backend2.onrender.com/api/buyairtime', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            // mode: 'cors',
            body: JSON.stringify({
              tx_hash: writeData,
              amount: parseFloat(amount),
              token: selectedToken,
              // fiat_amount: calculateFiatAmount(),
              fiat_amount: getFinalReceiveAmount(), // ✅ Exactly what user sees
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

          if(!response.ok) {
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
              url: 'https://afriramp-backend.onrender.com/api/buyairtime',
              method: 'POST',
              body: JSON.stringify({
                tx_hash: writeData,
                amount: parseFloat(amount),
                token: selectedToken,
                // fiat_amount: calculateFiatAmount(),
                fiat_amount: getFinalReceiveAmount(), // ✅ Exactly what user sees
                fiat_currency: fiatCurrency,
                payout_method: payoutMethod,
                mobile_number: mobileNumber,
                sender_address: address,
                recipient_address: RECIPIENT_ADDRESS,
                chain_id: chainId }),
            }
          });
          setErrorMessage('Failed to save transaction. Please check console for details.');
        }finally {
          setIsSubmitting(false);
        }
      };

      sendToBackend();

    }
  },[isWriteSuccess, writeData]);

  // After a successful transaction submission, reset page after 10s
  useEffect(() => {
    if (txHash && writeData) {
      const timeout = setTimeout(() => {
        resetPage();
      }, 10000); // 10 seconds
      return () => clearTimeout(timeout);
    }
  }, [txHash, writeData]);
  
  // Token options
  const tokens = [
    { symbol: 'USDC', name: 'USD Coin', icon: '$', price: 1.00 },
    { symbol: 'USDT', name: 'Tether', icon: '₮', price: 1.00 }
  ];
  
  // Get token balance (mock data - would be fetched from blockchain)
  const getTokenBalance = (symbol: string) => {
    // Mock balances
    const balances = {
      USDC: '1000000000', // 1000 USDC (6 decimals)
      USDT: '1000000000'  // 1000 USDT (6 decimals)
    };
    return formatUnits(BigInt(balances[symbol as keyof typeof balances]), 6);
  };
  
  // Available balance for selected token
  const availableBalance = parseFloat(getTokenBalance(selectedToken));
  
  // Fiat currencies
  const fiatCurrencies = [
    { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling' },
    { code: 'KSH', symbol: 'KSh', name: 'Kenyan Shilling' },
    
  ];
  
  // Exchange rates (1 USD = X local currency)
  // const exchangeRates = {
  //   KSH: 143.50, // 1 USD = 143.50 KSH
  //   UGX: 3850.75, // 1 USD = 3850.75 UGX
  // };
  
  // Get payment methods based on currency
  const getPaymentMethods = () => {
    if (fiatCurrency === 'UGX') {
      return [
        { id: 'mtn', name: 'MTN', icon: <Smartphone size={18} /> },
        { id: 'airtel', name: 'Airtel', icon: <Phone size={18} /> },
      ];
    } else
    if (fiatCurrency === 'KSH') {
      return [
        { id: 'mpesa', name: 'M-PESA', icon: <Phone size={18} /> },
      ];
    } 
    return [];
  };
  
  // Get current fiat currency symbol
  const getCurrencySymbol = () => {
    const currency = fiatCurrencies.find(c => c.code === fiatCurrency);
    return currency ? currency.symbol : 'USh';
  };
  
  
  
  // Calculate fiat amount based on token amount
  // const calculateFiatAmount = () => {
  //   if (!amount || isNaN(parseFloat(amount))) return '0.00';
  //   const token = tokens.find(t => t.symbol === selectedToken);
  //   if (!token) return '0.00';
    
  //   // Convert token amount to local currency
  //   const usdAmount = parseFloat(amount) * token.price;
  //   const localAmount = usdAmount * exchangeRates[fiatCurrency as keyof typeof exchangeRates];
  //   return localAmount.toFixed(2);
  // };

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
    if (fiatCurrency === 'KSH') {
      // Kenya: +254 or 07xx/01xx format, 9-12 digits
      return /^(?:\+254|0)[17]\d{8}$/.test(number);
    } else if (fiatCurrency === 'UGX') {
      // Uganda: +256 or 07xx format, 9-12 digits
      return /^(?:\+256|0)[7]\d{8}$/.test(number);
    }
    return false;
  };
  
  // Format mobile number display
  const formatMobileNumber = (number: string) => {
    if (!number) return '';
    // Remove any non-digit characters
    const cleaned = number.replace(/\D/g, '');
    if (fiatCurrency === 'KSH') {
      // Format as 07XX XXX XXX or +254 7XX XXX XXX
      if (cleaned.startsWith('254')) {
        return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
      }
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    } else if (fiatCurrency === 'UGX') {
      // Format as 07XX XXX XXX or +256 7XX XXX XXX
      if (cleaned.startsWith('256')) {
        return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
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
    // Reset payment method to first available option for new currency
    const methods = currency === 'UGX' ?  ['mtn', 'airtel'] : ['mpesa'];
    setPayoutMethod(methods[0]);
    // Reset mobile number
    setMobileNumber('');
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
      default: return `Network (${chainId})`;
    }
  };
  
  // Handle sell action
  const handleSell = async () => {
    if(!address || !chainId) return;

    setIsSubmitting(true);

    try{
      const tokenAddress = TOKEN_ADDRESSES[selectedToken]?.[chainId as keyof typeof TOKEN_ADDRESSES['USDC']] as `0x${string}`;
      const decimals = 6; // USDC and USDT both use 6 decimal places
      const amountInWei = BigInt(parseFloat(amount) * 10 ** decimals);

     writeContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [RECIPIENT_ADDRESS, amountInWei],
      });

      // The tx hash will be set in the useEffect when isWriteSuccess and writeData are available
    
    }catch(error){
      console.error('Transaction Error:', error); 
      setIsSubmitting(false);
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
        <h2 className="text-xl font-semibold mb-6">Buy Airtime</h2>
        
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              You Pay
            </label>
            {/* <span className="text-sm text-slate-500 dark:text-slate-400">
              Available: {availableBalance.toFixed(2)} {selectedToken}
            </span> */}
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
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                {tokens.find(t => t.symbol === selectedToken)?.icon}
              </div>
              
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <button
                  onClick={() => setTokenExpanded(!tokenExpanded)}
                  className="px-3 py-1 rounded-lg border border-slate-300 dark:border-dark-500 bg-white dark:bg-dark-600 text-slate-900 dark:text-white flex items-center"
                >
                  <span>{selectedToken}</span>
                  <ChevronDown size={16} className={`ml-2 transition-transform ${tokenExpanded ? 'rotate-180' : ''}`} />
                </button>
                
                {tokenExpanded && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-1 w-48 bg-white dark:bg-dark-700 rounded-lg shadow-lg border border-slate-200 dark:border-dark-600 z-20"
                  >
                    <div className="py-1">
                      {tokens.map(token => (
                        <button
                          key={token.symbol}
                          onClick={() => {
                            setSelectedToken(token.symbol as keyof typeof TOKEN_ADDRESSES);
                            setTokenExpanded(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-dark-600 transition-colors flex items-center"
                        >
                          <span className="w-8">{token.icon}</span>
                          <span>{token.symbol}</span>
                          <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">{token.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
          
          {/* <div className="flex justify-between mt-2 gap-2 mb-4">
            {[25, 50, 75, 100].map((percentage) => (
              <button
                key={percentage}
                type="button"
                onClick={() => usePercentage(percentage)}
                className="flex-1 text-sm py-1 px-2 rounded-md bg-slate-100 dark:bg-dark-600 hover:bg-slate-200 dark:hover:bg-dark-500 transition-colors"
              >
                {percentage}%
              </button>
            ))}
          </div> */}
          
          <div className="flex justify-between">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              You Receive (Estimated)
            </label>
          </div>
          
          <div className="mt-1 p-4 rounded-lg bg-slate-50 dark:bg-dark-600 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400 flex items-center justify-center mr-3">
                <span className="text-lg">{getCurrencySymbol()}</span>
              </div>
              <div>
                {/* <p className="font-medium"> */}
                  {/* {(((Number(exchangeRate)) - Number(exchangeRate) * (2/100)) * Number(amount)).toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "} */}
                  {/* {calculateFiatAmount()} */}
                   {/* {fiatCurrency} */}
                {/* </p> */}
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
                        key={currency.code}
                        onClick={() => {
                          handleCurrencyChange(currency.code);
                          setFiatExpanded(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-dark-600 transition-colors flex items-center"
                      >
                        <span className="w-12">{currency.symbol}</span>
                        <span>{currency.code}</span>
                        <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">{currency.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
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
              {/* {((((Number(exchangeRate))  * (98/100)) * Number(amount)) * 0.98).toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "} */}
              {getFinalReceiveAmount().toLocaleString(undefined, { maximumFractionDigits: 2 })}
              {fiatCurrency}</span>
          </div> 
         </div>
        
            <div className="mb-2 text-xs text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/30 rounded px-3 py-2">
                <strong>Note:</strong> For convenience, we always round down the airtime amount to the nearest hundred. For example, if your estimated airtime is 1,786 UGX, you will receive 1,700 UGX.
            </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Number Receiving
          </label>
          
          <div className="relative">
            <button
              onClick={() => setPayoutExpanded(!payoutExpanded)}
              className="w-full input flex items-center justify-between"
            >
              <div className="flex items-center">
                {getPaymentMethods().find(m => m.id === payoutMethod)?.icon}
                <span className="ml-2">{getPaymentMethods().find(m => m.id === payoutMethod)?.name}</span>
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
                  {getPaymentMethods().map(method => (
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
              placeholder={fiatCurrency === 'KSH' ? ' 0712 345 678' : ' 0775 123 456'}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
              {fiatCurrency === 'UGX' ? '+256' : '+254'}
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


        
        <button 
          onClick={handleSell}
          className="btn btn-primary w-full flex items-center justify-center"
          disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > availableBalance || !validateMobileNumber(mobileNumber) || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
        >
          Continue
          <ArrowRight size={18} className="ml-2" />
        </button>

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
        
        {parseFloat(amount) > availableBalance && (
          <div className="mt-2 text-sm text-error-600 dark:text-error-400">
            Insufficient balance. Maximum amount: {availableBalance.toFixed(2)} {selectedToken}
          </div>
        )}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="card"
      >
        {/* Mobile Money */}
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
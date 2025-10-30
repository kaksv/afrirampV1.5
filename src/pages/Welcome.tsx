import { motion } from 'framer-motion';
import { Wallet, ArrowRight, Shield, BarChart4, Globe, Sparkle, ArrowRightLeft, Network, PieChart, ArrowUpRight, ArrowDownLeft } from 'lucide-react';





export default function Welcome() {
  
  return (
    <div className="h-screen md:min-h-screen bg-slate-50 dark:bg-dark-800 relative overflow-hidden">

      {/* Animated Background Gradient */}
      <div className="absolute inset-0 polymorphic-gradient"></div>
      
      {/* Dashboard Background Preview */}
      <div className="absolute inset-0 opacity-8 dashboard-preview">
        <div className="h-screen md:min-h-screen bg-slate-50 dark:bg-dark-800 flex flex-col">
          {/* Simulated Navbar */}
          <div className="h-16 bg-white dark:bg-dark-700 border-b border-slate-200 dark:border-dark-600 flex items-center px-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-md"></div>
              <div className="font-bold text-xl">AfriRamp</div>
            </div>
          </div>
          
          <div className="flex-1 flex">
            {/* Simulated Sidebar */}
            <div className="w-64 bg-white dark:bg-dark-700 border-r border-slate-200 dark:border-dark-600 p-6">
              <div className="space-y-4">
                <div className="h-8 bg-primary-100 dark:bg-primary-900/20 rounded-lg"></div>
                <div className="h-8 bg-slate-100 dark:bg-dark-600 rounded-lg"></div>
                <div className="h-8 bg-slate-100 dark:bg-dark-600 rounded-lg"></div>
                <div className="h-8 bg-slate-100 dark:bg-dark-600 rounded-lg"></div>
              </div>
            </div>
            
            {/* Simulated Main Content */}
            <main className="flex-1 p-8">
              <div className="space-y-8">
                {/* Metrics Cards */}
                <div className="grid grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-dark-700 rounded-xl shadow-sm border border-slate-200 dark:border-dark-600 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                          <div className="h-4 w-20 bg-slate-200 dark:bg-dark-600 rounded"></div>
                          <div className="h-8 w-16 bg-slate-300 dark:bg-dark-500 rounded"></div>
                        </div>
                        <div className={`w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/20`}>
                          {i === 1 && <ArrowRightLeft size={18} className="text-primary-600 dark:text-primary-400 m-1" />}
                          {i === 2 && <Network size={18} className="text-primary-600 dark:text-primary-400 m-1" />}
                          {i === 3 && <PieChart size={18} className="text-primary-600 dark:text-primary-400 m-1" />}
                        </div>
                      </div>
                      <div className="h-4 w-12 bg-slate-200 dark:bg-dark-600 rounded"></div>
                    </div>
                  ))}
                </div>
                
                {/* Balance and History Cards */}
                <div className="grid grid-cols-2 gap-8">
                  {/* Balance Card */}
                  <div className="bg-white dark:bg-dark-700 rounded-xl shadow-sm border border-slate-200 dark:border-dark-600 p-6 relative">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-t-xl" />
                    <div className="mt-4 space-y-4">
                      <div className="h-6 w-24 bg-slate-200 dark:bg-dark-600 rounded"></div>
                      <div className="space-y-3">
                        {[1, 2].map((i) => (
                          <div key={i} className="p-4 rounded-lg bg-slate-50 dark:bg-dark-600">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 mr-3"></div>
                                <div className="space-y-1">
                                  <div className="h-4 w-16 bg-slate-200 dark:bg-dark-500 rounded"></div>
                                  <div className="h-3 w-10 bg-slate-200 dark:bg-dark-500 rounded"></div>
                                </div>
                              </div>
                              <div className="h-6 w-20 bg-slate-200 dark:bg-dark-500 rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="btn btn-primary opacity-50 flex items-center justify-center">
                          <ArrowUpRight size={18} className="mr-2" />
                          Send
                        </div>
                        <div className="btn btn-outline opacity-50 flex items-center justify-center">
                          <ArrowDownLeft size={18} className="mr-2" />
                          Receive
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Transaction History Card */}
                  <div className="bg-white dark:bg-dark-700 rounded-xl shadow-sm border border-slate-200 dark:border-dark-600 p-6">
                    <div className="space-y-4">
                      <div className="h-6 w-32 bg-slate-200 dark:bg-dark-600 rounded"></div>
                      <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-dark-600 mr-3"></div>
                              <div className="space-y-1">
                                <div className="h-4 w-20 bg-slate-200 dark:bg-dark-500 rounded"></div>
                                <div className="h-3 w-16 bg-slate-200 dark:bg-dark-500 rounded"></div>
                              </div>
                            </div>
                            <div className="h-4 w-16 bg-slate-200 dark:bg-dark-500 rounded"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
      
      {/* Overlay Content */}
      <div className="relative z-10">
        {/* Floating Header */}

        
        {/* Main Content Overlay */}
        <main className="relative z-10 h-screen md:min-h-screen flex items-center justify-center">
          <div className="absolute inset-0 glass-overlay"></div>
          
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 1.2,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            className="relative z-20 text-center px-4 max-w-4xl mx-auto"
          >
            {/* Hero Section with Focus on Connect Wallet */}
            <div className="glass-hero rounded-3xl p-8 md:p-12 shadow-2xl connect-wallet-glow hover:shadow-3xl transition-all duration-500">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <div className="mb-6">
                  <div className="mx-auto inline-block glass-logo-container bg-white/10 dark:bg-dark-800/20 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/20 dark:border-white/10 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <motion.img src="/logo.jpg" alt="AfriRamp" className="w-8 h-8 rounded-lg" whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} />
                      <span className="font-bold text-xl text-white drop-shadow-lg">Welcome to AfriRamp</span>
                    </div>
                  </div>
                </div>
                
                <h1 className="hidden md:block text-3xl md:text-5xl font-bold mb-6">
                  <span className="gradient-text">On and Offramp</span> USDC and USDT
                  <br />
                  <span className="gradient-text">with ease</span>
                </h1>
                
                <p className="text-2xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                  The simplest way to buy, sell, send, and receive stablecoins in East Africa.
                </p>
              </motion.div>
              
              {/* Large Connect Wallet Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
                className="mb-8"
              >
                <div className="glass-header-button bg-white/5 dark:bg-white/5 backdrop-blur-sm rounded-2xl px-12 py-4 md:px-16 md:py-5 border border-white/10 dark:border-white/10 shadow-sm hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-300 inline-block min-w-[320px] md:min-w-[400px] flex items-center justify-center">
                  <div className="scale-125 md:scale-150">
                    <appkit-button label="Connect Wallet" />
                  </div>
                </div>
              </motion.div>
              
              {/* Features Preview */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
              >
                {[
                  { icon: <Wallet size={20} />, text: 'Simple Wallet' },
                  { icon: <Shield size={20} />, text: 'Secure Transactions' },
                  { icon: <BarChart4 size={20} />, text: 'Track Portfolio' },
                  { icon: <Globe size={20} />, text: 'Global Support' }
                ].map((feature, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 + (index * 0.1) }}
                    whileHover={{ y: -5, scale: 1.05 }}
                    className="flex flex-col items-center p-4 rounded-xl bg-slate-50 dark:bg-dark-700/50 hover:bg-slate-100 dark:hover:bg-dark-600/50 transition-all duration-300 cursor-pointer group"
                  >
                    <motion.div 
                      className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-2"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-slate-500 dark:text-slate-400"
              >
                <p className="mb-2">Supported Wallets:</p>
                <p className="font-medium">MetaMask, Coinbase Wallet, WalletConnect & more</p>
              </motion.div>
            </div>
            
            {/* Floating Action Hint */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="mt-8"
            >
              <motion.a 
                href="#features" 
                className="inline-flex items-center text-white/80 hover:text-white transition-all duration-300 hover:scale-105"
                whileHover={{ y: -2 }}
                animate={{ y: [0, -5, 0] }}
                transition={{
                  y: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                <span className="mr-2">Learn more about AfriRamp</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ArrowRight size={16} />
                </motion.div>
              </motion.a>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
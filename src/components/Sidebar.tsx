import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign, 
  CreditCard, 
  Clock, 
  X,
  Smartphone,
} from 'lucide-react';

import { cn } from '../utils/cn';

interface SidebarProps {
  onClose? : () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation();
  
  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Send', path: '/send', icon: ArrowUpRight },
    { name: 'Receive', path: '/receive', icon: ArrowDownLeft },
    { name: 'Buy Stable Coins', path: '/onramp', icon: DollarSign },
    { name: 'Sell Stable Coins', path: '/offramp', icon: CreditCard },
        { name: 'Buy Airtime with Stables', path: '/buyairtime', icon: Smartphone }, // <-- Add this line
    { name: 'History', path: '/history', icon: Clock },
  ];
  
  return (
    <div className="h-full bg-white dark:bg-dark-700 border-r border-slate-200 dark:border-dark-600">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="/logo.jpg" alt="AfriRamp" className="w-8 h-8 rounded-md" />
          <span className="font-bold text-xl">AfriRamp</span>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="p-1 rounded-md text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
          >
            <X size={24} />
          </button>
        )}
      </div>
      
      <nav className="mt-6 px-3 space-y-1">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                "flex items-center px-3 py-3 text-sm font-medium rounded-lg relative",
                isActive 
                  ? "text-primary-600 dark:text-primary-400" 
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-600"
              )}
            >
              {isActive && (
                <motion.div 
                  // layoutId="activeNavigation"
                  className="absolute left-0 right-0 top-0 bottom-0 bg-primary-50 dark:bg-primary-900/20 rounded-lg -z-10"
                  transition={{ type: "spring", duration: 0.3 }}
                />
              )}
              <Icon 
                size={20} 
                className={cn("mr-3", isActive ? "text-primary-500 dark:text-primary-400" : "")} 
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="absolute bottom-0 left-0 p-4">
        <Link
          to="https://t.me/+eb3CQeeKXTY3ZjY0"
          onClick={onClose}
          className="flex items-center px-2 py-3 text-sm font-medium rounded-lg relative"
        >
        <div className="p-4 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white">
          <h3 className="font-semibold mb-1">Need Support?</h3>
          <p className="text-sm opacity-90 mb-3">We are here  <br/> to help you.</p>
          {/* <Link
            to="https://t.me/+eb3CQeeKXTY3ZjY0" 
            className="text-sm inline-flex items-center font-medium bg-white text-primary-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Join our Telegram
          </Link> */}
        </div>
        </Link>
      </div>
    </div>
  );
}


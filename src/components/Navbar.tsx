// import { useAccount } from 'wagmi';
import { 
    Menu, 
    // Moon, 
    // Sun 
} from 'lucide-react';
import { useAppKitAccount } from '@reown/appkit/react';


interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
//   const [darkMode, setDarkMode] = useState(false);
  // const { isConnected } = useAccount();
//   const { isConnected, address } = useAccount();
  const { 
    address, 
    isConnected, 
    caipAddress, 
    // status, 
    // embeddedWalletInfo 
} = useAppKitAccount();
  
  // Get the current page title
  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return 'Dashboard';
      case '/send':
        return 'Send ETH';
      case '/receive':
        return 'Receive ETH';
      case '/onramp':
        return 'Buy ';
      case '/offramp':
        return 'Sell ';
      case '/history':
        return 'Transaction History';
      default:
        return 'AfriRamp';
    }
  };
  
// Logic to implement Dark mode. Set it if the user is using dark mode a=on loading
// and activate the toggle if toggle button is clicked.
  
  return (
    <nav className="sticky top-0 z-10 backdrop-blur-md bg-white/80 dark:bg-dark-800/80 border-b border-slate-200 dark:border-dark-700 px-4 md:px-8 py-4">
      <div className="container mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="mr-4 p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white md:hidden"
          >
            <Menu size={24} />
          </button>
          <div className="hidden md:flex items-center space-x-2">
            <img src="/logo.jpg" alt="AfriRamp Logo" className="w-8 h-8 rounded-md" />
          </div>
          <h1 className="text-xl font-semibold md:ml-8">{getPageTitle()}</h1>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="flex items-center space-x-2">  
            <appkit-button label={`${isConnected ? caipAddress ? caipAddress : address : 'Connect Wallet' }`} loadingLabel='Loading...' />
          </div>
        </div>
      </div>
    </nav>
  );
}
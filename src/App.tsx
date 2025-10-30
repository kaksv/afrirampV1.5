import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
// import { WagmiProvider, useAccount } from 'wagmi';
import {useAppKitAccount} from '@reown/appkit/react'

// Layout
import AppLayout from './layouts/AppLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Send from './pages/Send';
import Receive from './pages/Receive';
import OnRamp from './pages/OnRamp';
import OffRamp from './pages/OffRamp';
// import History from './pages/History';
import Welcome from './pages/Welcome';
import BuyAirtime from './pages/BuyAirtime';

import "./App.css"

// Component to handle protected routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
const { 
  // address, 
  isConnected, 
  // caipAddress, 
  // status, 
  // embeddedWalletInfo
 } =
  useAppKitAccount();
  
  if (!isConnected) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};


export function App() {
  const { isConnected } =
  useAppKitAccount();
  // const { isConnected } = useAccount();
  // const [isLoading, setIsLoading] = useState(true);

  return (

   <BrowserRouter>
    <Routes>
      <Route path="/" element={isConnected ? <Navigate to="/dashboard" replace /> : <Welcome />} />
      <Route path="/" element={<AppLayout />}>
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="send" element={
          <ProtectedRoute>
            <Send />
          </ProtectedRoute>
        } />
        <Route path="receive" element={
          <ProtectedRoute>
            <Receive />
          </ProtectedRoute>
        } />
        <Route path="onramp" element={
          <ProtectedRoute>
            <OnRamp />
          </ProtectedRoute>
        } />
        <Route path="offramp" element={
          <ProtectedRoute>
            <OffRamp />
          </ProtectedRoute>
        } />
          <Route path="receive" element={
          <ProtectedRoute>
            <Receive />
          </ProtectedRoute>
        } />
        <Route path="buyairtime" element={  
          <ProtectedRoute>
            <BuyAirtime />
          </ProtectedRoute>
        } />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </BrowserRouter>
  );

    // <div className={"pages"}>
    //   <WagmiProvider config={wagmiAdapter.wagmiConfig}>
    //     <QueryClientProvider client={queryClient}>
    //         <appkit-button />
    //         <ActionButtonList />
    //         <div className="advice">
    //           <p>
    //             This projectId only works on localhost. <br/>
    //             Go to <a href="https://dashboard.reown.com" target="_blank" className="link-button" rel="Reown Dashboard">Reown Dashboard</a> to get your own.
    //           </p>
    //         </div>
    //         <InfoList />
    //     </QueryClientProvider>
    //   </WagmiProvider>
    // </div>
  
}

export default App

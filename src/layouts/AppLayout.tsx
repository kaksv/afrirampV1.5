import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-800 flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-20"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="fixed top-0 left-0 bottom-0 w-64 z-30"
              >
                <Sidebar onClose={() => setSidebarOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
        
        {/* Desktop sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <Sidebar />
        </div>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="container mx-auto max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
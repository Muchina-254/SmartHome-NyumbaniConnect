import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Styles
import './App.css';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);
  
  return null;
}

// Loading component
const PageLoader = () => (
  <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-bounce text-6xl mb-4">🏠</div>
      <div className="spinner mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading SmartNyumba...</p>
    </div>
  </div>
);

function App() {
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <ScrollToTop />
          <Navbar />
          <main className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>

          {/* Enhanced Footer */}
          <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid md:grid-cols-4 gap-8">
                <div className="animate-fade-in-up">
                  <div className="flex items-center mb-4">
                    <div className="text-3xl">🏠</div>
                    <span className="ml-2 text-xl font-bold">SmartNyumba</span>
                  </div>
                  <p className="text-gray-400 mb-4">
                    Kenya's leading property platform connecting renters with verified landlords across all 47 counties.
                  </p>
                  <div className="flex space-x-4">
                    <span className="text-2xl hover:scale-110 transition-transform cursor-pointer">📱</span>
                    <span className="text-2xl hover:scale-110 transition-transform cursor-pointer">💬</span>
                    <span className="text-2xl hover:scale-110 transition-transform cursor-pointer">📧</span>
                  </div>
                </div>
                
                <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="/" className="hover:text-white transition-colors">🏠 Home</a></li>
                    <li><a href="/properties" className="hover:text-white transition-colors">🔍 Browse Properties</a></li>
                    <li><a href="/register" className="hover:text-white transition-colors">📝 List Property</a></li>
                    <li><a href="/dashboard" className="hover:text-white transition-colors">📊 Dashboard</a></li>
                  </ul>
                </div>
                
                <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                  <h3 className="text-lg font-semibold mb-4">Support</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">❓ Help Center</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">📞 Contact Us</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">🛡️ Safety Tips</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">📋 Terms of Service</a></li>
                  </ul>
                </div>
                
                <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                  <h3 className="text-lg font-semibold mb-4">Popular Areas</h3>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li><a href="#" className="hover:text-white transition-colors">📍 Nairobi Properties</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">📍 Mombasa Rentals</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">📍 Kisumu Homes</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">📍 Nakuru Properties</a></li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2025 SmartNyumba. All rights reserved. Made with ❤️ in Kenya 🇰🇪</p>
              </div>
            </div>
          </footer>

          {/* Enhanced Toast Notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#1f2937',
                border: '1px solid rgba(5, 150, 105, 0.2)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                padding: '16px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#059669',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />

          {/* Floating Action Button for Quick Actions */}
          <div className="fixed bottom-6 right-6 z-40">
            <div className="relative">
              <button className="btn-modern w-16 h-16 rounded-full text-2xl animate-pulse-custom shadow-2xl">
                💬
              </button>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">
                !
              </div>
            </div>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

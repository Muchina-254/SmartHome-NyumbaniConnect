import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
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
import About from './pages/About';
import Contact from './pages/Contact';
import HelpCenter from './pages/HelpCenter';
import AddProperty from './pages/AddProperty';
import ManageProperties from './pages/ManageProperties';
import SavedProperties from './pages/SavedProperties';
import MyInquiries from './pages/MyInquiries';
import Messages from './pages/Messages';
import Analytics from './pages/Analytics';
import EditProfile from './pages/EditProfile';
import SafetyTips from './pages/SafetyTips';
import TermsOfService from './pages/TermsOfService';
import NotFound from './pages/NotFound';

// Styles
import './App.css';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
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

// Professional Loading component
const PageLoader = () => (
  <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
    <div className="text-center">
      <div className="icon icon-home text-8xl mb-6 text-primary-500 animate-pulse-soft"></div>
      <div className="spinner-professional mx-auto mb-6"></div>
      <h3 className="text-heading-md text-neutral-900 mb-2">SmartNyumba</h3>
      <p className="text-body-md text-neutral-600">Loading Kenya's Premier Property Platform</p>
    </div>
  </div>
);

// Professional Footer Component
const Footer = () => (
  <footer className="bg-neutral-900 text-white section-professional">
    <div className="container-professional">
      <div className="grid md:grid-cols-4 gap-12 mb-12">
        <div className="animate-slide-up">
          <div className="flex items-center mb-6">
            <div className="icon icon-home text-4xl text-primary-500 animate-pulse-soft"></div>
            <div className="ml-3">
              <div className="text-xl font-display font-bold">SmartNyumba</div>
              <div className="text-xs text-neutral-400 font-medium tracking-wide uppercase">
                Kenya Property Platform
              </div>
            </div>
          </div>
          <p className="text-body-md text-neutral-300 mb-6 leading-relaxed">
            Kenya's leading property platform connecting renters with verified landlords 
            across all 47 counties. Experience the future of property hunting.
          </p>
          <div className="flex space-x-4">
            <span className="icon icon-phone text-2xl hover-scale cursor-pointer transition-transform text-neutral-400 hover:text-white"></span>
            <span className="icon icon-message text-2xl hover-scale cursor-pointer transition-transform text-neutral-400 hover:text-white"></span>
            <span className="icon icon-email text-2xl hover-scale cursor-pointer transition-transform text-neutral-400 hover:text-white"></span>
            <span className="icon icon-settings text-2xl hover-scale cursor-pointer transition-transform text-neutral-400 hover:text-white"></span>
          </div>
        </div>
        
        <div className="animate-slide-up animate-delay-100">
          <h3 className="text-heading-md font-bold mb-6">Quick Links</h3>
          <ul className="space-y-3">
            <li><Link to="/" className="text-neutral-300 hover:text-white transition-colors text-body-md hover-lift flex items-center gap-2 focus-professional"><span className="icon icon-home"></span> Home</Link></li>
            <li><Link to="/properties" className="text-neutral-300 hover:text-white transition-colors text-body-md hover-lift flex items-center gap-2 focus-professional"><span className="icon icon-search"></span> Browse Properties</Link></li>
            <li><Link to="/register" className="text-neutral-300 hover:text-white transition-colors text-body-md hover-lift flex items-center gap-2 focus-professional"><span className="icon icon-plus"></span> List Property</Link></li>
            <li><Link to="/dashboard" className="text-neutral-300 hover:text-white transition-colors text-body-md hover-lift flex items-center gap-2 focus-professional"><span className="icon icon-chart"></span> Dashboard</Link></li>
          </ul>
        </div>
        
        <div className="animate-slide-up animate-delay-200">
          <h3 className="text-heading-md font-bold mb-6">Support</h3>
          <ul className="space-y-3">
            <li><Link to="/help" className="text-neutral-300 hover:text-white transition-colors text-body-md hover-lift flex items-center gap-2 focus-professional"><span className="icon icon-star"></span> Help Center</Link></li>
            <li><Link to="/contact" className="text-neutral-300 hover:text-white transition-colors text-body-md hover-lift flex items-center gap-2 focus-professional"><span className="icon icon-phone"></span> Contact Us</Link></li>
            <li><Link to="/safety-tips" className="text-neutral-300 hover:text-white transition-colors text-body-md hover-lift flex items-center gap-2 focus-professional"><span className="icon icon-verified"></span> Safety Tips</Link></li>
            <li><Link to="/terms" className="text-neutral-300 hover:text-white transition-colors text-body-md hover-lift flex items-center gap-2 focus-professional"><span className="icon icon-settings"></span> Terms of Service</Link></li>
          </ul>
        </div>
        
        <div className="animate-slide-up animate-delay-300">
          <h3 className="text-heading-md font-bold mb-6">Popular Areas</h3>
          <ul className="space-y-3">
            <li><Link to="/properties?county=nairobi" className="text-neutral-300 hover:text-white transition-colors text-body-sm hover-lift flex items-center gap-2 focus-professional"><span className="icon icon-location"></span> Nairobi Properties</Link></li>
            <li><Link to="/properties?county=mombasa" className="text-neutral-300 hover:text-white transition-colors text-body-sm hover-lift flex items-center gap-2 focus-professional"><span className="icon icon-location"></span> Mombasa Rentals</Link></li>
            <li><Link to="/properties?county=kisumu" className="text-neutral-300 hover:text-white transition-colors text-body-sm hover-lift flex items-center gap-2 focus-professional"><span className="icon icon-location"></span> Kisumu Homes</Link></li>
            <li><Link to="/properties?county=nakuru" className="text-neutral-300 hover:text-white transition-colors text-body-sm hover-lift flex items-center gap-2 focus-professional"><span className="icon icon-location"></span> Nakuru Properties</Link></li>
            <li><Link to="/properties?county=eldoret" className="text-neutral-300 hover:text-white transition-colors text-body-sm hover-lift flex items-center gap-2 focus-professional"><span className="icon icon-location"></span> Eldoret Apartments</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-neutral-800 pt-8 text-center">
        <p className="text-body-md text-neutral-400">
          &copy; 2025 SmartNyumba. All rights reserved. Made with <span className="icon icon-heart text-error-500"></span> in Kenya
        </p>
        <p className="text-body-sm text-neutral-500 mt-2">
          Empowering Kenyans to find their perfect homes since 2025
        </p>
      </div>
    </div>
  </footer>
);

function App() {
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

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
          <main className="min-h-screen bg-neutral-50">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/add" element={<AddProperty />} />
              <Route path="/properties/manage" element={<ManageProperties />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/saved-properties" element={<SavedProperties />} />
              <Route path="/my-inquiries" element={<MyInquiries />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/safety-tips" element={<SafetyTips />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />

          {/* Enhanced Toast Notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(255, 255, 255, 0.95)',
                color: 'var(--neutral-800)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                backdropFilter: 'blur(20px)',
                borderRadius: 'var(--radius-lg)',
                fontSize: '0.875rem',
                fontWeight: '500',
                padding: '16px 20px',
                boxShadow: 'var(--shadow-lg)',
              },
              success: {
                iconTheme: {
                  primary: 'var(--primary-600)',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: 'var(--error-500)',
                  secondary: '#ffffff',
                },
              },
            }}
          />

          {/* Floating Action Button */}
          <div className="fixed bottom-8 right-8 z-40">
            <div className="relative">
              <button className="btn btn-primary w-16 h-16 rounded-full text-2xl shadow-2xl hover-scale focus-professional animate-pulse-soft flex items-center justify-center">
                <span className="icon icon-message text-white"></span>
              </button>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-error-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">
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

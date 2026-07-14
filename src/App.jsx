import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { useStore } from './store/useStore';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import ServicesCatalog from './pages/ServicesCatalog';
import ExclusiveDeals from './pages/ExclusiveDeals';
import BookingSelectService from './pages/BookingSelectService';
import BookingTimeSelect from './pages/BookingTimeSelect';
import BookingClientDetails from './pages/BookingClientDetails';
import BookingConfirmation from './pages/BookingConfirmation';
import VelvetLuxe from './pages/VelvetLuxe';
import ScrollToTop from './components/ScrollToTop';

import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

function AppContent() {
  const location = useLocation();
  const { settings, initializeStore } = useStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  useEffect(() => {
    // Dynamically update the primary brand color across the entire client app
    if (settings.primaryAccent) {
      document.documentElement.style.setProperty('--primary', settings.primaryAccent);
      // Also update related tailwind-like variables if they exist in CSS
      const rgb = hexToRgb(settings.primaryAccent);
      if (rgb) {
        document.documentElement.style.setProperty('--primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
      }
    }
    
    // Update Brand Typography
    if (settings.typography) {
      document.documentElement.style.setProperty('--font-brand', settings.typography);
    }

    // Update Page Title
    if (settings.brandName) {
      document.title = settings.brandName;
    }
  }, [settings]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="services" element={<ServicesCatalog />} />
          <Route path="exclusive-deals" element={<ExclusiveDeals />} />
          <Route path="velvet-luxe" element={<VelvetLuxe />} />
          
          {/* Booking Flow */}
          <Route path="book">
            <Route index element={<BookingSelectService />} />
            <Route path="time" element={<BookingTimeSelect />} />
            <Route path="details" element={<BookingClientDetails />} />
            <Route path="confirm" element={<BookingConfirmation />} />
          </Route>
          
          <Route path="*" element={<LandingPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BookingProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppContent />
      </BrowserRouter>
    </BookingProvider>
  );
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}


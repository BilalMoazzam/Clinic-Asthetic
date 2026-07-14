import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useBooking } from '../context/BookingContext';

export default function TopNavBar() {
  const { settings } = useStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { clearBooking } = useBooking();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Special Offers', path: '/exclusive-deals' },
    { name: 'Membership', path: '/velvet-luxe' }
  ];

  return (
    <>
      {/* Main Nav */}
      <nav className="sticky top-0 z-50 border-b shadow-sm" style={{ backgroundColor: '#86626E', borderColor: '#6e4f5a' }}>
        <div className="flex justify-between items-center w-full px-4 md:px-10 py-4 max-w-screen-2xl mx-auto">
          <div>
            <Link to="/" className="text-2xl md:text-3xl font-headline group flex items-center gap-3" style={{ color: '#fff' }}>
              <span 
                className="w-10 h-10 md:w-12 md:h-12 rounded flex items-center justify-center font-semibold text-lg transition-all"
                style={{ backgroundColor: '#6e4f5a', color: '#fff' }}
              >
                {settings.brandName ? settings.brandName.charAt(0) : 'V'}
              </span>
              <span className="tracking-wide">{settings.brandName || 'VLAS'}</span>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink 
                key={link.path}
                link={link} 
                isActive={location.pathname === link.path} 
                settings={settings} 
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <Link 
                to="/book" 
                onClick={() => clearBooking()}
                className="premium-btn"
                style={{ backgroundColor: '#6e4f5a' }}
              >
                Book Now
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full transition-colors"
              style={{ color: '#fff' }}
            >
              <span className="material-symbols-outlined text-2xl">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden border-t" 
              style={{ backgroundColor: '#86626E', borderColor: '#6e4f5a' }}
            >
              <div className="flex flex-col p-6 gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-medium py-2 transition-colors"
                    style={{ color: location.pathname === link.path ? '#fff' : 'rgba(255,255,255,0.75)' }}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-4 border-t border-outline sm:hidden mt-2">
                  <Link 
                    to="/book" 
                    onClick={() => {
                      clearBooking();
                      setIsMobileMenuOpen(false);
                    }}
                    className="premium-btn block text-center"
                    style={{ backgroundColor: '#6e4f5a' }}
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}

function NavLink({ link, isActive }) {
  return (
    <Link 
      to={link.path} 
      className="text-[15px] font-medium transition-opacity relative py-2 block"
      style={{ color: '#fff', opacity: isActive ? 1 : 0.8 }}
    >
      {link.name}
      {isActive && (
        <motion.div 
          layoutId="nav-underline"
          className="absolute bottom-0 left-0 w-full h-0.5 rounded-t"
          style={{ backgroundColor: '#fff' }}
        />
      )}
    </Link>
  );
}


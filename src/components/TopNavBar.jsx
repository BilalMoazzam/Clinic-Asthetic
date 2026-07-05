import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';

export default function TopNavBar() {
  const { settings } = useStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Special Offers', path: '/exclusive-deals' },
    { name: 'Membership', path: '/velvet-luxe' }
  ];

  return (
    <>
      {/* Utility Bar */}
      {/* <div className="bg-surface-container text-on-surface-variant text-xs py-2 px-4 md:px-10 border-b border-outline hidden sm:block">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
          <div className="flex gap-4">
            <a href="tel:+15552026852" className="flex items-center gap-1 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[14px]">call</span>
              <span>+1 (555) 202-6852</span>
            </a>
          </div>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              <span>1022 Velvet Lane, London</span>
            </span>
          </div>
        </div>
      </div> */}

      {/* Main Nav */}
      <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-outline shadow-sm">
        <div className="flex justify-between items-center w-full px-4 md:px-10 py-4 max-w-screen-2xl mx-auto">
          <div>
            <Link to="/" className="text-2xl md:text-3xl font-headline text-on-surface group flex items-center gap-3">
              <span 
                className="w-10 h-10 md:w-12 md:h-12 rounded flex items-center justify-center text-white font-semibold text-lg transition-all"
                style={{ backgroundColor: settings.primaryAccent || 'var(--primary)' }}
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
                className="premium-btn"
                style={{ backgroundColor: settings.primaryAccent }}
              >
                Book Now
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
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
              className="lg:hidden bg-white border-t border-outline overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-medium py-2 transition-colors"
                    style={{ color: location.pathname === link.path ? (settings.primaryAccent || 'var(--primary)') : 'var(--on-surface-variant)' }}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-4 border-t border-outline sm:hidden mt-2">
                  <Link 
                    to="/book" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="premium-btn block text-center"
                    style={{ backgroundColor: settings.primaryAccent }}
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

function NavLink({ link, isActive, settings }) {
  return (
    <Link 
      to={link.path} 
      className="text-[15px] font-medium transition-colors relative py-2 block hover:text-primary"
      style={{ 
        color: isActive ? (settings.primaryAccent || 'var(--primary)') : 'var(--on-surface)'
      }}
    >
      {link.name}
      {isActive && (
        <motion.div 
          layoutId="nav-underline"
          className="absolute bottom-0 left-0 w-full h-0.5 rounded-t"
          style={{ backgroundColor: settings.primaryAccent || 'var(--primary)' }}
        />
      )}
    </Link>
  );
}

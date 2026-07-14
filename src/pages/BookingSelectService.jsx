import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { useStore } from '../store/useStore';

export default function BookingSelectService() {
  const navigate = useNavigate();
  const { bookingData, addToCart, removeFromCart, clearBooking } = useBooking();
  const { services, deals, fetchServices, fetchDeals, settings } = useStore();
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedDetails, setExpandedDetails] = useState({});

  useEffect(() => {
    fetchServices();
    fetchDeals();
  }, [fetchServices, fetchDeals]);

  const handleToggleService = (service) => {
    const item = {
      id: `service_${service.id}`,
      name: service.title,
      price: Number(service.price),
      duration: service.duration,
      image: service.image,
      type: 'service'
    };
    
    if (bookingData.cart.find(i => i.id === item.id)) {
      removeFromCart(item.id);
    } else {
      addToCart(item);
    }
  };

  const handleToggleDeal = (deal) => {
    const item = {
      id: `deal_${deal.id}`,
      name: deal.title,
      price: Number(deal.discountPrice),
      duration: deal.duration,
      image: deal.image,
      type: 'deal'
    };

    if (bookingData.cart.find(i => i.id === item.id)) {
      removeFromCart(item.id);
    } else {
      addToCart(item);
    }
  };

  const handleContinue = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (bookingData.cart.length > 0) {
      navigate('/book/time');
    }
  };

  const toggleDetails = (cartId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedDetails(prev => ({
      ...prev,
      [cartId]: !prev[cartId]
    }));
  };

  const activeColor = settings.primaryAccent || 'var(--primary)';
  const totalPrice = bookingData.cart.reduce((sum, item) => sum + item.price, 0);

  // Group services by category, ensuring no deals overlap
  const categories = [...new Set(services.map(s => s.category))].filter(Boolean);

  const handleToggleCategory = (categoryName) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  const renderServiceItem = (item, isDeal = false) => {
    const cartId = isDeal ? `deal_${item.id}` : `service_${item.id}`;
    const isSelected = bookingData.cart.some(i => i.id === cartId);
    const price = isDeal ? item.discountPrice : item.price;
    const isDetailsExpanded = !!expandedDetails[cartId];
    
    return (
      <div key={cartId} className="flex flex-col p-5 bg-surface border border-outline rounded-xl mb-4 hover:border-gray-300 transition-colors shadow-sm">
        <div className="flex justify-between items-center w-full">
          <div>
            <h4 className="font-headline text-xl text-on-surface mb-1">{item.title}</h4>
            <div className="text-sm text-on-surface-variant font-medium mb-3 flex items-center gap-2">
              <span>{item.duration}</span>
              <span className="w-1 h-1 rounded-full bg-on-surface-variant/50"></span>
              <span>${price}</span>
            </div>
            {item.description && (
              <button 
                onClick={(e) => toggleDetails(cartId, e)}
                className="text-xs font-semibold tracking-wider flex items-center gap-1 transition-opacity hover:opacity-70" 
                style={{ color: activeColor }}
              >
                {isDetailsExpanded ? 'Hide Details' : 'Show Details'} <span className="material-symbols-outlined text-sm">{isDetailsExpanded ? 'expand_less' : 'expand_more'}</span>
              </button>
            )}
          </div>
          <div className="flex flex-col items-end gap-3 shrink-0">
             <button
               onClick={(e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 isDeal ? handleToggleDeal(item) : handleToggleService(item);
               }}
               className={`px-8 py-2.5 rounded-lg border font-semibold tracking-wide transition-colors ${isSelected ? 'text-white shadow-md' : 'bg-transparent text-on-surface hover:bg-surface-container'}`}
               style={{
                  borderColor: isSelected ? activeColor : 'var(--outline)',
                  backgroundColor: isSelected ? activeColor : 'transparent'
               }}
             >
               {isSelected ? 'Selected' : 'Select'}
             </button>
          </div>
        </div>
        <AnimatePresence>
          {isDetailsExpanded && item.description && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-2 border-t border-outline/50">
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderCategoryAccordion = (categoryName, items, isDeal = false) => {
    const isExpanded = expandedCategory === categoryName;
    return (
      <div key={categoryName} className="border-b border-outline last:border-b-0 py-2">
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleToggleCategory(categoryName);
          }}
          className="w-full flex justify-between items-center py-5 text-left group"
        >
          <div>
            <h3 className="text-2xl font-headline text-on-surface group-hover:opacity-70 transition-opacity">{categoryName}</h3>
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.15em] mt-1 opacity-70">
              {isDeal ? 'Deal' : 'Service'}
            </p>
          </div>
          <span className="text-sm font-bold tracking-widest uppercase flex items-center gap-1 transition-opacity group-hover:opacity-70" style={{ color: activeColor }}>
            {isExpanded ? 'Collapse' : 'Expand'}
            <span className="material-symbols-outlined text-lg">{isExpanded ? 'expand_less' : 'expand_more'}</span>
          </span>
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-2 pb-6">
                {items.map(item => renderServiceItem(item, isDeal))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen pt-24 pb-40 flex-grow overflow-x-hidden">
      <main className="max-w-screen-md mx-auto px-4 md:px-10">
        
        <header className="mb-12 md:mb-16">
          <h1 className="font-headline text-4xl md:text-5xl text-on-surface mb-2">Book your appointment</h1>
        </header>

        <div className="space-y-2">
          {deals.length > 0 && renderCategoryAccordion('Exclusive Packages', deals, true)}
          {categories.map(category => {
            const categoryServices = services.filter(s => s.category === category);
            return renderCategoryAccordion(category, categoryServices, false);
          })}
        </div>
      </main>

      {/* Responsive Sticky Bottom Summary (CART) */}
      <AnimatePresence>
        {bookingData.cart.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 w-full z-[60] bg-surface border-t border-outline shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
          >
            <div className="max-w-screen-xl mx-auto px-4 md:px-10 py-4 md:py-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-8">
                
                <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white shrink-0 font-bold" style={{ backgroundColor: activeColor }}>
                    {bookingData.cart.length}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant block">Your Selection</span>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          clearBooking();
                        }}
                        className="text-xs font-medium text-red-500 hover:text-red-600 uppercase tracking-wider"
                      >
                        Clear All
                      </button>
                    </div>
                    <h4 className="font-headline text-lg text-on-surface truncate max-w-[200px] md:max-w-md mt-1">
                      {bookingData.cart.map(i => i.name).join(' + ')}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 border-outline pt-4 sm:pt-0">
                  <div className="flex flex-col text-left sm:text-right">
                    <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Total</span>
                    <span className="font-headline text-2xl text-on-surface">${totalPrice.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={handleContinue}
                    className="premium-btn px-8 py-3 w-full sm:w-auto whitespace-nowrap"
                  >
                    Continue
                  </button>
                </div>
                
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


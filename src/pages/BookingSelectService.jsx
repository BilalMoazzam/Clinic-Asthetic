import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { useStore } from '../store/useStore';
import BookingProgressBar from '../components/BookingProgressBar';

export default function BookingSelectService() {
  const navigate = useNavigate();
  const { bookingData, addToCart, removeFromCart } = useBooking();
  const { services, deals, fetchServices, fetchDeals, settings } = useStore();

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

  const handleContinue = () => {
    if (bookingData.cart.length > 0) {
      navigate('/book/time');
    }
  };

  const featuredDeals = deals.slice(0, 3);
  const aLaCarte = services;
  const totalPrice = bookingData.cart.reduce((sum, item) => sum + item.price, 0);
  const activeColor = settings.primaryAccent || 'var(--primary)';

  return (
    <div className="bg-surface text-on-surface min-h-screen pt-24 pb-40 flex-grow overflow-x-hidden">
      <main className="max-w-screen-xl mx-auto px-4 md:px-10">
        
        <header className="text-center mb-12 md:mb-16">
          <h1 className="font-headline text-4xl md:text-5xl text-on-surface mb-4">Select Services</h1>
          <p className="text-lg text-on-surface-variant font-light max-w-2xl mx-auto">
            Choose from our specialized packages or build your custom treatment plan.
          </p>
        </header>

        <div className="mb-12 max-w-3xl mx-auto">
          <BookingProgressBar currentStep={1} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Packages & Deals */}
          <section className="lg:col-span-7 space-y-8">
            <h2 className="font-headline text-3xl text-on-surface">Special Packages</h2>

            {featuredDeals.length > 0 ? (
              <div className="space-y-6">
                {/* Main Deal */}
                <div 
                  onClick={() => handleToggleDeal(featuredDeals[0])}
                  className={`editorial-card group overflow-hidden cursor-pointer transition-shadow ${bookingData.cart.find(i => i.id === `deal_${featuredDeals[0].id}`) ? 'ring-2' : ''}`}
                  style={{ ringColor: bookingData.cart.find(i => i.id === `deal_${featuredDeals[0].id}`) ? activeColor : 'transparent' }}
                >
                  <div className="relative h-64 md:h-80 w-full overflow-hidden">
                    <img alt={featuredDeals[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={featuredDeals[0].image}/>
                    <div className="absolute inset-0 bg-black/20"></div>
                    {bookingData.cart.find(i => i.id === `deal_${featuredDeals[0].id}`) && (
                      <div className="absolute top-4 right-4 bg-white rounded-full p-1 shadow-md z-20">
                        <span className="material-symbols-outlined text-2xl" style={{ color: activeColor }}>check_circle</span>
                      </div>
                    )}
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <span className="bg-white text-on-surface text-xs font-bold px-3 py-1 rounded uppercase tracking-widest mb-3 inline-block shadow-sm">
                        {featuredDeals[0].tag || 'EXCLUSIVE'}
                      </span>
                      <div className="flex justify-between items-end">
                        <div>
                          <h3 className="font-headline text-3xl md:text-4xl mb-2 shadow-sm">{featuredDeals[0].title}</h3>
                          <p className="font-light text-white/90 line-clamp-1">{featuredDeals[0].description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="block font-medium text-3xl mb-1">${featuredDeals[0].discountPrice}</span>
                          <span className="block text-xs uppercase tracking-wider">{featuredDeals[0].duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Deals */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {featuredDeals.slice(1, 3).map(deal => {
                    const isSelected = bookingData.cart.find(i => i.id === `deal_${deal.id}`);
                    return (
                      <div 
                        key={deal.id}
                        onClick={() => handleToggleDeal(deal)}
                        className={`editorial-card p-6 md:p-8 cursor-pointer transition-shadow hover:shadow-md ${isSelected ? 'ring-2' : ''}`}
                        style={{ ringColor: isSelected ? activeColor : 'transparent' }}
                      >
                        <div className="flex justify-between mb-4">
                          <span className="material-symbols-outlined text-2xl transition-colors" style={{ color: isSelected ? activeColor : 'var(--outline)' }}>
                            {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          <span className="font-medium text-xl text-on-surface">${deal.discountPrice}</span>
                        </div>
                        <h4 className="font-headline text-xl mb-3 text-on-surface">{deal.title}</h4>
                        <p className="text-sm text-on-surface-variant font-light mb-6 line-clamp-2">{deal.description}</p>
                        <div className="flex items-center text-xs font-semibold text-on-surface-variant uppercase tracking-widest mt-auto">
                          <span className="material-symbols-outlined text-sm mr-2">schedule</span>
                          {deal.duration}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-10 text-on-surface-variant italic font-light">Loading packages...</div>
            )}
          </section>

          {/* Right: A La Carte */}
          <section className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <h2 className="font-headline text-3xl text-on-surface mb-6">Individual Services</h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {aLaCarte.length > 0 ? aLaCarte.map(item => {
                  const isSelected = bookingData.cart.find(i => i.id === `service_${item.id}`);
                  return (
                    <div 
                      key={item.id}
                      onClick={() => handleToggleService(item)}
                      className={`flex items-center p-5 bg-white border cursor-pointer transition-colors rounded-xl ${isSelected ? 'border-transparent shadow-sm' : 'border-outline hover:border-gray-300 hover:shadow-sm'}`}
                      style={{ 
                        borderColor: isSelected ? activeColor : '',
                        backgroundColor: isSelected ? `${activeColor}10` : 'white'
                      }}
                    >
                      <div className="mr-4">
                         <span className="material-symbols-outlined text-xl" style={{ color: isSelected ? activeColor : 'var(--outline)' }}>
                            {isSelected ? 'check_box' : 'check_box_outline_blank'}
                         </span>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-headline text-lg text-on-surface mb-1">{item.title}</h4>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{item.category}</span>
                          <span className="w-1 h-1 bg-outline rounded-full"></span>
                          <span className="text-xs font-medium text-on-surface-variant">{item.duration}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="block font-medium text-lg text-on-surface">${item.price}</span>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="py-10 text-on-surface-variant italic font-light">Loading individual services...</div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Responsive Sticky Bottom Summary (CART) */}
      <AnimatePresence>
        {bookingData.cart.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 w-full z-[60] bg-white border-t border-outline shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
          >
            <div className="max-w-screen-xl mx-auto px-4 md:px-10 py-4 md:py-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-8">
                
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white shrink-0 font-bold" style={{ backgroundColor: activeColor }}>
                    {bookingData.cart.length}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant block mb-1">Your Selection</span>
                    <h4 className="font-headline text-lg text-on-surface truncate max-w-[200px] md:max-w-md">
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

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useBooking } from '../context/BookingContext';

export default function ExclusiveDeals() {
  const navigate = useNavigate();
  const { deals, fetchDeals, settings } = useStore();
  const { addToCart } = useBooking();

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const handleSelectDeal = (deal) => {
    addToCart({
      id: `deal_${deal.id}`,
      name: deal.title,
      price: Number(deal.discountPrice),
      image: deal.image,
      duration: deal.duration,
      type: 'deal'
    });
    navigate('/book/time');
  };

  const activeColor = settings.primaryAccent || 'var(--primary)';

  return (
    <div className="bg-surface min-h-screen pt-24 pb-32 px-4 md:px-10">
      <div className="max-w-screen-xl mx-auto">
        
        {/* Header */}
        <header className="text-center mb-16 md:mb-24">
          <h1 className="text-4xl md:text-6xl font-headline mb-6 text-on-surface">Exclusive Offers</h1>
          <div className="w-16 h-1 mx-auto mb-8" style={{ backgroundColor: activeColor }}></div>
          <p className="text-lg md:text-xl text-on-surface-variant font-light max-w-2xl mx-auto">
            Discover our specially curated packages and seasonal promotions designed to give you the ultimate pampering experience.
          </p>
        </header>

        {/* Deals List */}
        <div className="space-y-12 md:space-y-20">
          {deals.length > 0 ? deals.map((deal, idx) => (
            <div 
              key={deal.id} 
              className="editorial-card overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className={`relative h-64 md:h-auto ${idx % 2 === 1 ? 'md:order-2' : ''}`}>
                  <img 
                    src={deal.image} 
                    alt={deal.title} 
                    className="w-full h-full object-cover absolute inset-0"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-surface px-4 py-2 text-xs font-bold uppercase tracking-widest shadow-md rounded" style={{ color: activeColor }}>
                      {deal.tag || 'Special Offer'}
                    </span>
                  </div>
                </div>
                <div className={`bg-primary p-8 md:p-12 lg:p-16 flex flex-col justify-center ${idx % 2 === 1 ? 'md:order-1' : ''}`}>
                  <span className="text-xs font-bold tracking-widest uppercase mb-4 block text-white opacity-80">
                    {deal.tag || 'Special Offer'}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-headline mb-4 text-white">{deal.title}</h2>
                  <p className="text-lg text-white opacity-90 font-light leading-relaxed mb-8">
                    {deal.description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/20">
                    <div className="flex items-center gap-4 text-white">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold tracking-wider uppercase mb-1 opacity-80">Value</span>
                        <span className="text-xl font-medium line-through opacity-80">${deal.originalPrice}</span>
                      </div>
                      <div className="w-px h-10 bg-white/20 mx-2"></div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold tracking-wider uppercase mb-1">Now</span>
                        <span className="text-3xl font-headline">${deal.discountPrice}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleSelectDeal(deal)}
                      className="bg-transparent border border-white text-white hover:bg-white hover:text-black font-bold uppercase tracking-widest text-xs px-8 py-3 rounded transition-colors w-full sm:w-auto"
                    >
                      Book This Deal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center text-on-surface-variant text-xl font-light">Loading special offers...</div>
          )}
        </div>
      </div>
    </div>
  );
}


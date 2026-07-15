import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useBooking } from '../context/BookingContext';

export default function ServicesCatalog() {
  const navigate = useNavigate();
  const { services, fetchServices, settings } = useStore();
  const { addToCart, bookingData } = useBooking();

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleAddToCart = (service) => {
    addToCart({
      id: `service_${service.id}`,
      name: service.title,
      price: Number(service.price),
      duration: service.duration,
      image: service.image,
      type: 'service'
    });
  };

  const activeColor = settings.primaryAccent || 'var(--primary)';

  return (
    <div className="bg-surface min-h-screen pt-24 pb-32 px-4 md:px-10">
      <div className="max-w-screen-xl mx-auto">

        {/* Header */}
        <header className="text-center mb-16 md:mb-24">
          <h1 className="text-4xl md:text-6xl font-headline mb-6 text-on-surface">Our Services</h1>
          <div className="w-16 h-1 mx-auto mb-8" style={{ backgroundColor: activeColor }}></div>
          <p className="text-lg md:text-xl text-on-surface-variant font-light max-w-2xl mx-auto">
            Explore our curated menu of premium treatments, designed to rejuvenate and restore your natural beauty.
          </p>
        </header>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12" >
          {services.length > 0 ? services.map((service) => {
            const isSelected = bookingData.cart.find(i => i.id === `service_${service.id}`);
            return (
              <div
                key={service.id}
                className={`editorial-card flex flex-col group overflow-hidden ${isSelected ? 'ring-2' : ''}`}
                style={{ ringColor: isSelected ? activeColor : 'transparent' }}
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-surface px-3 py-1 rounded text-xs font-semibold tracking-widest uppercase shadow-sm" style={{ backgroundColor: 'rgb(110, 79, 90)', color: '#fff', }}>
                    {service.category}
                  </div>
                  {isSelected && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl text-white">check_circle</span>
                    </div>
                  )}
                </div>

                <div className="p-8 flex flex-col flex-grow" style={{ backgroundColor: 'rgb(134, 98, 110)' }}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-headline text-on-surface pr-4" style={{ color: '#fff', }}>{service.title}</h3>
                    <span className="text-xl font-medium" style={{ color: '#fff', }}>${service.price}</span>
                  </div>

                  <p className="text-on-surface-variant font-light mb-6 flex-grow" style={{ color: '#fff', }}>
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-outline" >
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium" style={{ color: '#fff', }}>
                      <span className="material-symbols-outlined text-base">schedule</span>
                      {service.duration}
                    </div>
                    <button
                      onClick={() => {
                        handleAddToCart(service);
                        if (!isSelected) navigate('/book');
                      }}
                      className="text-sm font-bold tracking-wider uppercase transition-colors hover:opacity-80 px-3 py-3  rounded-lg"
                      style={{ backgroundColor: 'rgb(110, 79, 90)', color: '#fff', }}
                    >
                      {isSelected ? 'Added to Cart' : 'Book Now'}
                    </button>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="col-span-full py-20 text-center text-on-surface-variant text-xl font-light">Loading our service menu...</div>
          )}
        </div>
      </div>

      {/* Floating Cart Button */}
      {bookingData.cart.length > 0 && (
        <div className="fixed bottom-8 right-8 z-[100]">
          <button
            onClick={() => navigate('/book')}
            className="flex items-center gap-3 px-8 py-4 rounded shadow-2xl text-white font-semibold tracking-wider uppercase text-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: activeColor }}
          >
            <span>Proceed to Booking ({bookingData.cart.length})</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  );
}


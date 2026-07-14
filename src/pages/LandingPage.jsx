import { useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useBooking } from '../context/BookingContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { services, deals, fetchServices, fetchDeals, settings } = useStore();
  const { addToCart } = useBooking();

  useEffect(() => {
    fetchServices();
    fetchDeals();
  }, [fetchServices, fetchDeals]);

  const mainDeal = useMemo(() => deals.find(d => d.featured) || deals[0], [deals]);

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
    <div className="bg-surface text-on-surface overflow-x-hidden selection:bg-primary/20">
      
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&q=80&w=1920" 
            alt="Luxury Spa" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-sm md:text-base font-semibold tracking-widest uppercase text-white mb-6 block"
          >
            Welcome to {settings.brandName || 'VLAS'}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-headline text-white mb-8 leading-tight"
          >
            Elevate Your <br className="hidden md:block"/> Beauty Routine
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white/90 font-light mb-10 max-w-2xl mx-auto"
          >
            Experience premium aesthetic treatments in a serene environment designed for your absolute relaxation.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link 
              to="/book" 
              className="inline-block bg-white text-on-surface px-10 py-4 rounded font-semibold tracking-wider uppercase hover:bg-surface-container transition-colors shadow-lg text-sm"
            >
              Book Your Appointment
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 px-4 md:px-10 bg-surface-container">
        <div className="max-w-screen-2xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-headline mb-4">Our Services</h2>
            <div className="w-16 h-1 mx-auto mb-6" style={{ backgroundColor: activeColor }}></div>
            <p className="text-on-surface-variant max-w-2xl mx-auto">
              Discover our range of premium treatments tailored to enhance your natural beauty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {services.length > 0 ? services.filter(s => s.featured).slice(0, 3).map((service) => (
              <div key={service.id} className="editorial-card group overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-primary px-3 py-1 rounded text-xs font-semibold tracking-widest uppercase shadow-sm text-white">
                    {service.category}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-headline mb-3 text-on-surface">{service.title}</h3>
                  <p className="text-on-surface-variant font-light mb-6 line-clamp-2">
                    {service.description || "A premium treatment designed to rejuvenate and restore your natural glow."}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-lg">${service.price}</span>
                    <Link 
                      to="/services" 
                      className="text-sm font-semibold tracking-wide uppercase hover:opacity-80 transition-opacity"
                      style={{ color: activeColor }}
                    >
                      Learn More →
                    </Link>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-12 text-center text-on-surface-variant">Loading our signature treatments...</div>
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/services" className="premium-btn inline-block">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 px-4 md:px-10">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl md:text-5xl font-headline mb-6">Our Approach</h2>
            <div className="w-16 h-1 mb-8" style={{ backgroundColor: activeColor }}></div>
            <p className="text-lg text-on-surface-variant font-light leading-relaxed mb-6">
              At {settings.brandName || 'VLAS'}, we believe that beauty is personal. Our experienced team combines advanced techniques with premium products to deliver results that enhance your unique features.
            </p>
            <p className="text-lg text-on-surface-variant font-light leading-relaxed mb-10">
              Step into our relaxing sanctuary and let us take care of the rest. Every treatment is a personalized experience designed for your ultimate comfort and satisfaction.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <span className="text-4xl font-headline block mb-2" style={{ color: activeColor }}>10+</span>
                <span className="text-sm font-semibold tracking-widest uppercase text-on-surface-variant">Years Exp.</span>
              </div>
              <div>
                <span className="text-4xl font-headline block mb-2" style={{ color: activeColor }}>5k+</span>
                <span className="text-sm font-semibold tracking-widest uppercase text-on-surface-variant">Happy Clients</span>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
             <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-xl">
                <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1200" alt="Spa Interior" className="w-full h-full object-cover"/>
             </div>
          </div>
        </div>
      </section>

      {/* Featured Deal */}
      {mainDeal && (
        <section className="py-16 md:py-24 px-4 md:px-10 bg-surface-container relative overflow-hidden">
          <div className="max-w-screen-xl mx-auto">
            <div className="bg-primary text-white rounded-2xl overflow-hidden shadow-lg grid grid-cols-1 md:grid-cols-2 items-center">
              <div className="aspect-square md:aspect-auto md:h-full relative">
                <img 
                  src={mainDeal.image} 
                  alt={mainDeal.title} 
                  className="w-full h-full object-cover absolute inset-0"
                />
              </div>
              <div className="p-10 md:p-16 text-center md:text-left">
                <span className="text-xs font-bold tracking-widest uppercase mb-4 block text-white opacity-80">Special Offer</span>
                <h2 className="text-4xl md:text-5xl font-headline mb-6 text-white">{mainDeal.title}</h2>
                <p className="text-lg text-white/90 font-light mb-8">
                  {mainDeal.description}
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-10">
                  <button 
                    onClick={() => handleSelectDeal(mainDeal)} 
                    className="premium-btn w-full sm:w-auto" 
                  >
                    Book This Deal
                  </button>
                  <div className="flex flex-col items-center sm:items-start">
                    <span className="text-sm text-white/80 line-through mb-1">${mainDeal.price}</span>
                    <span className="text-3xl font-headline text-white">${mainDeal.discountPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonial */}
      <section className="py-20 md:py-32 px-4 border-y border-outline bg-primary">
        <div className="max-w-screen-md mx-auto text-center">
          <div className="mb-8">
            {[1,2,3,4,5].map(i => (
              <span key={i} className="material-symbols-outlined text-2xl mx-1 text-white">star</span>
            ))}
          </div>
          <h3 className="text-2xl md:text-4xl font-headline leading-relaxed text-white mb-8">
            "The most relaxing and professional experience I've ever had. My skin has never looked better. Highly recommend to anyone looking for premium care."
          </h3>
          <p className="text-sm font-semibold tracking-widest uppercase text-white/80">
            — Sarah M.
          </p>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 md:py-32 px-4 bg-surface text-center">
        <div className="max-w-screen-sm mx-auto">
          <h2 className="text-4xl md:text-5xl font-headline mb-6">Stay Connected</h2>
          <p className="text-on-surface-variant font-light mb-10 text-lg">
            Subscribe to our newsletter for exclusive offers, beauty tips, and updates on new services.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center" onSubmit={(e) => e.preventDefault()}>
            <input 
              className="input-editorial flex-grow max-w-sm sm:max-w-none !py-4 !text-base !font-normal" 
              placeholder="Enter your email address" 
              type="email"
              required
            />
            <button className="premium-btn whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}


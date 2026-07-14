import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useBooking } from '../context/BookingContext';

export default function VelvetLuxe() {
  const navigate = useNavigate();
  const { settings, addCustomer } = useStore();
  const { addToCart } = useBooking();

  const handleJoinWaitlist = async () => {
    const email = prompt("Enter your email for the VIP waitlist:");
    if (!email) return;
    
    await addCustomer({
      name: "Waitlist Member",
      email: email,
      phone: "Not Provided",
      tier: "Waitlist"
    });
    alert('Thank you. Your email has been added to our VIP waitlist.');
  };

  const handleApply = async (tier) => {
    addToCart({
      id: `membership_${tier.name.toLowerCase()}`,
      name: `Membership: ${tier.name}`,
      price: tier.priceNumeric,
      duration: '1 Year',
      image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&q=80&w=1200",
      type: 'membership'
    });
    navigate('/book/time');
  };

  const tiers = [
    {
      name: "Gold Member",
      price: "$2,500 / year",
      priceNumeric: 2500,
      features: ["Priority Booking Access", "Bi-Monthly Signature Facials", "Complimentary Skin Analysis", "10% off all retail products"]
    },
    {
      name: "Platinum Member",
      price: "$5,000 / year",
      priceNumeric: 5000,
      features: ["All Gold Benefits", "Unlimited Priority Booking", "Monthly Premium Treatments", "VIP Lounge Access"]
    }
  ];

  const activeColor = settings.primaryAccent || 'var(--primary)';

  return (
    <div className="bg-surface min-h-screen pt-24 pb-32 px-4 md:px-10">
      
      {/* Hero Section */}
      <section className="max-w-screen-xl mx-auto text-center mb-24">
        <span className="text-sm font-semibold tracking-widest uppercase mb-6 block text-on-surface-variant">
          Elevate Your Experience
        </span>
        <h1 className="text-4xl md:text-6xl font-headline mb-8 text-on-surface">
          VIP Memberships
        </h1>
        <div className="w-16 h-1 mx-auto mb-8" style={{ backgroundColor: activeColor }}></div>
        <p className="text-lg md:text-xl text-on-surface-variant font-light leading-relaxed max-w-3xl mx-auto mb-10">
          Join our exclusive membership program to receive priority access, dedicated care, and curated treatments tailored specifically for your wellness journey.
        </p>
        <button 
          onClick={handleJoinWaitlist}
          className="premium-btn px-10 py-4"
        >
          Join The Waitlist
        </button>
      </section>

      {/* Philosophy Section */}
      <section className="bg-surface-container py-16 md:py-24 px-4 md:px-10 rounded-2xl max-w-screen-xl mx-auto mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-headline mb-8 text-on-surface">The Standard of <br className="hidden lg:block"/> Excellence</h2>
            <p className="text-lg text-on-surface-variant font-light leading-relaxed mb-10">
              Membership at {settings.brandName || 'VLAS'} is more than just access; it's a commitment to your long-term aesthetic and wellness goals. We provide a sanctuary where your care is prioritized.
            </p>
            <div className="space-y-8">
              {[
                { title: "Personalized Care", desc: "Treatments tailored to your unique skin profile and wellness goals." },
                { title: "Exclusive Access", desc: "Early access to new treatments, private events, and exclusive product lines." },
                { title: "Dedicated Concierge", desc: "A personal coordinator to manage your appointments and aesthetic journey." }
              ].map((benefit, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="mt-1">
                    <span className="material-symbols-outlined text-3xl" style={{ color: activeColor }}>verified</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-headline mb-2 text-on-surface">
                       {benefit.title}
                    </h4>
                    <p className="text-on-surface-variant font-light text-base">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="aspect-[4/5] overflow-hidden rounded-xl shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1200" 
              alt="VIP Lounge" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Tiered Membership */}
      <section className="max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-headline mb-4">Membership Tiers</h2>
          <p className="text-on-surface-variant font-light text-lg">Choose the level of care that best fits your lifestyle.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <div 
              key={i} 
              className="bg-surface border border-outline p-8 md:p-12 flex flex-col rounded-2xl shadow-sm hover:shadow-xl transition-shadow"
            >
              <div className="text-center mb-10">
                <h3 className="text-3xl font-headline mb-4 text-on-surface">
                   {tier.name}
                </h3>
                <span className="text-2xl font-medium" style={{ color: activeColor }}>{tier.price}</span>
              </div>
              
              <ul className="space-y-6 mb-12 flex-grow">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-4 text-on-surface-variant font-light">
                    <span className="material-symbols-outlined text-xl shrink-0 mt-0.5" style={{ color: activeColor }}>check_circle</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => handleApply(tier)}
                className="premium-btn w-full py-4 mt-auto"
              >
                Apply for {tier.name}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


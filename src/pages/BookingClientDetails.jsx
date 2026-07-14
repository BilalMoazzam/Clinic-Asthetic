import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { useStore } from '../store/useStore';
import BookingProgressBar from '../components/BookingProgressBar';

export default function BookingClientDetails() {
  const navigate = useNavigate();
  const { bookingData, updateClient, updateVoucher, removeFromCart } = useBooking();
  const { validateVoucher, fetchVouchers, settings } = useStore();

  const [formData, setFormData] = useState({
    firstName: bookingData.client?.firstName || '',
    lastName: bookingData.client?.lastName || '',
    phone: bookingData.client?.phone || '',
    email: bookingData.client?.email || ''
  });

  const [voucherCode, setVoucherCode] = useState('');
  const [voucherError, setVoucherError] = useState('');

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  // Real-time persistence
  useEffect(() => {
    const timer = setTimeout(() => {
      updateClient(formData);
    }, 500);
    return () => clearTimeout(timer);
  }, [formData, updateClient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Phone: only allow digits, max 10 after +92
  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, phone: digits }));
  };

  const handleApplyVoucher = () => {
    const voucher = validateVoucher(voucherCode);
    if (voucher) {
      updateVoucher(voucher);
      setVoucherError('');
    } else {
      setVoucherError('Invalid voucher code.');
      updateVoucher(null);
    }
  };

  const handleContinue = (e) => {
    if (e) e.preventDefault();
    if (formData.firstName && formData.email) {
      updateClient(formData);
      navigate('/book/confirm');
    } else {
      alert("Please provide at least your first name and email.");
    }
  };

  const basePrice = bookingData.cart.reduce((sum, item) => sum + item.price, 0);
  let discount = 0;
  if (bookingData.voucher) {
    if (bookingData.voucher.type === 'Percentage') {
      discount = (basePrice * Number(bookingData.voucher.value)) / 100;
    } else {
      discount = Number(bookingData.voucher.value);
    }
  }
  const totalPrice = Math.max(0, basePrice - discount);
  const activeColor = settings.primaryAccent || 'var(--primary)';

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-40 overflow-x-hidden pt-24">
      <main className="max-w-screen-xl mx-auto px-4 md:px-10">
        
        <header className="text-center mb-12 md:mb-16">
          <h1 className="font-headline text-4xl md:text-5xl text-on-surface mb-4">Your Details</h1>
          <p className="text-lg text-on-surface-variant font-light max-w-2xl mx-auto">
            Please provide your information to complete the booking.
          </p>
        </header>

        <div className="mb-16 max-w-3xl mx-auto">
          <BookingProgressBar currentStep={3} />
        </div>

        <div className="flex flex-col lg:flex-row lg:gap-16 items-start">
          {/* Form Side */}
          <div className="w-full lg:flex-1 max-w-3xl">
            <div className="bg-surface p-8 md:p-12 border border-outline rounded-2xl shadow-sm mb-8">
              <h2 className="text-2xl font-headline mb-8">Client Information</h2>
              
              <form className="space-y-8" onSubmit={handleContinue}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div>
                    <label className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant mb-2 block">First Name *</label>
                    <input 
                      required 
                      name="firstName" 
                      value={formData.firstName} 
                      onChange={handleChange} 
                      autoComplete="given-name"
                      className="w-full bg-surface border border-outline focus:border-primary rounded-lg py-3 px-4 text-on-surface outline-none transition-colors" 
                      placeholder="Jane" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant mb-2 block">Last Name *</label>
                    <input 
                      required 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleChange} 
                      autoComplete="family-name"
                      className="w-full bg-surface border border-outline focus:border-primary rounded-lg py-3 px-4 text-on-surface outline-none transition-colors" 
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div>
                    <label className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant mb-2 block">Phone Number *</label>
                    <div className="flex w-full bg-surface border border-outline focus-within:border-gray-400 rounded-lg overflow-hidden transition-colors">
                      <span className="flex items-center px-4 py-3 font-semibold text-on-surface border-r border-outline bg-surface-container shrink-0 select-none">+92</span>
                      <input 
                        required
                        inputMode="numeric"
                        name="phone"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        autoComplete="tel"
                        maxLength={10}
                        className="flex-1 bg-transparent py-3 px-3 text-on-surface outline-none"
                        placeholder="3XXXXXXXXX"
                      />
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1 opacity-70">Format: +92 3XXXXXXXXX (10 digits)</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant mb-2 block">Email Address *</label>
                    <input 
                      required 
                      type="email"
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      autoComplete="email"
                      className="w-full bg-surface border border-outline focus:border-primary rounded-lg py-3 px-4 text-on-surface outline-none transition-colors" 
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="bg-surface p-8 border border-outline rounded-2xl shadow-sm">
              <h3 className="text-xl font-headline mb-4">Promo Code or Gift Card</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  className="flex-grow bg-surface border border-outline focus:border-primary rounded-lg py-3 px-4 text-sm outline-none transition-colors" 
                  placeholder="Enter code" 
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                />
                <button 
                  className="premium-btn px-8 py-3 whitespace-nowrap" 
                  type="button"
                  onClick={handleApplyVoucher}
                >
                  Apply Code
                </button>
              </div>
              <AnimatePresence>
                {voucherError && <p className="text-red-500 text-sm mt-3">{voucherError}</p>}
                {bookingData.voucher && (
                  <div className="mt-3 flex items-center gap-2 text-sm font-medium" style={{ color: activeColor }}>
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    Voucher Applied: {bookingData.voucher.code}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar Summary */}
          <aside className="w-full lg:w-[400px] shrink-0 mt-8 lg:mt-0">
            <div className="bg-surface border border-outline rounded-2xl shadow-md lg:sticky lg:top-24 overflow-hidden">
              <div className="p-6 md:p-8 bg-surface-container">
                <h3 className="text-xl font-headline mb-6">Booking Summary</h3>

                <div className="space-y-4 mb-6 pb-6 border-b border-outline">
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-xl">event</span>
                    <span className="text-sm font-medium">{bookingData.date || 'TBD'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-xl">schedule</span>
                    <span className="text-sm font-medium">{bookingData.time || 'TBD'}</span>
                  </div>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {bookingData.cart.map((item) => (
                    <div key={item.id} className="flex gap-4 items-start">
                      <div className="w-16 h-16 bg-surface rounded-lg overflow-hidden shrink-0 border border-outline">
                        <img alt={item.name} className="w-full h-full object-cover" src={item.image}/>
                      </div>
                      <div className="min-w-0 flex-grow">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-headline text-sm text-on-surface leading-tight">
                            {item.name}
                          </h4>
                          <button onClick={() => removeFromCart(item.id)} className="text-on-surface-variant hover:text-red-500 shrink-0">
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mt-1 block">{item.type}</span>
                        <span className="text-sm font-medium text-on-surface mt-1 block">${item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span className="font-medium text-on-surface">${basePrice.toFixed(2)}</span>
                </div>
                {bookingData.voucher && (
                  <div className="flex justify-between items-center text-sm" style={{ color: activeColor }}>
                    <span>Discount</span>
                    <span className="font-medium">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-end border-t border-outline pt-4 mt-2">
                  <span className="font-headline text-xl">Total</span>
                  <span className="font-headline text-3xl text-on-surface">${totalPrice.toFixed(2)}</span>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={handleContinue}
                    className="premium-btn w-full py-4 text-sm"
                  >
                    Review Booking
                  </button>
                </div>
                
                <div className="pt-4 text-center">
                   <button 
                     onClick={() => navigate('/book/time')} 
                     className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant hover:text-on-surface transition-colors inline-flex items-center"
                   >
                     <span className="material-symbols-outlined text-sm mr-2">arrow_back</span>
                     Back to Time Selection
                   </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}


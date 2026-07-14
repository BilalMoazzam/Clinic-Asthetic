import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { useStore } from '../store/useStore';
import BookingProgressBar from '../components/BookingProgressBar';

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const { bookingData, clearBooking } = useBooking();
  const { addBooking, addCustomer, settings } = useStore();

  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (hasSubmitted.current) return;
    
    if (bookingData.cart.length > 0 && bookingData.date) {
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

      const newBooking = {
        cartItems: bookingData.cart,
        serviceName: bookingData.cart.map(i => i.name).join(' + '),
        clientDetails: {
          name: `${bookingData.client.firstName} ${bookingData.client.lastName}`,
          email: bookingData.client.email,
          phone: bookingData.client.phone
        },
        date: bookingData.date,
        time: bookingData.time,
        totalPrice: totalPrice,
        voucherCode: bookingData.voucher?.code || null,
        status: 'pending'
      };
      
      addBooking(newBooking);
      
      addCustomer({
        name: `${bookingData.client.firstName} ${bookingData.client.lastName}`,
        email: bookingData.client.email,
        phone: bookingData.client.phone,
        tier: 'Elite'
      });

      // Clear localStorage immediately so next booking starts fresh
      localStorage.removeItem('vlasBookingData');
      
      hasSubmitted.current = true;
    }
  }, [bookingData, addBooking, addCustomer]);

  const handleDone = () => {
    clearBooking();
    navigate('/');
  };

  const activeColor = settings.primaryAccent || 'var(--primary)';

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-40 overflow-x-hidden pt-24">
      <main className="max-w-screen-xl mx-auto px-4 md:px-10">
        
        <div className="mb-12 max-w-3xl mx-auto">
          <BookingProgressBar currentStep={4} />
        </div>

        {/* Status Area */}
        <section className="mb-20 text-center max-w-4xl mx-auto px-4">
          <div className="relative inline-block mb-10">
            <div 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-surface flex items-center justify-center border shadow-md mx-auto"
              style={{ color: activeColor, borderColor: `${activeColor}22` }}
            >
              <span className="material-symbols-outlined text-5xl md:text-6xl">check_circle</span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-headline mb-6">Booking Confirmed</h2>
          <p className="text-lg text-on-surface-variant font-light mb-12">
            Thank you, {bookingData.client?.firstName || 'Guest'}. Your appointment has been successfully scheduled.
          </p>
          
          {/* Confirmed Sequence Overview */}
          <div className="max-w-2xl mx-auto mb-16 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bookingData.cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-surface border border-outline rounded-xl shadow-sm">
                  <div className="w-12 h-12 rounded overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 text-left">
                    <h4 className="text-sm font-semibold truncate text-on-surface">{item.name}</h4>
                    <span className="text-xs text-on-surface-variant">{item.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-outline rounded-2xl shadow-sm p-8 max-w-2xl mx-auto text-left mb-12">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-outline pb-4">
                <span className="text-on-surface-variant font-medium">Date & Time</span>
                <span className="font-semibold text-on-surface">{bookingData.date} at {bookingData.time}</span>
              </div>
              <div className="flex justify-between items-center border-b border-outline pb-4">
                <span className="text-on-surface-variant font-medium">Email</span>
                <span className="text-on-surface font-light">{bookingData.client?.email}</span>
              </div>
              <p className="text-sm text-on-surface-variant pt-2 leading-relaxed">
                A confirmation email with your booking details and arrival instructions has been sent.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => {
                const date = bookingData.date;
                const time = bookingData.time || '09:00 AM';
                const serviceName = bookingData.cart?.map(i => i.name).join(' + ') || 'VLAS Appointment';
                const [timeStr, modifier] = time.split(' ');
                const [h, m] = timeStr.split(':').map(Number);
                let hour = h;
                if (modifier === 'PM' && h !== 12) hour += 12;
                if (modifier === 'AM' && h === 12) hour = 0;
                const startDate = new Date(date);
                startDate.setHours(hour, m || 0, 0, 0);
                const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
                const fmt = (d) => d.toISOString().replace(/-|:|\.\d{3}/g, '');
                const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(serviceName)}&dates=${fmt(startDate)}/${fmt(endDate)}&details=${encodeURIComponent('Appointment at VLAS AESTHETIC')}`;
                window.open(url, '_blank');
              }}
              className="premium-btn px-8 py-3 flex items-center justify-center gap-3 w-full sm:w-auto"
            >
              <span className="material-symbols-outlined text-sm">calendar_add_on</span>
              Add to Calendar
            </button>
            <button 
              onClick={handleDone}
              className="text-sm font-semibold tracking-wider text-on-surface-variant uppercase hover:text-on-surface transition-colors py-3 w-full sm:w-auto"
            >
              Return to Home
            </button>
          </div>
        </section>

        {/* Final Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-surface p-8 border border-outline rounded-xl shadow-sm text-center md:text-left">
            <span className="material-symbols-outlined mb-4 text-3xl" style={{ color: activeColor }}>location_on</span>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant mb-2">Location</h4>
            <p className="text-base text-on-surface">123 Aesthetic Avenue<br/>Suite 400</p>
          </div>
          <div className="bg-surface p-8 border border-outline rounded-xl shadow-sm text-center md:text-left">
            <span className="material-symbols-outlined mb-4 text-3xl" style={{ color: activeColor }}>info</span>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant mb-2">Arrival</h4>
            <p className="text-base text-on-surface">Please arrive 15 minutes prior to your appointment time.</p>
          </div>
          <div className="bg-surface p-8 border border-outline rounded-xl shadow-sm text-center md:text-left">
            <span className="material-symbols-outlined mb-4 text-3xl" style={{ color: activeColor }}>call</span>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant mb-2">Questions?</h4>
            <p className="text-base text-on-surface">+1 (555) 000-0000<br/>contact@vlas.com</p>
          </div>
        </div>

      </main>
    </div>
  );
}


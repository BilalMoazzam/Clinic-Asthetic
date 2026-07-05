import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { useStore } from '../store/useStore';
import BookingProgressBar from '../components/BookingProgressBar';

export default function BookingTimeSelect() {
  const navigate = useNavigate();
  const { bookingData, updateDateTime, removeFromCart } = useBooking();
  const { settings, fetchSettings, bookings, fetchBookings } = useStore();
  const [selectedDate, setSelectedDate] = useState(bookingData.date || '');
  const [selectedTime, setSelectedTime] = useState(bookingData.time || '');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchSettings();
    fetchBookings();
  }, [fetchSettings, fetchBookings]);

  const bookedSlots = useMemo(() => {
    return bookings
      .filter(b => b.date === selectedDate && b.status !== 'cancelled' && !b.isFake)
      .map(b => b.time);
  }, [bookings, selectedDate]);

  const bookingWindow = parseInt(settings.bookingWindow) || 60;
  const bufferTime = typeof settings.bufferTime !== 'undefined' ? parseInt(settings.bufferTime) : 10;

  // Redirect if cart is empty to prevent invalid state
  useEffect(() => {
    if (!bookingData.cart || bookingData.cart.length === 0) {
      navigate('/book');
    }
  }, [bookingData.cart, navigate]);

  const parseDuration = (durStr) => {
    if (!durStr) return 60;
    const str = durStr.toString().toLowerCase();
    const num = parseInt(str.replace(/[^0-9]/g, '')) || 0;
    if (str.includes('hour') || str.includes('hr')) return num * 60;
    return num || 60;
  };

  const totalServiceDuration = bookingData.cart?.reduce((sum, item) => {
    return sum + parseDuration(item.duration);
  }, 0) || 0;
  
  const slotInterval = Math.max(10, totalServiceDuration + bufferTime);

  const isDateAvailable = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + bookingWindow);
    return d >= today && d <= maxDate;
  };

  const getDaysInMonth = (date) => {
    if (!date) return { firstDay: 0, days: 30 };
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    return { firstDay, days };
  };

  const { firstDay, days } = getDaysInMonth(currentMonth);

  const generateSlots = useMemo(() => {
    if (!selectedDate || slotInterval <= 0) return [];
    const slots = [];
    const startHour = settings.workingHoursStart || '09:00 AM';
    const endHour = settings.workingHoursEnd || '08:00 PM';
    
    const parseTime = (timeStr) => {
      try {
        const parts = timeStr.split(' ');
        const time = parts[0];
        const modifier = parts[1] || 'AM';
        let [hours, minutes] = time.split(':');
        if (!hours) hours = '0';
        if (hours === '12' && modifier === 'AM') hours = '0';
        if (modifier === 'PM' && hours !== '12') hours = parseInt(hours, 10) + 12;
        return { hours: parseInt(hours), minutes: parseInt(minutes) || 0 };
      } catch (e) {
        return { hours: 9, minutes: 0 };
      }
    };

    const start = parseTime(startHour);
    const end = parseTime(endHour);

    const current = new Date(selectedDate);
    current.setHours(start.hours, start.minutes, 0, 0);
    
    const endTime = new Date(selectedDate);
    endTime.setHours(end.hours, end.minutes, 0, 0);

    const now = new Date();
    const isToday = new Date(selectedDate).toDateString() === now.toDateString();

    let limit = 0;
    while (current < endTime && limit < 150) { 
      const startStr = current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      slots.push({
        time: startStr,
        isPast: isToday && current <= now
      });
      current.setMinutes(current.getMinutes() + slotInterval);
      limit++;
    }
    return slots;
  }, [selectedDate, settings, slotInterval]);

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      updateDateTime(selectedDate, selectedTime);
      navigate('/book/details');
    }
  };

  const changeMonth = (offset) => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + offset);
    setCurrentMonth(next);
  };

  const activeColor = settings.primaryAccent || 'var(--primary)';

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-40 relative overflow-x-hidden pt-24">
      <main className="max-w-screen-xl mx-auto px-4 md:px-10">
        
        <header className="text-center mb-12 md:mb-16">
          <h1 className="font-headline text-4xl md:text-5xl text-on-surface mb-4">Select a Time</h1>
          <p className="text-lg text-on-surface-variant font-light max-w-2xl mx-auto">
            Choose a date and time for your appointment.
          </p>
        </header>

        <div className="mb-16 max-w-3xl mx-auto">
          <BookingProgressBar currentStep={2} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Calendar Section */}
          <div className="lg:col-span-8 bg-white p-8 md:p-12 border border-outline rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl md:text-3xl font-headline">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
              <div className="flex gap-4">
                <button onClick={() => changeMonth(-1)} className="w-10 h-10 flex items-center justify-center bg-surface-container hover:bg-outline rounded-full transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button onClick={() => changeMonth(1)} className="w-10 h-10 flex items-center justify-center bg-surface-container hover:bg-outline rounded-full transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 md:gap-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-xs font-semibold text-on-surface-variant text-center pb-4 uppercase tracking-wider">{d}</div>
              ))}
              {Array(firstDay).fill(0).map((_, i) => <div key={`empty-${i}`} />)}
              {Array(days).fill(0).map((_, i) => {
                const day = i + 1;
                const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const available = isDateAvailable(dateStr);
                const selected = selectedDate === dateStr;

                return (
                  <button
                    key={day}
                    disabled={!available}
                    onClick={() => { setSelectedDate(dateStr); setSelectedTime(''); }}
                    className={`aspect-square flex flex-col items-center justify-center transition-all duration-300 relative rounded-xl text-lg font-medium
                      ${!available ? 'opacity-20 cursor-not-allowed bg-transparent' : 'hover:bg-surface-container'}
                      ${selected ? 'text-white shadow-md' : 'text-on-surface'}
                    `}
                    style={{ backgroundColor: selected ? activeColor : '' }}
                  >
                    <span className="relative z-10">{day}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slots Section */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            <div className="bg-white p-6 md:p-8 border border-outline rounded-2xl shadow-sm">
              <h3 className="text-xl font-headline mb-4">Your Selection</h3>
              {bookingData.cart.length > 0 ? (
                <div className="space-y-3">
                  {bookingData.cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-surface border border-outline rounded-xl">
                      <div className="w-10 h-10 rounded overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-grow">
                        <h4 className="text-sm font-semibold truncate text-on-surface">{item.name}</h4>
                        <span className="text-xs text-on-surface-variant">{item.duration}</span>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-on-surface-variant hover:text-red-500 transition-colors p-1"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant">No items selected.</p>
              )}
            </div>

            <div className="bg-white p-6 md:p-8 border border-outline rounded-2xl shadow-sm flex flex-col min-h-[300px]">
              <h3 className="text-xl font-headline mb-6">Available Times</h3>
              
              <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar max-h-[350px]">
                {selectedDate ? (
                  <div className="grid grid-cols-2 gap-3">
                    {generateSlots.length > 0 ? generateSlots.map(({ time, isPast }) => {
                      const isBooked = bookedSlots.includes(time);
                      const isDisabled = isBooked || isPast;
                      const isSelected = selectedTime === time;
                      return (
                      <button
                        key={time}
                        disabled={isDisabled}
                        onClick={() => !isDisabled && setSelectedTime(time)}
                        className={`p-3 text-center transition-all border rounded-xl text-sm font-medium ${
                          isSelected ? 'text-white border-transparent shadow-md' : 'border-outline hover:border-gray-400 bg-surface text-on-surface'
                        } ${isDisabled ? 'opacity-30 line-through cursor-not-allowed bg-surface-container' : ''}`}
                        style={{ backgroundColor: isSelected ? activeColor : '' }}
                      >
                         {time}
                      </button>
                    )}) : (
                      <div className="col-span-full py-10 text-center text-on-surface-variant text-sm font-light">No availability for this date.</div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10">
                    <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-4 opacity-50">event_available</span>
                    <p className="text-sm text-on-surface-variant font-light">Choose a date to view available times.</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-outline flex justify-between items-center gap-4">
                 <button 
                   onClick={() => navigate('/book')} 
                   className="text-sm font-semibold tracking-wider text-on-surface-variant uppercase hover:text-on-surface transition-colors"
                 >
                   Back
                 </button>
                 <button 
                  onClick={handleNext}
                  disabled={!selectedDate || !selectedTime}
                  className="premium-btn px-8 py-3 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

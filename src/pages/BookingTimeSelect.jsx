import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { useStore } from '../store/useStore';
import BookingProgressBar from '../components/BookingProgressBar';

export default function BookingTimeSelect() {
  const navigate = useNavigate();
  const { bookingData, updateDateTime } = useBooking();
  const { settings, fetchSettings, bookings, fetchBookings } = useStore();
  
  // Normalize today to start of day for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const initialDateStr = bookingData.date || '';
  const initialDateObj = initialDateStr ? new Date(`${initialDateStr}T00:00:00`) : today;

  const [selectedDate, setSelectedDate] = useState(initialDateStr);
  const [selectedTime, setSelectedTime] = useState(bookingData.time || '');
  const [weekOffset, setWeekOffset] = useState(0); // number of weeks offset from current week view

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
  
  const totalPrice = bookingData.cart?.reduce((sum, item) => sum + item.price, 0) || 0;

  const slotInterval = Math.max(10, totalServiceDuration + bufferTime);

  const isDateAvailable = (d) => {
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + bookingWindow);
    return d >= today && d <= maxDate;
  };

  // Generate the 7 dates to show in the horizontal selector
  const visibleDates = useMemo(() => {
    const dates = [];
    // Base is either the initial selected date week, or just today.
    const baseDate = new Date(initialDateObj);
    baseDate.setDate(baseDate.getDate() + (weekOffset * 7));
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, [weekOffset, initialDateObj]);

  const currentMonthDisplay = visibleDates.length > 0 ? visibleDates[0].toLocaleString('default', { month: 'long', year: 'numeric' }) : '';

  const generateSlots = useMemo(() => {
    if (!selectedDate || slotInterval <= 0) return { morning: [], afternoon: [] };
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

    const current = new Date(`${selectedDate}T00:00:00`);
    current.setHours(start.hours, start.minutes, 0, 0);
    
    const endTime = new Date(`${selectedDate}T00:00:00`);
    endTime.setHours(end.hours, end.minutes, 0, 0);

    const now = new Date();
    const isToday = new Date(`${selectedDate}T00:00:00`).toDateString() === now.toDateString();

    let limit = 0;
    const morningSlots = [];
    const afternoonSlots = [];

    while (current < endTime && limit < 150) { 
      const startStr = current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      const slotObj = {
        time: startStr,
        isPast: isToday && current <= now
      };
      if (current.getHours() < 12) {
        morningSlots.push(slotObj);
      } else {
        afternoonSlots.push(slotObj);
      }
      current.setMinutes(current.getMinutes() + slotInterval);
      limit++;
    }
    return { morning: morningSlots, afternoon: afternoonSlots };
  }, [selectedDate, settings, slotInterval]);

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      updateDateTime(selectedDate, selectedTime);
      navigate('/book/details');
    }
  };

  const activeColor = settings.primaryAccent || 'var(--primary)';

  const renderSlotButton = (slotObj) => {
    const { time, isPast } = slotObj;
    const isBooked = bookedSlots.includes(time);
    const isDisabled = isBooked || isPast;
    const isSelected = selectedTime === time;
    return (
      <button
        key={time}
        disabled={isDisabled}
        onClick={() => !isDisabled && setSelectedTime(time)}
        className={`px-4 py-2 text-center transition-all border rounded-full text-sm font-medium whitespace-nowrap ${
          isSelected ? 'text-white border-transparent shadow-md' : 'border-outline hover:border-gray-400 bg-surface text-on-surface'
        } ${isDisabled ? 'opacity-30 line-through cursor-not-allowed bg-surface' : ''}`}
        style={{ backgroundColor: isSelected ? activeColor : '' }}
      >
         {time}
      </button>
    );
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-40 overflow-x-hidden pt-24">
      <main className="max-w-screen-xl mx-auto px-4 md:px-10">

        <div className="mb-12 max-w-3xl mx-auto">
          <BookingProgressBar currentStep={2} />
        </div>

        <header className="text-center mb-12 md:mb-16">
          <h1 className="font-headline text-4xl md:text-5xl text-on-surface mb-2">Select Date & Time</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* Calendar & Slots Section */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Horizontal Date Selector */}
            <div className="bg-surface border border-outline rounded-xl overflow-hidden shadow-sm">
              {/* Header */}
              <div className="px-6 py-4 border-b border-outline flex justify-between items-center bg-surface">
                <span className="font-headline text-lg">{currentMonthDisplay}</span>
                <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">calendar_month</span>
              </div>
              
              {/* Dates */}
              <div className="px-4 py-6 flex items-center justify-between">
                <button onClick={() => setWeekOffset(weekOffset - 1)} className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                
                <div className="flex-grow flex justify-center items-center gap-2 md:gap-4 overflow-x-auto hide-scrollbar px-2">
                  {visibleDates.map(d => {
                    const isToday = d.toDateString() === today.toDateString();
                    const available = isDateAvailable(d);
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    const dateStr = `${year}-${month}-${day}`;
                    const selected = selectedDate === dateStr;

                    return (
                      <button
                        key={dateStr}
                        disabled={!available}
                        onClick={() => { setSelectedDate(dateStr); setSelectedTime(''); }}
                        className={`flex flex-col items-center gap-2 shrink-0 ${!available ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer group'}`}
                      >
                        <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                          {isToday ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                        <div 
                          className={`w-12 h-12 flex items-center justify-center rounded-full text-lg transition-all ${
                            selected ? 'text-white shadow-md' : 'text-on-surface bg-surface border border-transparent group-hover:border-outline'
                          }`}
                          style={{ backgroundColor: selected ? activeColor : '' }}
                        >
                          {d.getDate()}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button onClick={() => setWeekOffset(weekOffset + 1)} className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Slots Area */}
            {selectedDate && (
              <div className="mt-4">
                <div className="mb-6">
                   <h3 className="font-headline text-lg mb-1">
                     Availability for {new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                   </h3>
                   <p className="text-xs text-on-surface-variant">All dates and times are displayed in the location's timezone.</p>
                </div>

                {generateSlots.morning.length === 0 && generateSlots.afternoon.length === 0 ? (
                  <div className="py-10 text-on-surface-variant text-sm font-light">No availability for this date.</div>
                ) : (
                  <div className="space-y-8">
                    {/* Morning */}
                    {generateSlots.morning.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-4 text-on-surface">Morning</h4>
                        <div className="flex flex-wrap gap-3">
                          {generateSlots.morning.map(renderSlotButton)}
                        </div>
                      </div>
                    )}
                    
                    {/* Afternoon */}
                    {generateSlots.afternoon.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-4 text-on-surface">Afternoon</h4>
                        <div className="flex flex-wrap gap-3">
                          {generateSlots.afternoon.map(renderSlotButton)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar: Appointment Details */}
          <div className="lg:col-span-4">
            <div className="bg-surface border border-outline rounded-xl shadow-sm sticky top-24">
              <div className="p-6 border-b border-outline">
                <h3 className="font-headline text-xl">Appointment Details</h3>
              </div>
              <div className="p-6">
                {bookingData.cart.length > 0 ? (
                  <div className="space-y-4">
                    {bookingData.cart.map(item => (
                      <div key={item.id} className="text-on-surface font-semibold text-base mb-1">
                        {item.name}
                      </div>
                    ))}
                    
                    <div className="text-sm text-on-surface-variant space-y-1.5 mt-4 font-medium">
                      <p>
                        {selectedDate 
                          ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
                          : 'Select a Date'}
                      </p>
                      <p>{selectedTime ? selectedTime : 'Select a Time'}</p>
                      <p>{totalServiceDuration} min</p>
                      <p className="mt-4 pt-4 border-t border-outline">Starting at: ${totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-on-surface-variant">No items selected.</p>
                )}

                <div className="mt-8">
                  <button 
                    onClick={handleNext}
                    disabled={!selectedDate || !selectedTime}
                    className="premium-btn py-3 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                  <button 
                    onClick={() => navigate('/book')} 
                    className="mt-4 text-sm font-semibold tracking-wider text-on-surface-variant uppercase hover:text-on-surface transition-colors w-full text-center"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


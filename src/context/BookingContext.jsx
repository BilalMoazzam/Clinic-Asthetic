import { createContext, useContext, useState, useEffect } from 'react';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [bookingData, setBookingData] = useState(() => {
    const saved = localStorage.getItem('vlasBookingData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Robust validation to prevent crashes from legacy data structures
        return {
          cart: Array.isArray(parsed.cart) ? parsed.cart : [],
          voucher: parsed.voucher || null,
          date: parsed.date || null,
          time: parsed.time || null,
          client: parsed.client && typeof parsed.client === 'object' ? {
            firstName: parsed.client.firstName || '',
            lastName: parsed.client.lastName || '',
            email: parsed.client.email || '',
            phone: parsed.client.phone || '',
            notes: parsed.client.notes || ''
          } : {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            notes: ''
          }
        };
      } catch (e) {
        console.error("Error parsing booking data", e);
      }
    }
    return {
      cart: [],
      voucher: null,
      date: null,
      time: null,
      client: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        notes: ''
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('vlasBookingData', JSON.stringify(bookingData));
  }, [bookingData]);

  const addToCart = (item) => {
    setBookingData(prev => {
      const exists = prev.cart.find(i => i.id === item.id);
      if (exists) return prev;
      return { ...prev, cart: [...prev.cart, item] };
    });
  };

  const removeFromCart = (itemId) => {
    setBookingData(prev => ({
      ...prev,
      cart: prev.cart.filter(i => i.id !== itemId)
    }));
  };

  const updateVoucher = (voucher) => setBookingData(prev => ({ ...prev, voucher }));
  const updateDateTime = (date, time) => setBookingData(prev => ({ ...prev, date, time }));
  const updateClient = (client) => setBookingData(prev => ({ ...prev, client }));
  const clearBooking = () => setBookingData({
    cart: [],
    voucher: null,
    date: null,
    time: null,
    client: { firstName: '', lastName: '', email: '', phone: '', notes: '' }
  });

  return (
    <BookingContext.Provider value={{ 
      bookingData, 
      addToCart,
      removeFromCart,
      updateVoucher, 
      updateDateTime, 
      updateClient, 
      clearBooking 
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}

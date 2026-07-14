import { createContext, useContext, useState, useCallback } from 'react';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [bookingData, setBookingData] = useState({
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
  });

  const addToCart = useCallback((item) => {
    setBookingData(prev => {
      const exists = prev.cart.find(i => i.id === item.id);
      if (exists) return prev;
      return { ...prev, cart: [...prev.cart, item] };
    });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setBookingData(prev => ({
      ...prev,
      cart: prev.cart.filter(i => i.id !== itemId)
    }));
  }, []);

  const updateVoucher = useCallback((voucher) => setBookingData(prev => ({ ...prev, voucher })), []);
  const updateDateTime = useCallback((date, time) => setBookingData(prev => ({ ...prev, date, time })), []);
  const updateClient = useCallback((client) => setBookingData(prev => ({ ...prev, client })), []);
  const clearBooking = useCallback(() => setBookingData({
    cart: [],
    voucher: null,
    date: null,
    time: null,
    client: { firstName: '', lastName: '', email: '', phone: '', notes: '' }
  }), []);

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


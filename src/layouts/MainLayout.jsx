import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

export default function MainLayout() {
  const location = useLocation();
  const { clearBooking } = useBooking();

  useEffect(() => {
    // If the user navigates to any page outside of the booking flow, clear the booking session
    if (!location.pathname.startsWith('/book')) {
      clearBooking();
    }
  }, [location.pathname, clearBooking]);

  return (
    <>
      <TopNavBar />
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

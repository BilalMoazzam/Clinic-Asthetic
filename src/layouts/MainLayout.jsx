import { Outlet } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

export default function MainLayout() {
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

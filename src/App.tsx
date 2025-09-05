import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Reservation from './components/Reservation';
import About from './components/About';
import Fleet from './components/Fleet';
import WhyChooseUs from './components/WhyChooseUs';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CarDetailPage from './pages/CarDetailPage';
import ReservationsPage from './pages/ReservationsPage';
import CarRentalsPage from './pages/CarRentalsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handlePasswordSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Routes>
        <Route path="/" element={
          <>
            <Header />
            <Hero />
            <Reservation />
            <Fleet />
            <About />
            <WhyChooseUs />
            <Contact />
            <Footer />
          </>
        } />
        <Route path="/fleet/:carId" element={<CarDetailPage />} />
        <Route 
          path="/reservations" 
          element={
            <ProtectedRoute 
              isAuthenticated={isAuthenticated} 
              onPasswordSuccess={handlePasswordSuccess}
            >
              <ReservationsPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/car-rentals" element={<CarRentalsPage />} />
      </Routes>
    </div>
  );
}

export default App;
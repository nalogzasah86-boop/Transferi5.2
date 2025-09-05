import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Users, Luggage, Star, ArrowRight, Calculator } from 'lucide-react';
import { vehicles, formatPricingDisplay, getPricingTiers } from '../data/vehicles';

const Fleet = () => {
  const navigate = useNavigate();
  const [currentIndices, setCurrentIndices] = useState(
    vehicles.reduce((acc, vehicle) => ({ ...acc, [vehicle.id]: 0 }), {})
  );

  const nextImage = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setCurrentIndices(prev => ({
        ...prev,
        [vehicleId]: (prev[vehicleId] + 1) % vehicle.images.length
      }));
    }
  };

  const prevImage = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setCurrentIndices(prev => ({
        ...prev,
        [vehicleId]: (prev[vehicleId] - 1 + vehicle.images.length) % vehicle.images.length
      }));
    }
  };

  const setImageIndex = (vehicleId: string, index: number) => {
    setCurrentIndices(prev => ({
      ...prev,
      [vehicleId]: index
    }));
  };

  const handleBookNow = (vehicleId: string) => {
    navigate(`/fleet/${vehicleId}`);
  };

  const CarCard = ({ vehicle }) => {
    const currentIndex = currentIndices[vehicle.id] || 0;

    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Image Carousel */}
        <div className="relative h-64 lg:h-80 overflow-hidden">
          <img 
            src={vehicle.images[currentIndex]}
            alt={`${vehicle.name} - Image ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          
          {/* No Deposit Badge */}
          <div className="absolute top-4 left-4 bg-gold-500 text-black px-3 py-2 rounded-lg font-bold text-sm shadow-lg">
            Rent Without Deposit
          </div>
          
          {/* Navigation buttons */}
          <button 
            onClick={() => prevImage(vehicle.id)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => nextImage(vehicle.id)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>


          {/* Image counter */}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
            {currentIndex + 1} / {vehicle.images.length}
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center py-3 space-x-1 bg-gray-50">
          {vehicle.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setImageIndex(vehicle.id, index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-gold-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Vehicle details */}
        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-800">{vehicle.name}</h3>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
                <span className="text-sm text-gray-600">5.0</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600 mb-3">
              <span className="bg-gold-100 text-gold-700 px-2 py-1 rounded-full font-medium text-xs">
                {vehicle.category}
              </span>
              <span>{vehicle.year}</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
              {vehicle.description}
            </p>
          </div>

          {/* Quick specs */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Users className="w-4 h-4 text-gold-500 mx-auto mb-1" />
              <div className="font-bold text-gray-800 text-sm">{vehicle.passengers}</div>
              <div className="text-xs text-gray-600">Passengers</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Luggage className="w-4 h-4 text-gold-500 mx-auto mb-1" />
              <div className="font-bold text-gray-800 text-sm">{vehicle.luggage}</div>
              <div className="text-xs text-gray-600">Luggage</div>
            </div>
          </div>

          {/* Key highlights */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Features:</h4>
            <div className="space-y-1">
              {vehicle.highlights.slice(0, 3).map((highlight, idx) => (
                <div key={idx} className="flex items-center text-xs text-gray-600">
                  <div className="w-1 h-1 bg-gold-500 rounded-full mr-2 flex-shrink-0"></div>
                  <span className="truncate">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing and booking */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-gray-800">{formatPricingDisplay(vehicle)}</div>
                <div className="text-xs text-gray-600">per day</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-600">Longer rentals</div>
                <div className="font-semibold text-gray-800 text-sm">
                  Better rates
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <button 
                onClick={() => handleBookNow(vehicle.id)}
                className="w-full bg-gold-500 text-black py-3 rounded-full font-bold hover:bg-gold-600 transition-colors flex items-center justify-center space-x-2"
              >
                <span>View Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => navigate('/#reservation')}
                className="w-full border-2 border-gold-500 text-gold-500 py-2 rounded-full font-semibold hover:bg-gold-500 hover:text-black transition-colors text-sm"
              >
                Quick Book
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="fleet" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Car Rentals <span className="text-gold-500">Montenegro</span>
          </h2>
          <div className="w-20 h-1 bg-gold-500 mx-auto mb-6"></div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Car Rentals Montenegro made simple, with modern, trusted, and comfortable vehicles available throughout the country. Our Montenegro car rental fleet is well-maintained to ensure safety, reliability, and convenience for every journey. Whether you need a rental in Podgorica, Tivat, or along the Adriatic coast, our car hire services provide affordable and stress-free travel — all with transparent pricing and no deposit required.
          </p>
        </div>

        {/* Fleet showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto px-4 sm:px-0">
          {vehicles.map((vehicle) => (
            <CarCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              What's Included with Every Rental
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 sm:gap-8 justify-items-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-gold-500" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">24/7 Support</h4>
                <p className="text-xs sm:text-sm text-gray-600">Round-the-clock assistance</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-gold-500" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Premium Service</h4>
                <p className="text-xs sm:text-sm text-gray-600">White-glove treatment</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Luggage className="w-6 h-6 text-gold-500" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Free Delivery</h4>
                <p className="text-xs sm:text-sm text-gray-600">To your location</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calculator className="w-6 h-6 text-gold-500" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Tiered Pricing</h4>
                <p className="text-xs sm:text-sm text-gray-600">Better rates for longer rentals</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-gold-500" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">No Deposit</h4>
                <p className="text-xs sm:text-sm text-gray-600">Rent without upfront deposit</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Fleet;
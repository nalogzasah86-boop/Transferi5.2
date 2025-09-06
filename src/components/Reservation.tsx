import React, { useState } from 'react';
import { MapPin, ArrowRight, Clock, Users, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { getTodayString, isDateInPast } from '../lib/dateValidation';

const Reservation = () => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    pickup: '',
    destination: '',
    date: '',
    time: '',
    passengers: '1',
    name: '',
    countryCode: '+382',
    localPhone: '',
    email: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);

  const countryCodes = [
    { code: '+382', name: 'Montenegro', flag: '🇲🇪' },
    { code: '+381', name: 'Serbia', flag: '🇷🇸' },
    { code: '+385', name: 'Croatia', flag: '🇭🇷' },
    { code: '+387', name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
    { code: '+386', name: 'Slovenia', flag: '🇸🇮' },
    { code: '+383', name: 'Kosovo', flag: '🇽🇰' },
    { code: '+389', name: 'North Macedonia', flag: '🇲🇰' },
    { code: '+355', name: 'Albania', flag: '🇦🇱' },
    { code: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: '+33', name: 'France', flag: '🇫🇷' },
    { code: '+39', name: 'Italy', flag: '🇮🇹' },
    { code: '+43', name: 'Austria', flag: '🇦🇹' },
    { code: '+41', name: 'Switzerland', flag: '🇨🇭' },
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
    { code: '+1', name: 'United States', flag: '🇺🇸' },
    { code: '+7', name: 'Russia', flag: '🇷🇺' },
    { code: '+90', name: 'Turkey', flag: '🇹🇷' }
  ];

  const routes = [
    { from: 'Podgorica', to: 'Budva', price: 50 },
    { from: 'Podgorica', to: 'Kotor', price: 85 },
    { from: 'Podgorica', to: 'Tivat', price: 85 },
    { from: 'Podgorica', to: 'Sutomore', price: 55 },
    { from: 'Podgorica', to: 'Bar', price: 55 },
    { from: 'Podgorica', to: 'Ulcinj', price: 80 },
    { from: 'Podgorica', to: 'Žabljak', price: 90 },
    { from: 'Podgorica', to: 'Tirana', price: 100 },
    { from: 'Podgorica', to: 'Sarajevo', price: 150 },
    { from: 'Podgorica', to: 'Dubrovnik', price: 120 }
  ];

  const popularPickupLocations = ['Podgorica'];
  const popularDestinations = ['Budva', 'Kotor', 'Tivat', 'Sutomore', 'Bar', 'Ulcinj', 'Žabljak', 'Tirana', 'Sarajevo', 'Dubrovnik'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLocationSelect = (location: string, type: 'pickup' | 'destination') => {
    setFormData({
      ...formData,
      [type]: location
    });
    if (type === 'pickup') {
      setShowPickupSuggestions(false);
    } else {
      setShowDestinationSuggestions(false);
    }
  };

  const getRoutePrice = () => {
    const route = routes.find(r => 
      r.from.toLowerCase() === formData.pickup.toLowerCase() && 
      r.to.toLowerCase() === formData.destination.toLowerCase()
    );
    return route ? route.price : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that the selected date is not in the past
    if (isDateInPast(formData.date)) {
      setSubmissionStatus('error');
      setStatusMessage('Please select a date that is today or in the future.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmissionStatus('idle');
    setStatusMessage('');

    try {
      const reservationData = {
        pickup: formData.pickup,
        destination: formData.destination,
        date: formData.date,
        time: formData.time,
        passengers: parseInt(formData.passengers),
        name: formData.name,
        phone: formData.countryCode + formData.localPhone,
        email: formData.email
      };

      const { data, error } = await supabase
        .from('reservations')
        .insert([reservationData])
        .select();

      if (error) {
        throw error;
      }

      // Success
      setSubmissionStatus('success');
      setStatusMessage('Your reservation has been submitted successfully! We will contact you shortly to confirm the details.');
      
      // Clear form
      setFormData({
        pickup: '',
        destination: '',
        date: '',
        time: '',
        passengers: '1',
        name: '',
        countryCode: '+382',
        localPhone: '',
        email: ''
      });

    } catch (error: any) {
      console.error('Error submitting reservation:', error);
      setSubmissionStatus('error');
      setStatusMessage(error.message || 'An error occurred while submitting your reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const routePrice = getRoutePrice();

  return (
    <section id="reservation" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            {t('reservation.title')} <span className="text-gold-500">{t('reservation.titleHighlight')}</span>
          </h2>
          <div className="w-20 h-1 bg-gold-500 mx-auto mb-6"></div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            {t('reservation.description')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Booking Form */}
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 mx-4 sm:mx-0">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">Book Your Transfer</h3>
            
            {/* Status Messages */}
            {submissionStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  <div className="text-green-800 font-medium">Success!</div>
                </div>
                <p className="text-green-700 mt-2">{statusMessage}</p>
              </div>
            )}
            
            {submissionStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                  <div className="text-red-800 font-medium">Error</div>
                </div>
                <p className="text-red-700 mt-2">{statusMessage}</p>
              </div>
            )}

            {routePrice && (
              <div className="bg-gold-50 border border-gold-200 rounded-lg p-3 sm:p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-800 text-sm sm:text-base">
                      {formData.pickup} → {formData.destination}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Premium transfer service</div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-gold-500">
                    €{routePrice}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    name="pickup"
                    value={formData.pickup}
                    onChange={handleInputChange}
                    onFocus={() => setShowPickupSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 200)}
                    className="w-full px-3 sm:px-4 py-3 rounded-lg border border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-colors text-sm sm:text-base"
                    placeholder="Enter pickup location"
                    required
                  />
                  {showPickupSuggestions && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <div className="p-2 text-xs text-gray-500 font-semibold border-b">Popular Locations</div>
                      {popularPickupLocations.map((location, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleLocationSelect(location, 'pickup')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                        >
                          {location}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Destination
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    onFocus={() => setShowDestinationSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowDestinationSuggestions(false), 200)}
                    className="w-full px-3 sm:px-4 py-3 rounded-lg border border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-colors text-sm sm:text-base"
                    placeholder="Enter destination"
                    required
                  />
                  {showDestinationSuggestions && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <div className="p-2 text-xs text-gray-500 font-semibold border-b">Popular Destinations</div>
                      {popularDestinations.map((destination, idx) => {
                        const route = routes.find(r => 
                          r.from.toLowerCase() === formData.pickup.toLowerCase() && 
                          r.to.toLowerCase() === destination.toLowerCase()
                        );
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleLocationSelect(destination, 'destination')}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between items-center"
                          >
                            <span className="text-gray-700">{destination}</span>
                            {route && (
                              <span className="text-gold-500 font-semibold text-sm">€{route.price}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    min={getTodayString()}
                    className="w-full px-3 sm:px-4 py-3 rounded-lg border border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-colors text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-3 rounded-lg border border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-colors text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Passengers
                  </label>
                  <select
                    name="passengers"
                    value={formData.passengers}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-3 rounded-lg border border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-colors text-sm sm:text-base"
                  >
                    {[1,2,3,4,5,6,7,8].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-3 rounded-lg border border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-colors text-sm sm:text-base"
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      className="px-3 py-3 rounded-lg border border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-colors bg-white w-full sm:min-w-[140px] sm:w-auto text-sm sm:text-base"
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      name="localPhone"
                      value={formData.localPhone}
                      onChange={handleInputChange}
                      className="flex-1 px-3 sm:px-4 py-3 rounded-lg border border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-colors text-sm sm:text-base"
                      placeholder="67 123 456"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-3 rounded-lg border border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-colors text-sm sm:text-base"
                  placeholder="your@email.com"
                  required
                />
              </div>

              {/* Price Bar */}
              {routePrice && (
                <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-black p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-base sm:text-lg">
                        {formData.pickup} → {formData.destination}
                      </div>
                      <div className="text-xs sm:text-sm opacity-90">Premium transfer service</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-bold">€{routePrice}</div>
                      <div className="text-xs sm:text-sm opacity-90">Total price</div>
                    </div>
                  </div>
                </div>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-colors flex items-center justify-center space-x-2 transform hover:scale-105 ${
                  isSubmitting 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-gold-500 text-black hover:bg-gold-600'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Reserve Transfer</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-xs sm:text-sm text-gray-600">
              <p>Need a custom route? <span className="text-gold-500 font-semibold cursor-pointer hover:underline">Contact us</span> for a personalized quote.</p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 bg-white p-4 sm:p-6 rounded-xl shadow-sm mx-4 sm:mx-0">
            <h4 className="font-semibold text-gray-800 mb-4 text-center">What's Included:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gold-500 rounded-full mr-2"></div>
                Professional driver
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gold-500 rounded-full mr-2"></div>
                Comfortable vehicle
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gold-500 rounded-full mr-2"></div>
                Meet & greet
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gold-500 rounded-full mr-2"></div>
                Luggage assistance
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gold-500 rounded-full mr-2"></div>
                Flight monitoring
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gold-500 rounded-full mr-2"></div>
                Free cancellation
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reservation;
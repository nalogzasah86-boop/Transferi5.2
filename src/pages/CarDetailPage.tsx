import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehicles, getDailyRate, getPricingTiers } from '../data/vehicles';
import { supabase } from '../lib/supabase';
import { checkCarAvailability } from '../lib/carAvailability';
import { getTodayString, validateDateRange, getMinEndDate } from '../lib/dateValidation';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Luggage, 
  Settings, 
  Fuel, 
  Shield, 
  Star,
  Check,
  Calendar,
  Phone,
  Mail,
  Calculator,
  X,
  AlertTriangle
} from 'lucide-react';

const CarDetailPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showRentalForm, setShowRentalForm] = useState(false);
  const [rentalFormData, setRentalFormData] = useState({
    startDate: '',
    endDate: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    countryCode: '+382'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  
  const vehicle = vehicles.find(v => v.id === carId);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Vehicle Not Found</h1>
          <button 
            onClick={() => navigate('/')}
            className="bg-gold-500 text-black px-6 py-3 rounded-full font-semibold hover:bg-gold-600 transition-colors"
          >
            Back to Fleet
          </button>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
  };

  const handleRentalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRentalFormData({
      ...rentalFormData,
      [e.target.name]: e.target.value
    });
    
    // Clear availability error when dates change
    if (e.target.name === 'startDate' || e.target.name === 'endDate') {
      setAvailabilityError(null);
    }
  };

  const calculateRentalDays = () => {
    if (!rentalFormData.startDate || !rentalFormData.endDate) return 0;
    const start = new Date(rentalFormData.startDate);
    const end = new Date(rentalFormData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotalPrice = () => {
    const days = calculateRentalDays();
    if (!vehicle) return 0;
    const dailyRate = getDailyRate(vehicle, days);
    return days * dailyRate;
  };

  // Check availability when dates change
  React.useEffect(() => {
    const checkAvailability = async () => {
      if (!vehicle || !rentalFormData.startDate || !rentalFormData.endDate) return;

      try {
        const availability = await checkCarAvailability(
          vehicle.id,
          rentalFormData.startDate,
          rentalFormData.endDate
        );

        if (!availability.isAvailable) {
          const conflicts = availability.conflictingRentals || [];
          setAvailabilityError(
            `This vehicle is not available for the selected dates. It conflicts with ${conflicts.length} existing rental(s).`
          );
        } else {
          setAvailabilityError(null);
        }
      } catch (error) {
        setAvailabilityError('Failed to check availability. Please try again.');
      }
    };

    if (rentalFormData.startDate && rentalFormData.endDate) {
      checkAvailability();
    }
  }, [vehicle, rentalFormData.startDate, rentalFormData.endDate]);

  const handleRentalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vehicle) return;
    
    // Validate date range
    const dateValidation = validateDateRange(rentalFormData.startDate, rentalFormData.endDate);
    if (!dateValidation.isValid) {
      setSubmissionStatus('error');
      setStatusMessage(dateValidation.error || 'Invalid date selection');
      return;
    }
    
    if (availabilityError) {
      setSubmissionStatus('error');
      setStatusMessage('Please select different dates. The vehicle is not available for the selected period.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmissionStatus('idle');
    setStatusMessage('');

    try {
      // Final availability check before submission
      const availability = await checkCarAvailability(
        vehicle.id,
        rentalFormData.startDate,
        rentalFormData.endDate
      );

      if (!availability.isAvailable) {
        throw new Error('Vehicle is no longer available for the selected dates. Please choose different dates.');
      }

      const rentalData = {
        vehicle_id: vehicle.id,
        rental_start_date: rentalFormData.startDate,
        rental_end_date: rentalFormData.endDate,
        customer_name: rentalFormData.customerName,
        customer_email: rentalFormData.customerEmail,
        customer_phone: rentalFormData.countryCode + rentalFormData.customerPhone,
        total_price: calculateTotalPrice(),
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('car_rentals')
        .insert([rentalData])
        .select();

      if (error) {
        throw error;
      }

      setSubmissionStatus('success');
      setStatusMessage('Your car rental reservation has been submitted successfully! We will contact you shortly to confirm the details and arrange pickup.');
      
      // Clear form
      setRentalFormData({
        startDate: '',
        endDate: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        countryCode: '+382'
      });

    } catch (error: any) {
      console.error('Error submitting car rental:', error);
      setSubmissionStatus('error');
      setStatusMessage(error.message || 'An error occurred while submitting your rental reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const countryCodes = [
    { code: '+382', name: 'Montenegro', flag: '🇲🇪' },
    { code: '+381', name: 'Serbia', flag: '🇷🇸' },
    { code: '+385', name: 'Croatia', flag: '🇭🇷' },
    { code: '+387', name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
    { code: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: '+33', name: 'France', flag: '🇫🇷' },
    { code: '+39', name: 'Italy', flag: '🇮🇹' },
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
    { code: '+1', name: 'United States', flag: '🇺🇸' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-4">
        <div className="container mx-auto px-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gold-500 hover:text-gold-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="relative h-96 lg:h-[500px] overflow-hidden rounded-2xl mb-4">
              <img 
                src={vehicle.images[currentImageIndex]}
                alt={`${vehicle.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation buttons */}
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white p-3 rounded-full transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white p-3 rounded-full transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image counter */}
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {vehicle.images.length}
              </div>
            </div>

            {/* Thumbnail gallery */}
            <div className="grid grid-cols-5 gap-2">
              {vehicle.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-20 rounded-lg overflow-hidden ${
                    index === currentImageIndex ? 'ring-2 ring-gold-500' : ''
                  }`}
                >
                  <img 
                    src={image}
                    alt={`${vehicle.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Details */}
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">{vehicle.name}</h1>
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-gold-500 text-gold-500" />
                  <span className="text-gray-600">5.0</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <span className="bg-gold-100 text-gold-700 px-4 py-2 rounded-full font-medium">
                  {vehicle.category}
                </span>
                <span className="text-gray-600">{vehicle.year}</span>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                {vehicle.description}
              </p>
            </div>

            {/* Quick specs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Users className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                <div className="font-bold text-gray-800">{vehicle.passengers}</div>
                <div className="text-sm text-gray-600">Passengers</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Luggage className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                <div className="font-bold text-gray-800">{vehicle.luggage}</div>
                <div className="text-sm text-gray-600">Luggage</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Settings className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                <div className="font-bold text-gray-800">Auto</div>
                <div className="text-sm text-gray-600">Transmission</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <Fuel className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                <div className="font-bold text-gray-800">{vehicle.fuel}</div>
                <div className="text-sm text-gray-600">Fuel Type</div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-black p-6 rounded-2xl mb-8">
              <h4 className="text-lg font-semibold mb-4">Rental Pricing</h4>
              <div className="space-y-2">
                {getPricingTiers(vehicle).map((tier, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm opacity-90">{tier.split(':')[0]}:</span>
                    <span className="font-semibold">{tier.split(':')[1].trim()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking buttons */}
            <div className="space-y-4 mb-8">
              <button 
                onClick={() => setShowRentalForm(true)}
                className="w-full bg-gold-500 text-black py-4 rounded-xl font-bold text-lg hover:bg-gold-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Rent This Vehicle</span>
              </button>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => navigate('/#reservation')}
                  className="flex items-center justify-center space-x-2 border-2 border-gold-500 text-gold-500 py-3 rounded-xl font-semibold hover:bg-gold-500 hover:text-black transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Transfer</span>
                </button>
                <button className="flex items-center justify-center space-x-2 border-2 border-gold-500 text-gold-500 py-3 rounded-xl font-semibold hover:bg-gold-500 hover:text-black transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>Call Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
          {/* Highlights */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Key Highlights</h3>
            <div className="space-y-4">
              {vehicle.highlights.map((highlight, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-black" />
                  </div>
                  <span className="text-gray-700">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Technical Specs</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Engine</span>
                <span className="font-semibold text-gray-800">{vehicle.specifications.engine}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Power</span>
                <span className="font-semibold text-gray-800">{vehicle.specifications.power}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Consumption</span>
                <span className="font-semibold text-gray-800">{vehicle.specifications.consumption}</span>
              </div>
            </div>
          </div>

          {/* Features & Amenities */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Features & Amenities</h3>
            <div className="grid grid-cols-1 gap-3">
              {vehicle.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Shield className="w-4 h-4 text-gold-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What's Included */}
        <div className="mt-16 bg-black text-white rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-8 text-center">What's Included with Your Rental</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-gold-500" />
              </div>
              <h4 className="font-semibold mb-1">Full Insurance</h4>
              <p className="text-sm text-gray-300">Comprehensive coverage included</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-gold-500" />
              </div>
              <h4 className="font-semibold mb-1">24/7 Support</h4>
              <p className="text-sm text-gray-300">Round-the-clock assistance</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Settings className="w-6 h-6 text-gold-500" />
              </div>
              <h4 className="font-semibold mb-1">Free Delivery</h4>
              <p className="text-sm text-gray-300">To your location in Podgorica</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-gold-500" />
              </div>
              <h4 className="font-semibold mb-1">Premium Service</h4>
              <p className="text-sm text-gray-300">White-glove treatment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Car Rental Form Modal */}
      {showRentalForm && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  Rent {vehicle?.name}
                </h3>
                <button
                  onClick={() => {
                    setShowRentalForm(false);
                    setSubmissionStatus('idle');
                    setStatusMessage('');
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 p-2 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
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

              {/* Availability Warning */}
              {availabilityError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
                    <div className="text-red-800 font-medium">Availability Conflict</div>
                  </div>
                  <p className="text-red-700 mt-2">{availabilityError}</p>
                </div>
              )}

              {/* Vehicle Summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-4">
                  <img 
                    src={vehicle?.images[0]}
                    alt={vehicle?.name}
                    className="w-16 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">{vehicle?.name}</h4>
                    <p className="text-sm text-gray-600">{vehicle?.category} • {vehicle?.year}</p>
                    <p className="text-lg font-bold text-gold-500">{vehicle?.dailyRate}/day</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleRentalSubmit} className="space-y-6">
                {/* Rental Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={rentalFormData.startDate}
                      onChange={handleRentalInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      min={getTodayString()}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Return Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={rentalFormData.endDate}
                      onChange={handleRentalInputChange}
                      min={rentalFormData.startDate || new Date().toISOString().split('T')[0]}
                      min={getMinEndDate(rentalFormData.startDate)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Price Calculation */}
                {rentalFormData.startDate && rentalFormData.endDate && calculateRentalDays() > 0 && (
                  <div className="bg-gold-50 border border-gold-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calculator className="w-5 h-5 text-gold-500" />
                        <div>
                          <div className="font-semibold text-gray-800">
                            {calculateRentalDays()} day{calculateRentalDays() !== 1 ? 's' : ''} rental
                          </div>
                          <div className="text-sm text-gray-600">
                            {vehicle && getDailyRate(vehicle, calculateRentalDays()) > 0 
                              ? `€${getDailyRate(vehicle, calculateRentalDays())} × ${calculateRentalDays()} day${calculateRentalDays() !== 1 ? 's' : ''}`
                              : 'Contact us for pricing'
                            }
                          </div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-gold-500">
                        {vehicle && getDailyRate(vehicle, calculateRentalDays()) > 0 
                          ? `€${calculateTotalPrice()}`
                          : 'Quote'
                        }
                      </div>
                    </div>
                  </div>
                )}

                {/* Customer Information */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">Customer Information</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        value={rentalFormData.customerName}
                        onChange={handleRentalInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-colors"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="customerEmail"
                        value={rentalFormData.customerEmail}
                        onChange={handleRentalInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-colors"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="flex space-x-2">
                        <select
                          name="countryCode"
                          value={rentalFormData.countryCode}
                          onChange={(e) => setRentalFormData({...rentalFormData, countryCode: e.target.value})}
                          className="px-3 py-3 rounded-lg border border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-colors bg-white min-w-[120px]"
                        >
                          {countryCodes.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.flag} {country.code}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          name="customerPhone"
                          value={rentalFormData.customerPhone}
                          onChange={handleRentalInputChange}
                          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-colors"
                          placeholder="67 123 456"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-800 mb-2">Rental Terms</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Valid driver's license required (minimum 21 years old)</li>
                    <li>• Full insurance coverage included</li>
                    <li>• Free delivery within Podgorica city limits</li>
                    <li>• 24/7 roadside assistance included</li>
                    <li>• Fuel policy: Return with same fuel level</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={isSubmitting || calculateRentalDays() <= 0 || !!availabilityError || (vehicle && getDailyRate(vehicle, calculateRentalDays()) === 0)}
                  className={`w-full py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center space-x-2 ${
                    isSubmitting || calculateRentalDays() <= 0 || !!availabilityError || (vehicle && getDailyRate(vehicle, calculateRentalDays()) === 0)
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                      : 'bg-gold-500 text-black hover:bg-gold-600'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {vehicle && getDailyRate(vehicle, calculateRentalDays()) > 0 
                          ? `Reserve for €${calculateTotalPrice()}${calculateRentalDays() > 0 ? ` (${calculateRentalDays()} day${calculateRentalDays() !== 1 ? 's' : ''})` : ''}`
                          : 'Contact for Quote'
                        }
                      </span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetailPage;
import React from 'react';
import { Award, Users, MapPin, Clock } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Award, label: 'Years Experience', value: '10+' },
    { icon: Users, label: 'Happy Clients', value: '5000+' },
    { icon: MapPin, label: 'Cities Covered', value: '15+' },
    { icon: Clock, label: 'Available', value: '24/7' }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Car Rentals & Transfers <span className="text-gold-500">Montenegro Experts</span>
              </h2>
              <div className="w-20 h-1 bg-gold-500 mb-6"></div>
              
              <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed">
                DV Transfers is Montenegro's premier provider of car rentals and transfer services. Whether you need 
                car rentals Montenegro for extended stays or car transfers Montenegro for airport pickups and city 
                connections, we deliver luxury transportation solutions throughout Montenegro with professional drivers 
                and comfortable vehicles.
              </p>
              
              <p className="text-base sm:text-lg text-gray-700 mb-8 leading-relaxed">
                From airport transfers Montenegro to long-term car rentals Montenegro, our comprehensive 
                transportation services ensure comfort, reliability, and luxury for every journey. Experience 
                the best car transfers Montenegro and car rentals Montenegro has to offer.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Private Transfers</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">Airport, hotel, and city transfers</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Car Rental Montenegro</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">Premium Montenegro car rentals</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Private Tours</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">Customized sightseeing tours</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Business Travel</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">Corporate transportation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src="https://i.imgur.com/e1a0aLY.jpeg"
                alt="Luxury car interior"
                className="w-full h-96 object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
            {/* Floating stats card */}
            <div className="absolute -bottom-4 sm:-bottom-8 left-4 sm:left-8 bg-white rounded-xl shadow-xl p-4 sm:p-6">
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <stat.icon className="w-4 sm:w-6 h-4 sm:h-6 text-gold-500 mx-auto mb-1 sm:mb-2" />
                    <div className="text-lg sm:text-2xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
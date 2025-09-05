import React from 'react';
import { Shield, Clock, Award, Users, Headphones, MapPin } from 'lucide-react';

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: Shield,
      title: 'Safe & Reliable',
      description: 'All vehicles are regularly maintained and fully insured. Professional drivers with clean records.'
    },
    {
      icon: Clock,
      title: '24/7 Service',
      description: 'Available round the clock for your convenience. Emergency transportation available anytime.'
    },
    {
      icon: Award,
      title: 'Modern & Comfortable Vehicles',
      description: 'Travel in style and comfort with our well-equipped cars, designed to provide a smooth and enjoyable ride for every passenger.'
    },
    {
      icon: Users,
      title: 'Professional Drivers',
      description: 'Experienced, courteous drivers who know Montenegro inside and out.'
    },
    {
      icon: Headphones,
      title: 'Customer Support',
      description: 'Dedicated customer service team ready to assist you before, during, and after your journey.'
    },
    {
      icon: MapPin,
      title: 'Local Expertise',
      description: 'Deep knowledge of Montenegro\'s roads, attractions, and hidden gems.'
    }
  ];

  return (
    <section className="py-20 bg-black text-white relative overflow-hidden w-full">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 gap-4 h-full w-full">
          {[...Array(48)].map((_, i) => (
            <div key={i} className="bg-gold-500 rounded-full w-2 h-2 animate-pulse" style={{
              animationDelay: `${i * 0.1}s`
            }}></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative w-full max-w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Why Choose <span className="text-gold-500">DV Transfers</span>
          </h2>
          <div className="w-20 h-1 bg-gold-500 mx-auto mb-6"></div>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            We're committed to providing the highest level of service, comfort, and reliability 
            for all your transportation needs in Montenegro.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-0">
          {reasons.map((reason, index) => (
            <div 
              key={index} 
              className="group p-6 sm:p-8 rounded-2xl border border-gray-800 hover:border-gold-500 transition-all duration-300 hover:transform hover:-translate-y-2"
            >
              <div className="mb-6">
                <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gold-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-gold-500/20 transition-colors">
                  <reason.icon className="w-8 h-8 text-gold-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-4 group-hover:text-gold-500 transition-colors">
                  {reason.title}
                </h3>
              </div>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
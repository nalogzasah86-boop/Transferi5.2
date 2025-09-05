import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'London, UK',
      rating: 5,
      text: 'Exceptional service from start to finish. The Mercedes was immaculate and our driver was professional and knowledgeable about Montenegro. Highly recommend for anyone wanting luxury transportation.',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Marco Rossi',
      location: 'Milan, Italy',
      rating: 5,
      text: 'Perfect airport transfer service! Flight was delayed but they monitored it and were waiting when I arrived. The BMW was comfortable and the driver helped with luggage. Will use again.',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Anna Müller',
      location: 'Vienna, Austria',
      rating: 5,
      text: 'We rented a luxury SUV for our family vacation in Montenegro. The vehicle was in perfect condition and the service was outstanding. Great way to explore the beautiful countryside.',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'David Thompson',
      location: 'New York, USA',
      rating: 5,
      text: 'Business trip to Podgorica was made seamless with DV Transfers. Punctual, professional, and the vehicle was equipped with everything I needed. Top-notch corporate service.',
      image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            What Our <span className="text-gold-500">Clients Say</span>
          </h2>
          <div className="w-20 h-1 bg-gold-500 mx-auto mb-6"></div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Don't just take our word for it. Here's what our satisfied customers 
            have to say about their experience with DV Transfers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 px-4 sm:px-0">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className={`bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative ${
                index === testimonials.length - 1 ? 'hidden lg:block' : ''
              }`}
            >
              {/* Quote icon */}
              <div className="absolute -top-3 -left-3 bg-gold-500 rounded-full p-2">
                <Quote className="w-4 h-4 text-black" />
              </div>

              {/* Stars */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold-500 text-gold-500" />
                ))}
              </div>

              {/* Testimonial text */}
              <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 italic leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Client info */}
              <div className="flex items-center">
                <img 
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover mr-3 sm:mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{testimonial.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto shadow-lg">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
              Trusted by Travelers Worldwide
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gold-500">5.0</div>
                <div className="text-xs sm:text-sm text-gray-600">Google Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gold-500">1000+</div>
                <div className="text-xs sm:text-sm text-gray-600">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gold-500">24/7</div>
                <div className="text-xs sm:text-sm text-gray-600">Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gold-500">10+</div>
                <div className="text-xs sm:text-sm text-gray-600">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
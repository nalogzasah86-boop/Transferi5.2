import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send, Clock } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    date: '',
    time: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+382 68 269 246', '+382 68 818 347'],
      action: 'Call Now'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['vucinicnikola23@gmail.com'],
      action: 'Send Email'
    },
    {
      icon: MapPin,
      title: 'Location',
      details: ['Podgorica, Montenegro'],
      action: 'Get Directions'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      details: ['+382 68 818 347'],
      action: 'Message Us'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Contact <span className="text-gold-500">& Book</span>
          </h2>
          <div className="w-20 h-1 bg-gold-500 mx-auto mb-6"></div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Ready for comfortable car rentals Montenegro or car transfers Montenegro? Contact DV Transfers 
            for comfortable car rental and transfer bookings throughout Montenegro.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 px-4 sm:px-0">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-black text-white rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold mb-6">Get In Touch</h3>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gold-500/10 p-3 rounded-full group-hover:bg-gold-500/20 transition-colors flex-shrink-0">
                        <info.icon className="w-6 h-6 text-gold-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-sm sm:text-base">{info.title}</h4>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-300 text-xs sm:text-sm mb-1">{detail}</p>
                        ))}
                        <button className="text-gold-500 text-xs sm:text-sm hover:text-gold-400 transition-colors mt-1">
                          {info.action}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>


              {/* WhatsApp CTA */}
              <div className="mt-8">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 rounded-full font-semibold transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base">
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp Us</span>
                </button>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-gray-100 rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold mb-6 text-center text-gray-800">
                Find Us in Montenegro
              </h3>
              <div className="aspect-video bg-gray-300 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2948.5087469716243!2d19.265073415341475!3d42.44170997918152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x134deb2c5ae7be21%3A0x5b2b5e5c7f5e8c8d!2sPodgorica%2C%20Montenegro!5e0!3m2!1sen!2sus!4v1635787843832!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
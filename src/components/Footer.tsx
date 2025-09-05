import React from 'react';
import { Instagram, Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Transfers', href: '#reservation' },
    { name: 'Fleet', href: '#fleet' },
    { name: 'Contact', href: '#contact' }
  ];

  const services = [
    'Airport Transfers',
    'Car Rental',
    'Private Tours',
    'Business Travel',
    'VIP Services'
  ];

  return (
    <footer className="bg-black text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">
                <span className="text-white">DV</span>
                <span className="text-gold-500"> Transfers</span>
              </h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                Comfortable car rentals and transfer services Montenegro. DV Transfers offers luxury 
                car rentals Montenegro and professional car transfers Montenegro with 24/7 service.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/dv_transfers_montenegro/" 
                className="bg-gray-800 hover:bg-gold-500 text-white hover:text-black p-3 rounded-full transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="tel:+38268269246" 
                className="bg-gray-800 hover:bg-gold-500 text-white hover:text-black p-3 rounded-full transition-colors"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a 
                href="mailto:vucinicnikola23@gmail.com" 
                className="bg-gray-800 hover:bg-gold-500 text-white hover:text-black p-3 rounded-full transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-6 text-gold-500">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-6 text-gold-500">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index} className="text-sm sm:text-base text-gray-400">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-6 text-gold-500">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-gold-500 mt-1" />
                <div>
                  <p className="text-sm sm:text-base text-white font-medium">+382 68 269 246</p>
                  <p className="text-gray-400 text-xs sm:text-sm">Primary Line</p>
                  <p className="text-sm sm:text-base text-white font-medium mt-2">+382 68 818 347</p>
                  <p className="text-gray-400 text-xs sm:text-sm">Secondary Line</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gold-500 mt-1" />
                <div>
                  <p className="text-sm sm:text-base text-white font-medium">vucinicnikola23@gmail.com</p>
                  <p className="text-gray-400 text-xs sm:text-sm">General Inquiries</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gold-500 mt-1" />
                <div>
                  <p className="text-sm sm:text-base text-white font-medium">Podgorica</p>
                  <p className="text-gray-400 text-xs sm:text-sm">Montenegro</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-gold-500 mt-1" />
                <div>
                  <p className="text-sm sm:text-base text-white font-medium">24/7 Service</p>
                  <p className="text-gray-400 text-xs sm:text-sm">Always Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              © 2025 DV Transfers Montenegro. All rights reserved. | Designed by <a href="https://assistnet.online/" target="_blank" rel="noopener noreferrer" className="text-gold-500 hover:text-gold-400 transition-colors">Assistnet</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
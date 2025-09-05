import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Star, Clock, Shield } from 'lucide-react';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden w-full">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://i.imgur.com/V9Bn9y0.jpeg')`,
        }}
        role="img"
        aria-label="Luxury car rental Montenegro - Premium vehicles for rent in Montenegro"
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 mt-[100px] w-full">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
          {t('hero.title')}
          <span className="text-gold-500"> {t('hero.titleHighlight')}</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 sm:mb-12 font-light">
          {t('hero.subtitle')}
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6 mb-12 sm:mb-16">
          <a href="#reservation" className="group bg-gold-500 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-gold-600 transition-all transform hover:scale-105 flex items-center space-x-2 w-full sm:w-auto justify-center" onClick={(e) => { e.preventDefault(); document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' }); }}>
            <span>{t('hero.bookRide')}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#fleet" className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-white hover:text-black transition-all w-full sm:w-auto">
            {t('hero.rentCar')}
          </a>
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto mt-6 sm:mt-8">
          <div className="flex items-center justify-center space-x-3">
            <Clock className="w-6 h-6 text-gold-500" />
            <span className="text-base sm:text-lg">{t('hero.service24')}</span>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <Shield className="w-6 h-6 text-gold-500" />
            <span className="text-base sm:text-lg">{t('hero.fullyInsured')}</span>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <Star className="w-6 h-6 text-gold-500" />
            <span className="text-base sm:text-lg">{t('hero.depositFree')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
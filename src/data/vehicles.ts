export interface PricingTier {
  minDays: number;
  maxDays: number | 'infinity';
  rate: number; // 0 means contact for quote
}

export interface Vehicle {
  id: string;
  name: string;
  category: string;
  year: string;
  passengers: string;
  luggage: string;
  transmission: string;
  fuel: string;
  pricing: PricingTier[];
  features: string[];
  specifications: {
    engine: string;
    power: string;
    consumption: string;
  };
  images: string[];
  description: string;
  highlights: string[];
}

// Helper function to get daily rate based on rental duration
export const getDailyRate = (vehicle: Vehicle, days: number): number => {
  for (const tier of vehicle.pricing) {
    if (days >= tier.minDays && (tier.maxDays === 'infinity' || days <= tier.maxDays)) {
      return tier.rate;
    }
  }
  // Fallback to first tier if no match found
  return vehicle.pricing[0]?.rate || 0;
};

// Helper function to get base daily rate (shortest duration rate)
export const getBaseDailyRate = (vehicle: Vehicle): number => {
  return vehicle.pricing[0]?.rate || 0;
};

// Helper function to format pricing display
export const formatPricingDisplay = (vehicle: Vehicle): string => {
  const baseRate = getBaseDailyRate(vehicle);
  return `€${baseRate}`;
};

// Helper function to get pricing tiers for display
export const getPricingTiers = (vehicle: Vehicle): string[] => {
  return vehicle.pricing.map(tier => {
    if (tier.rate === 0) {
      return `${tier.minDays}+ days: Contact us`;
    }
    const maxDisplay = tier.maxDays === 'infinity' ? '+' : `-${tier.maxDays}`;
    return `${tier.minDays}${tier.maxDays !== tier.minDays ? maxDisplay : ''} day${tier.minDays !== 1 || tier.maxDays !== 1 ? 's' : ''}: €${tier.rate}`;
  });
};

export const vehicles: Vehicle[] = [
  {
    id: 'passat-b8',
    name: 'Passat 2.0 Alltrack 4x4',
    category: 'Wagon',
    year: '2019',
    passengers: '3',
    luggage: '4',
    transmission: 'Automatic',
    fuel: 'Automatic',
    pricing: [
      { minDays: 1, maxDays: 5, rate: 70 },
      { minDays: 6, maxDays: 10, rate: 65 },
      { minDays: 11, maxDays: 15, rate: 60 },
      { minDays: 16, maxDays: 'infinity', rate: 0 }
    ],
    description: 'Experience comfort and capability with our Passat 2.0 Alltrack 4x4. Perfect for business trips, airport transfers, or exploring Montenegro\'s diverse terrain in style and comfort.',
    highlights: [
      'Front and rear sensors, parking camera',
      'Matrix headlights',
      'Ambient lighting',
      '5 driving modes',
      'Heated seats'
    ],
    features: [
      'Front and rear sensors',
      'Parking camera',
      'Matrix headlights',
      'Ambient lighting',
      '5 driving modes',
      'Heated seats',
      'Dual-zone automatic climate control'
    ],
    specifications: {
      engine: '2.0L',
      power: '190 HP',
      consumption: '6L/100km'
    },
    images: [
      'https://i.imgur.com/s8sw5N3.jpeg',
      'https://i.imgur.com/iTTjhQG.jpeg',
      'https://i.imgur.com/3nNQYBO.jpeg',
      'https://i.imgur.com/Ygkaknb.jpeg'
    ]
  },
  {
    id: 'citroen-c4',
    name: 'Citroën C4 Spacetourer',
    category: 'MPV',
    year: '2020',
    passengers: '7',
    luggage: '5',
    transmission: 'Automatic',
    fuel: 'Diesel',
    pricing: [
      { minDays: 1, maxDays: 5, rate: 50 },
      { minDays: 6, maxDays: 10, rate: 45 },
      { minDays: 11, maxDays: 15, rate: 40 },
      { minDays: 16, maxDays: 'infinity', rate: 0 }
    ],
    description: 'Spacious and versatile family MPV perfect for group travel and exploring Montenegro. Comfortable seating for 7 passengers with diesel efficiency and modern features.',
    highlights: [
      '7 seats',
      'Parking sensors',
      'Dual-zone climate control',
      'Diesel efficiency',
      '131 HP power'
    ],
    features: [
      '7 seats',
      'Parking sensors',
      'Dual-zone climate control'
    ],
    specifications: {
      engine: '1.5L Diesel',
      power: '131 HP',
      consumption: '5.5L/100km'
    },
    images: [
      'https://i.imgur.com/QREiT5p.jpeg',
      'https://i.imgur.com/4SyL68a.jpeg'
    ]
  }
];
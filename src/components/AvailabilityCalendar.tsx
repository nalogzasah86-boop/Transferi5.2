import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Car, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { vehicles } from '../data/vehicles';

interface AvailabilityCalendarProps {
  vehicleId?: string;
  onDateSelect?: (date: string) => void;
}

interface RentalPeriod {
  id: string;
  start: string;
  end: string;
  customer_name: string;
  status: string;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ 
  vehicleId, 
  onDateSelect 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [rentals, setRentals] = useState<RentalPeriod[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(vehicleId || vehicles[0]?.id || '');

  useEffect(() => {
    if (selectedVehicle) {
      fetchRentals();
    }
  }, [selectedVehicle, currentMonth]);

  const fetchRentals = async () => {
    if (!selectedVehicle) return;

    setLoading(true);
    try {
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from('car_rentals')
        .select('id, rental_start_date, rental_end_date, customer_name, status')
        .eq('vehicle_id', selectedVehicle)
        .in('status', ['confirmed', 'pending'])
        .gte('rental_end_date', startOfMonth.toISOString().split('T')[0])
        .lte('rental_start_date', endOfMonth.toISOString().split('T')[0]);

      if (error) throw error;

      setRentals(data?.map(rental => ({
        id: rental.id,
        start: rental.rental_start_date,
        end: rental.rental_end_date,
        customer_name: rental.customer_name,
        status: rental.status
      })) || []);
    } catch (error) {
      console.error('Error fetching rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  const isDateBooked = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return rentals.some(rental => 
      dateStr >= rental.start && dateStr <= rental.end
    );
  };

  const getRentalForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return rentals.find(rental => 
      dateStr >= rental.start && dateStr <= rental.end
    );
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-gold-500" />
          Vehicle Availability
        </h3>
        {!vehicleId && (
          <select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-colors"
          >
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h4 className="text-lg font-semibold text-gray-800">{monthName}</h4>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="h-10"></div>;
          }

          const isBooked = isDateBooked(day);
          const rental = getRentalForDate(day);
          const isToday = day.toDateString() === new Date().toDateString();
          const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));

          return (
            <div
              key={index}
              className={`h-10 flex items-center justify-center text-sm rounded-lg cursor-pointer transition-colors relative ${
                isToday ? 'ring-2 ring-gold-500' :
                isBooked ? (rental?.status === 'confirmed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800') :
                isPast ? 'text-gray-400' :
                'hover:bg-gray-100'
              }`}
              onClick={() => onDateSelect && onDateSelect(day.toISOString().split('T')[0])}
              title={isBooked ? `Booked by ${rental?.customer_name} (${rental?.status})` : 'Available'}
            >
              {day.getDate()}
              {isBooked && (
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                  rental?.status === 'confirmed' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-100 rounded border"></div>
          <span className="text-gray-600">Confirmed Booking</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-100 rounded border"></div>
          <span className="text-gray-600">Pending Booking</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-white rounded border"></div>
          <span className="text-gray-600">Available</span>
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
          <div className="flex items-center space-x-2 text-gray-600">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-gold-500 rounded-full animate-spin"></div>
            <span>Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
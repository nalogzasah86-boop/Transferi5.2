import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw,
  X,
  Car,
  Calculator
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { updateRentalStatus } from '../lib/carAvailability';
import { vehicles } from '../data/vehicles';
import ManualRentalForm from '../components/ManualRentalForm';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import RentalStatusBadge from '../components/RentalStatusBadge';
import { Plus } from 'lucide-react';
import type { Database } from '../lib/supabase';

type CarRental = Database['public']['Tables']['car_rentals']['Row'];

const CarRentalsPage = () => {
  const navigate = useNavigate();
  const [carRentals, setCarRentals] = useState<CarRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [selectedRental, setSelectedRental] = useState<CarRental | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);

  useEffect(() => {
    fetchCarRentals();
  }, []);

  const fetchCarRentals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('car_rentals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setCarRentals(data || []);
    } catch (err: any) {
      console.error('Error fetching car rentals:', err);
      setError(err.message || 'Failed to load car rentals');
    } finally {
      setLoading(false);
    }
  };

  const filteredRentals = carRentals.filter(rental => {
    const matchesSearch = 
      rental.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.vehicle_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !filterDate || rental.rental_start_date === filterDate;
    
    return matchesSearch && matchesDate;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.name : vehicleId;
  };

  const calculateRentalDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const exportToCSV = () => {
    const headers = ['Customer Name', 'Email', 'Phone', 'Vehicle', 'Start Date', 'End Date', 'Days', 'Total Price', 'Status', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...filteredRentals.map(rental => [
        rental.customer_name,
        rental.customer_email,
        rental.customer_phone,
        getVehicleName(rental.vehicle_id),
        rental.rental_start_date,
        rental.rental_end_date,
        calculateRentalDays(rental.rental_start_date, rental.rental_end_date),
        rental.total_price,
        rental.status,
        new Date(rental.created_at).toLocaleString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `car-rentals-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-gold-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading car rentals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gold-500 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Website</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                Car <span className="text-gold-500">Rentals</span>
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => navigate('/reservations')}
                className="hidden sm:flex items-center space-x-2 text-gray-600 hover:text-gold-500 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Transfers</span>
              </button>
              <button
                onClick={() => setShowManualForm(true)}
                className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Manual Rental</span>
                <span className="sm:hidden">Add</span>
              </button>
              <button
                onClick={fetchCarRentals}
                className="flex items-center space-x-2 bg-gold-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-gold-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
              <div className="text-red-800 font-medium">Error</div>
            </div>
            <p className="text-red-700 mt-2">{error}</p>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Rentals</p>
                <p className="text-2xl font-bold text-gray-800">{carRentals.length}</p>
              </div>
              <Car className="w-8 h-8 text-gold-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Rentals</p>
                <p className="text-2xl font-bold text-gray-800">
                  {carRentals.filter(r => r.status === 'confirmed').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-gold-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800">
                  €{carRentals.reduce((sum, r) => sum + r.total_price, 0)}
                </p>
              </div>
              <Calculator className="w-8 h-8 text-gold-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-800">
                  {carRentals.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-gold-500" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, email, or vehicle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-colors w-full sm:w-80"
                />
              </div>
              <div className="relative">
                <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-colors w-full sm:w-auto"
                />
              </div>
              <button
                onClick={exportToCSV}
                className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-3 rounded-lg hover:bg-gray-900 transition-colors w-full sm:w-auto justify-center"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Car Rentals Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-800">Customer</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-800">Vehicle</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-800">Rental Period</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-800">Price</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-800">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRentals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500">
                      {searchTerm || filterDate ? 'No car rentals match your filters' : 'No car rentals yet'}
                    </td>
                  </tr>
                ) : (
                  filteredRentals.map((rental) => (
                    <tr key={rental.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-semibold text-gray-800">{rental.customer_name}</div>
                          <div className="text-sm text-gray-600">{rental.customer_email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <Car className="w-5 h-5 text-gold-500" />
                          <div>
                            <div className="font-medium text-gray-800">{getVehicleName(rental.vehicle_id)}</div>
                            <div className="text-sm text-gray-600">{rental.vehicle_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-gray-800">
                            {formatDate(rental.rental_start_date)} - {formatDate(rental.rental_end_date)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {calculateRentalDays(rental.rental_start_date, rental.rental_end_date)} day{calculateRentalDays(rental.rental_start_date, rental.rental_end_date) !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-gold-500 text-lg">€{rental.total_price}</div>
                      </td>
                      <td className="py-4 px-6">
                        <RentalStatusBadge status={rental.status} size="sm" />
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => setSelectedRental(rental)}
                          className="flex items-center space-x-1 text-gold-500 hover:text-gold-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">View</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="font-bold text-gray-800">
                {filteredRentals.length} / {carRentals.length}
              </div>
              <div className="text-gray-600">Showing Rentals</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="font-bold text-gray-800">
                €{filteredRentals.reduce((sum, r) => sum + r.total_price, 0)}
              </div>
              <div className="text-gray-600">Total Value</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="font-bold text-gray-800">
                {filteredRentals.reduce((sum, r) => sum + calculateRentalDays(r.rental_start_date, r.rental_end_date), 0)}
              </div>
              <div className="text-gray-600">Total Days</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="font-bold text-gray-800">
                {new Set(filteredRentals.map(r => r.vehicle_id)).size}
              </div>
              <div className="text-gray-600">Unique Vehicles</div>
            </div>
          </div>
        </div>
      </div>

      {/* Rental Detail Modal */}
      {selectedRental && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Car Rental Details</h3>
                <button
                  onClick={() => setSelectedRental(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 p-2 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Vehicle Info */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Vehicle Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Car className="w-8 h-8 text-gold-500" />
                    <div>
                      <div className="font-bold text-gray-800 text-lg">{getVehicleName(selectedRental.vehicle_id)}</div>
                      <div className="text-sm text-gray-600">Vehicle ID: {selectedRental.vehicle_id}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Customer Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Name</div>
                    <div className="font-medium text-gray-800">{selectedRental.customer_name}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-medium text-gray-800 break-all">{selectedRental.customer_email}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg sm:col-span-2">
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="font-medium text-gray-800">
                      <a href={`tel:${selectedRental.customer_phone}`} className="text-gold-500 hover:text-gold-600">
                        {selectedRental.customer_phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rental Details */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Rental Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Start Date</div>
                    <div className="font-medium text-gray-800">{formatDate(selectedRental.rental_start_date)}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">End Date</div>
                    <div className="font-medium text-gray-800">{formatDate(selectedRental.rental_end_date)}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Duration</div>
                    <div className="font-medium text-gray-800">
                      {calculateRentalDays(selectedRental.rental_start_date, selectedRental.rental_end_date)} day{calculateRentalDays(selectedRental.rental_start_date, selectedRental.rental_end_date) !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Total Price</div>
                    <div className="font-bold text-gold-500 text-lg">€{selectedRental.total_price}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Status</div>
                    <div className="mt-1">
                      <RentalStatusBadge status={selectedRental.status} size="md" />
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Booked On</div>
                    <div className="font-medium text-gray-800">
                      {new Date(selectedRental.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex items-center justify-center space-x-2 bg-gold-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-gold-600 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>Call Customer</span>
                </button>
                <button className="flex items-center justify-center space-x-2 border-2 border-gold-500 text-gold-500 px-6 py-3 rounded-lg font-semibold hover:bg-gold-500 hover:text-black transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>Send Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Rental Form */}
      <ManualRentalForm
        isOpen={showManualForm}
        onClose={() => setShowManualForm(false)}
        onSuccess={() => {
          fetchCarRentals();
          setShowManualForm(false);
        }}
      />
    </div>
  );
};

export default CarRentalsPage;
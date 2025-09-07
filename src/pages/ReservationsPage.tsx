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
  Trash2,
  Car
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { deleteReservation, deleteCarRental } from '../lib/supabase';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';
import ConfirmDialog from '../components/ConfirmDialog';
import { vehicles } from '../data/vehicles';
import type { Database } from '../lib/supabase';

type Reservation = Database['public']['Tables']['reservations']['Row'];
type CarRental = Database['public']['Tables']['car_rentals']['Row'];

const ReservationsPage = () => {
  const navigate = useNavigate();
  const { toasts, removeToast, success, error: showError } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [carRentals, setCarRentals] = useState<CarRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [selectedCarRental, setSelectedCarRental] = useState<CarRental | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; reservationId: string | null }>({
    isOpen: false,
    reservationId: null
  });
  const [deleteCarRentalConfirm, setDeleteCarRentalConfirm] = useState<{ isOpen: boolean; rentalId: string | null }>({
    isOpen: false,
    rentalId: null
  });
  const [activeTab, setActiveTab] = useState<'transfers' | 'rentals'>('transfers');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch transfers
      const { data: transfersData, error: transfersError } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (transfersError) {
        throw transfersError;
      }

      // Fetch car rentals
      const { data: rentalsData, error: rentalsError } = await supabase
        .from('car_rentals')
        .select('*')
        .order('created_at', { ascending: false });

      if (rentalsError) {
        throw rentalsError;
      }

      setReservations(transfersData || []);
      setCarRentals(rentalsData || []);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransfer = async (id: string) => {
    if (!id) {
      console.error('No ID provided for deletion');
      return;
    }

    // Show confirmation dialog
    setDeleteConfirm({ isOpen: true, reservationId: id });
  };

  const confirmDelete = async () => {
    const id = deleteConfirm.reservationId;
    if (!id) return;

    setDeleteConfirm({ isOpen: false, reservationId: null });

    setDeleteLoading(id);
    
    try {
      const result = await deleteReservation(id);

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete reservation');
      }

      // Update local state to remove the deleted reservation
      setReservations(prev => prev.filter(reservation => reservation.user_id !== id));
      
      // Close modal if the deleted reservation was selected
      if (selectedReservation?.user_id === id) {
        setSelectedReservation(null);
      }

      // Clear any existing errors
      setError(null);
      
      // Show success toast
      success('Transfer Deleted', 'The transfer reservation has been successfully deleted.');
      
    } catch (err: any) {
      console.error('Error during deletion process:', err);
      setError(`Failed to delete reservation: ${err.message}`);
      
      // Show error toast
      showError('Delete Failed', err.message || 'Failed to delete the transfer reservation.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDeleteCarRental = async (id: string) => {
    if (!id) {
      console.error('No user_id provided for car rental deletion');
      return;
    }

    // Show confirmation dialog
    setDeleteCarRentalConfirm({ isOpen: true, rentalId: id });
  };

  const confirmDeleteCarRental = async () => {
    const id = deleteCarRentalConfirm.rentalId;
    if (!id) return;

    setDeleteCarRentalConfirm({ isOpen: false, rentalId: null });

    setDeleteLoading(id);
    
    try {
      const result = await deleteCarRental(id);

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete car rental');
      }

      // Update local state to remove the deleted car rental
      setCarRentals(prev => prev.filter(rental => rental.user_id !== id));
      
      // Close modal if the deleted car rental was selected
      if (selectedCarRental?.user_id === id) {
        setSelectedCarRental(null);
      }

      // Clear any existing errors
      setError(null);
      
      // Show success toast
      success('Car Rental Deleted', 'The car rental has been successfully deleted.');
      
    } catch (err: any) {
      console.error('Error during car rental deletion process:', err);
      setError(`Failed to delete car rental: ${err.message}`);
      
      // Show error toast
      showError('Delete Failed', err.message || 'Failed to delete the car rental.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = 
      reservation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !filterDate || reservation.date === filterDate;
    
    return matchesSearch && matchesDate;
  });

  const filteredCarRentals = carRentals.filter(rental => {
    const matchesSearch = 
      rental.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.vehicle_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !filterDate || rental.rental_start_date === filterDate;
    
    return matchesSearch && matchesDate;
  });

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const exportToCSV = () => {
    if (activeTab === 'transfers') {
      const headers = ['Name', 'Email', 'Phone', 'Pickup', 'Destination', 'Date', 'Time', 'Passengers', 'Created At'];
      const csvContent = [
        headers.join(','),
        ...filteredReservations.map(reservation => [
          reservation.name,
          reservation.email,
          reservation.phone,
          reservation.pickup,
          reservation.destination,
          reservation.date,
          reservation.time,
          reservation.passengers,
          new Date(reservation.created_at).toLocaleString()
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transfers-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      const headers = ['Customer Name', 'Email', 'Phone', 'Vehicle', 'Start Date', 'End Date', 'Days', 'Total Price', 'Status', 'Created At'];
      const csvContent = [
        headers.join(','),
        ...filteredCarRentals.map(rental => [
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
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-gold-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading reservations...</p>
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
                <span className="text-gold-500">Reservations</span> Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={fetchData}
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

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('transfers')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'transfers'
                    ? 'border-gold-500 text-gold-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Transfers ({reservations.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('rentals')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'rentals'
                    ? 'border-gold-500 text-gold-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Car className="w-4 h-4" />
                  <span>Car Rentals ({carRentals.length})</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Stats Overview */}
        {activeTab === 'transfers' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Transfers</p>
                  <p className="text-2xl font-bold text-gray-800">{reservations.length}</p>
                </div>
                <MapPin className="w-8 h-8 text-gold-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's Transfers</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {reservations.filter(r => r.date === new Date().toISOString().split('T')[0]).length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-gold-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Passengers</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {reservations.reduce((sum, r) => sum + r.passengers, 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-gold-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Popular Route</p>
                  <p className="text-lg font-bold text-gray-800">Podgorica → Budva</p>
                </div>
                <MapPin className="w-8 h-8 text-gold-500" />
              </div>
            </div>
          </div>
        ) : (
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
                    €{carRentals.reduce((sum, r) => sum + (r.total_price || 0), 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-gold-500" />
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
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={activeTab === 'transfers' ? "Search transfers..." : "Search car rentals..."}
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

        {/* Data Tables */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {activeTab === 'transfers' ? (
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-800">Customer</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-800">Route</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-800">Date & Time</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-800">Passengers</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-500">
                        {searchTerm || filterDate ? 'No transfers match your filters' : 'No transfers yet'}
                      </td>
                    </tr>
                  ) : (
                    filteredReservations.map((reservation) => (
                      <tr key={reservation.user_id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-semibold text-gray-800">{reservation.name}</div>
                            <div className="text-sm text-gray-600">{reservation.email}</div>
                            <div className="text-sm text-gray-600">{reservation.phone}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gold-500" />
                            <div>
                              <div className="font-medium text-gray-800">{reservation.pickup}</div>
                              <div className="text-sm text-gray-600">→ {reservation.destination}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-medium text-gray-800">{formatDate(reservation.date)}</div>
                            <div className="text-sm text-gray-600">{formatTime(reservation.time)}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-gold-500" />
                            <span className="font-medium text-gray-800">{reservation.passengers}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedReservation(reservation)}
                              className="flex items-center space-x-1 text-gold-500 hover:text-gold-600 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="text-sm">View</span>
                            </button>
                            <button
                              onClick={() => handleDeleteTransfer(reservation.user_id)}
                              disabled={deleteLoading === reservation.user_id}
                              className="flex items-center space-x-1 text-red-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {deleteLoading === reservation.user_id ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                              <span className="text-sm">
                                {deleteLoading === reservation.user_id ? 'Deleting...' : 'Delete'}
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
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
                  {filteredCarRentals.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-500">
                        {searchTerm || filterDate ? 'No car rentals match your filters' : 'No car rentals yet'}
                      </td>
                    </tr>
                  ) : (
                    filteredCarRentals.map((rental) => (
                      <tr key={rental.user_id} className="border-b hover:bg-gray-50 transition-colors">
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
                          <div className="font-bold text-gold-500 text-lg">€{rental.total_price || 0}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            rental.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            rental.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            rental.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {rental.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedCarRental(rental)}
                              className="flex items-center space-x-1 text-gold-500 hover:text-gold-600 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="text-sm">View</span>
                            </button>
                            <button
                              onClick={() => handleDeleteCarRental(rental.user_id)}
                              disabled={deleteLoading === rental.user_id}
                              className="flex items-center space-x-1 text-red-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {deleteLoading === rental.user_id ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                              <span className="text-sm">
                                {deleteLoading === rental.user_id ? 'Deleting...' : 'Delete'}
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Summary</h3>
          {activeTab === 'transfers' ? (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="font-bold text-gray-800">
                  {filteredReservations.length} / {reservations.length}
                </div>
                <div className="text-gray-600">Showing Transfers</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="font-bold text-gray-800">
                  {filteredReservations.reduce((sum, r) => sum + r.passengers, 0)}
                </div>
                <div className="text-gray-600">Total Passengers</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="font-bold text-gray-800">
                  {new Set(filteredReservations.map(r => r.pickup)).size}
                </div>
                <div className="text-gray-600">Unique Pickups</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="font-bold text-gray-800">
                  {new Set(filteredReservations.map(r => r.destination)).size}
                </div>
                <div className="text-gray-600">Unique Destinations</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="font-bold text-gray-800">
                  {filteredCarRentals.length} / {carRentals.length}
                </div>
                <div className="text-gray-600">Showing Rentals</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="font-bold text-gray-800">
                  €{filteredCarRentals.reduce((sum, r) => sum + (r.total_price || 0), 0)}
                </div>
                <div className="text-gray-600">Total Value</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="font-bold text-gray-800">
                  {filteredCarRentals.reduce((sum, r) => sum + calculateRentalDays(r.rental_start_date, r.rental_end_date), 0)}
                </div>
                <div className="text-gray-600">Total Days</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="font-bold text-gray-800">
                  {new Set(filteredCarRentals.map(r => r.vehicle_id)).size}
                </div>
                <div className="text-gray-600">Unique Vehicles</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reservation Detail Modal */}
      {selectedReservation && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Transfer Details</h3>
                <button
                  onClick={() => setSelectedReservation(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 p-2 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Customer Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Name</div>
                    <div className="font-medium text-gray-800">{selectedReservation.name}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-medium text-gray-800 break-all">{selectedReservation.email}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg sm:col-span-2">
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="font-medium text-gray-800">
                      <a href={`tel:${selectedReservation.phone}`} className="text-gold-500 hover:text-gold-600">
                        {selectedReservation.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transfer Details */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Transfer Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Pickup Location</div>
                    <div className="font-medium text-gray-800">{selectedReservation.pickup}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Destination</div>
                    <div className="font-medium text-gray-800">{selectedReservation.destination}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Date</div>
                    <div className="font-medium text-gray-800">{formatDate(selectedReservation.date)}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Time</div>
                    <div className="font-medium text-gray-800">{formatTime(selectedReservation.time)}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Passengers</div>
                    <div className="font-medium text-gray-800">{selectedReservation.passengers}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Booked On</div>
                    <div className="font-medium text-gray-800">
                      {new Date(selectedReservation.created_at).toLocaleDateString()}
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
                <button 
                  onClick={() => {
                    if (selectedReservation?.user_id) {
                      handleDeleteTransfer(selectedReservation.user_id);
                    }
                  }}
                  disabled={deleteLoading === selectedReservation.user_id || !selectedReservation.user_id}
                  className="flex items-center justify-center space-x-2 border-2 border-red-500 text-red-500 px-6 py-3 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading === selectedReservation.user_id ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span>
                    {deleteLoading === selectedReservation.user_id ? 'Deleting...' : 'Delete Transfer'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Car Rental Detail Modal */}
      {selectedCarRental && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Car Rental Details</h3>
                <button
                  onClick={() => setSelectedCarRental(null)}
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
                      <div className="font-bold text-gray-800 text-lg">{getVehicleName(selectedCarRental.vehicle_id)}</div>
                      <div className="text-sm text-gray-600">Vehicle ID: {selectedCarRental.vehicle_id}</div>
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
                    <div className="font-medium text-gray-800">{selectedCarRental.customer_name}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-medium text-gray-800 break-all">{selectedCarRental.customer_email}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg sm:col-span-2">
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="font-medium text-gray-800">
                      <a href={`tel:${selectedCarRental.customer_phone}`} className="text-gold-500 hover:text-gold-600">
                        {selectedCarRental.customer_phone}
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
                    <div className="font-medium text-gray-800">{formatDate(selectedCarRental.rental_start_date)}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">End Date</div>
                    <div className="font-medium text-gray-800">{formatDate(selectedCarRental.rental_end_date)}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Duration</div>
                    <div className="font-medium text-gray-800">
                      {calculateRentalDays(selectedCarRental.rental_start_date, selectedCarRental.rental_end_date)} day{calculateRentalDays(selectedCarRental.rental_start_date, selectedCarRental.rental_end_date) !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Total Price</div>
                    <div className="font-bold text-gold-500 text-lg">€{selectedCarRental.total_price || 0}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Status</div>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedCarRental.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        selectedCarRental.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        selectedCarRental.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedCarRental.status}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Booked On</div>
                    <div className="font-medium text-gray-800">
                      {new Date(selectedCarRental.created_at).toLocaleDateString()}
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
                <button 
                  onClick={() => {
                    if (selectedCarRental?.user_id) {
                      handleDeleteCarRental(selectedCarRental.user_id);
                    }
                  }}
                  disabled={deleteLoading === selectedCarRental.user_id || !selectedCarRental.user_id}
                  className="flex items-center justify-center space-x-2 border-2 border-red-500 text-red-500 px-6 py-3 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading === selectedCarRental.user_id ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span>
                    {deleteLoading === selectedCarRental.user_id ? 'Deleting...' : 'Delete Rental'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Transfer Reservation"
        message="Are you sure you want to delete this transfer reservation? This action cannot be undone and will permanently remove all associated data."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, reservationId: null })}
        type="danger"
      />

      {/* Delete Car Rental Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteCarRentalConfirm.isOpen}
        title="Delete Car Rental"
        message="Are you sure you want to delete this car rental? This action cannot be undone and will permanently remove all associated data."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteCarRental}
        onCancel={() => setDeleteCarRentalConfirm({ isOpen: false, rentalId: null })}
        type="danger"
      />
    </div>
  );
};

export default ReservationsPage;
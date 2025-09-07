import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to delete a reservation
export const deleteReservation = async (reservationId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('user_id', reservationId);

    if (error) {
      console.error('Supabase delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Delete reservation error:', err);
    return { success: false, error: 'Failed to delete reservation' };
  }
};

// Helper function to delete a car rental
export const deleteCarRental = async (rentalId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('car_rentals')
      .delete()
      .eq('id', rentalId);

    if (error) {
      console.error('Supabase delete car rental error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Delete car rental error:', err);
    return { success: false, error: 'Failed to delete car rental' };
  }
};
export type Database = {
  public: {
    Tables: {
      reservations: {
        Row: {
          user_id: string
          pickup: string
          destination: string
          date: string
          time: string
          passengers: number
          name: string
          phone: string
          email: string
          created_at: string
        }
        Insert: {
          user_id?: string
          pickup: string
          destination: string
          date: string
          time: string
          passengers: number
          name: string
          phone: string
          email: string
          created_at?: string
        }
        Update: {
          user_id?: string
          pickup?: string
          destination?: string
          date?: string
          time?: string
          passengers?: number
          name?: string
          phone?: string
          email?: string
          created_at?: string
        }
      }
      car_rentals: {
        Row: {
          id: string
          vehicle_id: string
          rental_start_date: string
          rental_end_date: string
          customer_name: string
          customer_email: string
          customer_phone: string
          total_price: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          vehicle_id: string
          rental_start_date: string
          rental_end_date: string
          customer_name: string
          customer_email: string
          customer_phone: string
          total_price?: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          rental_start_date?: string
          rental_end_date?: string
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          total_price?: number
          status?: string
          created_at?: string
        }
      }
    }
  }
}

// Helper function to format phone numbers consistently
export const formatPhoneNumber = (phone: string): string => {
  // Remove any existing country code if it's already there
  const cleanPhone = phone.replace(/^\+\d{1,4}/, '');
  return cleanPhone;
};

// Helper function to validate date ranges
export const validateDateRange = (startDate: string, endDate: string): { isValid: boolean; error?: string } => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (start < today) {
    return { isValid: false, error: 'Start date cannot be in the past' };
  }

  if (end <= start) {
    return { isValid: false, error: 'End date must be after start date' };
  }

  return { isValid: true };
};
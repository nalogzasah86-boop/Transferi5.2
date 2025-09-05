import { supabase } from './supabase';

export interface AvailabilityCheck {
  isAvailable: boolean;
  conflictingRentals?: Array<{
    id: string;
    customer_name: string;
    rental_start_date: string;
    rental_end_date: string;
    status: string;
  }>;
}

/**
 * Check if a car is available for the specified date range
 * @param vehicleId - The ID of the vehicle to check
 * @param startDate - Start date in YYYY-MM-DD format
 * @param endDate - End date in YYYY-MM-DD format
 * @param excludeRentalId - Optional rental ID to exclude from the check (for updates)
 * @returns Promise<AvailabilityCheck>
 */
export async function checkCarAvailability(
  vehicleId: string,
  startDate: string,
  endDate: string,
  excludeRentalId?: string
): Promise<AvailabilityCheck> {
  try {
    // Build the query to find overlapping rentals
    let query = supabase
      .from('car_rentals')
      .select('id, customer_name, rental_start_date, rental_end_date, status')
      .eq('vehicle_id', vehicleId)
      .in('status', ['confirmed', 'pending']) // Only check confirmed and pending rentals
      .or(`and(rental_start_date.lte.${endDate},rental_end_date.gte.${startDate})`);

    // Exclude a specific rental if provided (useful for updates)
    if (excludeRentalId) {
      query = query.neq('id', excludeRentalId);
    }

    const { data: conflictingRentals, error } = await query;

    if (error) {
      throw error;
    }

    const isAvailable = !conflictingRentals || conflictingRentals.length === 0;

    return {
      isAvailable,
      conflictingRentals: isAvailable ? undefined : conflictingRentals
    };
  } catch (error) {
    console.error('Error checking car availability:', error);
    throw new Error('Failed to check car availability');
  }
}

/**
 * Get all rentals for a specific vehicle within a date range
 * @param vehicleId - The ID of the vehicle
 * @param startDate - Start date in YYYY-MM-DD format
 * @param endDate - End date in YYYY-MM-DD format
 * @returns Promise<CarRental[]>
 */
export async function getVehicleRentals(
  vehicleId: string,
  startDate: string,
  endDate: string
) {
  try {
    const { data, error } = await supabase
      .from('car_rentals')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .gte('rental_start_date', startDate)
      .lte('rental_end_date', endDate)
      .order('rental_start_date', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching vehicle rentals:', error);
    throw new Error('Failed to fetch vehicle rentals');
  }
}

/**
 * Update rental status
 * @param rentalId - The ID of the rental to update
 * @param newStatus - The new status ('pending', 'confirmed', 'cancelled')
 * @returns Promise<boolean>
 */
export async function updateRentalStatus(
  rentalId: string,
  newStatus: 'pending' | 'confirmed' | 'cancelled'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('car_rentals')
      .update({ status: newStatus })
      .eq('id', rentalId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error updating rental status:', error);
    throw new Error('Failed to update rental status');
  }
}
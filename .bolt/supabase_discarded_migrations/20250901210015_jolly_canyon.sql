/*
  # Create car rentals table

  1. New Tables
    - `car_rentals`
      - `id` (uuid, primary key)
      - `vehicle_id` (text, references vehicle from vehicles data)
      - `rental_start_date` (date, when rental begins)
      - `rental_end_date` (date, when rental ends)
      - `customer_name` (text, customer full name)
      - `customer_email` (text, customer email address)
      - `customer_phone` (text, customer phone number)
      - `total_price` (numeric, calculated rental price)
      - `status` (text, rental status - pending, confirmed, cancelled)
      - `created_at` (timestamp, when reservation was made)

  2. Security
    - Enable RLS on `car_rentals` table
    - Add policy for public to insert new rentals
    - Add policy for public to read all rentals (for admin purposes)

  3. Notes
    - Default status is 'pending' for new reservations
    - Total price can be calculated based on daily rate and rental duration
    - Vehicle ID references the vehicle data structure from the application
*/

CREATE TABLE IF NOT EXISTS car_rentals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id text NOT NULL,
  rental_start_date date NOT NULL,
  rental_end_date date NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  total_price numeric DEFAULT 0,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE car_rentals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public car rental reservations"
  ON car_rentals
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow users to read car rentals"
  ON car_rentals
  FOR SELECT
  TO anon
  USING (true);
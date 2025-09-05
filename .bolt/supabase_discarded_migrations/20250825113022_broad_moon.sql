/*
  # Create reservations table

  1. New Tables
    - `reservations`
      - `id` (uuid, primary key)
      - `pickup` (text) - pickup location
      - `destination` (text) - destination location
      - `date` (date) - reservation date
      - `time` (time) - reservation time
      - `passengers` (integer) - number of passengers
      - `name` (text) - customer name
      - `phone` (text) - customer phone number
      - `email` (text) - customer email
      - `created_at` (timestamp) - when reservation was created

  2. Security
    - Enable RLS on `reservations` table
    - Add policy for public insert access (since this is a booking form)
*/

CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pickup text NOT NULL,
  destination text NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  passengers integer NOT NULL DEFAULT 1,
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert reservations (public booking form)
CREATE POLICY "Allow public reservations"
  ON reservations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow reading own reservations by email (for future customer portal)
CREATE POLICY "Allow users to read own reservations"
  ON reservations
  FOR SELECT
  TO anon
  USING (true);
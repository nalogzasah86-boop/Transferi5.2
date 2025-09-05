/**
 * Date validation utilities for preventing past date selections
 * and ensuring proper date range validation
 */

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Check if a date is in the past
 */
export const isDateInPast = (dateString: string): boolean => {
  const inputDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate < today;
};

/**
 * Check if a date range is valid (end date after start date, no past dates)
 */
export const validateDateRange = (startDate: string, endDate: string): {
  isValid: boolean;
  error?: string;
} => {
  if (!startDate || !endDate) {
    return { isValid: false, error: 'Both start and end dates are required' };
  }

  if (isDateInPast(startDate)) {
    return { isValid: false, error: 'Start date cannot be in the past' };
  }

  if (isDateInPast(endDate)) {
    return { isValid: false, error: 'End date cannot be in the past' };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end <= start) {
    return { isValid: false, error: 'End date must be after start date' };
  }

  return { isValid: true };
};

/**
 * Calculate the number of days between two dates
 */
export const calculateDaysBetween = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Format date for display
 */
export const formatDisplayDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Get minimum date for end date based on start date
 */
export const getMinEndDate = (startDate: string): string => {
  if (!startDate) return getTodayString();
  
  const start = new Date(startDate);
  const nextDay = new Date(start);
  nextDay.setDate(start.getDate() + 1);
  
  return nextDay.toISOString().split('T')[0];
};
/**
 * Format a date string to a more readable format
 * @param {string} dateString - ISO format date string
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Calculate time difference between two dates in a human-readable format
 * @param {string} date1 - First date as ISO string
 * @param {string} date2 - Second date as ISO string
 * @returns {string} - Formatted time difference
 */
export const getTimeDifference = (date1, date2) => {
  if (!date1 || !date2) return '';
  
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  // Get difference in milliseconds
  const diffMs = Math.abs(d2 - d1);
  
  // Convert to useful units
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);
  
  // Format based on the largest applicable unit
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  } else if (diffHrs > 0) {
    return `${diffHrs} hour${diffHrs > 1 ? 's' : ''}`;
  } else if (diffMin > 0) {
    return `${diffMin} minute${diffMin > 1 ? 's' : ''}`;
  } else {
    return `${diffSec} second${diffSec !== 1 ? 's' : ''}`;
  }
};

/**
 * Get a date N days ago from the current date
 * @param {number} days - Number of days to go back
 * @returns {Date} - Date object for N days ago
 */
export const getDateDaysAgo = (days) => {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - days);
  return pastDate;
};

/**
 * Format date for use in date inputs (YYYY-MM-DD)
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

export default {
  formatDate,
  getTimeDifference,
  getDateDaysAgo,
  formatDateForInput
};
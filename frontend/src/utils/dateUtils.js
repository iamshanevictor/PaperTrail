/**
 * Date and time utility functions
 */

// Default date format options
const DEFAULT_DATE_OPTIONS = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const DEFAULT_TIME_OPTIONS = {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
};

const DEFAULT_DATETIME_OPTIONS = {
  ...DEFAULT_DATE_OPTIONS,
  ...DEFAULT_TIME_OPTIONS,
};

/**
 * Formats a date string or Date object into a localized date string
 * @param {string|Date} date - The date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @param {string} locale - The locale to use for formatting
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}, locale = 'en-US') => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date:', date);
    return 'Invalid date';
  }
  
  const formatOptions = { ...DEFAULT_DATE_OPTIONS, ...options };
  return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
};

/**
 * Formats a date string or Date object into a localized time string
 * @param {string|Date} date - The date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @param {string} locale - The locale to use for formatting
 * @returns {string} Formatted time string
 */
export const formatTime = (date, options = {}, locale = 'en-US') => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date:', date);
    return 'Invalid time';
  }
  
  const formatOptions = { ...DEFAULT_TIME_OPTIONS, ...options };
  return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
};

/**
 * Formats a date string or Date object into a localized date and time string
 * @param {string|Date} date - The date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @param {string} locale - The locale to use for formatting
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date, options = {}, locale = 'en-US') => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date:', date);
    return 'Invalid date/time';
  }
  
  const formatOptions = { ...DEFAULT_DATETIME_OPTIONS, ...options };
  return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
};

/**
 * Formats a date as a relative time string (e.g., "2 days ago", "in 1 hour")
 * @param {string|Date} date - The date to format
 * @param {Object} options - Intl.RelativeTimeFormat options
 * @param {string} locale - The locale to use for formatting
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date, options = {}, locale = 'en-US') => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date:', date);
    return 'Invalid date';
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((dateObj - now) / 1000);
  
  // Define time units in seconds
  const units = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };
  
  // Find the most appropriate unit
  let unit = 'second';
  let value = diffInSeconds;
  
  for (const [u, seconds] of Object.entries(units)) {
    const absValue = Math.abs(diffInSeconds);
    
    if (absValue >= seconds) {
      unit = u;
      value = Math.round(diffInSeconds / seconds);
      break;
    }
  }
  
  // Format the relative time
  const rtf = new Intl.RelativeTimeFormat(locale, {
    numeric: 'auto',
    style: 'long',
    ...options,
  });
  
  return rtf.format(value, unit);
};

/**
 * Calculates the difference between two dates in the specified unit
 * @param {string|Date} date1 - The first date
 * @param {string|Date} date2 - The second date (defaults to now)
 * @param {string} unit - The unit to return the difference in ('years', 'months', 'days', 'hours', 'minutes', 'seconds')
 * @returns {number} The difference between the dates in the specified unit
 */
export const dateDiff = (date1, date2 = new Date(), unit = 'days') => {
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);
  
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    console.error('Invalid date(s) provided to dateDiff');
    return 0;
  }
  
  const diffInMs = d2 - d1;
  
  switch (unit.toLowerCase()) {
    case 'years':
      return d2.getFullYear() - d1.getFullYear();
    case 'months':
      return (d2.getFullYear() - d1.getFullYear()) * 12 + d2.getMonth() - d1.getMonth();
    case 'days':
      return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    case 'hours':
      return Math.floor(diffInMs / (1000 * 60 * 60));
    case 'minutes':
      return Math.floor(diffInMs / (1000 * 60));
    case 'seconds':
      return Math.floor(diffInMs / 1000);
    default:
      console.warn(`Unsupported unit '${unit}' in dateDiff, defaulting to days`);
      return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  }
};

/**
 * Adds a specified amount of time to a date
 * @param {string|Date} date - The base date
 * @param {number} amount - The amount to add
 * @param {string} unit - The unit of time to add ('years', 'months', 'days', 'hours', 'minutes', 'seconds')
 * @returns {Date} A new Date object with the time added
 */
export const addToDate = (date, amount, unit = 'days') => {
  const dateObj = date instanceof Date ? new Date(date) : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date provided to addToDate');
    return new Date();
  }
  
  const result = new Date(dateObj);
  
  switch (unit.toLowerCase()) {
    case 'years':
      result.setFullYear(result.getFullYear() + amount);
      break;
    case 'months':
      result.setMonth(result.getMonth() + amount);
      break;
    case 'days':
      result.setDate(result.getDate() + amount);
      break;
    case 'hours':
      result.setHours(result.getHours() + amount);
      break;
    case 'minutes':
      result.setMinutes(result.getMinutes() + amount);
      break;
    case 'seconds':
      result.setSeconds(result.getSeconds() + amount);
      break;
    default:
      console.warn(`Unsupported unit '${unit}' in addToDate, defaulting to days`);
      result.setDate(result.getDate() + amount);
  }
  
  return result;
};

/**
 * Checks if a date is today
 * @param {string|Date} date - The date to check
 * @returns {boolean} True if the date is today
 */
export const isToday = (date) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date provided to isToday');
    return false;
  }
  
  const today = new Date();
  
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

/**
 * Checks if a date is in the past
 * @param {string|Date} date - The date to check
 * @returns {boolean} True if the date is in the past
 */
export const isPastDate = (date) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date provided to isPastDate');
    return false;
  }
  
  return dateObj < new Date();
};

/**
 * Checks if a date is in the future
 * @param {string|Date} date - The date to check
 * @returns {boolean} True if the date is in the future
 */
export const isFutureDate = (date) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date provided to isFutureDate');
    return false;
  }
  
  return dateObj > new Date();
};

/**
 * Formats a duration in milliseconds into a human-readable string
 * @param {number} ms - Duration in milliseconds
 * @param {boolean} includeMs - Whether to include milliseconds in the output
 * @returns {string} Formatted duration string (e.g., "2h 30m 15s")
 */
export const formatDuration = (ms, includeMs = false) => {
  if (typeof ms !== 'number' || isNaN(ms)) {
    console.error('Invalid duration provided to formatDuration');
    return '0s';
  }
  
  const isNegative = ms < 0;
  const absoluteMs = Math.abs(ms);
  
  const seconds = Math.floor(absoluteMs / 1000) % 60;
  const minutes = Math.floor(absoluteMs / (1000 * 60)) % 60;
  const hours = Math.floor(absoluteMs / (1000 * 60 * 60)) % 24;
  const days = Math.floor(absoluteMs / (1000 * 60 * 60 * 24));
  const milliseconds = absoluteMs % 1000;
  
  const parts = [];
  
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || minutes > 0 || hours > 0 || days > 0) parts.push(`${seconds}s`);
  if (includeMs && (milliseconds > 0 || parts.length === 0)) parts.push(`${milliseconds}ms`);
  
  if (parts.length === 0) return '0s';
  
  return (isNegative ? '-' : '') + parts.join(' ');
};

/**
 * Converts a date to an ISO string without timezone conversion
 * @param {Date} date - The date to convert
 * @returns {string} ISO string without timezone
 */
export const toLocalISOString = (date) => {
  if (!(date instanceof Date)) {
    console.error('Invalid date provided to toLocalISOString');
    return '';
  }
  
  const tzOffset = date.getTimezoneOffset() * 60000; // Offset in milliseconds
  const localISOTime = new Date(date - tzOffset).toISOString().slice(0, -1);
  
  return localISOTime;
};

export default {
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  dateDiff,
  addToDate,
  isToday,
  isPastDate,
  isFutureDate,
  formatDuration,
  toLocalISOString,
};

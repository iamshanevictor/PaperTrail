/**
 * Validates if a value is not empty
 * @param {string} value - The value to validate
 * @returns {string|boolean} Error message if invalid, true if valid
 */
export const required = (value) => {
  if (!value && value !== 0) {
    return 'This field is required';
  }
  if (Array.isArray(value) && value.length === 0) {
    return 'At least one item is required';
  }
  if (typeof value === 'string' && value.trim() === '') {
    return 'This field cannot be empty';
  }
  return true;
};

/**
 * Validates if a value is a valid email address
 * @param {string} value - The email to validate
 * @returns {string|boolean} Error message if invalid, true if valid
 */
export const email = (value) => {
  if (!value) return true; // Skip if empty (use with required() if needed)
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(value) || 'Please enter a valid email address';
};

/**
 * Validates if a value meets a minimum length requirement
 * @param {string} value - The value to validate
 * @param {number} min - Minimum length required
 * @returns {string|boolean} Error message if invalid, true if valid
 */
export const minLength = (value, min) => {
  if (!value) return true; // Skip if empty
  return (
    value.length >= min || 
    `Must be at least ${min} character${min !== 1 ? 's' : ''} long`
  );
};

/**
 * Validates if a value doesn't exceed a maximum length
 * @param {string} value - The value to validate
 * @param {number} max - Maximum length allowed
 * @returns {string|boolean} Error message if invalid, true if valid
 */
export const maxLength = (value, max) => {
  if (!value) return true; // Skip if empty
  return (
    value.length <= max || 
    `Cannot exceed ${max} character${max !== 1 ? 's' : ''}`
  );
};

/**
 * Validates if a value contains only alphanumeric characters
 * @param {string} value - The value to validate
 * @returns {string|boolean} Error message if invalid, true if valid
 */
export const alphaNumeric = (value) => {
  if (!value) return true; // Skip if empty
  const alphaNumericRegex = /^[a-zA-Z0-9 ]+$/;
  return alphaNumericRegex.test(value) || 'Only letters and numbers are allowed';
};

/**
 * Validates if a value is a valid URL
 * @param {string} value - The URL to validate
 * @returns {string|boolean} Error message if invalid, true if valid
 */
export const url = (value) => {
  if (!value) return true; // Skip if empty
  try {
    new URL(value);
    return true;
  } catch (_) {
    return 'Please enter a valid URL';
  }
};

/**
 * Validates if two fields match (e.g., password confirmation)
 * @param {string} value1 - First value to compare
 * @param {string} value2 - Second value to compare
 * @param {string} fieldName - Name of the field being validated (for error message)
 * @returns {string|boolean} Error message if invalid, true if valid
 */
export const matches = (value1, value2, fieldName = 'Fields') => {
  return value1 === value2 || `${fieldName} do not match`;
};

/**
 * Validates if a value is a number
 * @param {any} value - The value to validate
 * @returns {string|boolean} Error message if invalid, true if valid
 */
export const isNumber = (value) => {
  if (value === undefined || value === null || value === '') return true;
  return !isNaN(Number(value)) || 'Must be a valid number';
};

/**
 * Validates if a number is within a specified range
 * @param {number} value - The number to validate
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {string|boolean} Error message if invalid, true if valid
 */
export const numberRange = (value, min, max) => {
  if (value === undefined || value === null || value === '') return true;
  const num = Number(value);
  if (isNaN(num)) return 'Must be a valid number';
  return (num >= min && num <= max) || `Must be between ${min} and ${max}`;
};

/**
 * Validates a value against a regular expression
 * @param {string} value - The value to validate
 * @param {RegExp} regex - The regular expression to test against
 * @param {string} message - Custom error message
 * @returns {string|boolean} Error message if invalid, true if valid
 */
export const pattern = (value, regex, message = 'Invalid format') => {
  if (!value) return true; // Skip if empty
  return regex.test(value) || message;
};

/**
 * Composes multiple validators into a single validation function
 * @param {...Function} validators - List of validator functions
 * @returns {Function} A function that runs all validators and returns the first error or true
 */
export const composeValidators = (...validators) => (value, allValues) => {
  return validators.reduce((error, validator) => {
    return error || validator(value, allValues);
  }, undefined);
};

/**
 * Creates a validator that requires a field if another field has a specific value
 * @param {string} fieldName - Name of the field to check
 * @param {any} expectedValue - The value that triggers the requirement
 * @param {string} message - Custom error message
 * @returns {Function} A validator function
 */
export const requiredIf = (fieldName, expectedValue, message = 'This field is required') => 
  (value, allValues) => {
    if (allValues[fieldName] === expectedValue) {
      return required(value) === true ? true : message;
    }
    return true;
  };

/**
 * Validates a date string is in the past
 * @param {string} value - The date string to validate
 * @returns {string|boolean} Error message if invalid, true if valid
 */
export const pastDate = (value) => {
  if (!value) return true;
  const date = new Date(value);
  return date < new Date() || 'Date must be in the past';
};

/**
 * Validates a date string is in the future
 * @param {string} value - The date string to validate
 * @returns {string|boolean} Error message if invalid, true if valid
 */
export const futureDate = (value) => {
  if (!value) return true;
  const date = new Date(value);
  return date > new Date() || 'Date must be in the future';
};

// Export all validators as a single object
export default {
  required,
  email,
  minLength,
  maxLength,
  alphaNumeric,
  url,
  matches,
  isNumber,
  numberRange,
  pattern,
  composeValidators,
  requiredIf,
  pastDate,
  futureDate
};

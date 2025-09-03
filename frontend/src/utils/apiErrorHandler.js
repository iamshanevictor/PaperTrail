/**
 * Handles API errors consistently across the application
 * @param {Error} error - The error object from the API call
 * @param {Object} options - Additional options for error handling
 * @param {boolean} options.showToast - Whether to show a toast notification (default: true)
 * @param {Function} options.onError - Callback function to handle the error
 * @param {string} options.defaultMessage - Default error message if none is provided
 * @returns {Object} An object containing the error message and status code
 */
const handleApiError = (error, options = {}) => {
  const {
    showToast = true,
    onError = null,
    defaultMessage = 'An unexpected error occurred. Please try again.'
  } = options;

  let errorMessage = defaultMessage;
  let statusCode = null;
  let validationErrors = {};
  let errorData = null;

  // Handle different types of errors
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { status, data } = error.response;
    statusCode = status;
    errorData = data;

    // Handle different HTTP status codes
    switch (status) {
      case 400:
        errorMessage = data.message || 'Bad request. Please check your input.';
        if (data.errors) {
          validationErrors = data.errors;
          errorMessage = 'Validation failed. Please check the form for errors.';
        }
        break;
      case 401:
        errorMessage = data.message || 'You are not authorized to perform this action.';
        // Optionally handle logout or token refresh here
        break;
      case 403:
        errorMessage = data.message || 'You do not have permission to perform this action.';
        break;
      case 404:
        errorMessage = data.message || 'The requested resource was not found.';
        break;
      case 422:
        errorMessage = data.message || 'Validation failed. Please check the form for errors.';
        if (data.errors) {
          validationErrors = data.errors;
        }
        break;
      case 429:
        errorMessage = 'Too many requests. Please try again later.';
        break;
      case 500:
        errorMessage = data.message || 'An internal server error occurred. Please try again later.';
        break;
      case 503:
        errorMessage = 'The service is currently unavailable. Please try again later.';
        break;
      default:
        errorMessage = data.message || defaultMessage;
    }
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage = 'No response from the server. Please check your internet connection.';
  } else {
    // Something happened in setting up the request that triggered an Error
    errorMessage = error.message || defaultMessage;
  }

  // Log the error for debugging
  if (process.env.NODE_ENV !== 'production') {
    console.error('API Error:', {
      message: errorMessage,
      status: statusCode,
      error: error,
      response: error.response,
      request: error.request,
      config: error.config,
    });
  }

  // Show toast notification if enabled
  if (showToast && typeof window !== 'undefined') {
    // You can replace this with your preferred toast notification library
    // For example: toast.error(errorMessage);
    console.error('Toast Notification:', errorMessage);
  }

  // Call the onError callback if provided
  if (typeof onError === 'function') {
    onError({
      message: errorMessage,
      status: statusCode,
      errors: validationErrors,
      data: errorData,
    });
  }

  // Return the error details
  return {
    message: errorMessage,
    status: statusCode,
    errors: validationErrors,
    data: errorData,
  };
};

/**
 * Creates a standardized API response object
 * @param {boolean} success - Whether the API call was successful
 * @param {any} data - The response data
 * @param {string} message - A message describing the result
 * @param {Object} meta - Additional metadata
 * @returns {Object} A standardized response object
 */
const createApiResponse = (success, data = null, message = '', meta = {}) => {
  return {
    success,
    data,
    message,
    ...meta,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Creates a success response
 * @param {any} data - The response data
 * @param {string} message - A success message
 * @param {Object} meta - Additional metadata
 * @returns {Object} A success response object
 */
const createSuccessResponse = (data = null, message = 'Operation completed successfully', meta = {}) => {
  return createApiResponse(true, data, message, meta);
};

/**
 * Creates an error response
 * @param {string} message - An error message
 * @param {any} data - Additional error data
 * @param {Object} meta - Additional metadata
 * @returns {Object} An error response object
 */
const createErrorResponse = (message = 'An error occurred', data = null, meta = {}) => {
  return createApiResponse(false, data, message, meta);
};

/**
 * Validates that a response has the expected structure
 * @param {Object} response - The API response to validate
 * @param {Array} requiredFields - Fields that must be present in the response data
 * @returns {Object} The validated response or throws an error
 */
const validateApiResponse = (response, requiredFields = []) => {
  if (!response) {
    throw new Error('No response received from the server');
  }

  if (response.status >= 400) {
    throw new Error(response.statusText || 'Request failed');
  }

  const { data } = response;

  if (!data) {
    throw new Error('No data in response');
  }

  // Check for required fields in the response data
  if (Array.isArray(requiredFields) && requiredFields.length > 0) {
    const missingFields = requiredFields.filter(field => !(field in data));
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields in response: ${missingFields.join(', ')}`);
    }
  }

  return response;
};

export {
  handleApiError,
  createApiResponse,
  createSuccessResponse,
  createErrorResponse,
  validateApiResponse,
};

export default {
  handleApiError,
  createApiResponse,
  createSuccessResponse,
  createErrorResponse,
  validateApiResponse,
};

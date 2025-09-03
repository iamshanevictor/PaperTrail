import jwtDecode from 'jwt-decode';

const TOKEN_KEY = 'papertrail_auth_token';
const REFRESH_TOKEN_KEY = 'papertrail_refresh_token';
const USER_KEY = 'papertrail_user';

/**
 * Checks if the current environment is a browser
 * @returns {boolean} True if running in a browser environment
 */
const isBrowser = () => typeof window !== 'undefined';

/**
 * Saves the authentication token to storage
 * @param {string} token - The JWT token
 * @param {boolean} rememberMe - Whether to persist the token beyond the session
 */
export const setAuthToken = (token, rememberMe = false) => {
  if (!isBrowser()) return;
  
  try {
    if (rememberMe) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
    }
  } catch (error) {
    console.error('Error saving auth token:', error);
  }
};

/**
 * Retrieves the authentication token from storage
 * @returns {string|null} The JWT token or null if not found
 */
export const getAuthToken = () => {
  if (!isBrowser()) return null;
  
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

/**
 * Saves the refresh token to storage
 * @param {string} refreshToken - The refresh token
 */
export const setRefreshToken = (refreshToken) => {
  if (!isBrowser()) return;
  
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch (error) {
    console.error('Error saving refresh token:', error);
  }
};

/**
 * Retrieves the refresh token from storage
 * @returns {string|null} The refresh token or null if not found
 */
export const getRefreshToken = () => {
  if (!isBrowser()) return null;
  
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Saves the user data to storage
 * @param {Object} user - The user data to store
 * @param {boolean} rememberMe - Whether to persist the user data beyond the session
 */
export const setUser = (user, rememberMe = false) => {
  if (!isBrowser()) return;
  
  try {
    const userData = JSON.stringify(user);
    if (rememberMe) {
      localStorage.setItem(USER_KEY, userData);
    } else {
      sessionStorage.setItem(USER_KEY, userData);
    }
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

/**
 * Retrieves the user data from storage
 * @returns {Object|null} The user data or null if not found
 */
export const getUser = () => {
  if (!isBrowser()) return null;
  
  try {
    const userData = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Clears all authentication data from storage
 */
export const clearAuth = () => {
  if (!isBrowser()) return;
  
  try {
    // Clear tokens from both storage locations
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    
    // Clear refresh token (only in localStorage)
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    
    // Clear user data from both storage locations
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error clearing authentication data:', error);
  }
};

/**
 * Checks if the current user is authenticated
 * @returns {boolean} True if the user is authenticated
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    
    // Check if token is expired
    if (decoded.exp < currentTime) {
      clearAuth();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error decoding token:', error);
    clearAuth();
    return false;
  }
};

/**
 * Gets the current user's ID from the token
 * @returns {string|null} The user ID or null if not found
 */
export const getCurrentUserId = () => {
  const token = getAuthToken();
  
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.sub || decoded.userId || null;
  } catch (error) {
    console.error('Error getting user ID from token:', error);
    return null;
  }
};

/**
 * Gets the current user's roles from the token
 * @returns {Array<string>} An array of roles or an empty array if none found
 */
export const getUserRoles = () => {
  const token = getAuthToken();
  
  if (!token) return [];
  
  try {
    const decoded = jwtDecode(token);
    if (Array.isArray(decoded.roles)) {
      return decoded.roles;
    } else if (decoded.role) {
      return [decoded.role];
    }
    return [];
  } catch (error) {
    console.error('Error getting user roles from token:', error);
    return [];
  }
};

/**
 * Checks if the current user has a specific role
 * @param {string|Array<string>} roles - The role(s) to check for
 * @returns {boolean} True if the user has any of the specified roles
 */
export const hasRole = (roles) => {
  if (!roles) return false;
  
  const userRoles = getUserRoles();
  const rolesToCheck = Array.isArray(roles) ? roles : [roles];
  
  return rolesToCheck.some(role => userRoles.includes(role));
};

/**
 * Checks if the current user has all of the specified roles
 * @param {string|Array<string>} roles - The role(s) to check for
 * @returns {boolean} True if the user has all of the specified roles
 */
export const hasAllRoles = (roles) => {
  if (!roles) return false;
  
  const userRoles = getUserRoles();
  const rolesToCheck = Array.isArray(roles) ? roles : [roles];
  
  return rolesToCheck.every(role => userRoles.includes(role));
};

/**
 * Gets the token expiration time
 * @returns {number|null} The expiration timestamp in seconds or null if not available
 */
export const getTokenExpiration = () => {
  const token = getAuthToken();
  
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.exp || null;
  } catch (error) {
    console.error('Error getting token expiration:', error);
    return null;
  }
};

/**
 * Checks if the token will expire soon
 * @param {number} threshold - Time in seconds before expiration to consider as "soon"
 * @returns {boolean} True if the token will expire within the threshold
 */
export const isTokenExpiringSoon = (threshold = 300) => { // 5 minutes default
  const expiration = getTokenExpiration();
  
  if (!expiration) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return (expiration - currentTime) < threshold;
};

export default {
  setAuthToken,
  getAuthToken,
  setRefreshToken,
  getRefreshToken,
  setUser,
  getUser,
  clearAuth,
  isAuthenticated,
  getCurrentUserId,
  getUserRoles,
  hasRole,
  hasAllRoles,
  getTokenExpiration,
  isTokenExpiringSoon,
};

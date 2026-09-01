// API base URL pointing to the authentication endpoints
const API_BASE_URL = "/api/auth";

/**
 * Register a new user
 * @param {Object} userData - { username, email, password }
 * @returns {Promise<Object>} Response containing token and user info
 */
export const signup = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create account. Please try again.");
  }

  return data;
};

/**
 * Log in an existing user
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} Response containing token and user info
 */
export const login = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Invalid email or password");
  }

  return data;
};

/**
 * Fetch the currently authenticated user profile
 * @param {string} token - JWT authentication token
 * @returns {Promise<Object>} User data
 */
export const getCurrentUser = async (token) => {
  const response = await fetch(`${API_BASE_URL}/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Session expired. Please log in again.");
  }

  return data;
};

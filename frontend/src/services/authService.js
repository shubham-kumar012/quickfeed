// Auth API base URL (Vite proxies this to localhost:5000 in dev)
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "";
const API_BASE_URL = `${BACKEND_URL}/api/auth`;

// Send signup request to backend
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

// Send login request to backend
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

// Fetch current user details using stored JWT token
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

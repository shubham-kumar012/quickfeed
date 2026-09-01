import React, { createContext, useContext, useState, useEffect } from "react";
import { signup as signupApi, login as loginApi, getCurrentUser } from "../services/authService";

// Create context to store login session across the entire React app
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // When the app loads, check if the user already has a saved token in localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        try {
          // Ask backend who this token belongs to
          const data = await getCurrentUser(storedToken);
          setUser(data.user);
          setToken(storedToken);
        } catch (error) {
          console.error("Session expired or invalid:", error.message);
          // If token is invalid or expired, remove it from browser
          localStorage.removeItem("token");
          setUser(null);
          setToken(null);
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Signup function: sends details to backend and saves received token
  const signup = async (username, email, password) => {
    const data = await signupApi({ username, email, password });
    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  // Login function: verifies credentials and saves received token
  const login = async (email, password) => {
    const data = await loginApi({ email, password });
    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  // Logout function: clears token from localStorage and resets state
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user && token),
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom helper hook so components can easily access auth state
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;

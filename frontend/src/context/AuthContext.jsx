import React, { createContext, useContext, useState, useEffect } from "react";
import { signup as signupApi, login as loginApi, getCurrentUser } from "../services/authService";

// 1. Create the Auth Context
const AuthContext = createContext(null);

// 2. Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Check if token exists on mount and verify with backend
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        try {
          // Fetch current user from /api/auth/me
          const data = await getCurrentUser(storedToken);
          setUser(data.user);
          setToken(storedToken);
        } catch (error) {
          console.error("Token verification failed:", error.message);
          // Token is invalid or expired, clear it
          localStorage.removeItem("token");
          setUser(null);
          setToken(null);
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Handle Signup
  const signup = async (username, email, password) => {
    const data = await signupApi({ username, email, password });
    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  // Handle Login
  const login = async (email, password) => {
    const data = await loginApi({ email, password });
    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  // Handle Logout
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

// 3. Custom hook to consume the Auth Context easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;

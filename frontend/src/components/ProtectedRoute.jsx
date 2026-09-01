import React from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";

// Route wrapper that only allows logged-in users to view the page
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // While checking if user is logged in, show a simple spinner
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0B0F17",
        }}
      >
        <CircularProgress size={32} sx={{ color: "#3B82F6" }} />
      </Box>
    );
  }

  // Not logged in? Send them to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in! Render the requested page
  return children;
};

export default ProtectedRoute;

import React from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";

// Route wrapper for public pages (Login/Signup) so logged-in users don't see them again
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show small spinner while checking session
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

  // Already logged in? Redirect directly to the feed
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  // Not logged in! Show login or signup form
  return children;
};

export default PublicRoute;

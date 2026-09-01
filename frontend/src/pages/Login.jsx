import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Stack,
  IconButton,
  InputAdornment,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

// Login page component
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form input state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Password visibility and form error state
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form inputs as user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error message when user starts typing again
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Toggle password visibility between text and hidden dots
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Client-side form validation before making backend call
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Check password
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit login credentials to backend
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login(formData.email.trim(), formData.password);
      // On success, redirect user to the social feed
      navigate("/home");
    } catch (err) {
      setErrorMessage(
        err.message || "Unable to sign in. Please check your email and password."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account"
    >
      {/* Top error alert */}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: "8px" }}>
          {errorMessage}
        </Alert>
      )}

      <Box component="form" onSubmit={handleLogin} noValidate>
        <Stack spacing={2.5}>
          {/* Email input field */}
          <Box>
            <Typography
              variant="body2"
              component="label"
              htmlFor="email"
              sx={{
                fontWeight: 600,
                color: "#F5F7FA",
                mb: 0.75,
                display: "block",
                fontSize: "0.875rem",
              }}
            >
              Email
            </Typography>
            <TextField
              id="email"
              name="email"
              type="email"
              fullWidth
              size="small"
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
              disabled={isSubmitting}
            />
          </Box>

          {/* Password input field with show/hide toggle */}
          <Box>
            <Typography
              variant="body2"
              component="label"
              htmlFor="password"
              sx={{
                fontWeight: 600,
                color: "#F5F7FA",
                mb: 0.75,
                display: "block",
                fontSize: "0.875rem",
              }}
            >
              Password
            </Typography>
            <TextField
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              size="small"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={Boolean(errors.password)}
              helperText={errors.password}
              disabled={isSubmitting}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={handleTogglePassword}
                        edge="end"
                        size="small"
                        sx={{ color: "#7F8A9D" }}
                      >
                        {showPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          {/* Sign in button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={isSubmitting}
            sx={{
              mt: 1,
              py: 1.25,
              fontSize: "0.9375rem",
              borderRadius: "8px",
              fontWeight: 600,
            }}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </Stack>
      </Box>

      {/* Link to signup page */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="body2" sx={{ color: "#A7B1C2" }}>
          Don't have an account?{" "}
          <Link
            component={RouterLink}
            to="/signup"
            underline="hover"
            sx={{
              fontWeight: 600,
              color: "#3B82F6",
            }}
          >
            Sign up
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
};

export default Login;

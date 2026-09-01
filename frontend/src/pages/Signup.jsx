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

// Signup page component
const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  // Form input state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Password visibility and form error state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  // Client-side form validation before making backend call
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    // Check username: no spaces, alphanumeric with underscores, 3-30 characters
    const trimmedUsername = formData.username.trim();
    if (!trimmedUsername) {
      newErrors.username = "Username is required";
    } else if (/\s/.test(formData.username)) {
      newErrors.username = "Username cannot contain spaces";
    } else if (trimmedUsername.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (trimmedUsername.length > 30) {
      newErrors.username = "Username cannot exceed 30 characters";
    } else if (!usernameRegex.test(trimmedUsername)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
    }

    // Check email format
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Check password length
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Check password confirmation match
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit signup form to backend
  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await signup(
        formData.username.trim(),
        formData.email.trim(),
        formData.password
      );
      // On success, redirect user directly into the feed
      navigate("/home");
    } catch (err) {
      setErrorMessage(
        err.message || "Failed to create account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join QuickFeed to share and connect"
    >
      {/* Top error alert */}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: "8px" }}>
          {errorMessage}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSignup} noValidate>
        <Stack spacing={2.25}>
          {/* 1. Username input field */}
          <Box>
            <Typography
              variant="body2"
              component="label"
              htmlFor="username"
              sx={{
                fontWeight: 600,
                color: "#F5F7FA",
                mb: 0.75,
                display: "block",
                fontSize: "0.875rem",
              }}
            >
              Username
            </Typography>
            <TextField
              id="username"
              name="username"
              fullWidth
              size="small"
              autoComplete="username"
              autoFocus
              placeholder="e.g. shubham_123"
              value={formData.username}
              onChange={handleChange}
              error={Boolean(errors.username)}
              helperText={errors.username}
              disabled={isSubmitting}
            />
          </Box>

          {/* 2. Email input field */}
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
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
              disabled={isSubmitting}
            />
          </Box>

          {/* 3. Password input field */}
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
              autoComplete="new-password"
              placeholder="At least 6 characters"
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
                        onClick={() => setShowPassword((prev) => !prev)}
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

          {/* 4. Confirm Password input field */}
          <Box>
            <Typography
              variant="body2"
              component="label"
              htmlFor="confirmPassword"
              sx={{
                fontWeight: 600,
                color: "#F5F7FA",
                mb: 0.75,
                display: "block",
                fontSize: "0.875rem",
              }}
            >
              Confirm Password
            </Typography>
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              fullWidth
              size="small"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword}
              disabled={isSubmitting}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        edge="end"
                        size="small"
                        sx={{ color: "#7F8A9D" }}
                      >
                        {showConfirmPassword ? (
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

          {/* Submit button */}
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
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </Stack>
      </Box>

      {/* Link to login page */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="body2" sx={{ color: "#A7B1C2" }}>
          Already have an account?{" "}
          <Link
            component={RouterLink}
            to="/login"
            underline="hover"
            sx={{
              fontWeight: 600,
              color: "#3B82F6",
            }}
          >
            Sign in
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
};

export default Signup;

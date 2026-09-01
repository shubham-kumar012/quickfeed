import React from "react";
import { Box, Container, Paper, Typography, Stack } from "@mui/material";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";

// Reusable centered layout wrapper for Login and Signup screens
const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0B0F17",
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 6 },
      }}
    >
      <Container maxWidth="xs" disableGutters>
        {/* QuickFeed Brand Logo Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1.25}
          sx={{ mb: 3.5, userSelect: "none" }}
        >
          <DynamicFeedIcon
            sx={{ fontSize: 30, color: "#3B82F6" }}
          />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#F5F7FA",
              fontSize: "1.5rem",
            }}
          >
            QuickFeed
          </Typography>
        </Stack>

        {/* Card Form Container */}
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: "14px",
            borderColor: "#253247",
            backgroundColor: "#111827",
            boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.35)",
          }}
        >
          {title && (
            <Box sx={{ mb: 3, textAlign: "center" }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 700,
                  color: "#F5F7FA",
                  fontSize: "1.25rem",
                  mb: 0.75,
                }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" sx={{ color: "#A7B1C2", fontSize: "0.875rem" }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
          )}

          {children}
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;

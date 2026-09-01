import React from "react";
import { Box, Container, Paper, Typography, Stack } from "@mui/material";
import DynamicFeedOutlinedIcon from "@mui/icons-material/DynamicFeedOutlined";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "background.default",
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 6 },
      }}
    >
      <Container maxWidth="xs" disableGutters>
        {/* Brand Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1}
          sx={{ mb: 3 }}
        >
          <DynamicFeedOutlinedIcon
            sx={{ fontSize: 28, color: "primary.main" }}
          />
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "text.primary",
            }}
          >
            Socially
          </Typography>
        </Stack>

        {/* Card Form Container */}
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 2,
            borderColor: "divider",
            backgroundColor: "background.paper",
          }}
        >
          {title && (
            <Box sx={{ mb: 3, textAlign: "center" }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 600,
                  mb: 0.75,
                }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary">
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

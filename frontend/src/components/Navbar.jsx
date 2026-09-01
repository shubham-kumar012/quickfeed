import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Top navigation bar showing QuickFeed brand, user profile, and logout button
const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Log out user and send them back to login page
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get the first letter of the username for the avatar
  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : "U";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#111827",
        borderBottom: "1px solid #253247",
        height: 64,
        justifyContent: "center",
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: 800,
          mx: "auto",
          px: { xs: 2, sm: 3 },
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            justifyContent: "space-between",
            minHeight: "64px !important",
          }}
        >
          {/* QuickFeed Brand Logo & Name */}
          <Stack
            component={RouterLink}
            to="/home"
            direction="row"
            alignItems="center"
            spacing={1.25}
            sx={{
              textDecoration: "none",
              color: "text.primary",
              userSelect: "none",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "primary.main",
              }}
            >
              <DynamicFeedIcon sx={{ fontSize: 24, color: "#3B82F6" }} />
            </Box>
            <Typography
              variant="h6"
              component="span"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#F5F7FA",
                fontSize: "1.25rem",
              }}
            >
              QuickFeed
            </Typography>
          </Stack>

          {/* User Profile Info & Logout Button */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* User avatar and username */}
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: "#3B82F6",
                  color: "#FFFFFF",
                  width: 34,
                  height: 34,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                {userInitial}
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#F5F7FA",
                  fontSize: "0.90625rem",
                  display: { xs: "none", sm: "block" },
                  maxWidth: 160,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.username || "User"}
              </Typography>
            </Stack>

            {/* Desktop Logout Button */}
            <Button
              onClick={handleLogout}
              startIcon={<LogoutOutlinedIcon sx={{ fontSize: "0.95rem !important" }} />}
              variant="outlined"
              size="small"
              sx={{
                display: { xs: "none", sm: "inline-flex" },
                px: 1.5,
                py: 0.5,
                fontSize: "0.8125rem",
                color: "#A7B1C2",
                borderColor: "#253247",
                backgroundColor: "transparent",
                "&:hover": {
                  color: "#F5F7FA",
                  backgroundColor: "#1A2537",
                  borderColor: "#31405A",
                },
              }}
            >
              Logout
            </Button>

            {/* Mobile Logout Icon */}
            <Tooltip title="Logout">
              <IconButton
                onClick={handleLogout}
                size="small"
                aria-label="Logout"
                sx={{
                  display: { xs: "inline-flex", sm: "none" },
                  color: "#A7B1C2",
                  border: "1px solid #253247",
                  p: 0.75,
                  "&:hover": {
                    color: "#F5F7FA",
                    backgroundColor: "#1A2537",
                    borderColor: "#31405A",
                  },
                }}
              >
                <LogoutOutlinedIcon sx={{ fontSize: "1.1rem" }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;

import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import DynamicFeedOutlinedIcon from "@mui/icons-material/DynamicFeedOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get initial for avatar
  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : "U";

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="md">
        <Toolbar disableGutters sx={{ justifyContent: "space-between", minHeight: 60 }}>
          {/* Logo & Brand */}
          <Stack
            component={RouterLink}
            to="/home"
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              textDecoration: "none",
              color: "text.primary",
            }}
          >
            <DynamicFeedOutlinedIcon sx={{ color: "primary.main", fontSize: 24 }} />
            <Typography
              variant="h6"
              component="span"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "text.primary",
                fontSize: "1.125rem",
              }}
            >
              Socially
            </Typography>
          </Stack>

          {/* User Info & Logout Button */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* User chip / badge */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mr: 0.5 }}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 32,
                  height: 32,
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
                  color: "text.primary",
                  display: { xs: "none", sm: "block" },
                }}
              >
                {user?.username || "User"}
              </Typography>
            </Stack>

            {/* Desktop Logout Button */}
            <Button
              onClick={handleLogout}
              startIcon={<LogoutOutlinedIcon />}
              variant="outlined"
              size="small"
              sx={{
                display: { xs: "none", sm: "inline-flex" },
                px: 1.5,
                py: 0.5,
              }}
            >
              Logout
            </Button>

            {/* Mobile Icon Logout Button */}
            <Tooltip title="Logout">
              <IconButton
                onClick={handleLogout}
                size="small"
                aria-label="Logout"
                sx={{
                  display: { xs: "inline-flex", sm: "none" },
                  color: "text.secondary",
                  "&:hover": { color: "text.primary" },
                }}
              >
                <LogoutOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;

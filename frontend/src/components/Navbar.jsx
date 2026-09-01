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
} from "@mui/material";
import DynamicFeedOutlinedIcon from "@mui/icons-material/DynamicFeedOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate, Link as RouterLink } from "react-router-dom";

const Navbar = ({ activeTab = "home" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Navigate back to login
    navigate("/login");
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="md">
        <Toolbar disableGutters sx={{ justifyContent: "space-between", minHeight: 64 }}>
          {/* Logo */}
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
            <DynamicFeedOutlinedIcon sx={{ color: "primary.main", fontSize: 26 }} />
            <Typography
              variant="h6"
              component="span"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "text.primary",
              }}
            >
              Socially
            </Typography>
          </Stack>

          {/* Navigation Links */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              component={RouterLink}
              to="/home"
              startIcon={<HomeOutlinedIcon />}
              variant={activeTab === "home" ? "contained" : "text"}
              size="small"
              sx={{
                color: activeTab === "home" ? "primary.contrastText" : "text.secondary",
                "&:hover": {
                  color: activeTab === "home" ? "primary.contrastText" : "text.primary",
                },
              }}
            >
              Home
            </Button>

            <Button
              startIcon={<PersonOutlineOutlinedIcon />}
              variant={activeTab === "profile" ? "contained" : "text"}
              size="small"
              sx={{
                color: activeTab === "profile" ? "primary.contrastText" : "text.secondary",
                "&:hover": {
                  color: activeTab === "profile" ? "primary.contrastText" : "text.primary",
                },
              }}
            >
              Profile
            </Button>

            <Button
              onClick={handleLogout}
              startIcon={<LogoutOutlinedIcon />}
              variant="outlined"
              size="small"
              sx={{ ml: 1, display: { xs: "none", sm: "inline-flex" } }}
            >
              Sign Out
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;

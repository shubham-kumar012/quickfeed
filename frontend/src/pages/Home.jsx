import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Avatar,
} from "@mui/material";
import DynamicFeedOutlinedIcon from "@mui/icons-material/DynamicFeedOutlined";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const username = user?.username || "User";
  const userInitial = username.charAt(0).toUpperCase();

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Feed Area */}
      <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 5 } }}>
        <Stack spacing={3}>
          {/* Welcome Greeting Header */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderRadius: 2,
              backgroundColor: "background.paper",
              borderColor: "divider",
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 46,
                  height: 46,
                  fontWeight: 600,
                  fontSize: "1.125rem",
                }}
              >
                {userInitial}
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  component="h1"
                  sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.3 }}
                >
                  Welcome back, {username}.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your social feed will appear here.
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Social Feed Placeholder Card */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 4, sm: 6 },
              borderRadius: 2,
              backgroundColor: "background.paper",
              borderColor: "divider",
              textAlign: "center",
            }}
          >
            <Stack spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "primary.main",
                }}
              >
                <DynamicFeedOutlinedIcon sx={{ fontSize: 28 }} />
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ fontWeight: 600, mb: 0.75, color: "text.primary" }}
                >
                  Social feed coming soon
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ maxWidth: 380, mx: "auto", lineHeight: 1.6 }}
                >
                  Posts, likes and comments will be added in the next phase.
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

export default Home;

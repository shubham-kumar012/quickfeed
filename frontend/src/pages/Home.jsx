import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stack,
  Divider,
  Snackbar,
  Alert,
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import Navbar from "../components/Navbar";

const Home = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCreatePostClick = () => {
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      {/* Top Navigation */}
      <Navbar activeTab="home" />

      {/* Main Content Area */}
      <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 5 } }}>
        <Stack spacing={3}>
          {/* Welcome User Card / Banner */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderRadius: 2,
              backgroundColor: "background.paper",
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 48,
                  height: 48,
                  fontWeight: 600,
                  fontSize: "1.125rem",
                }}
              >
                S
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  component="h1"
                  sx={{ fontWeight: 700, color: "text.primary" }}
                >
                  Welcome, Shubham
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ready to share an update with your network?
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Social Feed Placeholder Section */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 4, sm: 6 },
              borderRadius: 2,
              backgroundColor: "background.paper",
              textAlign: "center",
            }}
          >
            <Stack spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  backgroundColor: "rgba(59, 130, 246, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "primary.main",
                }}
              >
                <PostAddOutlinedIcon sx={{ fontSize: 32 }} />
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ fontWeight: 600, mb: 0.5, color: "text.primary" }}
                >
                  Your social feed will appear here.
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ maxWidth: 360, mx: "auto" }}
                >
                  When you create posts or follow creators, updates and discussions will be displayed right here.
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleCreatePostClick}
                sx={{
                  mt: 1.5,
                  px: 3,
                  py: 1,
                }}
              >
                Create your first post
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>

      {/* Temporary feedback for demo button */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="info"
          sx={{ width: "100%", borderRadius: 1.5 }}
        >
          Post creation feature will be available once the post feed is implemented.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;

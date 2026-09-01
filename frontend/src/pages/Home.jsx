import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  CircularProgress,
  Button,
  Alert,
  Paper,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import DynamicFeedOutlinedIcon from "@mui/icons-material/DynamicFeedOutlined";
import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import { getPosts } from "../services/postService";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load public posts from the backend
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      setError(
        err.message || "Unable to load posts. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Prepend newly created post to the feed instantly
  const handlePostCreated = (newPost) => {
    if (newPost) {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      {/* Top Sticky Header */}
      <Navbar />

      {/* Main Centered Content Container */}
      <Container
        maxWidth={false}
        sx={{
          maxWidth: 720,
          mx: "auto",
          py: { xs: 2.5, sm: 4 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Stack spacing={3}>
          {/* Create Post Section */}
          <CreatePost onPostCreated={handlePostCreated} />

          {/* Public Feed Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pt: 1,
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                fontSize: "1.125rem",
                letterSpacing: "-0.01em",
              }}
            >
              Public Feed
            </Typography>

            <Button
              size="small"
              startIcon={<RefreshIcon sx={{ fontSize: "1rem !important" }} />}
              onClick={fetchPosts}
              disabled={loading}
              sx={{
                color: "text.secondary",
                fontSize: "0.8125rem",
                "&:hover": {
                  color: "primary.main",
                  backgroundColor: "transparent",
                },
              }}
            >
              Refresh
            </Button>
          </Box>

          {/* Loading State */}
          {loading && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 6,
              }}
            >
              <CircularProgress size={36} sx={{ color: "primary.main", mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Loading posts...
              </Typography>
            </Box>
          )}

          {/* Error State */}
          {!loading && error && (
            <Alert
              severity="error"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={fetchPosts}
                  sx={{ fontWeight: 600 }}
                >
                  Try Again
                </Button>
              }
              sx={{ borderRadius: 2 }}
            >
              {error}
            </Alert>
          )}

          {/* Empty Feed State */}
          {!loading && !error && posts.length === 0 && (
            <Paper
              variant="outlined"
              sx={{
                p: { xs: 4, sm: 5 },
                borderRadius: 2,
                backgroundColor: "background.paper",
                borderColor: "divider",
                textAlign: "center",
              }}
            >
              <Stack spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "primary.main",
                    mb: 0.5,
                  }}
                >
                  <DynamicFeedOutlinedIcon sx={{ fontSize: 26 }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "text.primary" }}
                >
                  No posts yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Be the first person to share something.
                </Typography>
              </Stack>
            </Paper>
          )}

          {/* Public Posts Feed List */}
          {!loading && !error && posts.length > 0 && (
            <Stack spacing={2}>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default Home;

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
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import { getPosts } from "../services/postService";
import { useAuth } from "../context/AuthContext";

// Main home page with create post box and community social feed
const Home = () => {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all posts from the backend
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getPosts(token);
      setPosts(data);
    } catch (err) {
      setError(
        err.message || "Unable to load posts. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Load feed once component mounts
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Prepend newly created post to the top of the feed immediately
  const handlePostCreated = (newPost) => {
    if (newPost) {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#0B0F17" }}>
      {/* Top navigation header */}
      <Navbar />

      {/* Main centered container */}
      <Container
        maxWidth={false}
        sx={{
          maxWidth: 800,
          mx: "auto",
          py: { xs: 3, sm: 4.5 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Stack spacing={3.5}>
          {/* Create Post composer */}
          <CreatePost onPostCreated={handlePostCreated} />

          {/* Public feed section title and refresh button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pt: 0.5,
              px: 0.5,
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 700,
                color: "#F5F7FA",
                fontSize: "1.25rem",
                letterSpacing: "-0.015em",
              }}
            >
              Public Feed
            </Typography>

            {/* Refresh feed button */}
            <Button
              size="small"
              startIcon={<RefreshIcon sx={{ fontSize: "1rem !important" }} />}
              onClick={fetchPosts}
              disabled={loading}
              sx={{
                color: "#A7B1C2",
                fontSize: "0.84375rem",
                textTransform: "none",
                fontWeight: 600,
                px: 1.25,
                py: 0.5,
                borderRadius: "8px",
                "&:hover": {
                  color: "#F5F7FA",
                  backgroundColor: "#1A2537",
                },
              }}
            >
              Refresh
            </Button>
          </Box>

          {/* Feed loading indicator */}
          {loading && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 8,
              }}
            >
              <CircularProgress size={32} sx={{ color: "#3B82F6", mb: 2 }} />
              <Typography variant="body2" sx={{ color: "#7F8A9D" }}>
                Loading feed...
              </Typography>
            </Box>
          )}

          {/* Feed error alert */}
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
              sx={{
                borderRadius: "10px",
                backgroundColor: "#1F2937",
                color: "#F5F7FA",
                border: "1px solid #EF4444",
              }}
            >
              {error}
            </Alert>
          )}

          {/* Empty feed state when database has 0 posts */}
          {!loading && !error && posts.length === 0 && (
            <Paper
              variant="outlined"
              sx={{
                p: { xs: 4, sm: 6 },
                borderRadius: "14px",
                backgroundColor: "#111827",
                borderColor: "#253247",
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
                    color: "#3B82F6",
                    mb: 0.5,
                  }}
                >
                  <DynamicFeedIcon sx={{ fontSize: 24 }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "#F5F7FA", fontSize: "1.125rem" }}
                >
                  No posts yet
                </Typography>
                <Typography variant="body2" sx={{ color: "#A7B1C2", fontSize: "0.90625rem" }}>
                  Be the first to share something with the community.
                </Typography>
              </Stack>
            </Paper>
          )}

          {/* Render list of post cards */}
          {!loading && !error && posts.length > 0 && (
            <Stack spacing={2.5}>
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

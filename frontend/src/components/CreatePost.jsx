import React, { useState, useRef } from "react";
import {
  Box,
  Paper,
  InputBase,
  Button,
  IconButton,
  Typography,
  Stack,
  Alert,
  Avatar,
  Divider,
} from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { useAuth } from "../context/AuthContext";
import { createPost } from "../services/postService";

// Component that allows logged-in users to compose and publish posts
const CreatePost = ({ onPostCreated }) => {
  const { user, token } = useAuth();
  const fileInputRef = useRef(null);

  // Form input state
  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : "U";

  // Handles selecting an image from the user's computer
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file extension
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Please select a JPG, JPEG, PNG, or WebP image.");
      return;
    }

    // Check file size (max 5MB)
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrorMessage("Image size must be less than 5MB.");
      return;
    }

    setErrorMessage("");
    setSelectedImage(file);
    // Create temporary browser URL to preview image before uploading
    setImagePreview(URL.createObjectURL(file));
  };

  // Clears the selected image and its preview
  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submits the new post to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmedText = text.trim();

    // User must write text OR attach an image
    if (!trimmedText && !selectedImage) {
      setErrorMessage("Write something or add an image before posting.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Use FormData so we can upload both text and binary image file
      const formData = new FormData();
      if (trimmedText) {
        formData.append("text", trimmedText);
      }
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const createdPost = await createPost(formData, token);

      // Reset form after successful post
      setText("");
      handleRemoveImage();

      // Notify parent component to prepend new post to feed
      if (onPostCreated) {
        onPostCreated(createdPost);
      }
    } catch (err) {
      setErrorMessage(
        err.message || "Failed to create post. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Post button is disabled when both text and image are empty
  const isPostDisabled = !text.trim() && !selectedImage;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2.25, sm: 3 },
        borderRadius: "14px",
        backgroundColor: "#111827",
        borderColor: "#253247",
        transition: "border-color 150ms ease-in-out",
        "&:hover": {
          borderColor: "#31405A",
        },
      }}
    >
      {/* Header section label */}
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 650,
          color: "#7F8A9D",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontSize: "0.75rem",
          mb: 2,
          userSelect: "none",
        }}
      >
        Create a post
      </Typography>

      {/* Error alert if validation or request fails */}
      {errorMessage && (
        <Alert
          severity="error"
          onClose={() => setErrorMessage("")}
          sx={{ mb: 2, borderRadius: 1.5 }}
        >
          {errorMessage}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={1.75}>
          {/* Avatar + Auto-growing text area */}
          <Stack direction="row" spacing={1.75} alignItems="flex-start">
            <Avatar
              sx={{
                bgcolor: "#3B82F6",
                color: "#FFFFFF",
                width: 44,
                height: 44,
                fontSize: "1rem",
                fontWeight: 600,
                mt: 0.25,
                flexShrink: 0,
              }}
            >
              {userInitial}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <InputBase
                multiline
                fullWidth
                placeholder="What's on your mind?"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                disabled={isSubmitting}
                sx={{
                  color: "#F5F7FA",
                  fontSize: "1.03125rem",
                  lineHeight: 1.55,
                  p: 0,
                  "& textarea": {
                    minHeight: "72px",
                    maxHeight: "55vh",
                    overflowY: "auto !important",
                    resize: "none",
                    p: 0,
                    scrollbarWidth: "thin",
                    scrollbarColor: "#253247 transparent",
                    "&::-webkit-scrollbar": {
                      width: "5px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#253247",
                      borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      backgroundColor: "#3B82F6",
                    },
                    "&::placeholder": {
                      color: "#7F8A9D",
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>
          </Stack>

          {/* Selected image preview */}
          {imagePreview && (
            <Box
              sx={{
                position: "relative",
                mt: 1,
                borderRadius: "10px",
                overflow: "hidden",
                border: "1px solid #253247",
                backgroundColor: "#0B0F17",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                component="img"
                src={imagePreview}
                alt="Selected upload preview"
                sx={{
                  width: "100%",
                  maxHeight: 460,
                  objectFit: "contain",
                  display: "block",
                }}
              />

              {/* Button to remove selected image */}
              <IconButton
                size="small"
                aria-label="Remove image"
                onClick={handleRemoveImage}
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  backgroundColor: "rgba(11, 15, 23, 0.85)",
                  color: "#F5F7FA",
                  border: "1px solid #253247",
                  p: 0.75,
                  "&:hover": {
                    backgroundColor: "rgba(11, 15, 23, 1)",
                    borderColor: "#31405A",
                  },
                }}
              >
                <CloseIcon sx={{ fontSize: "1.05rem" }} />
              </IconButton>
            </Box>
          )}

          <Divider sx={{ my: 0.75, borderColor: "#253247" }} />

          {/* Bottom action row */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {/* Hidden HTML file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />

            {/* Button to trigger file input */}
            <Button
              variant="text"
              startIcon={<ImageOutlinedIcon sx={{ fontSize: "1.15rem !important" }} />}
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
              sx={{
                color: selectedImage ? "#3B82F6" : "#A7B1C2",
                fontSize: "0.875rem",
                textTransform: "none",
                fontWeight: 600,
                px: 1.25,
                py: 0.75,
                borderRadius: "8px",
                "&:hover": {
                  color: "#3B82F6",
                  backgroundColor: "rgba(59, 130, 246, 0.08)",
                },
              }}
            >
              {selectedImage ? "Change image" : "Add image"}
            </Button>

            {/* Post button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isPostDisabled || isSubmitting}
              endIcon={<SendIcon sx={{ fontSize: "0.95rem !important" }} />}
              sx={{
                px: 2.75,
                py: 0.85,
                fontWeight: 600,
                borderRadius: "8px",
                fontSize: "0.875rem",
              }}
            >
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
};

export default CreatePost;

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

const CreatePost = ({ onPostCreated }) => {
  const { user, token } = useAuth();
  const fileInputRef = useRef(null);

  // Form State
  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : "U";

  // Handle Image Selection with validation
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Please select a JPG, JPEG, PNG, or WebP image.");
      return;
    }

    // Validate file size (5MB)
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrorMessage("Image size must be less than 5MB.");
      return;
    }

    setErrorMessage("");
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Remove Selected Image
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

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmedText = text.trim();

    // Validate: At least text OR image must exist
    if (!trimmedText && !selectedImage) {
      setErrorMessage("Write something or add an image before posting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (trimmedText) {
        formData.append("text", trimmedText);
      }
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      // API call to backend
      const createdPost = await createPost(formData, token);

      // Reset form upon success
      setText("");
      handleRemoveImage();

      // Trigger callback to prepend new post to feed
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

  const isPostDisabled = !text.trim() && !selectedImage;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 2,
        backgroundColor: "background.paper",
        borderColor: "divider",
        transition: "box-shadow 0.2s ease-in-out",
      }}
    >
      {/* Header Label */}
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 600,
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontSize: "0.75rem",
          mb: 1.5,
        }}
      >
        Create a post
      </Typography>

      {/* Error Alert */}
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
        <Stack spacing={1.5}>
          {/* Composer Body: Avatar + Seamless Auto-Growing Input */}
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 38,
                height: 38,
                fontSize: "0.95rem",
                fontWeight: 600,
                mt: 0.25,
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
                  color: "text.primary",
                  fontSize: "0.9375rem",
                  lineHeight: 1.55,
                  "& textarea": {
                    minHeight: "44px",
                    maxHeight: "calc(100vh - 300px)",
                    overflowY: "auto !important",
                    resize: "none",
                    p: 0,
                    scrollbarWidth: "thin",
                    scrollbarColor: "#243248 transparent",
                    "&::-webkit-scrollbar": {
                      width: "5px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#243248",
                      borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      backgroundColor: "#3b82f6",
                    },
                    "&::placeholder": {
                      color: "text.secondary",
                      opacity: 0.7,
                    },
                  },
                }}
              />
            </Box>
          </Stack>

          {/* Image Preview - Placed after text content */}
          {imagePreview && (
            <Box
              sx={{
                position: "relative",
                mt: 1,
                borderRadius: 1.5,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: "#0d131f",
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
                  maxHeight: 360,
                  objectFit: "contain",
                  display: "block",
                }}
              />

              {/* Remove Image Button */}
              <IconButton
                size="small"
                aria-label="Remove image"
                onClick={handleRemoveImage}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "rgba(15, 23, 42, 0.8)",
                  color: "#f8fafc",
                  "&:hover": {
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                  },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          <Divider sx={{ my: 0.75 }} />

          {/* Composer Action Bar */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />

            {/* Add Image Button */}
            <Button
              variant="text"
              startIcon={<ImageOutlinedIcon />}
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
              sx={{
                color: selectedImage ? "primary.main" : "text.secondary",
                fontSize: "0.875rem",
                textTransform: "none",
                fontWeight: 500,
                px: 1,
                "&:hover": {
                  color: "primary.main",
                  backgroundColor: "rgba(59, 130, 246, 0.08)",
                },
              }}
            >
              {selectedImage ? "Change image" : "Add image"}
            </Button>

            {/* Submit Post Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isPostDisabled || isSubmitting}
              endIcon={<SendIcon sx={{ fontSize: "0.9rem !important" }} />}
              sx={{
                px: 2.5,
                py: 0.75,
                fontWeight: 600,
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

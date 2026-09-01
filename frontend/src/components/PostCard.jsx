import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Stack,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import SendIcon from "@mui/icons-material/Send";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { formatRelativeTime } from "../utils/formatDate";
import { useAuth } from "../context/AuthContext";
import {
  likePost,
  unlikePost,
  addComment,
  deleteComment,
} from "../services/postService";

// Card component displaying an individual social post with like, comment, and delete interactions
const PostCard = ({ post, onPostUpdated }) => {
  if (!post) return null;

  const { user, token } = useAuth();

  // Local state for Likes (initialized from post prop)
  const [isLiked, setIsLiked] = useState(Boolean(post.liked));
  const [likeCount, setLikeCount] = useState(Number(post.likeCount) || 0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // Local state for Comments
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [commentCount, setCommentCount] = useState(
    Number(post.commentCount) || (post.comments ? post.comments.length : 0)
  );
  const [commentInput, setCommentInput] = useState("");
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [deletingCommentIds, setDeletingCommentIds] = useState([]);

  // Snackbar error notification message
  const [errorSnackbar, setErrorSnackbar] = useState("");

  const authorName = post.user?.username || "Unknown";
  const authorInitial = authorName.charAt(0).toUpperCase();
  const timeFormatted = formatRelativeTime(post.createdAt);

  // 1. Like / Unlike click handler (with instant optimistic UI update)
  const handleToggleLike = async () => {
    // Prevent multiple fast clicks while a request is in flight
    if (isLikeLoading) return;

    // Save previous state in case request fails and we need to rollback
    const previousLiked = isLiked;
    const previousLikeCount = likeCount;

    // Update UI instantly
    const nextLiked = !previousLiked;
    const nextLikeCount = nextLiked
      ? previousLikeCount + 1
      : Math.max(0, previousLikeCount - 1);

    setIsLiked(nextLiked);
    setLikeCount(nextLikeCount);
    setIsLikeLoading(true);

    try {
      if (nextLiked) {
        // Send like to backend
        const res = await likePost(post._id, token);
        setLikeCount(res.likeCount);
      } else {
        // Send unlike to backend
        const res = await unlikePost(post._id, token);
        setLikeCount(res.likeCount);
      }
    } catch (err) {
      // Something went wrong, rollback to original like state
      setIsLiked(previousLiked);
      setLikeCount(previousLikeCount);
      setErrorSnackbar("Couldn't update like. Please try again.");
    } finally {
      setIsLikeLoading(false);
    }
  };

  // 2. Submit new comment handler (with instant optimistic UI update)
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const trimmed = commentInput.trim();
    if (!trimmed || isCommentSubmitting) return;

    // Create a temporary comment object so it shows up on screen immediately
    const tempId = `temp-${Date.now()}`;
    const temporaryComment = {
      _id: tempId,
      text: trimmed,
      user: {
        _id: user?.id,
        username: user?.username || "You",
      },
      createdAt: new Date().toISOString(),
      pending: true,
    };

    // Add temporary comment to local state and increment count
    setComments((prev) => [...prev, temporaryComment]);
    setCommentCount((prev) => prev + 1);
    setCommentInput("");
    setIsCommentSubmitting(true);

    try {
      // Save comment in MongoDB via API
      const data = await addComment(post._id, trimmed, token);

      // Replace temporary comment with the saved comment from server
      setComments((prev) =>
        prev.map((c) => (c._id === tempId ? data.comment : c))
      );
      if (typeof data.commentCount === "number") {
        setCommentCount(data.commentCount);
      }
    } catch (err) {
      // If API fails, remove the temporary comment and restore count
      setComments((prev) => prev.filter((c) => c._id !== tempId));
      setCommentCount((prev) => Math.max(0, prev - 1));
      setErrorSnackbar("Couldn't add comment. Please try again.");
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  // 3. Delete own comment handler (with optimistic UI removal)
  const handleDeleteComment = async (commentId) => {
    const commentToDelete = comments.find((c) => c._id === commentId);
    if (!commentToDelete || deletingCommentIds.includes(commentId)) return;

    // Remove comment from UI immediately
    setComments((prev) => prev.filter((c) => c._id !== commentId));
    setCommentCount((prev) => Math.max(0, prev - 1));
    setDeletingCommentIds((prev) => [...prev, commentId]);

    try {
      const data = await deleteComment(post._id, commentId, token);
      if (typeof data.commentCount === "number") {
        setCommentCount(data.commentCount);
      }
    } catch (err) {
      // Rollback comment if server request fails
      setComments((prev) => [...prev, commentToDelete]);
      setCommentCount((prev) => prev + 1);
      setErrorSnackbar("Couldn't delete comment. Please try again.");
    } finally {
      setDeletingCommentIds((prev) => prev.filter((id) => id !== commentId));
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2.5, sm: 3 },
        borderRadius: "14px",
        backgroundColor: "#111827",
        borderColor: "#253247",
        transition: "border-color 150ms ease-in-out",
        "&:hover": {
          borderColor: "#31405A",
        },
      }}
    >
      <Stack spacing={2}>
        {/* Post author header */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            sx={{
              bgcolor: "#3B82F6",
              color: "#FFFFFF",
              width: 44,
              height: 44,
              fontSize: "1rem",
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {authorInitial}
          </Avatar>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 650,
                color: "#F5F7FA",
                fontSize: "1.03125rem",
                lineHeight: 1.25,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {authorName}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#7F8A9D",
                fontSize: "0.8125rem",
              }}
            >
              {timeFormatted}
            </Typography>
          </Box>
        </Stack>

        {/* Post text message */}
        {post.text && (
          <Typography
            variant="body1"
            sx={{
              color: "#F5F7FA",
              whiteSpace: "pre-line",
              wordBreak: "break-word",
              lineHeight: 1.55,
              fontSize: "1.03125rem",
            }}
          >
            {post.text}
          </Typography>
        )}

        {/* Post attached image */}
        {post.image && (
          <Box
            sx={{
              mt: post.text ? 0.75 : 0,
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
              src={post.image}
              alt="Post attachment"
              loading="lazy"
              sx={{
                width: "100%",
                maxHeight: 520,
                objectFit: "contain",
                display: "block",
              }}
            />
          </Box>
        )}

        <Divider sx={{ my: 0.5, borderColor: "#253247" }} />

        {/* Action row: Like and Comment buttons */}
        <Stack direction="row" spacing={3} alignItems="center">
          {/* Like button */}
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Tooltip title={isLiked ? "Unlike post" : "Like post"}>
              <IconButton
                size="small"
                onClick={handleToggleLike}
                aria-label={isLiked ? "Unlike post" : "Like post"}
                sx={{
                  color: isLiked ? "#EF4444" : "#A7B1C2",
                  p: 0.6,
                  "&:hover": {
                    color: isLiked ? "#DC2626" : "#EF4444",
                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                  },
                }}
              >
                {isLiked ? (
                  <FavoriteIcon fontSize="small" sx={{ color: "#EF4444" }} />
                ) : (
                  <FavoriteBorderIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>

            {/* Zero-count rule: only show number when count is greater than 0 */}
            {likeCount > 0 && (
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.84375rem",
                  color: isLiked ? "#EF4444" : "#A7B1C2",
                  fontWeight: 600,
                  userSelect: "none",
                }}
              >
                {likeCount}
              </Typography>
            )}
          </Stack>

          {/* Comment toggle button */}
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Tooltip title="View comments">
              <IconButton
                size="small"
                onClick={() => setShowComments((prev) => !prev)}
                aria-label="View comments"
                sx={{
                  color: showComments ? "#3B82F6" : "#A7B1C2",
                  p: 0.6,
                  "&:hover": {
                    color: "#3B82F6",
                    backgroundColor: "rgba(59, 130, 246, 0.08)",
                  },
                }}
              >
                <ChatBubbleOutlineOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Zero-count rule: only show number when count is greater than 0 */}
            {commentCount > 0 && (
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.84375rem",
                  color: showComments ? "#3B82F6" : "#A7B1C2",
                  fontWeight: 600,
                  userSelect: "none",
                }}
              >
                {commentCount}
              </Typography>
            )}
          </Stack>
        </Stack>

        {/* Expandable comments section */}
        {showComments && (
          <Box sx={{ pt: 1 }}>
            <Divider sx={{ mb: 2, borderColor: "#253247" }} />

            {/* List of comments */}
            {comments.length > 0 && (
              <Stack spacing={1.5} sx={{ mb: 2 }}>
                {comments.map((comment) => {
                  const commentAuthor = comment.user?.username || "Unknown";
                  const commentInitial = commentAuthor.charAt(0).toUpperCase();
                  const commentTime = formatRelativeTime(comment.createdAt);

                  // Check if current user is the author of this comment
                  const isMyComment =
                    Boolean(user) &&
                    (comment.user?._id === user?.id ||
                      comment.user?._id === user?._id ||
                      comment.user?.username === user?.username);

                  return (
                    <Stack
                      key={comment._id}
                      direction="row"
                      spacing={1.25}
                      alignItems="flex-start"
                      sx={{
                        opacity: comment.pending ? 0.65 : 1,
                        transition: "opacity 150ms ease-in-out",
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 30,
                          height: 30,
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          bgcolor: "#1E293B",
                          color: "#94A3B8",
                          border: "1px solid #253247",
                          mt: 0.25,
                          flexShrink: 0,
                        }}
                      >
                        {commentInitial}
                      </Avatar>

                      <Box
                        sx={{
                          flex: 1,
                          backgroundColor: "#151E2E",
                          p: 1.5,
                          borderRadius: "10px",
                          border: "1px solid #253247",
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mb: 0.35 }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              color: "#F5F7FA",
                              fontSize: "0.84375rem",
                            }}
                          >
                            {commentAuthor}
                          </Typography>

                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#7F8A9D",
                                fontSize: "0.75rem",
                              }}
                            >
                              {commentTime}
                            </Typography>

                            {/* Delete button only appears for user's own comments */}
                            {isMyComment && !comment.pending && (
                              <Tooltip title="Delete comment">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteComment(comment._id)}
                                  aria-label="Delete comment"
                                  sx={{
                                    p: 0.25,
                                    ml: 0.5,
                                    color: "#7F8A9D",
                                    "&:hover": {
                                      color: "#EF4444",
                                      backgroundColor: "rgba(239, 68, 68, 0.08)",
                                    },
                                  }}
                                >
                                  <DeleteOutlineIcon sx={{ fontSize: "0.95rem" }} />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>
                        </Stack>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#F5F7FA",
                            fontSize: "0.90625rem",
                            lineHeight: 1.45,
                            whiteSpace: "pre-line",
                            wordBreak: "break-word",
                          }}
                        >
                          {comment.text}
                        </Typography>
                      </Box>
                    </Stack>
                  );
                })}
              </Stack>
            )}

            {/* Form to submit a new comment */}
            <Box component="form" onSubmit={handleCommentSubmit} noValidate>
              <TextField
                fullWidth
                size="small"
                placeholder="Write a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                disabled={isCommentSubmitting}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Send comment">
                          <span>
                            <IconButton
                              type="submit"
                              size="small"
                              disabled={
                                !commentInput.trim() || isCommentSubmitting
                              }
                              aria-label="Send comment"
                              sx={{
                                color: commentInput.trim()
                                  ? "#3B82F6"
                                  : "#7F8A9D",
                              }}
                            >
                              <SendIcon sx={{ fontSize: "1rem" }} />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#151E2E",
                    borderRadius: "8px",
                  },
                }}
              />
            </Box>
          </Box>
        )}
      </Stack>

      {/* Snackbar toast notification for errors */}
      <Snackbar
        open={Boolean(errorSnackbar)}
        autoHideDuration={4000}
        onClose={() => setErrorSnackbar("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setErrorSnackbar("")}
          severity="error"
          sx={{
            width: "100%",
            borderRadius: "8px",
            backgroundColor: "#1F2937",
            color: "#F5F7FA",
            border: "1px solid #EF4444",
          }}
        >
          {errorSnackbar}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default PostCard;

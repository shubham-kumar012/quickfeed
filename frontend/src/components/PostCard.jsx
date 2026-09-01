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

const PostCard = ({ post, onPostUpdated }) => {
  if (!post) return null;

  const { user, token } = useAuth();

  // Local Like & Comment State (Initialized from post prop)
  const [isLiked, setIsLiked] = useState(Boolean(post.liked));
  const [likeCount, setLikeCount] = useState(Number(post.likeCount) || 0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // Comments State
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [commentCount, setCommentCount] = useState(
    Number(post.commentCount) || (post.comments ? post.comments.length : 0)
  );
  const [commentInput, setCommentInput] = useState("");
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [deletingCommentIds, setDeletingCommentIds] = useState([]);

  // Notification / Feedback State
  const [errorSnackbar, setErrorSnackbar] = useState("");

  const authorName = post.user?.username || "Unknown";
  const authorInitial = authorName.charAt(0).toUpperCase();
  const timeFormatted = formatRelativeTime(post.createdAt);

  // 1. Optimistic Like / Unlike Handler
  const handleToggleLike = async () => {
    if (isLikeLoading) return;

    const previousLiked = isLiked;
    const previousLikeCount = likeCount;

    // Optimistically update local state immediately
    const nextLiked = !previousLiked;
    const nextLikeCount = nextLiked
      ? previousLikeCount + 1
      : Math.max(0, previousLikeCount - 1);

    setIsLiked(nextLiked);
    setLikeCount(nextLikeCount);
    setIsLikeLoading(true);

    try {
      if (nextLiked) {
        const res = await likePost(post._id, token);
        setLikeCount(res.likeCount);
      } else {
        const res = await unlikePost(post._id, token);
        setLikeCount(res.likeCount);
      }
    } catch (err) {
      // Rollback to previous state on error
      setIsLiked(previousLiked);
      setLikeCount(previousLikeCount);
      setErrorSnackbar("Couldn't update like. Please try again.");
    } finally {
      setIsLikeLoading(false);
    }
  };

  // 2. Optimistic Comment Submission Handler
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const trimmed = commentInput.trim();
    if (!trimmed || isCommentSubmitting) return;

    // Create a temporary comment for immediate visual feedback
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

    // Optimistically update UI
    setComments((prev) => [...prev, temporaryComment]);
    setCommentCount((prev) => prev + 1);
    setCommentInput("");
    setIsCommentSubmitting(true);

    try {
      const data = await addComment(post._id, trimmed, token);

      // Replace temporary comment with server-persisted comment
      setComments((prev) =>
        prev.map((c) => (c._id === tempId ? data.comment : c))
      );
      if (typeof data.commentCount === "number") {
        setCommentCount(data.commentCount);
      }
    } catch (err) {
      // Rollback temporary comment on failure
      setComments((prev) => prev.filter((c) => c._id !== tempId));
      setCommentCount((prev) => Math.max(0, prev - 1));
      setErrorSnackbar("Couldn't add comment. Please try again.");
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  // 3. Optimistic Comment Deletion Handler (Own Comments Only)
  const handleDeleteComment = async (commentId) => {
    const commentToDelete = comments.find((c) => c._id === commentId);
    if (!commentToDelete || deletingCommentIds.includes(commentId)) return;

    // Optimistically remove comment from UI
    setComments((prev) => prev.filter((c) => c._id !== commentId));
    setCommentCount((prev) => Math.max(0, prev - 1));
    setDeletingCommentIds((prev) => [...prev, commentId]);

    try {
      const data = await deleteComment(post._id, commentId, token);
      if (typeof data.commentCount === "number") {
        setCommentCount(data.commentCount);
      }
    } catch (err) {
      // Rollback deleted comment on failure
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
        p: { xs: 2.25, sm: 3 },
        borderRadius: 2,
        backgroundColor: "background.paper",
        borderColor: "divider",
      }}
    >
      <Stack spacing={2}>
        {/* Header: Author Avatar, Username & Timestamp */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 40,
              height: 40,
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            {authorInitial}
          </Avatar>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                lineHeight: 1.2,
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
                color: "text.secondary",
                fontSize: "0.75rem",
              }}
            >
              {timeFormatted}
            </Typography>
          </Box>
        </Stack>

        {/* Post Text Content */}
        {post.text && (
          <Typography
            variant="body1"
            sx={{
              color: "text.primary",
              whiteSpace: "pre-line",
              wordBreak: "break-word",
              lineHeight: 1.55,
              fontSize: "0.9375rem",
            }}
          >
            {post.text}
          </Typography>
        )}

        {/* Post Image Content */}
        {post.image && (
          <Box
            sx={{
              mt: post.text ? 1 : 0,
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

        <Divider sx={{ my: 0.5 }} />

        {/* Actions Row: Like & Comment Counters */}
        <Stack direction="row" spacing={3} alignItems="center">
          {/* Like Button & Count */}
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Tooltip title={isLiked ? "Unlike post" : "Like post"}>
              <IconButton
                size="small"
                onClick={handleToggleLike}
                aria-label={isLiked ? "Unlike post" : "Like post"}
                sx={{
                  color: isLiked ? "#f87171" : "text.secondary",
                  p: 0.5,
                  "&:hover": {
                    color: isLiked ? "#ef4444" : "#f87171",
                    backgroundColor: "rgba(248, 113, 113, 0.08)",
                  },
                }}
              >
                {isLiked ? (
                  <FavoriteIcon fontSize="small" />
                ) : (
                  <FavoriteBorderIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>

            {/* Zero Count Rule: Only show number when count > 0 */}
            {likeCount > 0 && (
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.8125rem",
                  color: isLiked ? "#f87171" : "text.secondary",
                  fontWeight: 600,
                  userSelect: "none",
                }}
              >
                {likeCount}
              </Typography>
            )}
          </Stack>

          {/* Comment Toggle Button & Count */}
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Tooltip title="View comments">
              <IconButton
                size="small"
                onClick={() => setShowComments((prev) => !prev)}
                aria-label="View comments"
                sx={{
                  color: showComments ? "primary.main" : "text.secondary",
                  p: 0.5,
                  "&:hover": {
                    color: "primary.main",
                    backgroundColor: "rgba(59, 130, 246, 0.08)",
                  },
                }}
              >
                <ChatBubbleOutlineOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Zero Count Rule: Only show number when count > 0 */}
            {commentCount > 0 && (
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.8125rem",
                  color: showComments ? "primary.main" : "text.secondary",
                  fontWeight: 600,
                  userSelect: "none",
                }}
              >
                {commentCount}
              </Typography>
            )}
          </Stack>
        </Stack>

        {/* Expandable Comments Section */}
        {showComments && (
          <Box sx={{ pt: 1 }}>
            <Divider sx={{ mb: 2 }} />

            {/* List of Comments */}
            {comments.length > 0 && (
              <Stack spacing={1.75} sx={{ mb: 2 }}>
                {comments.map((comment) => {
                  const commentAuthor = comment.user?.username || "Unknown";
                  const commentInitial = commentAuthor.charAt(0).toUpperCase();
                  const commentTime = formatRelativeTime(comment.createdAt);

                  // Ownership Check: Current user can delete only their own comments
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
                        transition: "opacity 0.2s ease-in-out",
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          bgcolor: "secondary.dark",
                          mt: 0.25,
                        }}
                      >
                        {commentInitial}
                      </Avatar>

                      <Box
                        sx={{
                          flex: 1,
                          backgroundColor: "#0d131f",
                          p: 1.25,
                          borderRadius: 1.5,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mb: 0.25 }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              color: "text.primary",
                              fontSize: "0.8125rem",
                            }}
                          >
                            {commentAuthor}
                          </Typography>

                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Typography
                              variant="caption"
                              sx={{
                                color: "text.secondary",
                                fontSize: "0.7rem",
                              }}
                            >
                              {commentTime}
                            </Typography>

                            {/* Delete Button (Visible only on user's own comments) */}
                            {isMyComment && !comment.pending && (
                              <Tooltip title="Delete comment">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteComment(comment._id)}
                                  aria-label="Delete comment"
                                  sx={{
                                    p: 0.25,
                                    ml: 0.5,
                                    color: "text.secondary",
                                    "&:hover": {
                                      color: "error.main",
                                      backgroundColor: "rgba(248, 113, 113, 0.08)",
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
                            color: "text.primary",
                            fontSize: "0.875rem",
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

            {/* Add Comment Input Form */}
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
                                  ? "primary.main"
                                  : "text.disabled",
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
                    backgroundColor: "#0d131f",
                    borderRadius: 1.5,
                  },
                }}
              />
            </Box>
          </Box>
        )}
      </Stack>

      {/* Error Toast Snackbar */}
      <Snackbar
        open={Boolean(errorSnackbar)}
        autoHideDuration={4000}
        onClose={() => setErrorSnackbar("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setErrorSnackbar("")}
          severity="error"
          sx={{ width: "100%", borderRadius: 1.5 }}
        >
          {errorSnackbar}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default PostCard;

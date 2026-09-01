import React from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Stack,
} from "@mui/material";
import { formatRelativeTime } from "../utils/formatDate";

const PostCard = ({ post }) => {
  if (!post) return null;

  const authorName = post.user?.username || "Unknown";
  const authorInitial = authorName.charAt(0).toUpperCase();
  const timeFormatted = formatRelativeTime(post.createdAt);

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
      </Stack>
    </Paper>
  );
};

export default PostCard;

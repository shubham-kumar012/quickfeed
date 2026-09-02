// Posts API base URL (Vite proxies this to localhost:5000 in dev)
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "";
const API_BASE_URL = `${BACKEND_URL}/api/posts`;

// Get all posts to display in the social feed
export const getPosts = async (token) => {
  const headers = {
    "Content-Type": "application/json",
  };

  // If user is logged in, pass token so backend knows if they liked each post
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(API_BASE_URL, {
    method: "GET",
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load public posts");
  }

  return data.posts || [];
};

// Create a new post (handles text and/or image upload)
export const createPost = async (postData, token) => {
  const headers = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let body = postData;

  // If sending raw JSON instead of FormData, stringify it
  if (!(postData instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(postData);
  }

  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers,
    body,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create post. Please try again.");
  }

  return data.post;
};

// Like a post
export const likePost = async (postId, token) => {
  const response = await fetch(`${API_BASE_URL}/${postId}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to like post.");
  }

  return data;
};

// Unlike a post
export const unlikePost = async (postId, token) => {
  const response = await fetch(`${API_BASE_URL}/${postId}/like`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to unlike post.");
  }

  return data;
};

// Add a comment to a post
export const addComment = async (postId, text, token) => {
  const response = await fetch(`${API_BASE_URL}/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add comment.");
  }

  return data;
};

// Delete your own comment from a post
export const deleteComment = async (postId, commentId, token) => {
  const response = await fetch(`${API_BASE_URL}/${postId}/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete comment.");
  }

  return data;
};

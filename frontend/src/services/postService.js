const API_BASE_URL = "/api/posts";

/**
 * Fetch all public posts (sorted newest first)
 * @param {string} [token] - Optional JWT token to determine current user's liked status
 * @returns {Promise<Array>} List of posts
 */
export const getPosts = async (token) => {
  const headers = {
    "Content-Type": "application/json",
  };

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

/**
 * Create a new post (text, image, or text + image)
 * @param {FormData|Object} postData - Post payload
 * @param {string} token - JWT authentication token
 * @returns {Promise<Object>} Created post object
 */
export const createPost = async (postData, token) => {
  const headers = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let body = postData;

  // If payload is a plain object instead of FormData, stringify it
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

/**
 * Like a post
 * @param {string} postId - Post ID
 * @param {string} token - JWT authentication token
 * @returns {Promise<Object>} { liked: true, likeCount }
 */
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

/**
 * Unlike a post
 * @param {string} postId - Post ID
 * @param {string} token - JWT authentication token
 * @returns {Promise<Object>} { liked: false, likeCount }
 */
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

/**
 * Add a comment to a post
 * @param {string} postId - Post ID
 * @param {string} text - Comment text
 * @param {string} token - JWT authentication token
 * @returns {Promise<Object>} { comment, commentCount }
 */
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

/**
 * Delete a comment from a post
 * @param {string} postId - Post ID
 * @param {string} commentId - Comment ID
 * @param {string} token - JWT authentication token
 * @returns {Promise<Object>} { message, commentCount }
 */
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

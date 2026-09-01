const API_BASE_URL = "/api/posts";

/**
 * Fetch all public posts (sorted newest first)
 * @returns {Promise<Array>} List of posts
 */
export const getPosts = async () => {
  const response = await fetch(API_BASE_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
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

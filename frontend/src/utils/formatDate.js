// Formats post and comment timestamps into friendly text like "Just now", "5m ago", "2h ago", or "Yesterday"
export const formatRelativeTime = (dateInput) => {
  if (!dateInput) return "";

  const date = new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Less than a minute ago
  if (diffInSeconds < 60) {
    return "Just now";
  }

  // Minutes ago (e.g., "5m ago")
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  // Hours ago (e.g., "2h ago")
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  // 1 day ago
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return "Yesterday";
  }

  // Less than a week ago (e.g., "3d ago")
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  // Older dates (e.g., "Aug 15")
  const options = { month: "short", day: "numeric" };
  if (date.getFullYear() !== now.getFullYear()) {
    options.year = "numeric";
  }

  return date.toLocaleDateString(undefined, options);
};

// Format time in seconds to MM:SS
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// Format time in seconds to readable format (1h 30m 45s)
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

// Format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get answer status color
export const getAnswerStatusColor = (status) => {
  switch (status) {
    case "answered":
      return "bg-success text-success-content";
    case "marked":
      return "bg-warning text-warning-content";
    case "not-answered":
      return "bg-base-300 text-base-content";
    default:
      return "bg-base-300 text-base-content";
  }
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return ((value / total) * 100).toFixed(2);
};

// Get score color based on value
export const getScoreColor = (score) => {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-error";
};

// Validate email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate phone number (Indonesian format)
export const isValidPhone = (phone) => {
  const re = /^(\+62|62|0)[0-9]{9,12}$/;
  return re.test(phone.replace(/\s/g, ""));
};

// Generate question number array
export const generateQuestionNumbers = (count) => {
  return Array.from({ length: count }, (_, i) => i + 1);
};

// Get question status
export const getQuestionStatus = (answer) => {
  if (answer.markedForReview) return "marked";
  if (answer.selectedAnswer) return "answered";
  return "not-answered";
};


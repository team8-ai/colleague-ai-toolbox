// Application configuration

// API configuration
export const API_CONFIG = {
  // Use VITE_API_BASE_URL from environment or fallback to the direct EC2 URL
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://34.198.232.22:8080/api', 
  timeoutMs: 10000, // 10 seconds timeout for API calls
};

// Feature flags
export const FEATURES = {
  enableComments: true,
  enableLikes: true,
  enableSharing: false,
};

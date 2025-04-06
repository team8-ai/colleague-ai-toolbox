// Application configuration

// API configuration
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeoutMs: 10000, // 10 seconds timeout for API calls
};

// Feature flags
export const FEATURES = {
  enableComments: true,
  enableLikes: true,
  enableSharing: false,
};

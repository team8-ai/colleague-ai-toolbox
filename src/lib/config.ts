// Application configuration

// API configuration
export const API_CONFIG = {
  // Use the remote backend directly only in development. Production uses relative paths handled by api.ts
  baseUrl: import.meta.env.DEV ? 'http://34.198.232.22:8080/api' : '', 
  timeoutMs: 10000, // 10 seconds timeout for API calls
};

// Feature flags
export const FEATURES = {
  enableComments: true,
  enableLikes: true,
  enableSharing: false,
};

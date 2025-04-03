// API client for communicating with our Postgres backend

// Base URL for API requests - should be configured based on environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Helper function for API requests
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Get auth token if available (for authenticated requests)
  const token = localStorage.getItem('authToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Make the request
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  // Handle non-2xx responses
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API request failed with status ${response.status}`);
  }
  
  // Parse JSON response
  return await response.json();
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  // Mock bypass login for development
  bypassLogin: async () => {
    // For development, return mock user data
    return {
      user: {
        uid: 'mock-user-id',
        email: 'mock@example.com',
        displayName: 'Development User',
        photoURL: null,
      },
      token: 'mock-token-for-development'
    };
  },
  
  logout: async () => {
    localStorage.removeItem('authToken');
    return { success: true };
  },
};

// Tools API
export const toolsAPI = {
  getAllTools: async () => {
    return fetchAPI('/tools');
  },
  
  getToolById: async (id: string) => {
    return fetchAPI(`/tools/${id}`);
  },
  
  getToolsByTag: async (tag: string) => {
    return fetchAPI(`/tools/tag/${encodeURIComponent(tag)}`);
  },
  
  toggleLikeTool: async (toolId: string) => {
    return fetchAPI(`/tools/${toolId}/like`, {
      method: 'POST',
    });
  },
  
  // Comments
  getCommentsByToolId: async (toolId: string) => {
    return fetchAPI(`/tools/${toolId}/comments`);
  },
  
  addComment: async (toolId: string, text: string) => {
    return fetchAPI(`/tools/${toolId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },
  
  // Tags
  getAllTags: async () => {
    return fetchAPI('/tags');
  },
};

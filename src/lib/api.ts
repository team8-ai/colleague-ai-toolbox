// API client for communicating with our Postgres backend

// Base URL for API requests - should be configured based on environment
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ai-hub.team8.vc/api';

// Helper function for API requests
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Default headers
  const headers: HeadersInit = {
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

  // Handle 401 Unauthorized - could indicate expired token
  if (response.status === 401) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    // Consider redirecting to login page here or throwing a specific error
    // For now, just throw a generic error
    throw new Error('Unauthorized: Please log in again.');
  }
  
  // Handle other non-2xx responses
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: `API request failed with status ${response.status}` }));
    throw new Error(error.detail || `API request failed with status ${response.status}`);
  }
  
  // Parse JSON response if content exists
  if (response.status !== 204) { // 204 No Content
    return await response.json();
  }
  return null; // Return null for 204 No Content
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    // Use fetch directly here as fetchAPI expects a token which we don't have yet
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(error.detail || 'Login failed');
    }
    
    return response.json(); // Returns { access_token, token_type, user }
  },
    
  logout: async () => {
    // In a real backend, you might call a logout endpoint
    // For now, just clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData'); // Also remove stored user data
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

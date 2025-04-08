// API client for communicating with our Postgres backend
import { API_CONFIG } from './config';
import { ContentType } from '@/types/content';

// Define a custom error for authentication issues
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

// Base URL is the full path including /api, coming from config
const API_BASE_URL = API_CONFIG.baseUrl;

// Helper function for API requests
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  // Endpoint should start with /, ensure it does or adjust based on usage
  // Assuming endpoint is like '/tools', '/tags'
  const url = `${API_BASE_URL}${endpoint}`;

  // Default headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Get auth token if available (for authenticated requests)
  const token = localStorage.getItem('authToken');
  console.log(`API Request to ${endpoint} - Token exists: ${!!token}`);
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    // Keep debug log temporarily if needed, otherwise remove
    // console.log('[DEBUG] Authorization Header:', headers['Authorization']); 
  } else {
    console.log('No auth token found in localStorage');
  }
  
  // Keep debug log temporarily if needed, otherwise remove
  // console.log('[DEBUG] Making fetch request with headers:', headers);
  const response = await fetch(url, {
    ...options,
    headers,
  });

  console.log(`Response from ${endpoint}: status ${response.status}`);

  // Handle 401 Unauthorized - could indicate expired token
  if (response.status === 401) {
    console.error('401 Unauthorized - clearing tokens');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    throw new AuthError('Unauthorized: Session expired. Please log in again.');
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
    // Use the full base URL + /auth/login
    const url = `${API_BASE_URL}/auth/login`;
    
    console.log(`Attempting login at: ${url}`);
      
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    console.log(`Login response status: ${response.status}`);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Login failed' }));
      console.error('Login failed:', error);
      throw new Error(error.detail || 'Login failed');
    }
    
    const data = await response.json();
    console.log('Login response structure:', Object.keys(data));
    
    // Log token information with some obfuscation for security
    if (data.access_token) {
      console.log(`access_token exists, length: ${data.access_token.length}`);
      console.log(`First 10 chars: ${data.access_token.substring(0, 10)}...`);
    } else {
      console.log('No access_token in response');
    }
    
    if (data.token) {
      console.log(`token exists, length: ${data.token.length}`);
      console.log(`First 10 chars: ${data.token.substring(0, 10)}...`);
    }
    
    return data; // Returns { access_token, token_type, user }
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

// Likes API
export const likesAPI = {
  getLikedContent: async () => {
    return fetchAPI('/likes/');
  },
  
  toggleLike: async (contentId: string, contentType: string) => {
    return fetchAPI(`/likes/toggle`, {
      method: 'POST',
      body: JSON.stringify({ contentId, contentType }),
    });
  },
};

// Documents API
export const documentsAPI = {
  getAllDocuments: async () => {
    return fetchAPI('/documents');
  },
  
  getDocumentById: async (id: string) => {
    return fetchAPI(`/documents/${id}`);
  },
  
  getDocumentsByTag: async (tag: string) => {
    return fetchAPI(`/documents/tag/${encodeURIComponent(tag)}`);
  },
  
  getAllDocumentTags: async () => {
    return fetchAPI('/documents/tags/all');
  },
  
  toggleLikeDocument: async (documentId: string) => {
    return fetchAPI(`/documents/${documentId}/like`, {
      method: 'POST',
    });
  },
};

// News API
export const newsAPI = {
  getAllNews: async () => {
    const data = await fetchAPI('/news');
    return data.map((item: any) => ({
      id: item.id,
      type: ContentType.NEWS,
      title: item.title,
      description: item.content,
      tags: item.tags || [],
      thumbnailUrl: item.image_url,
      createdAt: item.createdAt,
      sourceUrl: item.url,
      author: item.author?.displayName,
      publishDate: item.createdAt,
      content: item.content,
      isLiked: item.isLiked
    }));
  },
  
  getNewsById: async (id: string) => {
    const item = await fetchAPI(`/news/${id}`);
    if (!item) return null;
    
    return {
      id: item.id,
      type: ContentType.NEWS,
      title: item.title,
      description: item.content,
      tags: item.tags || [],
      thumbnailUrl: item.image_url,
      createdAt: item.createdAt,
      sourceUrl: item.url,
      author: item.author?.displayName,
      publishDate: item.createdAt,
      content: item.content,
      isLiked: item.isLiked
    };
  },
  
  getNewsByTag: async (tag: string) => {
    const data = await fetchAPI(`/news/tag/${encodeURIComponent(tag)}`);
    return data.map((item: any) => ({
      id: item.id,
      type: ContentType.NEWS,
      title: item.title,
      description: item.content,
      tags: item.tags || [],
      thumbnailUrl: item.image_url,
      createdAt: item.createdAt,
      sourceUrl: item.url,
      author: item.author?.displayName,
      publishDate: item.createdAt,
      content: item.content,
      isLiked: item.isLiked
    }));
  },
  
  toggleLikeNews: async (id: string) => {
    return fetchAPI(`/news/${id}/like`, {
      method: 'POST',
    });
  },
};

// Podcasts API
export const podcastAPI = {
  getAllPodcasts: async () => {
    const data = await fetchAPI('/podcasts');
    return data.map((item: any) => ({
      id: item.id,
      type: ContentType.PODCAST as ContentType.PODCAST,
      title: item.title,
      description: item.description,
      tags: item.tags || [],
      thumbnailUrl: item.image_url,
      createdAt: item.created_at,
      audioUrl: item.audio_url,
      duration: item.duration || 0,
      host: item.author?.displayName,
      isLiked: item.isLiked,
      content: item.content
    }));
  },
  
  getPodcastById: async (id: string) => {
    const item = await fetchAPI(`/podcasts/${id}`);
    if (!item) return null;
    
    return {
      id: item.id,
      type: ContentType.PODCAST as ContentType.PODCAST,
      title: item.title,
      description: item.description,
      tags: item.tags || [],
      thumbnailUrl: item.image_url,
      createdAt: item.created_at,
      audioUrl: item.audio_url,
      duration: item.duration || 0,
      host: item.author?.displayName,
      isLiked: item.isLiked,
      content: item.content
    };
  },
  
  getPodcastsByTag: async (tag: string) => {
    const data = await fetchAPI(`/podcasts/tag/${encodeURIComponent(tag)}`);
    return data.map((item: any) => ({
      id: item.id,
      type: ContentType.PODCAST as ContentType.PODCAST,
      title: item.title,
      description: item.description,
      tags: item.tags || [],
      thumbnailUrl: item.image_url,
      createdAt: item.created_at,
      audioUrl: item.audio_url,
      duration: item.duration || 0,
      host: item.author?.displayName,
      isLiked: item.isLiked,
      content: item.content
    }));
  },
  
  toggleLikePodcast: async (id: string) => {
    return fetchAPI(`/podcasts/${id}/like`, {
      method: 'POST',
    });
  },
};

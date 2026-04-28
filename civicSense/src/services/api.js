/**
 * Axios API Service
 * Centralized API calls with JWT token attachment
 */

import axios from 'axios'

const API = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api`;
const API_BASE_URL = API;
const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'https://your-ai-url';

// Create Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add JWT token to request headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle response errors and logging
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API RESPONSE] ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    console.error(`[API ERROR] ${error.config?.url}:`, error.response?.data || error.message);
    if (error.response?.status === 401) {
      // Token expired - redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

export const authAPI = {
  register: (username, email, password) =>
    apiClient.post('/auth/register', { username, email, password }),

  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),

  getCurrentUser: () =>
    apiClient.get('/auth/me'),
}

// ============================================================================
// POST ENDPOINTS
// ============================================================================

export const postsAPI = {
  getFeed: (lat, lon, radiusKm = 10, page = 0, size = 20) =>
    apiClient.get('/posts/feed', {
      params: { lat, lon, radiusKm, page, size },
    }),

  getPost: (id) =>
    apiClient.get(`/posts/${id}`),

  createPost: (
    imageFile,
    content,
    lat,
    lon,
    locationLabel = 'Unknown location',
    state = 'Unknown',
    isAnonymous = false
  ) => {
    const requestData = {
      content,
      locationLabel,
      state,
      latitude: lat,
      longitude: lon,
      isAnonymous,
    };

    // Convert image to base64 if provided
    if (imageFile) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          requestData.image = reader.result;
          apiClient.post('/posts', requestData)
            .then(resolve)
            .catch(reject);
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
    } else {
      return apiClient.post('/posts', requestData);
    }
  },

  upvotePost: (id) =>
    apiClient.put(`/posts/${id}/upvote`),

  commentOnPost: (id, comment) =>
    apiClient.post(`/posts/${id}/comment`, { text: comment }),

  deletePost: (id) =>
    apiClient.delete(`/posts/${id}`),

  getUserPosts: (userId) =>
    apiClient.get(`/posts/user/${userId}`),
}

// ============================================================================
// COMPLAINT ENDPOINTS
// ============================================================================

export const complaintsAPI = {
  submitComplaint: (imageFile, lat, lon, zoneType) => {
    const formData = new FormData()
    formData.append('image', imageFile)
    formData.append('latitude', lat)
    formData.append('longitude', lon)
    formData.append('zoneType', zoneType)

    return apiClient.post('/complaints', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  getComplaint: (id) =>
    apiClient.get(`/complaints/${id}`),

  getAreaComplaints: (areaName) =>
    apiClient.get(`/complaints/area/${areaName}`),
}

// ============================================================================
// AREA ENDPOINTS
// ============================================================================

export const areasAPI = {
  getArea: (areaName, state = 'Delhi') => {
    const cleanArea = areaName.split(",")[0].trim();
    return apiClient.get(`/areas/${encodeURIComponent(cleanArea)}`, {
      params: { state },
    });
  },

  getLeaderboard: (state = 'Delhi', limit = 20) =>
    apiClient.get('/areas/leaderboard', {
      params: { state, limit },
    }),

  getPropertyReport: (areaName, state = 'Delhi') => {
    const cleanArea = areaName.split(",")[0].trim();
    return apiClient.get(`/areas/property-report/${encodeURIComponent(cleanArea)}`, {
      params: { state },
    });
  },
}

// ============================================================================
// DASHBOARD ENDPOINTS
// ============================================================================

export const dashboardAPI = {
  getTrends: () => apiClient.get('/dashboard/trends'),
  getStream: () => apiClient.get('/dashboard/stream'),
  getOperatorProfile: () => apiClient.get('/dashboard/operator'),
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default apiClient

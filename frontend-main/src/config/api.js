// VandalHub API Configuration

// Get API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// API endpoints configuration
export const API_ENDPOINTS = {
  // Base URL
  BASE_URL: API_BASE_URL,
  
  // Authentication endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/login`,
    SIGNUP: `${API_BASE_URL}/signup`,
    LOGOUT: `${API_BASE_URL}/logout`,
  },
  
  // User endpoints
  USER: {
    PROFILE: (userId) => `${API_BASE_URL}/userProfile/${userId}`,
    UPDATE: (userId) => `${API_BASE_URL}/user/update/${userId}`,
    ALL: `${API_BASE_URL}/user/all`,
  },
  
  // Repository endpoints
  REPOSITORY: {
    ALL: `${API_BASE_URL}/repo/all`,
    CREATE: `${API_BASE_URL}/repo/create`,
    GET: (id) => `${API_BASE_URL}/repo/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/repo/update/${id}`,
    DELETE: (id) => `${API_BASE_URL}/repo/delete/${id}`,
    FILES: (id) => `${API_BASE_URL}/repo/${id}/files`,
    FILE: (id, filename) => `${API_BASE_URL}/repo/${id}/files/${filename}`,
  },
  
  // Issue endpoints
  ISSUE: {
    ALL: `${API_BASE_URL}/issue/all`,
    CREATE: `${API_BASE_URL}/issue/create`,
    GET: (id) => `${API_BASE_URL}/issue/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/issue/update/${id}`,
    DELETE: (id) => `${API_BASE_URL}/issue/delete/${id}`,
  },
};

// Export individual configurations
export const API_BASE = API_BASE_URL;
export default API_ENDPOINTS;

/**
 * API Service for connecting to the backend
 * Base URL: http://localhost:8000
 */

import axios from 'axios';

// Base API configuration
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor for adding auth tokens if needed
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Recipe API endpoints
 */
export const recipeAPI = {
  /**
   * Get all recipes with pagination
   * @param {number} skip - Number of recipes to skip
   * @param {number} limit - Number of recipes to return
   * @returns {Promise} Array of recipes
   */
  getAll: async (skip = 0, limit = 10) => {
    try {
      const response = await apiClient.get('/recipes/', {
        params: { skip, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      throw error;
    }
  },

  /**
   * Get a single recipe by ID
   * @param {string} id - Recipe ID
   * @returns {Promise} Recipe object
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch recipe ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new recipe
   * @param {Object} recipeData - Recipe data
   * @returns {Promise} Created recipe
   */
  create: async (recipeData) => {
    try {
      const response = await apiClient.post('/recipes/', recipeData);
      return response.data;
    } catch (error) {
      console.error('Failed to create recipe:', error);
      throw error;
    }
  },
};

/**
 * AI API endpoints
 */
export const aiAPI = {
  /**
   * Search recipes using AI
   * @param {string} query - Search query
   * @returns {Promise} Search results
   */
  search: async (query) => {
    try {
      const response = await apiClient.post('/ai/search', null, {
        params: { query }
      });
      return response.data;
    } catch (error) {
      console.error('AI search failed:', error);
      throw error;
    }
  },

  /**
   * Get AI assistant response
   * @param {string} question - User question
   * @param {string} context - Recipe context
   * @returns {Promise} AI response
   */
  assistant: async (question, context) => {
    try {
      const response = await apiClient.post('/ai/assistant', {
        question,
        context
      });
      return response.data;
    } catch (error) {
      console.error('AI assistant failed:', error);
      throw error;
    }
  },
};

/**
 * User API endpoints
 */
export const userAPI = {
  /**
   * Register a new user
   * @param {Object} userData - User data (email, password)
   * @returns {Promise} User object
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post('/users/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  /**
   * Login user
   * @param {string} username - User email
   * @param {string} password - User password
   * @returns {Promise} Token object
   */
  login: async (username, password) => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await apiClient.post('/users/token', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  /**
   * Save a recipe to user's collection
   * @param {string} recipeId - Recipe ID
   * @returns {Promise} Success message
   */
  saveRecipe: async (recipeId) => {
    try {
      const response = await apiClient.post(`/users/me/saved-recipes?recipe_id=${recipeId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to save recipe:', error);
      throw error;
    }
  },

  /**
   * Get user's saved recipes
   * @returns {Promise} Array of saved recipes
   */
  getSavedRecipes: async () => {
    try {
      const response = await apiClient.get('/users/me/saved-recipes');
      return response.data;
    } catch (error) {
      console.error('Failed to get saved recipes:', error);
      throw error;
    }
  },
};

/**
 * Health check endpoint
 * @returns {Promise} Server status
 */
export const healthCheck = async () => {
  try {
    const response = await axios.get('http://localhost:8000/');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export default apiClient;


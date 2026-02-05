import axios from 'axios';

// Configure axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 30000, // 30 seconds timeout for image processing
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Analyze produce image and return quality metrics
 * @param {File} imageFile - The uploaded image file
 * @param {number} quantity - Quantity in kg
 * @returns {Promise} API response with analysis results
 */
export const analyzeProduceImage = async (imageFile, quantity) => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('quantity', quantity.toString());

    const response = await api.post('/analyze-produce', formData);
    
    // Validate response structure
    if (!response.data || !response.data.analysis) {
      throw new Error('Invalid response format from server');
    }

    return response.data;
  } catch (error) {
    // Handle different types of errors
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - Image processing took too long');
    } else if (error.response?.status === 413) {
      throw new Error('Image file too large - Please use a smaller image');
    } else if (error.response?.status === 422) {
      throw new Error('Invalid image format - Please use JPG, PNG, or WEBP');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error - Please try again later');
    } else if (!navigator.onLine) {
      throw new Error('No internet connection - Please check your network');
    } else {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to analyze image');
    }
  }
};

export default api;
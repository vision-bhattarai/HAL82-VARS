import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Helper function to get CSRF token from cookies
const getCsrfToken = () => {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add request interceptor to include CSRF token
apiClient.interceptors.request.use(
  config => {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor for better error logging
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  register: (userData) => apiClient.post('/users/register/', userData),
  login: (credentials) => apiClient.post('/users/login/', credentials),
  logout: () => apiClient.post('/users/logout/'),
  getCurrentUser: () => apiClient.get('/users/me/'),
};

// User Services
export const userService = {
  becomeStartup: (startupData) => apiClient.post('/users/startup/register/', startupData),
  getStartups: () => apiClient.get('/users/startups/'),
  getStartupStats: () => apiClient.get('/users/startups/stats/'),
  getMyStartup: () => apiClient.get('/users/startups/my_startup/'),
};

// Campaign Services
export const campaignService = {
  getAllCampaigns: (params) => apiClient.get('/campaigns/', { params }),
  getCampaignDetail: (id) => apiClient.get(`/campaigns/${id}/`),
  createCampaign: (campaignData) => apiClient.post('/campaigns/', campaignData),
  updateCampaign: (id, campaignData) => apiClient.put(`/campaigns/${id}/`, campaignData),
  getTrendingCampaigns: () => apiClient.get('/campaigns/trending/'),
  getPopularCampaigns: () => apiClient.get('/campaigns/popular/'),
  getMyCampaigns: () => apiClient.get('/campaigns/my_campaigns/'),
};

// Wallet Services
export const walletService = {
  getMyWallet: () => apiClient.get('/wallet/wallets/my_wallet/'),
  getMyTransactions: () => apiClient.get('/wallet/transactions/my_transactions/'),
  donate: (donationData) => apiClient.post('/wallet/donate/', donationData),
};

export default apiClient;

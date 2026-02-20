import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

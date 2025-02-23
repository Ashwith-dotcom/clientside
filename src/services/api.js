import axios from 'axios';

const API_URL = 'https://satvikfood-backend-api-f8h2gqdthbh9hkcb.ukwest-01.azurewebsites.net/api';

export const api = {
  createOrder: async (amount) => {
    const response = await axios.post(`${API_URL}/donations/create-order`, { amount });
    return response.data;
  },

  verifyPayment: async (paymentData, userData, amount) => {
    const response = await axios.post(`${API_URL}/donations/verify`, {
      ...paymentData,
      userData,
      amount
    });
    return response.data;
  },

  getDonationsByPhone: async (phone) => {
    const response = await axios.get(`${API_URL}/donations/by-phone/${phone}`);
    return response.data;
  },

  getDonationByTrackId: async (trackId) => {
    const response = await axios.get(`${API_URL}/donations/track/${trackId}`);
    return response.data;
  },

  sendOTP: async (phone) => {
    const response = await axios.post(`${API_URL}/otp/send`, { phone });
    return response.data;
  },

  verifyOTP: async (phone, otp) => {
    const response = await axios.post(`${API_URL}/otp/verify`, { phone, otp });
    return response.data;
  },

  // Modify downloadReceipt to include OTP verification
  downloadReceipt: async (trackId, phone, otp) => {
    try {
      // Download receipt with OTP verification
      const response = await axios.get(`${API_URL}/receipts/${trackId}`, {
        params: { phone, otp },
        responseType: 'blob'
      });
      
      // Check if the response is an error message (not a PDF)
      const contentType = response.headers['content-type'];
      if (contentType && contentType.includes('application/json')) {
        // Convert blob to text to read the error message
        const text = await response.data.text();
        const error = JSON.parse(text);
        throw new Error(error.error || 'Failed to download receipt');
      }
      
      // If we got here, we have a PDF blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `donation-${trackId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download Receipt Error:', error);
      throw error;
    }
  },

  // Send WhatsApp message via AiSensy API
  sendWhatsAppReceipt: async (payload) => {
    const currentApiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYmMzNTI2YmQzZWE3NzE3ZGViOTJmOCIsIm5hbWUiOiJTUkkgUkFNQU5VSkEgU0FIQVNSQUJESSIsImFwcE5hbWUiOiJBaVNlbnN5IiwiY2xpZW50SWQiOiI2M2JjMzUyNmJkM2VhNzcxN2RlYjkyZjMiLCJhY3RpdmVQbGFuIjoiQkFTSUNfTU9OVEhMWSIsImlhdCI6MTY3MzI3ODc1OH0.McM1ZWryuHOAQU89Pboi0AZuicwdBJ7iqyN-r4zTRfE'; // Update this
    
    const modifiedPayload = {
      ...payload,
      apiKey: currentApiKey
    };
  
    try {
      const response = await axios.post(
        'https://backend.aisensy.com/campaign/t1/api', 
        modifiedPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentApiKey}` // Optional: Add authorization header
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('WhatsApp Send Error:', error.response?.data || error.message);
      throw error;
    }
  },

  createAutopayPlan: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/autopay/create-plan`, data);
      return response.data;
    } catch (error) {
      console.error('Create Autopay Plan Error:', error.response?.data || error.message);
      throw error;
    }
  },
  verifyAutopaySubscription: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/autopay/verify`, data);
      return response.data;
    } catch (error) {
      console.error('Verify Autopay Subscription Error:', error.response?.data || error.message);
      throw error;
    }
  },

  cancelAutopayPlan: async (subscriptionId) => {
    try {
      const response = await axios.post(`${API_URL}/autopay/cancel-plan/${subscriptionId}`);
      return response.data;
    } catch (error) {
      console.error('Cancel Autopay Plan Error:', error.response?.data || error.message);
      throw error;
    }
  },

  getAutopaySubscriptions: async (phone) => {
    const response = await axios.get(`${API_URL}/autopay/subscriptions/${phone}`);
    return response.data;
  },

  cancelAutopaySubscription: async (subscriptionId) => {
    const response = await axios.post(`${API_URL}/autopay/cancel/${subscriptionId}`);
    return response.data;
  },
  
  getUserDetailsByPhone: async (phone) => {
    const response = await axios.get(`${API_URL}/users/details/${phone}`);
    return response.data;
  },
  updateUserDetails: async (userData) => {
    const response = await axios.put(`${API_URL}/users/update`, userData);
    return response.data;
  },
};
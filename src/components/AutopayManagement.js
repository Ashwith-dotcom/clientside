import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { api } from '../services/api';
import { Search, AlertCircle } from 'lucide-react';

const AutopayManagement = () => {
  const [phone, setPhone] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(value);

    if (hasSearched) {
      setSubscriptions([]);
      setHasSearched(false);
    }
  };

  const handleSearch = async () => {
    if (!phone.match(/^[0-9]{10}$/)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const result = await api.getAutopaySubscriptions(phone);
      setSubscriptions(result);
      if (result.length === 0) {
        toast.info('No active autopay subscriptions found');
        
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (subscription) => {
    try {
      await api.sendOTP(phone);
      setSelectedSubscription(subscription);
      setShowOtpModal(true);
      toast.success('OTP sent to your registered phone number');
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Failed to send OTP');
    }
  };

  const handleOtpSubmit = async () => {
    if (!selectedSubscription || !otpInput) {
      toast.error('Please enter OTP');
      return;
    }

    try {
      setCancellingId(selectedSubscription.id);
      
      await api.verifyOTP(phone, otpInput);
      
      const result = await api.cancelAutopaySubscription(selectedSubscription.id);
      
      if (result.success) {
        toast.success('Subscription cancelled successfully');
        setSubscriptions(prev => prev.filter(sub => sub.id !== selectedSubscription.id));
        setShowOtpModal(false);
        setOtpInput('');
        setSelectedSubscription(null);
        setPhone('');
        setHasSearched(false);
      } else {
        throw new Error(result.error || 'Cancellation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'Failed to verify OTP or cancel subscription');
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-orange-600 mb-6 flex items-center gap-2">
          <Search className="w-6 h-6" />
          Cancel Your Autopay Subscriptions Here
        </h2>
        
        <div className="flex gap-4 mb-8">
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="Enter your phone number"
            className="w-full p-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            maxLength={10}
          />
          <button
            onClick={handleSearch}
            disabled={loading || phone.length !== 10}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {hasSearched && subscriptions.length > 0 && (
          <div className="space-y-4">
            {subscriptions.map((sub) => (
              <div 
                key={sub.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div className="space-y-1">
                    <p className="text-lg font-semibold">₹{sub.amount} / {sub.frequency}</p>
                    <p className="text-sm text-gray-600">
                      Next payment: {formatDate(sub.next_payment_date)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status: <span className="text-green-600 font-medium">{sub.status}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleCancelRequest(sub)}
                    disabled={cancellingId === sub.id}
                    className={`
                      px-4 py-2 rounded-lg text-white
                      ${cancellingId === sub.id 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-red-600 hover:bg-red-700'}
                      transition-colors
                    `}
                  >
                    {cancellingId === sub.id ? 'Cancelling...' : 'Cancel Subscription'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {hasSearched && subscriptions.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500 flex flex-col items-center gap-2">
            <AlertCircle className="w-12 h-12 text-orange-500" />
            <p>No active subscriptions found for this phone number.</p>
          </div>
        )}

        {showOtpModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-orange-600 mb-4">Verify OTP</h3>
              <p className="text-gray-600 mb-4">
                Please enter the OTP sent to your registered phone number to confirm subscription cancellation.
              </p>
              <input
                type="text"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter OTP"
                className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                maxLength={6}
              />
              <div className="flex gap-4">
                <button
                  onClick={handleOtpSubmit}
                  className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Verify & Cancel
                </button>
                <button
                  onClick={() => {
                    setShowOtpModal(false);
                    setOtpInput('');
                    setSelectedSubscription(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutopayManagement;
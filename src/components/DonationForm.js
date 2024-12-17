import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { Heart, Mail, MessageCircle, CheckCircle2, Search , Phone ,Download , ChevronDown} from 'lucide-react';
import Modal from 'react-modal';
import FormSection from './FormSection';
import FormInput from './FormInput';


Modal.setAppElement('#root');

const initialFormState = {
  citizenship: 'indian',
  title: 'Mr',
  name: '',
  birthdate: '',
  email: '',
  phone: '',
  whatsapp: '',
  pan: '',
  pinCode: '',
  address: '',
  amount: null,
  receiptMethod: '',
  autopay: false,
  autopayFrequency: '',
};


const DonationForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showAllDonations, setShowAllDonations] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState('');
  const [trackIdInput, setTrackIdInput] = useState('');
  const [pastDonations, setPastDonations] = useState([]);
  const [trackedDonation, setTrackedDonation] = useState(null);
  const [showPhoneSearchModal, setShowPhoneSearchModal] = useState(false);
  const [phoneSearchInput, setPhoneSearchInput] = useState('');
  const [phoneDonations, setPhoneDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    const savedDonations = localStorage.getItem('pastDonations');
    if (savedDonations) {
      setPastDonations(JSON.parse(savedDonations));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();


    const trackId = uuidv4().slice(0, 8).toUpperCase();
    setCurrentTrackId(trackId);
    
    const newDonation = {
      trackId,
      amount: formData.amount,
      date: new Date().toISOString(),
      phone: formData.phone,
      status: 'successful'
    };

    setPastDonations(prev => {
      const updated = [...prev, newDonation];
      localStorage.setItem('pastDonations', JSON.stringify(updated));
      return updated;
    });

    setShowSuccessModal(true);
  };

  const handleReceiptMethod = (method) => {
    setFormData(prev => ({ ...prev, receiptMethod: method }));
    setShowReceiptModal(false);
    setShowSuccessModal(false);
    
    toast.success(
      method === 'whatsapp' 
        ? 'Receipt will be sent via WhatsApp.' 
        : 'Receipt will be Downloaded'
    );
    resetForm();
  };

  const trackDonation = (id) => {
    const donation = pastDonations.find(d => d.trackId === id);
    if (donation) {
      setTrackedDonation(donation);
      setShowTrackingModal(true);
    } else {
      toast.error('Donation not found');
    }
  };
  const searchDonationsByPhone = (phoneNumber) => {
    const donations = pastDonations.filter(d => d.phone === phoneNumber);
    if (donations.length > 0) {
      setPhoneDonations(donations);
      setShowPhoneSearchModal(true);
    } else {
      toast.error('No donations found for this phone number');
    }
  };

  const viewDonationDetails = (donation) => {
    setSelectedDonation(donation);
    setShowPhoneSearchModal(false);
    setShowTrackingModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:shadow-2xl">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-orange-600 mb-6 flex items-center gap-2">
              <Heart className="text-orange-500" /> Make a Donation
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormSection title="Fill the Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Citizenship</label>
                    <div className="space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="citizenship"
                          value="indian"
                          checked={formData.citizenship === 'indian'}
                          onChange={handleInputChange}
                          className="form-radio text-orange-600"
                        />
                        <span className="ml-2">Indian Citizen</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="citizenship"
                          value="foreign"
                          checked={formData.citizenship === 'foreign'}
                          onChange={handleInputChange}
                          className="form-radio text-orange-600"
                        />
                        <span className="ml-2">Foreign National</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Title</label>
                    <select
                      name="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full p-3 border rounded-lg input-focus-effect"
                    >
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Ms">Ms</option>
                      <option value="Dr">Dr</option>
                    </select>
                  </div>
                </div>

                <FormInput
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />

                <FormInput
                  label="Birthdate"
                  name="birthdate"
                  type="date"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                />
              

              
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}

                />

                <FormInput
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />

                <FormInput
                  label="WhatsApp Number"
                  name="whatsapp"
                  type="tel"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                />
              

               
                <label className="block text-gray-700 mb-4">Select Amount</label>
                <div>
        <input
          type="number"
          placeholder="Enter Amount"
          value={formData.amount}
          onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
          className="w-full p-3 border rounded-lg input-focus-effect mt-4"
        />
        <p>Become a facilitator by contributing even a rupee a day!</p>
      </div>
                
                {formData.amount >= 2000 && (
                  <FormInput
                    label="PAN Number"
                    name="pan"
                    value={formData.pan}
                    onChange={handleInputChange}
                    required
                    pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                    title="Please enter a valid PAN number"
                  />
                )}
                <br/>
                <div className="space-y-4 ">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="autopay"
                      checked={formData.autopay}
                      onChange={handleInputChange}
                      className="form-checkbox text-orange-600"
                    />
                    <span className="ml-2">Enable Autopay</span>
                  </label>
                  {formData.autopay && (
                    <select
                      name="autopayFrequency"
                      value={formData.autopayFrequency}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg input-focus-effect"
                    >
                      <option value="">Select Frequency (Daily, Monthly, Yearly)</option>
                      <option value="daily">Daily</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  )}
                </div>
              </FormSection>
              <button
                type="submit"
                className="w-full bg-orange-600 text-white py-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 button-hover-effect"
              >
                Donate Now
                <Heart className="animate-pulse" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h3 className="text-2xl font-bold text-orange-600 mb-6 flex items-center gap-2">
              <Search /> Track Your Donation
            </h3>
            <div className="flex gap-4">
              <input
                type="text"
                value={trackIdInput}
                onChange={(e) => setTrackIdInput(e.target.value)}
                placeholder="Enter your tracking ID"
                className="flex-1 p-3 border rounded-lg input-focus-effect"
              />
              <button
                onClick={() => trackDonation(trackIdInput)}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors button-hover-effect"
              >
                Track
              </button>
            </div>
          </div>
          <div className="p-8">
                <h3 className="text-2xl font-bold text-orange-600 mb-6 flex items-center gap-2">
                  <Phone /> Search by Phone
                </h3>
                <div className="flex gap-4">
                  <input
                    type="tel"
                    value={phoneSearchInput}
                    onChange={(e) => setPhoneSearchInput(e.target.value)}
                    placeholder="Enter phone number"
                    className="flex-1 p-3 border rounded-lg input-focus-effect"
                  />
                  <button
                    onClick={() => searchDonationsByPhone(phoneSearchInput)}
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors button-hover-effect"
                  >
                    Search
                  </button>
                </div>
              </div>
        </div>

        {/* Success Modal */}
        <Modal
          isOpen={showSuccessModal}
          onRequestClose={() => setShowReceiptModal(true)}
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <div className="text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Thank You for Your Donation!</h2>
            <p className="text-gray-600 mb-4">Your donation has been successfully processed.</p>
            <p className="text-lg font-semibold mb-6">Tracking ID: {currentTrackId}</p>
            <button
              onClick={() => setShowReceiptModal(true)}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors button-hover-effect"
            >
              Continue
            </button>
          </div>
        </Modal>

        {/* Receipt Method Modal */}
        <Modal
          isOpen={showReceiptModal}
          onRequestClose={() => {
            setShowReceiptModal(false);
            resetForm();
          }}
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <div className="text-center">
          <button onClick={()=> setShowReceiptModal(false) & setShowSuccessModal(false)}>X</button>
            <h2 className="text-2xl font-bold mb-6">Choose Receipt Method</h2>
            <div className="space-y-4">
              <button
                onClick={() => handleReceiptMethod('download')}
                className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors button-hover-effect flex items-center justify-center gap-2"
              >
                <Download /> Download Receipt
              </button>
              <button
                onClick={() => handleReceiptMethod('whatsapp')}
                className="w-full bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition-colors button-hover-effect flex items-center justify-center gap-2"
              >
                <MessageCircle /> Receive via WhatsApp
              </button>
            </div>
          </div>
        </Modal>

        {/* Tracking Modal */}
        <Modal
          isOpen={showTrackingModal}
          onRequestClose={() => setShowTrackingModal(false)}
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          {trackedDonation && (
            <div className="text-center">
              
              <h2 className="text-2xl font-bold mb-6">Donation Details</h2>
              <div className="space-y-4 text-left">
                <p className="flex justify-between">
                  <span className="font-semibold">Track ID:</span>
                  <span>{trackedDonation.trackId}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold">Amount:</span>
                  <span>₹{trackedDonation.amount.toLocaleString()}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold">Date:</span>
                  <span>{new Date(trackedDonation.date).toLocaleDateString()}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold">Status:</span>
                  <span className="text-green-600 font-semibold">{trackedDonation.status}</span>
                </p>
              </div>
              <button
                onClick={() => setShowTrackingModal(false)}
                className="mt-6 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors button-hover-effect"
              >
                Close
              </button>
            </div>
          )}
        </Modal>
        <Modal
          isOpen={showPhoneSearchModal}
          onRequestClose={() => setShowPhoneSearchModal(false)}
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <div className="text-center">
          <button 
      onClick={() => setShowPhoneSearchModal(false)}
      className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
    >
      ✕
    </button>
            <h2 className="text-2xl font-bold mb-6">Your Donations</h2>
            <div className="donations-grid">
              {phoneDonations.map((donation) => (
                <div
                  key={donation.trackId}
                  onClick={() => viewDonationDetails(donation)}
                  className="mb-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">Track ID: {donation.trackId}</p>
                      <p className="text-gray-600">Amount: ₹{donation.amount}</p>
                      <p className="text-gray-600">Date: {new Date(donation.date).toLocaleDateString()}</p>
                    </div>
                    <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full whitespace-nowrap ml-4">
                      {donation.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowPhoneSearchModal(false)}
              className="mt-6 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors button-hover-effect"
            >
              Close
            </button>
          </div>
        </Modal>
        <Modal
          isOpen={showTrackingModal}
          onRequestClose={() => setShowTrackingModal(false)}
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          {selectedDonation && (
            <div className="text-center">
              <button 
        onClick={() => setShowTrackingModal(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
              <h2 className="text-2xl font-bold mb-6">Donation Details</h2>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="space-y-4 text-left">
                <p className="flex justify-between">
                  <span className="font-semibold">Track ID:</span>
                  <span>{selectedDonation.trackId}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold">Amount:</span>
                  <span>₹{selectedDonation.amount.toLocaleString()}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold">Date:</span>
                  <span>{new Date(selectedDonation.date).toLocaleDateString()}</span>
                  
                  
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold">Status:</span>
                  <span className="text-green-600 font-semibold">{selectedDonation.status}</span>
                </p>
              </div>
              </div>
              <div className="mt-6 space-x-4">
                <button
                  // onClick={() => handleDownloadReceipt(selectedDonation)}

                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors button-hover-effect inline-flex items-center gap-2"
                >
                  <Download size={20} />
                  Download Receipt
                </button>
                <button
                  onClick={() => setShowTrackingModal(false)}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors button-hover-effect"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>
        {pastDonations.length > 0 && (
    <div className="mt-12 bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:shadow-2xl">
      <div className="p-8">
        <h3 className="text-2xl font-bold text-orange-600 mb-6">Past Donations</h3>
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          
          {(showAllDonations ? pastDonations : pastDonations.slice(0, 4)).map((donation) => (
            <div
              key={donation.trackId}
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
              onClick={() => {
                setSelectedDonation(donation);
                setShowTrackingModal(true);
              }}
            >
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Track ID: {donation.trackId}</p>
                  <p className="text-gray-600">Amount: ₹{donation.amount}</p>
                  <p className="text-gray-600">Date: {new Date(donation.date).toLocaleDateString()}</p>
                </div>
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full whitespace-nowrap ml-4">
                  {donation.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {pastDonations.length > 4 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAllDonations(!showAllDonations)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {showAllDonations ? 'Show Less' : 'Show More'}
              <ChevronDown 
                className={`transform transition-transform ${showAllDonations ? 'rotate-180' : ''}`}
                size={20}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  )}
      </div>
    </div>
  );
};

export default DonationForm;

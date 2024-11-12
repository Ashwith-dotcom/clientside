import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { Heart, Mail, MessageCircle, CheckCircle2, Search } from 'lucide-react';
import Modal from 'react-modal';
import FormSection from './FormSection';
import FormInput from './FormInput';
import AmountSelector from './AmountSelector';

Modal.setAppElement('#root');

const generateCaptcha = () => {
  const num1 = Math.floor(Math.random() * 10);
  const num2 = Math.floor(Math.random() * 10);
  return { num1, num2, answer: num1 + num2 };
};

const predefinedAmounts = [
  80000, 75000, 70000, 65000, 60000, 55000, 50000, 45000,
  40000, 30000, 25000, 20000, 15000, 12000, 7500, 3000
];

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
  amount: 0,
  sponsorPlate: false,
  plateAmount: 100,
  captchaAnswer: '',
  acceptTerms: false,
  syncPhoneWithWhatsapp: false,
  receiptMethod: '',
};


const DonationForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState('');
  const [trackIdInput, setTrackIdInput] = useState('');
  const [pastDonations, setPastDonations] = useState([]);
  const [trackedDonation, setTrackedDonation] = useState(null);

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
    setCaptcha(generateCaptcha());
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (parseInt(formData.captchaAnswer) !== captcha.answer) {
      toast.error('Incorrect captcha answer!');
      setCaptcha(generateCaptcha());
      return;
    }

    if (!formData.acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    const trackId = uuidv4().slice(0, 8).toUpperCase();
    setCurrentTrackId(trackId);
    
    const newDonation = {
      trackId,
      amount: formData.amount + (formData.sponsorPlate ? formData.plateAmount : 0),
      date: new Date().toISOString(),
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
    toast.success(`Receipt will be sent via ${method === 'email' ? 'email' : 'WhatsApp'}`);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:shadow-2xl">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-orange-600 mb-6 flex items-center gap-2">
              <Heart className="text-orange-500" /> Make a Donation
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormSection title="Personal Information">
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
              </FormSection>

              <FormSection title="Contact Information">
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
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
              </FormSection>

              <FormSection title="Donation Details">
                <label className="block text-gray-700 mb-4">Select Amount</label>
                <AmountSelector
                  amounts={predefinedAmounts}
                  selectedAmount={formData.amount}
                  onChange={(amount) => setFormData(prev => ({ ...prev, amount }))}
                />

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

                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="checkbox"
                    name="sponsorPlate"
                    checked={formData.sponsorPlate}
                    onChange={handleInputChange}
                    className="form-checkbox text-orange-600 h-5 w-5"
                  />
                  <label>I would also like to sponsor a steel meal plate worth ₹100</label>
                </div>
              </FormSection>

              <FormSection title="Address">
                <FormInput
                  label="Pin Code"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleInputChange}
                  required
                />

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    required
                    className="w-full p-3 border rounded-lg input-focus-effect"
                    rows={3}
                  />
                </div>
              </FormSection>

              <div className="bg-gray-50 p-6 rounded-lg">
                <label className="block text-gray-700 mb-2">Verification</label>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold">{captcha.num1} + {captcha.num2} = ?</span>
                  <input
                    type="text"
                    name="captchaAnswer"
                    required
                    className="w-24 p-3 border rounded-lg input-focus-effect"
                    value={formData.captchaAnswer}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className="form-checkbox text-orange-600 h-5 w-5"
                />
                <label>I accept the terms and conditions</label>
              </div>

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
            <h2 className="text-2xl font-bold mb-6">Choose Receipt Method</h2>
            <div className="space-y-4">
              <button
                onClick={() => handleReceiptMethod('email')}
                className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors button-hover-effect flex items-center justify-center gap-2"
              >
                <Mail /> Receive via Email
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
        {pastDonations.length > 0 && (
    <div className="mt-12 bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:shadow-2xl">
      <div className="p-8">
        <h3 className="text-2xl font-bold text-orange-600 mb-6">Past Donations</h3>
        <div className="space-y-4">
          {pastDonations.map((donation) => (
            <div
              key={donation.trackId}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div>
                <p className="font-semibold">Track ID: {donation.trackId}</p>
                <p>Amount: ₹{donation.amount}</p>
                <p>Date: {new Date(donation.date).toLocaleDateString()}</p>
              </div>
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full">
                {donation.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )}
      </div>
    </div>
  );
};

export default DonationForm;

// import React, { useState, useEffect } from 'react';
// import { v4 as uuidv4 } from 'uuid';
// import toast from 'react-hot-toast';
// import { MapPin, Heart } from 'lucide-react';

// import Modal from 'react-modal';

// const generateCaptcha = () => {
//   const num1 = Math.floor(Math.random() * 10);
//   const num2 = Math.floor(Math.random() * 10);
//   return { num1, num2, answer: num1 + num2 };
// };

// const predefinedAmounts = [
//   80000, 75000, 70000, 65000, 60000, 55000, 50000, 45000,
//   40000, 30000, 25000, 20000, 15000, 12000, 7500, 3000
// ];

// const DonationForm = () => {
//   const [formData, setFormData] = useState({
//     citizenship: 'indian',
//     title: 'Mr',
//     name: '',
//     birthdate: '',
//     email: '',
//     phone: '',
//     whatsapp: '',
//     alternateMobile: '',
//     pan: '',
//     pinCode: '',
//     address: '',
//     amount: 0,
//     sponsorPlate: false,
//     plateAmount: 100,
//     captchaAnswer: '',
//     acceptTerms: false,
//     syncPhoneWithWhatsapp: false,
//     receiptMethod: '',
//   });

//   const [captcha, setCaptcha] = useState(generateCaptcha());
//   const [showModal, setShowModal] = useState(false);
//   const [trackIdInput, setTrackIdInput] = useState('');
//   const [receiptEmail, setReceiptEmail] = useState('');
//   const [pastDonations, setPastDonations] = useState([]);
//   const [showTrackingSection, setShowTrackingSection] = useState(false);

//   useEffect(() => {
//     // Load past donations from localStorage
//     const savedDonations = localStorage.getItem('pastDonations');
//     if (savedDonations) {
//       setPastDonations(JSON.parse(savedDonations));
//     }
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value, type } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? (e.target).checked : value
//     }));
//   };

//   const saveDonation = (trackId, amount) => {
//     const newDonation = {
//       trackId,
//       amount,
//       date: new Date().toISOString(),
//       status: 'successful'
//     };

//     const updatedDonations = [...pastDonations, newDonation];
//     setPastDonations(updatedDonations);
//     localStorage.setItem('pastDonations', JSON.stringify(updatedDonations));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (parseInt(formData.captchaAnswer) !== captcha.answer) {
//       toast.error('Incorrect captcha answer!');
//       setCaptcha(generateCaptcha());
//       return;
//     }

//     if (!formData.acceptTerms) {
//       toast.error('Please accept the terms and conditions');
//       return;
//     }

//     const trackId = uuidv4().slice(0, 8).toUpperCase();
    
//     // Simulate payment process
//     toast.success(`Donation successful! Your tracking ID: ${trackId}`);
//     saveDonation(trackId, formData.amount);

//     // Reset form
//     setFormData({
//       citizenship: 'indian',
//       title: 'Mr',
//       name: '',
//       birthdate: '',
//       email: '',
//       phone: '',
//       whatsapp: '',
//       alternateMobile: '',
//       pan: '',
//       pinCode: '',
//       address: '',
//       amount: 0,
//       sponsorPlate: false,
//       plateAmount: 100,
//       captchaAnswer: '',
//       acceptTerms: false
//     });
//     setCaptcha(generateCaptcha());
//   };

//   const trackDonation = (id) => {
//     const donation = pastDonations.find(d => d.trackId === id);
//     if (donation) {
//       toast.success(`Donation Status: ${donation.status}
// Amount: ₹${donation.amount}
// Date: ${new Date(donation.date).toLocaleDateString()}`);
//     } else {
//       toast.error('Donation not found');
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//           <div className="p-8">
//             <h2 className="text-3xl font-bold text-orange-600 mb-6">Make a Donation</h2>
            
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-gray-700 mb-2">Citizenship</label>
//                   <div className="space-x-4">
//                     <label className="inline-flex items-center">
//                       <input
//                         type="radio"
//                         name="citizenship"
//                         value="indian"
//                         checked={formData.citizenship === 'indian'}
//                         onChange={handleInputChange}
//                         className="form-radio text-orange-600"
//                       />
//                       <span className="ml-2">Indian Citizen</span>
//                     </label>
//                     <label className="inline-flex items-center">
//                       <input
//                         type="radio"
//                         name="citizenship"
//                         value="foreign"
//                         checked={formData.citizenship === 'foreign'}
//                         onChange={handleInputChange}
//                         className="form-radio text-orange-600"
//                       />
//                       <span className="ml-2">Foreign National</span>
//                     </label>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 mb-2">Title</label>
//                   <select
//                     name="title"
//                     value={formData.title}
//                     onChange={handleInputChange}
//                     className="w-full p-3 border rounded-lg"
//                   >
//                     <option value="Mr">Mr</option>
//                     <option value="Mrs">Mrs</option>
//                     <option value="Ms">Ms</option>
//                     <option value="Dr">Dr</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-gray-700 mb-2">Full Name *</label>
//                   <input
//                     type="text"
//                     name="name"
//                     required
//                     className="w-full p-3 border rounded-lg"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 mb-2">Birthdate</label>
//                   <input
//                     type="date"
//                     name="birthdate"
//                     className="w-full p-3 border rounded-lg"
//                     value={formData.birthdate}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-gray-700 mb-2">Email *</label>
//                   <input
//                     type="email"
//                     name="email"
//                     required
//                     className="w-full p-3 border rounded-lg"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 mb-2">WhatsApp Number</label>
//                   <input
//                     type="tel"
//                     name="whatsapp"
//                     className="w-full p-3 border rounded-lg"
//                     value={formData.whatsapp}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-gray-700 mb-2">Alternate Mobile</label>
//                   <input
//                     type="tel"
//                     name="alternateMobile"
//                     className="w-full p-3 border rounded-lg"
//                     value={formData.alternateMobile}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 mb-2">PAN Number *</label>
//                   <input
//                     type="text"
//                     name="pan"
//                     required
//                     className="w-full p-3 border rounded-lg"
//                     value={formData.pan}
//                     onChange={handleInputChange}
//                     pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
//                     title="Please enter a valid PAN number"
//                   />
//                   <p className="text-sm text-gray-500 mt-1">Required for 80G certificate</p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-gray-700 mb-2">Pin Code *</label>
//                   <input
//                     type="text"
//                     name="pinCode"
//                     required
//                     className="w-full p-3 border rounded-lg"
//                     value={formData.pinCode}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 mb-2">Address *</label>
//                   <textarea
//                     name="address"
//                     required
//                     className="w-full p-3 border rounded-lg"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     rows={3}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-4">Select Amount</label>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   {predefinedAmounts.map((amount) => (
//                     <label key={amount} className="inline-flex items-center">
//                       <input
//                         type="radio"
//                         name="amount"
//                         value={amount}
//                         checked={formData.amount === amount}
//                         onChange={handleInputChange}
//                         className="form-radio text-orange-600"
//                       />
//                       <span className="ml-2">₹{amount}</span>
//                     </label>
//                   ))}
//                   <div className="col-span-2 md:col-span-4">
//                     <input
//                       type="number"
//                       name="amount"
//                       placeholder="Other Amount"
//                       className="w-full p-3 border rounded-lg"
//                       value={formData.amount || ''}
//                       onChange={handleInputChange}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   name="sponsorPlate"
//                   checked={formData.sponsorPlate}
//                   onChange={handleInputChange}
//                   className="form-checkbox text-orange-600"
//                 />
//                 <label>I would also like to sponsor a steel meal plate worth ₹100</label>
//               </div>

//               <div className="bg-gray-50 p-6 rounded-lg">
//                 <label className="block text-gray-700 mb-2">Captcha</label>
//                 <div className="flex items-center gap-4">
//                   <span>{captcha.num1} + {captcha.num2} = ?</span>
//                   <input
//                     type="text"
//                     name="captchaAnswer"
//                     required
//                     className="w-24 p-3 border rounded-lg"
//                     value={formData.captchaAnswer}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//               </div>

//               <div className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   name="acceptTerms"
//                   checked={formData.acceptTerms}
//                   onChange={handleInputChange}
//                   className="form-checkbox text-orange-600"
//                 />
//                 <label>I accept the terms and conditions</label>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
//               >
//                 Donate Now
//                 <Heart size={20} />
//               </button>
//             </form>
//           </div>
//         </div>

//         <div className="mt-12 bg-white rounded-xl shadow-lg overflow-hidden">
//           <div className="p-8">
//             <h3 className="text-2xl font-bold text-orange-600 mb-6">Track Your Donation</h3>
//             <div className="flex gap-4">
//               <input
//                 type="text"
//                 value={trackIdInput}
//                 onChange={(e) => setTrackIdInput(e.target.value)}
//                 placeholder="Enter your tracking ID"
//                 className="flex-1 p-3 border rounded-lg"
//               />
//               <button
//                 onClick={() => trackDonation(trackIdInput)}
//                 className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
//               >
//                 Track
//               </button>
//             </div>
//           </div>
//         </div>

//         {pastDonations.length > 0 && (
//           <div className="mt-12 bg-white rounded-xl shadow-lg overflow-hidden">
//             <div className="p-8">
//               <h3 className="text-2xl font-bold text-orange-600 mb-6">Past Donations</h3>
//               <div className="space-y-4">
//                 {pastDonations.map((donation) => (
//                   <div
//                     key={donation.trackId}
//                     className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
//                   >
//                     <div>
//                       <p className="font-semibold">Track ID: {donation.trackId}</p>
//                       <p>Amount: ₹{donation.amount}</p>
//                       <p>Date: {new Date(donation.date).toLocaleDateString()}</p>
//                     </div>
//                     <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full">
//                       {donation.status}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DonationForm;
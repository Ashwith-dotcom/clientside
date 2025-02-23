import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Heart,

  Search,
} from "lucide-react";
import Modal from "react-modal";
import FormSection from "./FormSection";
import FormInput from "./FormInput";
import { api } from "../services/api";
import {
  handleAutopaySubscription,
  handleOneTimePayment,
} from "../utils/paymentHandlers";
Modal.setAppElement("#root");

const DonationForm = () => {
  const initialFormState = {
    citizenship: "indian",
    title: "Mr",
    name: "",
    email: "",
    phone: "",
    pan: "",
    amount: "",
    receiptMethod: "",
    autopay: false,
    autopayFrequency: "",
  };
  const [hasSearched, setHasSearched] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [showPhoneSearchModal, setShowPhoneSearchModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [selectedDonationForOtp, setSelectedDonationForOtp] = useState(null);
  const [showDetailsConfirmationModal, setShowDetailsConfirmationModal] =
    useState(false);
  const [existingUserDetails, setExistingUserDetails] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => {
      const newData = { ...prevData };
      if (name === "phone") {
        newData[name] = normalizePhoneNumber(value);
      } else if (type === "checkbox") {
        newData[name] = checked;
      } else {
        newData[name] = value;
      }
      return newData;
    });
  };

  const resetForm = () => {
    setFormData(initialFormState);

  };

  const normalizePhoneNumber = (phone) => {
    // Remove all non-digits
    const normalizedPhone = phone.replace(/\D/g, "");

    // If starts with 91 or 0, remove them
    if (normalizedPhone.startsWith("91")) {
      return normalizedPhone.slice(2).slice(-10);
    }
    if (normalizedPhone.startsWith("0")) {
      return normalizedPhone.slice(1).slice(-10);
    }

    return normalizedPhone.slice(-10);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkExistingUserDetails = async (userData) => {
    try {
      const existingUser = await api.getUserDetailsByPhone(userData.phone);

      if (existingUser) {
        // Check if any details have changed
        const hasNameChange =
          existingUser.name &&
          userData.name &&
          existingUser.name !== userData.name;
        const hasEmailChange =
          existingUser.email &&
          userData.email &&
          existingUser.email !== userData.email;
        const hasPanChange =
          existingUser.pan && userData.pan && existingUser.pan !== userData.pan;

        const hasChanges = hasNameChange || hasEmailChange || hasPanChange;

        if (hasChanges) {
          // Store existing and new details for comparison
          setExistingUserDetails({
            oldDetails: existingUser,
            newDetails: userData,
          });

          // Show confirmation modal
          setShowDetailsConfirmationModal(true);
          return false; // Prevent immediate donation processing
        }

        return existingUser; // Use existing details if no changes
      }

      return userData; // Use new user data if no existing user found
    } catch (error) {
      console.error("Error checking user details:", error);
      return userData; // Proceed with new user data if verification fails
    }
  };

  const handleUserDetailsConfirmation = async (useNewDetails) => {
    try {
      const finalUserData = useNewDetails
        ? existingUserDetails.newDetails
        : existingUserDetails.oldDetails;

      // If using new details, update user in database
      if (useNewDetails) {
        await api.updateUserDetails(finalUserData);
      }

      // Close modal and process donation
      setShowDetailsConfirmationModal(false);
      await processDonation(finalUserData);
    } catch (error) {
      console.error("Error handling user details confirmation:", error);
      toast.error("Failed to process donation");
    }
  };
  const processDonation = async (userData) => {

    if (!userData.phone) {
      toast.error("Phone number is required.");
      return;
    }
    try {
      let result;

      if (formData.autopay && formData.autopayFrequency) {
        result = await handleAutopaySubscription(
          userData,
          Number(formData.amount),
          formData.autopayFrequency,
          resetForm
        );
      } else {
        result = await handleOneTimePayment(userData, Number(formData.amount) , resetForm);
      }
      if (result === true && result?.success) {
        toast.success(
          formData.autopay
            ? "Autopay setup successful!"
            : "Donation successful!"
        );

        return { success: true };
      }

      return { success: false };
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Failed to process donation");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (formData.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Prepare user data
    const userData = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      pan: formData.pan,
    };

    try {
      // Check existing user and handle details confirmation if needed
      const checkedUserData = await checkExistingUserDetails(userData);

      if (checkedUserData) {
        const response = await processDonation(checkedUserData);

        if (response.success) {
          console.log("Donation successful");

        } else {
          toast.error("Donation failed");
        }
      }
     
    } catch (error) {
      console.error("Error processing donation:", error);
      toast.error("Failed to process donation");
    }
  };

  const handleSearch = async () => {
    try {
      let results;
      if (searchInput.match(/^[0-9]{10}$/)) {

        results = await api.getDonationsByPhone(searchInput);
      } else {

        const donation = await api.getDonationByTrackId(searchInput);
        results = donation ? [donation] : [];
      }
      setSearchResults(results);
      setShowPhoneSearchModal(true);
      setHasSearched(true);
      if (results.length === 0) {
        toast.info("No donations found");
        setSearchInput("");
      }
    } catch (error) {
      toast.error("No donations found");
      setSearchInput("");
    }
  };

  const handleDownloadReceipt = async (donation) => {
    const donationDate = new Date(donation.created_at);
    const currentDate = new Date();
    const daysDifference = (currentDate - donationDate) / (1000 * 60 * 60 * 24);

    if (daysDifference > 1) {
      try {
        // Send OTP
        await api.sendOTP(donation.phone);
        setSelectedDonationForOtp(donation);
        setShowOtpModal(true);
        toast.success("OTP sent to your registered phone number");
      } catch (error) {
        toast.error("Failed to send OTP");
      }
    } else {
      downloadReceipt(donation.track_id);
    }
  };

  const downloadReceipt = async (trackId) => {
    try {
      await api.downloadReceipt(trackId);
      toast.success("Receipt downloaded successfully");
    } catch (error) {
      toast.error("Failed to download receipt");
    }
  };

  const handleOtpSubmit = async () => {
    try {
      if (!selectedDonationForOtp || !otpInput) {
        toast.error("Please enter OTP");
        return;
      }

      try {
        // Download receipt with OTP verification
        await api.downloadReceipt(
          selectedDonationForOtp.track_id,
          selectedDonationForOtp.phone,
          otpInput
        );
        setShowOtpModal(false);
        setOtpInput("");
        toast.success("Receipt downloaded successfully");
      } catch (error) {
        console.error("Download error:", error);
        if (error.response?.status === 403) {
          toast.error(error.response?.data?.error || "Invalid or expired OTP");
        } else {
          toast.error("Failed to download receipt. Please try again.");
        }
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(error.response?.data?.error || "Failed to verify OTP");
    }
  };

  return (
    <section id="donation" className="py-20">
      <div className="container mx-auto px-4 py-8">
        <div cdlassName="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:shadow-2xl">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-orange-600 mb-6 flex items-center gap-2">
                <Heart className="text-orange-500" /> Make a Donation
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <FormSection title="Fill the Details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Citizenship
                      </label>
                      <div className="space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="citizenship"
                            value="indian"
                            checked={formData.citizenship === "indian"}
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
                            checked={formData.citizenship === "foreign"}
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
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
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

                  <label className="block text-gray-700 mb-4">
                    Select Amount
                  </label>
                  <div>
                    <input
                      type="number"
                      placeholder="Enter Amount"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                    <p>
                      Become a facilitator by contributing even a rupee a day!
                    </p>
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
                  <br />
                  <div className="space-y-4 ">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="autopay"
                        checked={formData.autopay}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            autopay: e.target.checked,
                          });
                        }}
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
                        <option value="">Select Frequency</option>
                        <option value="weekly">Weekly (Every 7 days)</option>
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
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    if (hasSearched) {
                      setSearchResults([]);
                      setHasSearched(false);
                    }
                  }}
                  placeholder="Enter tracking ID or phone number"
                  className="w-full p-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                />
                <button
                  onClick={handleSearch}
                  disabled={searchInput.length !== 10}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors button-hover-effect disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          <Modal
            isOpen={showPhoneSearchModal}
            onRequestClose={() => {
              setShowPhoneSearchModal(false);
              setSearchInput("");
            }}
            className="modal-content"
            overlayClassName="modal-overlay"
          >
            <div className="text-center">
              <button
                onClick={() => {
                  setShowPhoneSearchModal(false);
                  setSearchInput("");
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-6">Search Results</h2>
              <div className="donations-grid">
                {hasSearched &&
                  searchResults.map((donation) => (
                    <div
                      key={donation.track_id}
                      className="mb-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-left">
                          <p className="font-semibold text-gray-800">
                            Track ID: {donation.track_id}
                          </p>
                          <p className="text-gray-600">
                            Amount: ₹{donation.amount}
                          </p>
                          <p className="text-gray-600">
                            Date:{" "}
                            {new Date(donation.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full whitespace-nowrap ml-4">
                          {donation.status}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadReceipt(donation);
                          }}
                          className="mt-2 bg-orange-500 text-white py-1 px-3 rounded-md hover:bg-orange-600"
                        >
                          Download Receipt
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
              <button
                onClick={() => {
                  setShowPhoneSearchModal(false);
                  setSearchInput("");
                }}
                className="mt-6 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors button-hover-effect"
              >
                Close
              </button>
            </div>
          </Modal>

          <Modal
            isOpen={showOtpModal}
            onRequestClose={() => setShowOtpModal(false)}
            className="modal-content"
            overlayClassName="modal-overlay"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
              <button
                onClick={() => setShowOtpModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold text-orange-600 mb-4">
                Enter OTP
              </h2>
              <p className="text-gray-600 mb-4">
                Please enter the 4-digit OTP sent to your registered phone
                number.
              </p>
              <input
                type="text"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="Enter 4-digit OTP"
                className="w-full p-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors mb-4"
                maxLength={6}
              />
              <button
                onClick={handleOtpSubmit}
                className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
              >
                Verify OTP
              </button>
            </div>
          </Modal>
        </div>
      </div>
      <Modal
        isOpen={showDetailsConfirmationModal}
        onRequestClose={() => setShowDetailsConfirmationModal(false)}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">
            Update User Details?
          </h2>
          <p className="text-gray-600 mb-4">
            We found some differences in your details. Would you like to update
            them?
          </p>

          {existingUserDetails && (
            <div className="space-y-4 mb-6">
              {existingUserDetails.oldDetails.name !==
                existingUserDetails.newDetails.name &&
                existingUserDetails.oldDetails.name &&
                existingUserDetails.newDetails.name && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Name:</span>
                    <div className="text-right">
                      <p className="text-gray-600">
                        Current: {existingUserDetails.oldDetails.name}
                      </p>
                      <p className="text-orange-600">
                        New: {existingUserDetails.newDetails.name}
                      </p>
                    </div>
                  </div>
                )}

              {existingUserDetails.oldDetails.email !==
                existingUserDetails.newDetails.email &&
                existingUserDetails.oldDetails.email &&
                existingUserDetails.newDetails.email && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Email:</span>
                    <div className="text-right">
                      <p className="text-gray-600">
                        Current: {existingUserDetails.oldDetails.email}
                      </p>
                      <p className="text-orange-600">
                        New: {existingUserDetails.newDetails.email}
                      </p>
                    </div>
                  </div>
                )}

              {existingUserDetails.oldDetails.pan !==
                existingUserDetails.newDetails.pan &&
                existingUserDetails.oldDetails.pan &&
                existingUserDetails.newDetails.pan && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium">PAN:</span>
                    <div className="text-right">
                      <p className="text-gray-600">
                        Current: {existingUserDetails.oldDetails.pan}
                      </p>
                      <p className="text-orange-600">
                        New: {existingUserDetails.newDetails.pan}
                      </p>
                    </div>
                  </div>
                )}
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={() => handleUserDetailsConfirmation(true)}
              className="flex-1 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Use New Details
            </button>
            <button
              onClick={() => handleUserDetailsConfirmation(false)}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Keep Existing
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default DonationForm;

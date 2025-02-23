import { toast } from 'react-hot-toast';
import { api } from '../services/api';
import { loadRazorpayScript, initializeRazorpayPayment } from './razorpay';
const API_URL = 'http://192.168.0.101:5000/api';

export async function handleAutopaySubscription(userData, amount, frequency, resetForm) {
  const loadingIndicator = document.createElement('div');
  loadingIndicator.id = 'razorpay-loading';
  document.body.appendChild(loadingIndicator);
  try {
    if (!userData.name || !userData.phone) {
      throw new Error("Required user information missing")
    }

    if (!amount || amount <= 0) {
      throw new Error("Invalid amount")
    }

    if (!frequency) {
      throw new Error("Frequency is required for autopay")
    }

    const subscriptionPlan = await api.createAutopayPlan({
      userData,
      amount,
      frequency,
    })

    if (!subscriptionPlan.success) {
      throw new Error(subscriptionPlan.error || "Failed to create subscription plan")
    }

    await loadRazorpayScript()

    const options = {
      key: process.env.RAZORPAY_KEY_ID,
      subscription_id: subscriptionPlan.subscriptionId,
      name: "Vikas Tarangini",
      description: `${frequency} donation of ₹${amount}`,
      prefill: {
        name: userData.name,
        email: userData.email,
        contact: userData.phone,
      },
      handler: async (response) => {
        document.getElementById('razorpay-loading')?.remove();
        if (response.razorpay_payment_id) {
          try {
            const verificationResult = await api.verifyAutopaySubscription({
              subscriptionId: subscriptionPlan.subscriptionId,
              paymentId: response.razorpay_payment_id,
              userData,
              amount,
              frequency,
              planId: subscriptionPlan.planId
            });

            if (verificationResult.success) {
              toast.success("Autopay donation set up successfully!");
              resetForm(); 
              return true;
            } else {
              toast.error("Failed to verify subscription");
              return false;
            }
          } catch (error) {
            console.error("Subscription verification failed:", error);
            toast.error(error.response?.data?.error || "Failed to verify subscription");
            return false;
          }
        }
        toast.error("Subscription setup failed")
        return false
      },
      modal: {
        ondismiss: async () => {
          document.getElementById('razorpay-loading')?.remove();
          try {
            await api.cancelAutopayPlan(subscriptionPlan.subscriptionId);
          } catch (error) {
            console.error("Error handling subscription cancellation:", error);
          }
          toast.error("Subscription setup cancelled");
        },
      },
    }

    return initializeRazorpayPayment(options)
  } catch (error) {
    document.getElementById('razorpay-loading')?.remove();
    console.error("Subscription creation failed:", error)
    toast.error(error.message || "Failed to setup subscription")
    return false
  }
}


export async function handleOneTimePayment(
  userData,
  amount,
  resetForm
) {
  const loadingIndicator = document.createElement('div');
  loadingIndicator.id = 'razorpay-loading';
  document.body.appendChild(loadingIndicator);
  try{
  const order = await api.createOrder(amount);
  await loadRazorpayScript();

  const options = {
    key: process.env.RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    order_id: order.id,
    name: 'Vikas Tarangini',
    description: 'Donation',
    handler: async (response) => {
      document.getElementById('razorpay-loading')?.remove();
      const result = await api.verifyPayment(
        {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature
        },
        userData,
        amount
      );
      if (result.success) {
        resetForm()
        

        if (result.trackId) {
          try {
            await api.downloadReceipt(result.trackId);
            // Step 1: Fetch the receipt URL
            const receiptUrl = `${API_URL}/receipts/${result.trackId}`;
            const whatsappPayload = {
              apiKey: process.env.AISENSY_API_KEY,
              campaignName: 'dis_payment_receipts',
              destination: `91${userData.phone}`,
              userName: userData.name,
              templateParams: [
                userData.name,
                amount.toFixed(2),
                'Vikas Tarangini'
              ],
              media: {
                filename: `Donation Receipt - ${result.trackId}`,
                url: "https://whatsapp-media-library.s3.ap-south-1.amazonaws.com/IMAGE/63bc3526bd3ea7717deb92f8/9589286_VASTHRASAMARPANAM.jpg"
              }
            };

            await api.sendWhatsAppReceipt(whatsappPayload);
            toast.success('Receipt sent via WhatsApp!');

          } catch (error) {
            console.error('Error in receipt handling:', error);
            toast.error(`Failed to send receipt: ${error.message}`);
          }
        }
      } else {
        toast.error('Donation Failed')
      }

    },
    modal: {
      ondismiss: () => {
        document.getElementById('razorpay-loading')?.remove();
      }
    }
  };

  return initializeRazorpayPayment(options);
} catch (error) {
  document.getElementById('razorpay-loading')?.remove();
  console.error("Payment failed:", error);
  toast.error("Failed to process donation");
  return false;
}
}
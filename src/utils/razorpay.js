export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = resolve;
    document.body.appendChild(script);
  });
};

export const initializeRazorpayPayment = (options) => {
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay(options);
    rzp.on('payment.success', resolve);
    rzp.on('payment.error', reject);
    rzp.open();
  });
};
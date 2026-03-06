// services/paymentService.js
import axios from 'axios';
import { loadRazorpayScript } from '../utils/razorpayLoader';
import { API_URL, RAZORPAY_KEY_ID } from '../hooks/tools';



export const initiatePayment = async (subscriptionData) => {
  try {
    // Load Razorpay script
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error('Failed to load Razorpay SDK');
    }

    // Get auth token
  


    // 1. Create subscription order in backend
    const orderResponse = await axios.post(
      `${API_URL}/user/subscription`,
      subscriptionData,
      {
        withCredentials:true,
        headers: {
          'Content-Type': 'application/json'
        },
        
      },
      
    );

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message || 'Failed to create subscription');
    }

    const { subscription } = orderResponse.data;

    // 2. Create Razorpay order
    const razorpayResponse = await axios.post(
      `${API_URL}/payments/create-order`,
      {
        amount: subscription.totalamount,
        currency: 'INR',
        receipt: `sub_${subscription._id}`,
        notes: {
          subscriptionId: subscription._id,
          userId: subscription.userid,
          plan: subscription.plan
        }
      },
      {
        withCredentials:true,
        headers: {
          'Content-Type': 'application/json'
        },
        
      },
    );

    if (!razorpayResponse.data.success) {
      throw new Error(razorpayResponse.data.message || 'Failed to create payment order');
    }

    const { order } = razorpayResponse.data;

    console.log(order,'order')

    // 3. Open Razorpay checkout
    const paymentResult = await openRazorpayCheckout({
      key: RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name: 'Laundry Service',
      description: `Subscription: ${subscription.plan}`,
      prefill: {
        name: subscriptionData.userEmail?.split('@')[0] || 'Customer',
        email: subscriptionData.userEmail,
        contact: subscriptionData.userPhone
      },
      notes: order.notes,
      theme: {
        color: '#3B82F6'
      }
    });

    if (paymentResult.error) {
      throw new Error(paymentResult.error.description || 'Payment failed');
    }

    // 4. Verify payment on backend
    const verificationResponse = await axios.post(
      `${API_URL}/payments/verify`,
      {
        razorpay_payment_id: paymentResult.razorpay_payment_id,
        razorpay_order_id: paymentResult.razorpay_order_id,
        razorpay_signature: paymentResult.razorpay_signature,
        subscriptionId: subscription._id
      },
      {
        withCredentials:true,
        headers: {
          'Content-Type': 'application/json'
        },
        
      },
    );

    if (!verificationResponse.data.success) {
      throw new Error(verificationResponse.data.message || 'Payment verification failed');
    }

    return {
      success: true,
      subscription: verificationResponse.data.subscription,
      orderId: paymentResult.razorpay_order_id,
      paymentId: paymentResult.razorpay_payment_id
    };

  } catch (error) {
    console.error('Payment initiation error:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Payment failed'
    };
  }
};

// Helper function to open Razorpay checkout
const openRazorpayCheckout = (options) => {
  return new Promise((resolve) => {
    const razorpayOptions = {
      ...options,
      handler: (response) => {
        resolve(response);
      },
      modal: {
        ondismiss: () => {
          resolve({ error: { description: 'Payment cancelled by user' } });
        }
      }
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
  });
};
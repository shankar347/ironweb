import axios from 'axios';
import { loadRazorpayScript } from '../utils/razorpayLoader';
import { API_URL, RAZORPAY_KEY_ID } from '../hooks/tools';

export const initiateOrderPayment = async (orderPaymentData) => {
  try {
    // Load Razorpay script
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error('Failed to load Razorpay SDK');
    }

    const { 
      orderData, 
      amount, 
      useSubscription, 
      subscriptionId, 
      usedCredits, 
      redeemedItems,
      userEmail,
      userPhone,
      userName
    } = orderPaymentData;

    // 1. Create order in backend first
    const orderResponse = await axios.post(
      `${API_URL}/orders/createorder`,
      orderData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!orderResponse.data.data) {
      throw new Error(orderResponse.data.message || 'Failed to create order');
    }

    const createdOrder = orderResponse.data.data;

    // If amount is 0, just return success (already handled in component)
    if (amount === 0) {
      return {
        success: true,
        order: createdOrder
      };
    }

    // 2. Create Razorpay order
    const razorpayResponse = await axios.post(
      `${API_URL}/payments/create-order`,
      {
        amount: amount,
        currency: 'INR',
        receipt: `ord_${createdOrder._id}`,
        notes: {
          orderId: createdOrder._id,
          userId: createdOrder.userid,
          useSubscription: useSubscription || false,
          subscriptionId: subscriptionId || null,
          usedCredits: usedCredits || 0
        }
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!razorpayResponse.data.success) {
      throw new Error(razorpayResponse.data.message || 'Failed to create payment order');
    }

    const { order } = razorpayResponse.data;

    // 3. Open Razorpay checkout
    const paymentResult = await openRazorpayCheckout({
      key: RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name: 'Laundry Service',
      description: `Order Payment`,
      prefill: {
        name: userName || 'Customer',
        email: userEmail,
        contact: userPhone
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
      `${API_URL}/orders/verify-order-payment`,
      {
        razorpay_payment_id: paymentResult.razorpay_payment_id,
        razorpay_order_id: paymentResult.razorpay_order_id,
        razorpay_signature: paymentResult.razorpay_signature,
        orderId: createdOrder._id,
        useSubscription: useSubscription,
        subscriptionId: subscriptionId,
        usedCredits: usedCredits,
        redeemedItems: redeemedItems
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!verificationResponse.data.success) {
      throw new Error(verificationResponse.data.message || 'Payment verification failed');
    }

    return {
      success: true,
      order: verificationResponse.data.order,
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
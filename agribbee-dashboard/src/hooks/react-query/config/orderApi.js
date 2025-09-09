import MainApi from 'src/api/MainApi';

export const OrderApi = {
  orderRequestApproval: (formData) => {
    return MainApi.post('/api/v1/ecommerce-order-request-approval', formData);
  },

  placeOrder: (formData) => {
    return MainApi.post('/api/v1/customer/order/place', formData);
  },
  orderHistory: (orderType, limit, offset) => {
    return MainApi.get(`/api/v1/customer/order/${orderType}?limit=${limit}&offset=${offset}`);
  },
  orderDetails: (qrCode, order_id, phone, guestId) => {
    if (qrCode) {
      return MainApi.get(`/api/v1/seller-order-requests/${qrCode}`);
    }
    const params = `?order_id=${order_id}`;
    if (order_id) {
      if (phone) {
        return MainApi.get(`/api/v1/customer/order/details?${params}`);
      }
    }
  },
  orderReview: (order_id) => {
    if (order_id) {
      return MainApi.get(`/api/v1/customer/getPendingReviews?order_id=${order_id}`);
    }
  },
  foodLists: (foodId) => {
    return MainApi.post(`/api/v1/customer/food-list?food_id=${foodId}`);
  },
  orderTracking: (order_id, phone, guestId) => {
    const params = `?order_id=${order_id}`;

    if (phone) {
      return MainApi.get(`/api/v1/customer/order/track${params}`);
    }
  },
  CancelOrder: (formData) => {
    return MainApi.post('/api/v1/customer/order/cancel', formData);
  },
  FailedPaymentMethodUpdate: (formData) => {
    return MainApi.post('/api/v1/customer/order/payment-method', formData);
  },
};

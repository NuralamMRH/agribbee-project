import MainApi from 'src/api/MainApi';

let token = undefined;
if (typeof window != 'undefined') {
  token = localStorage.getItem('token');
}
export const OrderRequestApi = {
  orderDetails: (qrCode) => {
    if (qrCode) {
      return MainApi.get(`/api/v1/seller-order-request-details/?qrCode=${qrCode}`);
    }
  },
  placeOrder: (formData) => {
    return MainApi.post('/api/v1/customer/order/place', formData);
  },
  orderHistory: (orderType, limit, offset) => {
    return MainApi.get(`/api/v1/customer/order/${orderType}?limit=${limit}&offset=${offset}`);
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

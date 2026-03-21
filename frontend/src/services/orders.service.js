import api from './api';

class OrdersService {
  async createOrder(orderData) {
    const response = await api.post('cart/orders/', orderData);
    return response.data;
  }

  async getOrders() {
    const response = await api.get('cart/orders/');
    return response.data;
  }

  async getOrderById(id) {
    const response = await api.get(`cart/orders/${id}/`);
    return response.data;
  }

  async updateOrder(id, data) {
    const response = await api.patch(`cart/orders/${id}/`, data);
    return response.data;
  }
}

export default new OrdersService();
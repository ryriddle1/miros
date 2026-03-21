import api from './api';

class OrdersService {
  // Оформление заказа
  async createOrder(orderData) {
    const response = await api.post('orders/', orderData);
    return response.data;
  }

  // Получение списка заказов
  async getOrders() {
    const response = await api.get('orders/');
    return response.data;
  }

  // Получение деталей заказа
  async getOrderById(id) {
    const response = await api.get(`orders/${id}/`);
    return response.data;
  }

  // Изменение заказа (если статус позволяет)
  async updateOrder(id, data) {
    const response = await api.patch(`orders/${id}/`, data);
    return response.data;
  }
}

export default new OrdersService();

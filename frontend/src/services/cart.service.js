import api from './api';

class CartService {
  async getCart() {
    const response = await api.get('cart/');
    return response.data.items || [];
  }

  async addItem(productId, quantity = 1) {
    const response = await api.post('cart/items/', { product_id: productId, quantity });
    return response.data;
  }

  async updateItem(itemId, quantity) {
    const response = await api.put(`cart/items/${itemId}/`, { quantity });
    return response.data;
  }

  async removeItem(itemId) {
    await api.delete(`cart/items/${itemId}/`);
  }

  async clearCart() {
    await api.delete('cart/clear/');
  }
}

export default new CartService();
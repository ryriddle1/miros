import api from './api';

class CartService {
  // Получение корзины
  async getCart() {
    const response = await api.get('cart/');
    return response.data;
  }

  // Добавление товара в корзину
  async addItem(productId, quantity = 1) {
    const response = await api.post('cart/items/', { product_id: productId, quantity });
    return response.data;
  }

  // Изменение количества товара
  async updateItem(itemId, quantity) {
    const response = await api.patch(`cart/items/${itemId}/`, { quantity });
    return response.data;
  }

  // Удаление товара из корзины
  async removeItem(itemId) {
    await api.delete(`cart/items/${itemId}/`);
  }

  // Очистка корзины
  async clearCart() {
    await api.delete('cart/clear/');
  }
}

export default new CartService();

import api from './api';

class ProductsService {
  // Получение списка товаров с фильтрацией
  async getProducts(params = {}) {
    const response = await api.get('products/', { params });
    return response.data;
  }

  // Получение детальной информации о товаре
  async getProductById(id) {
    const response = await api.get(`products/${id}/`);
    return response.data;
  }

  // Получение категорий
  async getCategories() {
    const response = await api.get('categories/');
    return response.data;
  }
}

export default new ProductsService();

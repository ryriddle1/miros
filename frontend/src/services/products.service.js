import api from './api';

class ProductsService {
  async getProducts() {
    const response = await api.get('products/');
    return response.data;
  }

  async getProductById(id) {
    const response = await api.get(`products/${id}/`);
    return response.data;
  }
}

export default new ProductsService();
import api from './api';

class PCBuilderService {
  // Получение списка комплектующих
  async getComponents(type) {
    const params = type ? { type } : {};
    const response = await api.get('builder/components/', { params });
    return response.data;
  }

  // Проверка совместимости
  async checkCompatibility(components) {
    const response = await api.post('builder/check-compatibility/', { components });
    return response.data;
  }

  // Сохранение сборки
  async saveBuild(buildData) {
    const response = await api.post('builder/builds/', buildData);
    return response.data;
  }

  // Получение списка сборок
  async getBuilds() {
    const response = await api.get('builder/builds/');
    return response.data;
  }

  // Получение деталей сборки
  async getBuildById(id) {
    const response = await api.get(`builder/builds/${id}/`);
    return response.data;
  }

  // Добавление сборки в корзину
  async addBuildToCart(id) {
    const response = await api.post(`builder/builds/${id}/add-to-cart/`);
    return response.data;
  }
  
  async deleteBuild(id) {
    const response = await api.delete(`builder/builds/${id}/`);
    return response.data;
  }

  // Получение рекомендаций от нейросети
  async getRecommendations(purpose, budget) {
    const response = await api.post('builder/recommend/', { purpose, budget });
    return response.data;
  }
}

export default new PCBuilderService();

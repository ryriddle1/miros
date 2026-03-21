import api from './api';

class ServiceRequestsService {
  // Создание заявки на ремонт
  async createRequest(requestData) {
    const response = await api.post('service-requests/', requestData);
    return response.data;
  }

  // Получение списка заявок пользователя
  async getRequests() {
    const response = await api.get('service-requests/');
    return response.data;
  }

  // Получение деталей заявки
  async getRequestById(id) {
    const response = await api.get(`service-requests/${id}/`);
    return response.data;
  }

  // Вызов мастера
  async callMaster(data) {
    const response = await api.post('call-master/', data);
    return response.data;
  }

  // Получение вызовов мастера
  async getCalls() {
    const response = await api.get('call-master/');
    return response.data;
  }

  // Получение деталей вызова
  async getCallById(id) {
    const response = await api.get(`call-master/${id}/`);
    return response.data;
  }
}

export default new ServiceRequestsService();

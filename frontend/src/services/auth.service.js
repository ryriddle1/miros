import api from './api';

class AuthService {
  // Регистрация
  async register(userData) {
    const response = await api.post('auth/register/', userData);
    return response.data;
  }

  // Вход
  async login(email, password) {
    const response = await api.post('auth/login/', { email, password });
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  }

  // Выход
  async logout() {
    try {
      await api.post('auth/logout/');
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  // Получение профиля
  async getProfile() {
    const response = await api.get('users/me/');
    return response.data;
  }

  // Обновление профиля
  async updateProfile(userData) {
    const response = await api.patch('users/me/', userData);
    // Обновляем данные пользователя в localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...currentUser, ...response.data }));
    return response.data;
  }
}

export default new AuthService();


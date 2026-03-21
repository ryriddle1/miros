import api from './api';

class AuthService {
  async register(userData) {
    const data = {
            username: userData.email,        // ← добавляем username = email
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      phone_number: userData.phone_number,
      password: userData.password
    };
    const response = await api.post('auth/register/', data);
    return response.data;
  }

  async login(email, password) {
    const response = await api.post('auth/login/', { email, password });
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  }

  async logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  async getProfile() {
    const response = await api.get('auth/me/');
    return response.data;
  }

  async updateProfile(userData) {
    const response = await api.patch('auth/me/', userData);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...currentUser, ...response.data }));
    return response.data;
  }
}

export default new AuthService();
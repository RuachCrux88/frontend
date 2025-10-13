import axios from 'axios';

const API_ROOT = (import.meta?.env?.VITE_API_URL || 'http://localhost:8080').replace(/\/+$/, '');
const BASE_URL = `${API_ROOT}/api/open-ressources`;

export default {
  // GET /api/open-ressources
  getAll() {
    return axios.get(BASE_URL);
  },

  // GET /api/open-ressources/{id}
  getById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  },

  // POST /api/open-ressources
  create(dto) {
    return axios.post(BASE_URL, dto);
  },

  // PUT /api/open-ressources/{id}
  update(id, dto) {
    return axios.put(`${BASE_URL}/${id}`, dto);
  },

  // DELETE /api/open-ressources/{id}
  delete(id) {
    return axios.delete(`${BASE_URL}/${id}`);
  }
};

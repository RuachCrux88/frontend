import axios from 'axios';

const API_ROOT = (import.meta?.env?.VITE_API_URL || 'http://localhost:8080').replace(/\/+$/, '');
const BASE_URL = `${API_ROOT}/api/formats`;

export default {
  // GET /api/formats
  getAll() {
    return axios.get(BASE_URL);
  },

  // GET /api/formats/{id}
  getById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  },

  // POST /api/formats
  create(dto) {
    return axios.post(BASE_URL, dto);
  },

  // PUT /api/formats/{id}
  update(id, dto) {
    return axios.put(`${BASE_URL}/${id}`, dto);
  },

  // DELETE /api/formats/{id}
  delete(id) {
    return axios.delete(`${BASE_URL}/${id}`);
  }
};

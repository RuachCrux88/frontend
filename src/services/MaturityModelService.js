// src/services/MaturityModelService.js
// Service "résilient" pour Formulaires (Maturity Models) + Domains + KDAs
// -> Essaie plusieurs patterns d'URL (compat Spring @RequestMapping usuels)
// -> Utilise VITE_API_URL pour le host

import axios from 'axios'

const API_ROOT = (import.meta?.env?.VITE_API_URL || 'http://localhost:8080').replace(/\/+$/, '')

// ——— Patterns d’API possibles (ordre d’essai) ———
// Form list/detail: GET/POST / PUT / DELETE
const FORM_BASE = '/api/maturity-models';
const DOMAIN_BASE = '/api/domains';
const KDA_BASE = '/api/kdas';

export default {
  /* ===================== FORMULAIRES ===================== */
  list () {
    return axios.get(`${API_ROOT}${FORM_BASE}`);
  },
  getById (id) {
    return axios.get(`${API_ROOT}${FORM_BASE}/${id}`);
  },
  create (payload) {
    return axios.post(`${API_ROOT}${FORM_BASE}`, payload);
  },
  update (id, payload) {
    return axios.put(`${API_ROOT}${FORM_BASE}/${id}`, payload);
  },
  delete (id) {
    return axios.delete(`${API_ROOT}${FORM_BASE}/${id}`);
  },

  /* ===================== DOMAINS ===================== */
  getDomains () {
    return axios.get(`${API_ROOT}${DOMAIN_BASE}`);
  },
  getDomainById (id) {
    return axios.get(`${API_ROOT}${DOMAIN_BASE}/${id}`);
  },
  createDomain (modelId, payload) {
    return axios.post(`${API_ROOT}${DOMAIN_BASE}/${modelId}`, payload);
  },
  updateDomain (id, modelId, payload) {
    return axios.put(`${API_ROOT}${DOMAIN_BASE}/${id}/${modelId}`, payload);
  },
  deleteDomain (id) {
    return axios.delete(`${API_ROOT}${DOMAIN_BASE}/${id}`);
  },

  /* ===================== KDAs ===================== */
  getKdas () {
    return axios.get(`${API_ROOT}${KDA_BASE}`);
  },
  getKdaById (id) {
    return axios.get(`${API_ROOT}${KDA_BASE}/${id}`);
  },
  createKda (domainId, payload) {
    return axios.post(`${API_ROOT}${KDA_BASE}/${domainId}`, payload);
  },
  updateKda (id, domainId, payload) {
    return axios.put(`${API_ROOT}${KDA_BASE}/${id}/${domainId}`, payload);
  },
  deleteKda (id) {
    return axios.delete(`${API_ROOT}${KDA_BASE}/${id}`);
  }
}

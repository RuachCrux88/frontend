// src/services/TaxonomyFormService.js
import axios from 'axios';

// Base URL configurable por variable de entorno (VITE_API_URL)
const API_ROOT = (import.meta?.env?.VITE_API_URL || 'http://localhost:8080').replace(/\/+$/, '');
const BASE_URL = `${API_ROOT}/api/taxonomy-forms`;

// Optionnel : un axios instance si tu veux ajouter des headers (auth, etc.)
// const api = axios.create({ baseURL: BASE_URL });

export default {
  /* ---------------------------------------
   * FORMULAIRES (TaxonomyForm)
   * ------------------------------------- */

  // Liste (pour menu gauche)
  getFormsList() {
    // GET /api/taxonomy-forms/list-forms -> [{ id, title }, ...]
    return axios.get(`${BASE_URL}/list-forms`);
  },

  // Détail d’un formulaire avec ses capas/dimensions/features
  getFormById(id) {
    // GET /api/taxonomy-forms/{id}
    return axios.get(`${BASE_URL}/${id}`);
  },

  // Création d’un formulaire (title, description)
  createForm(payload) {
    // POST /api/taxonomy-forms
    // payload attendu: { title, description }
    return axios.post(`${BASE_URL}`, payload);
  },

  // Renommer / mettre à jour partielle (si tu préfères PATCH)
  renameForm(id, title) {
    // PUT /api/taxonomy-forms/{id}
    // on envoie seulement ce qui change; si ton back exige tout l'objet, passe un payload complet
    return axios.put(`${BASE_URL}/${id}`, { title });
  },

  // Mise à jour complète d’un formulaire (titre, description, etc.)
  updateForm(id, payload) {
    // PUT /api/taxonomy-forms/{id}
    return axios.put(`${BASE_URL}/${id}`, payload);
  },

  // Suppression d’un formulaire
  deleteForm(id) {
    // DELETE /api/taxonomy-forms/{id}
    return axios.delete(`${BASE_URL}/${id}`);
  },

  /* ---------------------------------------
   * CAPAS (Layers)
   * ------------------------------------- */

  // Ajouter une capa à un formulaire
  createLayer(formId, payload) {
    // POST /api/taxonomy-forms/{formId}/layers
    // payload attendu: { name, description }
    return axios.post(`${BASE_URL}/${formId}/layers`, payload);
  },

  // Modifier une capa
  updateLayer(layerId, payload) {
    // PUT /api/taxonomy-forms/layers/{layerId}
    // payload attendu: { name?, description? }
    return axios.put(`${BASE_URL}/layers/${layerId}`, payload);
  },

  // Supprimer une capa
  deleteLayer(layerId) {
    // DELETE /api/taxonomy-forms/layers/{layerId}
    return axios.delete(`${BASE_URL}/layers/${layerId}`);
  },

  /* ---------------------------------------
   * DIMENSIONS
   * ------------------------------------- */

  // Ajouter une dimension à une capa
  createDimension(layerId, payload) {
    // POST /api/taxonomy-forms/layers/{layerId}/dimensions
    // payload attendu: { name, description }
    return axios.post(`${BASE_URL}/layers/${layerId}/dimensions`, payload);
  },

  // Modifier une dimension
  updateDimension(dimensionId, payload) {
    // PUT /api/taxonomy-forms/dimensions/{dimensionId}
    // payload attendu: { name?, description? }
    return axios.put(`${BASE_URL}/dimensions/${dimensionId}`, payload);
  },

  // Supprimer une dimension
  deleteDimension(dimensionId) {
    // DELETE /api/taxonomy-forms/dimensions/{dimensionId}
    return axios.delete(`${BASE_URL}/dimensions/${dimensionId}`);
  },

  /* ---------------------------------------
   * CARACTÉRISTIQUES (Features)
   * ------------------------------------- */

  // Ajouter une caractéristique à une dimension
  createFeature(dimensionId, payload) {
    // POST /api/taxonomy-forms/dimensions/{dimensionId}/features
    // payload attendu: { name } (+ autres champs si besoin)
    return axios.post(`${BASE_URL}/dimensions/${dimensionId}/features`, payload);
  },

  // Modifier une caractéristique
  updateFeature(featureId, payload) {
    // PUT /api/taxonomy-forms/features/{featureId}
    // payload attendu: { name? }
    return axios.put(`${BASE_URL}/features/${featureId}`, payload);
  },

  // Supprimer une caractéristique
  deleteFeature(featureId) {
    // DELETE /api/taxonomy-forms/features/{featureId}
    return axios.delete(`${BASE_URL}/features/${featureId}`);
  },

  /* ---------------------------------------
   * ENREGISTREMENT DE RÉPONSE UTILISATEUR
   * ------------------------------------- */

  addResponseForm(userId, taxonomyFormId, jsonResponse) {
    // POST /api/taxonomy-forms/form-response
    return axios.post(`${BASE_URL}/form-response`, {
      userId,
      taxonomyFormId,
      jsonResponse
    });
  }
};

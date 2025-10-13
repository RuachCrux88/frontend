<template>
  <div class="page-container">
    <div class="card-container">
      <h1 class="title">Modelos de Madurez</h1>

      <div v-if="loading" class="loading">Loading...</div>
      <div v-if="error" class="error">{{ error }}</div>

      <div v-if="!loading && !error" class="forms-list">
        <div
          v-for="form in forms"
          :key="form.id"
          class="form-item"
          @click="goToForm(form.id)"
        >
          <h2>{{ form.title }}</h2>
          <p class="description">{{ form.description || 'Sin descripción' }}</p>
          <p class="target"><strong>Dirigido a:</strong> {{ form.target }}</p>
          <p class="result"><strong>Resultado:</strong> {{ form.result }}</p>

          <!-- Acciones de administrador: botón de reporte -->
          <div v-if="isAdmin" class="admin-actions">
            <button class="btn-admin" @click.stop="goToReport(form.id)">Ver reporte</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import MaturityModelService from '@/services/MaturityModelService'
import { useRouter } from 'vue-router'
import { getUserRole } from '@/services/authService'

const forms = ref([])
const loading = ref(true)
const error = ref(null)
const router = useRouter()
const userRole = ref(null)
const isAdmin = computed(() => (userRole.value || '').includes('ADMIN'))

async function fetchForms() {
  try {
    const response = await MaturityModelService.list()
    forms.value = response.data
  } catch {
    error.value = "No se pudo cargar los modelos de madurez."
  } finally {
    loading.value = false
  }
}

function goToForm(id) {
  // Redirige al primer dominio del formulario
  const form = forms.value.find(f => f.id === id)
  if (form && form.domains && form.domains.length > 0) {
    router.push(`/modelo-de-madurez/forms/${id}/domain/${form.domains[0].id}`)
  }
}

function goToReport(id) {
  router.push(`/modelo-de-madurez/forms/${id}/reporte`)
}

onMounted(() => {
  userRole.value = getUserRole()
  fetchForms()
})
</script>

<style scoped>
.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f7f7fa;
  padding: 20px;
}

.card-container {
  background: #fff;
  padding: 32px 28px;
  border-radius: 18px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.08);
  max-width: 900px;
  width: 100%;
}

.title {
  color: #222;
  text-align: center;
  font-size: 2rem;
  margin-bottom: 24px;
  font-weight: 600;
}

.forms-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-item {
  background: #fafbfc;
  border-radius: 12px;
  padding: 18px 20px;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}

.form-item:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  border-color: #bdbdf7;
}

.form-item h2 {
  font-size: 1.1rem;
  color: #222;
  margin-bottom: 6px;
  font-weight: 500;
}

.form-item p {
  font-size: 0.95rem;
  color: #555;
}

.description {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #444;
}

.loading {
  text-align: center;
  color: #bbb;
  font-size: 1.1rem;
  margin: 30px 0;
}

.error {
  text-align: center;
  color: #d9534f;
  background: #fff0f0;
  border: 1px solid #ffd6d6;
  border-radius: 8px;
  padding: 12px 0;
  margin: 30px 0;
}
.admin-actions {
  margin-top: 10px;
  text-align: right;
}

.btn-admin {
  background: #32621c;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 400;
  transition: all 0.2s ease;
}

.btn-admin:hover {
  background: #2a5318;
  transform: translateY(-2px);
}
</style>

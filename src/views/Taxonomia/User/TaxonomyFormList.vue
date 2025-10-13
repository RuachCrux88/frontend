<template>
  <div class="page-container">
    <div class="card-container">
      <h1 class="title">Taxonomías</h1>

      <div v-if="loading" class="loading">Cargando...</div>
      <div v-if="error" class="error">{{ error }}</div>

      <div v-if="!loading && !error" class="forms-list">
        <div
          v-for="form in forms"
          :key="form.id"
          class="form-item"
          @click="goToForm(form.id)"
        >
          <h2>{{ form.title }}</h2>
          <p class="description">
            {{ form.description || '' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import taxonomyFormService from '@/services/TaxonomyFormService';

export default {
  name: 'FormsList',
  data() {
    return {
      forms: [],
      loading: true,
      error: null
    };
  },
  methods: {
    async fetchForms() {
      try {
        const response = await taxonomyFormService.getFormsList();
        this.forms = response.data;
        console.log('Formularios cargados:', this.forms);
      } catch {
        this.error = "No se pudo cargar los formularios.";
      } finally {
        this.loading = false;
      }
    },
    goToForm(id) {
      this.$router.push(`/herramientas-evaluacion/taxonomy/forms/${id}`);
    }
  },
  mounted() {
    this.fetchForms();
  }
};
</script>

<style scoped>
/* Harmonisation du style avec les autres fichiers */
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
  border: 1px solid #ececf1;
}

.title {
  color: #222;
  text-align: center;
  font-size: 2rem;
  margin-bottom: 24px;
  font-weight: 600;
}

/* Liste verticale */
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
</style>

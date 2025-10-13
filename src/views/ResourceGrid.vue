<template>
  <div class="resource-page">
    <!-- Barre de filtre et recherche -->
    <div class="filter-bar">
      <div class="filter-group">
        <label for="filter-select">🎯 Filtrar :</label>
        <select id="filter-select" v-model="filter">
          <option v-for="option in formatOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>

      <div class="search-group">
        <label for="search">🔍 Buscar :</label>
        <input
          id="search"
          type="text"
          v-model="search"
          placeholder="Título del recurso..."
        />
      </div>
    </div>

    <div v-if="resources.length === 0">
      ⏳ Loading...
    </div>
    <div v-else class="resource-grid">
      <ResourceCard
        v-for="(resource, index) in filteredResources"
        :key="index"
        :resource="resource"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ResourceCard from '../components/ResourceCard.vue'
import OpenRessourceService from '@/services/openRessourceService'
import formatService from '@/services/formatService'

const filter = ref('Todos')
const search = ref('')
const resources = ref([])
const formats = ref([])

const formatOptions = computed(() => {
  return ['Todos', ...formats.value.map(f => f.name)]
})

// Appel API pour récupérer les ressources et formats
const fetchData = async () => {
  try {
    const resResources = await OpenRessourceService.getAll()
    resources.value = resResources.data
    console.log('Ressources chargées:', resources.value)
  } catch (error) {
    console.error('Erreur de chargement des ressources :', error)
  }
  try {
    const resFormats = await formatService.getAll()
    formats.value = resFormats.data
    console.log('Formats chargés:', formats.value)
  } catch (error) {
    console.error('Erreur de chargement des formats :', error)
  }
}

onMounted(fetchData)

const filteredResources = computed(() => {
  return resources.value.filter((resource) => {
    if (!resource || !resource.title) return false

    const matchFormat =
      filter.value === 'Todos' ||
      (resource.formatNames || []).includes(filter.value)

    const matchSearch = resource.title
      .toLowerCase()
      .includes(search.value.toLowerCase())

    return matchFormat && matchSearch
  })
})

</script>

<style scoped>
/* 🔷 Structure principale */
.resource-page {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  gap: 2rem;
  background-color: #ffffff;
}

/* 🟢 Barre filtres + recherche */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1rem 1.5rem;
  background-color: #f3f9f4;
  border: 1px solid #d4e1d5;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  max-width: 100%;
  flex-wrap: wrap;
}

.filter-group,
.search-group {
  display: flex;
  flex-direction: column;
}

.filter-group label,
.search-group label {
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #2e5400;
}

.filter-group select,
.search-group input {
  padding: 0.6rem 1rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #b5d2b9;
  background-color: #fff;
  width: 250px;
  transition: border-color 0.3s;
}

.filter-group select:focus,
.search-group input:focus {
  outline: none;
  border-color: #2e5400;
}

/* 🟦 Grille des cartes */
.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  justify-items: center;
}

/* Responsive */
@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

<template>
  <div class="inicio-container">
    <!-- Colonne gauche : Liste de ressources dynamiques -->
    <div class="left-column">
      <ResourceCard
        v-for="(resource, index) in resources"
        :key="index"
        :resource="resource"
      />
    </div>

    <!-- Colonne droite : Herramientas -->
    <div class="right-column">
      <div class="herramientas-box">
        <h2 class="herramientas-title">Herramientas</h2>
        <div class="tools-grid">
          <div
            class="tool-card"
            v-for="(tool, index) in tools"
            :key="index"
            @click="irAOtraVista(tool.route)"
          >
            <img :src="tool.image" :alt="tool.title" class="tool-img" />
            <p class="tool-title">{{ tool.title }}</p>
          </div>
        </div>
      </div>

      <div class="placeholder-box"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ResourceCard from '@/components/ResourceCard.vue'
import OpenRessourceService from '@/services/openRessourceService'

import herramienta1 from '@/assets/img/herramientasEvaluacion/objetivosBarreras.png'
import herramienta2 from '@/assets/img/herramientasEvaluacion/maturityModel.png'
import herramienta3 from '@/assets/img/herramientasEvaluacion/taxonomy.png'

const resources = ref([])

const fetchResources = async () => {
  try {
    const res = await OpenRessourceService.getAll()
    resources.value = res.data
  } catch (error) {
    console.error('Erreur de chargement des ressources :', error)
  }
}

import { useRouter } from 'vue-router'

const router = useRouter()

function irAOtraVista(ruta) {
  router.push(`/herramientas-evaluacion/${ruta}`)
}

onMounted(fetchResources)

const tools = [
  {
    title: 'Evaluación de taxonomía',
    image: herramienta1,
    route: 'taxonomy'
  },
  {
    title: 'Modelo de madurez',
    image: herramienta3,
    route: 'maturity-model'
  },
  {
    title: 'Objetivos y barreras',
    image: herramienta2,
    route: 'objetivos'
  },
]
</script>

<style scoped>
.inicio-container {
  display: flex;
  gap: 2rem;
  padding: 2rem;
}

.left-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.right-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.herramientas-box {
  background-color: #d9d9d9;
  border-radius: 20px;
  padding: 1.5rem;
  text-align: center;
}

.herramientas-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #561b5c;
  margin-bottom: 1rem;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  justify-items: center;
}

.tool-card {
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
  max-width: 200px;
  text-align: center;
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
}

.tool-img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
}

.tool-title {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
}

.placeholder-box {
  height: 150px;
  background-color: #d9d9d9;
  border-radius: 20px;
}
</style>

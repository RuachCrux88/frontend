<template>
  <!-- Mensaje de éxito después del envío -->
  <div v-if="formSubmitted" class="success-container">
    <div class="success-card">
      <div class="success-icon">✓</div>
      <h1 class="success-title">¡Respuesta enviada!</h1>
      <p class="success-message">Gracias por completar el modelo de madurez . Tus respuestas han sido guardadas correctamente.</p>
      <div class="success-actions">
        <button @click="goToFormsList" class="btn-next">Volver a la lista</button>
        <button v-if="isAdmin" @click="goToReport" class="btn-prev">Ver reporte</button>
      </div>
    </div>
  </div>

  <!-- Formulario -->
  <div v-else-if="domain" class="domain-container">
    <h1 class="domain-title">{{ domain.name }}</h1>
    <div class="kda-question-block">
      <strong>{{ currentKda.name }}</strong>
      <p>{{ currentKda.question }}</p>
    </div>
    <div class="kda-table">
      <table>
        <thead>
          <tr>
            <th class="no-center">Descripción del nivel</th>
            <th>Nivel actual</th>
            <th>Nivel deseado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="level in 5" :key="'level-'+level">
            <td class="desc-cell">
              {{ currentKda['level' + level] }}
            </td>
            <td>
              <input
                type="radio"
                :name="`actual-${currentKda.id}`"
                :value="level"
                v-model="answers[currentKda.id].actual"
              />
            </td>
            <td>
              <input
                type="radio"
                :name="`desired-${currentKda.id}`"
                :value="level"
                v-model="answers[currentKda.id].desired"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div class="kda-description">
        {{ currentKda.description }}
      </div>
    </div>
    <div class="navigation-buttons">
      <button class="btn-prev" v-if="hasPreviousKda" @click="goToPreviousKda">Pregunta anterior</button>
      <button class="btn-next" v-if="hasNextKda && answeredCurrentKda" @click="goToNextKda">Siguiente pregunta</button>
      <button class="btn-next" v-if="!hasNextKda && allKdasAnswered" @click="goToNextDomainOrSubmit">Siguiente dominio / Enviar</button>
    </div>
    <div v-if="submitMsg" class="submit-message">{{ submitMsg }}</div>
  <canvas id="radarChart" width="400" height="400"></canvas>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MaturityModelService from '@/services/MaturityModelService'
import axios from 'axios'
const API_ROOT = (import.meta?.env?.VITE_API_URL || 'http://localhost:8080').replace(/\/+$/, '')
import Chart from 'chart.js/auto'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const route = useRoute()
const router = useRouter()
const formId = Number(route.params.formId)
const domainId = Number(route.params.domainId)

const form = ref(null)
const domain = ref(null)
const answers = ref({})
const submitMsg = ref('')
const formSubmitted = ref(false)

// Verificar si el usuario es admin
const isAdmin = computed(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user.role === 'ADMIN'
})

const currentKdaIndex = ref(0)
const currentKda = computed(() => domain.value?.kdas[currentKdaIndex.value] || {})

onMounted(async () => {
  const res = await MaturityModelService.getById(formId)
  form.value = res.data
  const currentDomain = form.value.domains.find(d => d.id === domainId)
  domain.value = currentDomain
  currentKdaIndex.value = 0
  // Inicializar respuestas
  currentDomain.kdas.forEach(kda => {
    answers.value[kda.id] = { actual: null, desired: null }
  })
})

watch(
  () => route.params.domainId,
  (newDomainId) => {
    const newDomain = form.value.domains.find(d => d.id === Number(newDomainId))
    domain.value = newDomain
    currentKdaIndex.value = 0
    newDomain.kdas.forEach(kda => {
      if (!answers.value[kda.id]) {
        answers.value[kda.id] = { actual: null, desired: null }
      }
    })
  }
)

const hasPreviousKda = computed(() => currentKdaIndex.value > 0)
const hasNextKda = computed(() => domain.value && currentKdaIndex.value < domain.value.kdas.length - 1)
const answeredCurrentKda = computed(() => {
  const ans = answers.value[currentKda.value.id]
  return ans && ans.actual !== null && ans.desired !== null
})
const allKdasAnswered = computed(() =>
  domain.value && domain.value.kdas.every(kda => {
    const ans = answers.value[kda.id]
    return ans && ans.actual !== null && ans.desired !== null
  })
)

function goToPreviousKda() {
  if (hasPreviousKda.value) currentKdaIndex.value--
}
function goToNextKda() {
  if (hasNextKda.value && answeredCurrentKda.value) currentKdaIndex.value++
}
function goToNextDomainOrSubmit() {
  const currentDomainId = Number(route.params.domainId)
  const domainIndex = form.value.domains.findIndex(d => d.id === currentDomainId)
  if (domain.value && allKdasAnswered.value) {
    if (domainIndex < form.value.domains.length - 1) {
      const nextDomain = form.value.domains[domainIndex + 1]
      currentKdaIndex.value = 0
      router.push(`/modelo-de-madurez/forms/${formId}/domain/${nextDomain.id}`)
    } else {
      submitForm()
    }
  }
}

async function submitForm() {
  const jsonResponse = {
    formTitle: form.value.title,
    domains: form.value.domains.map(domain => ({
      domainId: domain.id,
      domainName: domain.name,
      kdas: domain.kdas.map(kda => ({
        kdaId: kda.id,
        kdaName: kda.name,
        actual: answers.value[kda.id].actual,
        desired: answers.value[kda.id].desired
      }))
    }))
  }

  const dto = {
    maturityModelFormId: formId,
    jsonResponse
  }

  try {
    await axios.post(`${API_ROOT}/api/maturity-models/form-response`, dto)
    formSubmitted.value = true
  } catch (e) {
    submitMsg.value = 'Error al enviar el formulario.'
  }
}

function goToFormsList() {
  router.push('/modelo-de-madurez/forms')
}

function goToReport() {
  router.push(`/modelo-de-madurez/forms/${formId}/reporte`)
}
</script>

<style scoped>
.domain-container {
  max-width: 900px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  padding: 2rem 2.5rem;
}

.domain-title {
  color: #32621c;
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.kda-table {
  margin: 2rem 0 1.5rem 0;
}

table {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  border-collapse: collapse;
  background: #eee;
}

th, td {
  padding: 1rem;
  font-size: 1rem;
  text-align: center;
  vertical-align: middle;
}

th {
  background: #ddd;
  font-weight: 600;
  border-bottom: 2px solid #aaa;
}

.no-center {
  text-align: left;
}

.desc-cell {
  text-align: left;
  font-size: 1rem;
  color: #333;
  width: 70%;
  white-space: normal;
  word-wrap: break-word;
}

input[type="radio"] {
  accent-color: #32621c;
  width: 22px;
  height: 22px;
}

.kda-question-block {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.kda-question-block strong {
  font-size: 1.1rem;
  color: #32621c;
}

.kda-description {
  margin-top: 1.2rem;
  font-size: 1rem;
  color: #666;
  text-align: left;
}

.navigation-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;
}

.submit-message {
  margin-top: 1.5rem;
  color: #218838;
  font-weight: 500;
  text-align: center;
}

canvas#radarChart {
  position: absolute;
  left: -9999px;
  top: -9999px;
}

/* Estilos para la pantalla de éxito */
.success-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 2rem;
}

.success-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  padding: 3rem 2rem;
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: #32621c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 3rem;
  color: #fff;
  font-weight: bold;
}

.success-title {
  color: #32621c;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.success-message {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.success-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-prev {
  background: #ccc;
  color: #000000;
  border: none;
  padding: 0.7rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 400;
  transition: all 0.2s ease;
}

.btn-prev:hover {
  background: #ddd;
  transform: translateY(-2px);
}

.btn-next {
  background: #32621c;
  color: #fff;
  border: none;
  padding: 0.7rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 400;
  transition: all 0.2s ease;
}

.btn-next:hover {
  background: #2a5318;
  transform: translateY(-2px);
}
</style>

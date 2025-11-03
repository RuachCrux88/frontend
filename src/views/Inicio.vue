<template>
  <div class="inicio-container">
    <!-- Columna izquierda: recursos dinámicos -->
    <div class="left-column">
      <template v-if="resources && resources.length">
        <ResourceCard
          v-for="(resource, index) in resources"
          :key="index"
          :resource="resource"
        />
      </template>
      <div v-else class="empty-state">
        <h3>Aún no hay recursos</h3>
        <p>Cuando se publiquen documentos o videos, aparecerán aquí.</p>
      </div>
    </div>

    <!-- Columna derecha: contenido Akadata -->
    <div class="right-column">
      <section class="hero">
        <h1>Transformando la Gobernanza de Datos en la Educación Superior</h1>
        <p class="subtitle">
          Una plataforma integral para el diagnóstico, diseño y seguimiento de programas
          institucionales de gobernanza de datos.
        </p>
      </section>

      <section class="akadata-card">
        <p>
          <strong>Akadata</strong> es una plataforma diseñada para apoyar a
          Instituciones de Educación Superior en la implementación de estrategias de
          gobernanza de datos. Con un enfoque flexible, Akadata impulsa la
          <em>madurez digital institucional</em> orientada por datos.
        </p>
      </section>

      <section class="features">
        <div class="feature">
          <h3>Acceso Abierto</h3>
          <p>
            Portal informativo con acceso libre a documentos, videos y herramientas
            para la alfabetización digital institucional.
          </p>
        </div>
        <div class="feature">
          <h3>Herramientas de Evaluación</h3>
          <p>
            Diagnóstico escalable que incluye encuesta de barreras y oportunidades, modelo
            de madurez y taxonomía, adaptable a las necesidades de cada institución.
          </p>
        </div>
      </section>

      <section class="cta">
        <button class="cta-btn" @click="goTo('/herramientas-evaluacion')">
          ¿Listos para transformar la gobernanza de datos en tu institución?
          <span class="arrow" aria-hidden="true">→</span>
        </button>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ResourceCard from '@/components/ResourceCard.vue'
import OpenRessourceService from '@/services/openRessourceService'

// Estado
const resources = ref([])

// Cargar recursos
const fetchResources = async () => {
  try {
    const res = await OpenRessourceService.getAll()
    resources.value = res.data
  } catch (error) {
    console.error('Error al cargar recursos:', error)
  }
}

onMounted(fetchResources)

// Navegación
const router = useRouter()
function goTo(path) {
  router.push(path)
}
</script>

<style scoped>
/* Layout */
.inicio-container {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  padding: 16px;
}

.left-column {
  flex: 1;
  min-width: 300px;
  display: grid;
  gap: 16px;
}

.right-column {
  flex: 1.1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 16px;
}

/* Hero */
.hero {
  background: radial-gradient(120% 120% at 0% 0%, rgba(79, 70, 229, 0.12), transparent 60%),
  linear-gradient(180deg, #ffffff, #f8fafc);
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 6px 20px rgba(2, 6, 23, 0.06);
}

.hero h1 {
  margin: 0 0 8px;
  font-size: 1.6rem;
  line-height: 1.25;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #0f172a;
}

.subtitle {
  margin: 0;
  color: #334155;
  font-size: 1rem;
}

/* Tarjeta Akadata */
.akadata-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 3px 14px rgba(15, 23, 42, 0.05);
  color: #0f172a;
}

.akadata-card p {
  margin: 0;
  line-height: 1.6;
}

/* Features */
.features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.feature {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(2, 6, 23, 0.04);
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.feature:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(2, 6, 23, 0.08);
}

.feature h3 {
  margin: 0 0 6px;
  font-size: 1.05rem;
  font-weight: 700;
  color: #111827;
}

.feature p {
  margin: 0;
  color: #475569;
  font-size: 0.98rem;
  line-height: 1.55;
}

/* CTA */
.cta {
  display: flex;
  justify-content: center;
  margin-top: 4px;
}

.cta-btn {
  appearance: none;
  border: 0;
  border-radius: 999px;
  padding: 12px 18px;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  color: #ffffff;
  font-weight: 700;
  letter-spacing: 0.01em;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(124, 58, 237, 0.25);
  transition: transform 140ms ease, box-shadow 140ms ease, filter 140ms ease;
}

.cta-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 30px rgba(124, 58, 237, 0.32);
  filter: brightness(1.02);
}

.cta-btn:active {
  transform: translateY(0);
}

.arrow {
  padding-left: 8px;
}

/* Estado vacío */
.empty-state {
  border: 1px dashed #cbd5e1;
  background: #f8fafc;
  color: #475569;
  border-radius: 12px;
  padding: 18px;
  text-align: center;
}

.empty-state h3 {
  margin: 0 0 4px;
  font-size: 1.05rem;
  color: #0f172a;
}

/* Responsive */
@media (max-width: 1024px) {
  .inicio-container {
    flex-direction: column;
  }
  .right-column {
    position: static;
  }
  .features {
    grid-template-columns: 1fr;
  }
}
</style>

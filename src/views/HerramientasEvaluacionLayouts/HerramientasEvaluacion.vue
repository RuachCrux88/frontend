<template>
  <section class="evaluacion">
    <h2 class="titulo">Herramientas de evaluación</h2>
    <div class="contenedor-tarjetas">
      <div
        class="tarjeta"
        @click="irAOtraVista('objetivos')"
      >
        <img
          src="@/assets/img/herramientasEvaluacion/objetivosBarreras.png"
          alt="Objetivos y barreras"
        />
        <h3>Objetivos y barreras</h3>
        <p>
          Este formulario es ideal para clasificar y analizar sistemáticamente universidades u organizaciones. Permite una evaluación detallada de sus capacidades y características clave, estandarizando la recolección de información para comparaciones y la toma de decisiones estratégicas.
        </p>
      </div>

      <div
        class="tarjeta"
        @click="irAOtraVista('maturity-model')"
      >
        <img
          src="@/assets/img/herramientasEvaluacion/maturityModel.png"
          alt="Modelo de madurez"
        />
        <h3>Modelo de madurez</h3>
        <p>
          Este modelo es ideal para evaluar el nivel de madurez digital de universidades u organizaciones. Proporciona un marco para comprender su progreso en la transformación digital, identificando las etapas actuales y las acciones necesarias para avanzar hacia un mayor desarrollo y optimización.
        </p>
      </div>

      <div
        class="tarjeta"
        @click="irAOtraVista('taxonomy')"
      >
        <img
          src="@/assets/img/herramientasEvaluacion/taxonomy.png"
          alt="Evaluación taxonomía"
        />
        <h3>Evaluación taxonomía</h3>
        <p>
          Este análisis es ideal para identificar y comprender los factores externos e internos que influyen en el éxito de universidades u organizaciones. Permite reconocer las oportunidades a aprovechar para el crecimiento y la innovación, así como las barreras a superar para mitigar riesgos y alcanzar objetivos estratégicos.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function irAOtraVista(ruta) {
  router.push(`/herramientas-evaluacion/${ruta}`)
}
</script>

<style scoped>
.evaluacion {
  padding: 3rem 2rem;
  text-align: center;
}

.titulo {
  font-size: 2rem;
  font-weight: 700;
  color: #4b0a38;
  margin-bottom: 2rem;
}

.contenedor-tarjetas {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}

.tarjeta {
  width: 300px;
  background-color: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  text-align: left;
}

.tarjeta:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.tarjeta img {
  width: 100%;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
}

.tarjeta h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #4b0a38;
}

.tarjeta p {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #333;
}
</style>

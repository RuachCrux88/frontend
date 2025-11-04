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
        <h3>Oportiunidades y barreras</h3>
        <p>
          Encuesta para identificar los desafíos y factores habilitadores en la implementación de
          gobernanza de datos en Instituciones de Educación Superior.
          <b>
          ¿Quieres participar?
          </b>
          Identifica los factores clave que afectan la gobernanza de datos en tu institución.
        </p>
      </div> <!--op y barreras--------------------------------------------------->
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
          Estructura conceptual jerárquica de dominios, dimensiones y características clave de la
          gobernanza de datos en universidades.
          <b>
            ¿Por dónde empezar?
          </b>
          Explora la taxonomía para identificar los elementos críticos de un sistema de gobernanza
          de datos. Personaliza tu ruta según las necesidades y capacidades institucionales.
        </p>
      </div> <!--Tax------------------------------------------------------------->
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
          Un marco estructurado para medir el grado de avance institucional en gobernanza de
          datos y transformación digital, con métricas por dominios estratégicos.
          <b>
            ¿En qué etapa estás?
          </b>
          Evalúa tu grado de avance institucional en gobernanza de datos y con métricas por
          dominios estratégicos.
        </p>
      </div> <!--MModel---------------------------------------------------------->
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

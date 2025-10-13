<script setup>
import { RouterView } from 'vue-router'
import HeaderLogOut from './components/Headers/HeaderLogOut.vue'
import HeaderLogIn from './components/Headers/HeaderLogIn.vue'
import Footer from './components/Footer.vue'
import { getToken } from '@/services/authService.js'
import { computed } from 'vue'

const isAuthenticated = computed(() => !!getToken())
</script>

<template>
  <div class="layout">
    <HeaderLogIn v-if="isAuthenticated" />
    <HeaderLogOut v-else />

    <main class="content">
      <RouterView />
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Le contenu prend toute la hauteur disponible entre header et footer */
.content {
  flex: 1;
  padding: 1rem;
}

</style>

<template>
  <header class="header">
    <div class="left-section">
      <a href="#" class="logo-link" @click.prevent="onOpenInicio">
        <img
          class="logo"
          :src="logoUdeA"
          alt="Logo Universidad de Antioquia"
        />
        <h1 class="site-title">AKADATA</h1>
      </a>
    </div>

    <nav class="nav">
      <ul class="nav-list">
        <li><a href="#" @click.prevent="onOpenInicio">Inicio</a></li>
        <li><a href="#" @click.prevent="onOpenRessources">Recursos abiertos</a></li>
        <li><a href="#" @click.prevent="onHerramientasEvaluacion">Herramientas</a></li>
        <li><a href="#" @click.prevent="onOpenConocenos">Conócenos</a></li>
        <li><a @click.prevent="onOpenProfile" href="#">Mi perfil</a></li>
      </ul>
    </nav>

    <div class="right-section">
      <span class="user-button">{{ userName }}</span>
      <a href="#" class="logout-button" @click.prevent="onLogout">Cerrar sesión</a>
      <button class="menu-toggle" aria-label="Abrir menú">
        <img :src="menuIcon" alt="Icono menú" class="menu-icon" />
      </button>
    </div>
  </header>
</template>

<script setup>
import logoUdeA from '@/assets/img/logosimbolo-horizontal-png.png'
import menuIcon from '@/assets/img/menu.png'
import { useRouter } from 'vue-router'
import { logout, getUserName } from '@/services/authService.js'
import { ref, onMounted } from 'vue'

const router = useRouter()
const userName = ref('')

onMounted(() => {
  userName.value = getUserName() || 'Utilisateur'
})

function onLogout() {
  logout()
  router.push('/').then(() => window.location.reload())
}

function onOpenInicio() {
  router.push({name: 'Inicio'})
}

function onOpenRessources() {
  router.push({ name: 'OpenRessources' })
}

function onOpenConocenos() {
  router.push({ name: 'Conocenos'})
}

function onHerramientasEvaluacion() {
  router.push({ name: 'HerramientasEvaluacion' })
}

function onOpenProfile() {
  router.push({ name: 'UserProfile' })
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #32621c; /* Vert UdeA */
  padding: 0.75rem 2rem;
  color: white;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo {
  height: 45px;
  margin-right: 0.75rem;
}

.site-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin: 0;
}

.nav {
  flex: 1;
  margin-left: 2rem;
}

.nav-list {
  display: flex;
  gap: 2rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
}

.nav-list a:hover {
  text-decoration: underline;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-button {
  background-color: #f9b115; /* Jaune bouton */
  color: black;
  padding: 0.5rem 1.2rem;
  border-radius: 999px;
  font-weight: 600;
}

.logout-button {
  background-color: #4b0a38; /* Violet sombre */
  color: white;
  padding: 0.5rem 1.2rem;
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.logout-button:hover {
  background-color: #38082a;
}

.menu-toggle {
  background: none;
  border: none;
  cursor: pointer;
}

.menu-icon {
  width: 24px;
  height: 24px;
  filter: brightness(100);
}
</style>

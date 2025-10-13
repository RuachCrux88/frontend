<template>
  <div class="home-container">
    <section class="login-section">
      <h2>Iniciar sesión</h2>
      <form @submit.prevent="onSubmit">
        <label for="email">Correo electrónico</label>
        <input
          id="email"
          type="email"
          placeholder=""
          v-model="email"
          required
        />

        <label for="password">Contraseña</label>
        <input
          id="password"
          type="password"
          placeholder=""
          v-model="password"
          required
        />

        <div class="verification">
          <input
            id="verification"
            type="checkbox"
            v-model="verification"
          />
          <label for="verification">Verificación</label>
        </div>

        <div v-if="errorMsg" class="error-message">{{ errorMsg }}</div>

        <div class="buttons">
          <button type="button" class="register-btn" @click="onRegister">
            Regístrate
          </button>
          <button type="submit" class="continue-btn">
            Continuar
          </button>
        </div>

        <a href="#" class="forgot-password" @click.prevent="showReset = !showReset">
          ¿Olvidaste tu contraseña?
        </a>
      </form>

      <div v-if="showReset" class="reset-box">
        <label for="reset-email">Correo electrónico</label>
        <input
          id="reset-email"
          type="email"
          v-model="resetEmail"
          placeholder="Introduce tu correo"
          required
        />
        <button class="reset-btn" @click="onResetPassword">Enviar</button>
        <div v-if="resetMsg" class="reset-message">{{ resetMsg }}</div>
      </div>
    </section>

    <section class="image-section">
      <img :src="image1" alt="Ilustración de trabajo en equipo" />
    </section>
  </div>
</template>

<script setup>
import image1 from '@/assets/img/login.png'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, register, resetPassword } from '@/services/authService.js'

const router = useRouter()

const email = ref('')
const password = ref('')
const verification = ref(false)
const loading = ref(false)
const errorMsg = ref('')

const showReset = ref(false)
const resetEmail = ref('')
const resetMsg = ref('')

async function onSubmit() {
  loading.value = true
  errorMsg.value = ''
  try {
    await login(email.value, password.value)
    // Si login ok, redirige vers la page d'accueil ou dashboard
    router.push({ name: 'Inicio' }).then(() => window.location.reload())

  } catch (error) {
    errorMsg.value = error.response?.data || 'Erreur de connexion'
  } finally {
    loading.value = false
  }
}

function onRegister() {
  router.push({ name: 'UserRegister' })
}

async function onResetPassword() {
  resetMsg.value = ''
  try {
    await resetPassword(resetEmail.value)
    resetMsg.value = 'Si el correo existe, se ha enviado una nueva contraseña.'
  } catch (error) {
    resetMsg.value = error.response?.data || 'No se pudo enviar el correo.'
  }
}
</script>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 5rem;
  gap: 4rem;
  min-height: 80vh;
}

.login-section {
  flex: 1;
  max-width: 350px;
}

h2 {
  font-weight: 600;
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 0.6rem 1rem;
  margin-bottom: 1.2rem;
  border-radius: 20px;
  border: none;
  background-color: #d7d7d7;
  font-size: 0.9rem;
  color: #555;
  outline: none;
}

.verification {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.2rem;
  font-weight: 500;
  font-size: 0.9rem;
}

.buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.register-btn {
  background-color: #470047; /* violet */
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 2px 2px 5px rgba(71, 0, 71, 0.4);
  transition: background-color 0.3s ease;
}

.register-btn:hover {
  background-color: #370037;
}

.continue-btn {
  background-color: #f9b115; /* jaune */
  color: black;
  padding: 0.5rem 1.5rem;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 2px 2px 5px rgba(249, 177, 21, 0.4);
  transition: background-color 0.3s ease;
}

.continue-btn:hover {
  background-color: #e2a100;
}

.forgot-password {
  display: inline-block;
  font-size: 0.85rem;
  color: #470047;
  text-decoration: none;
  cursor: pointer;
}

.forgot-password:hover {
  text-decoration: underline;
}

.image-section {
  flex: 1;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-section img {
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

.error-message {
  color: #c82333;
  background: #ffeaea;
  border: 1px solid #c82333;
  border-radius: 8px;
  padding: 0.7rem 1rem;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 500;
}

.reset-box {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(71,0,71,0.07);
}

.reset-box label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.reset-box input {
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid #ccc;
  margin-bottom: 0.7rem;
  font-size: 0.95rem;
}

.reset-btn {
  background-color: #470047;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 2px 2px 5px rgba(71, 0, 71, 0.2);
  transition: background-color 0.3s ease;
}

.reset-btn:hover {
  background-color: #370037;
}

.reset-message {
  margin-top: 0.7rem;
  color: #32621c;
  text-align: center;
  font-weight: 500;
}
</style>

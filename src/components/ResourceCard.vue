<template>
  <div
    class="resource-card"
    @click="openInNewTab"
  >
    <img :src="imageSrc" :alt="resource.title" class="resource-img" />

    <h3 class="resource-title">{{ resource.title }}</h3>

    <p class="resource-formats" v-if="resource.formatNames?.length">
      {{ resource.formatNames.join(' | ') }}
    </p>

    <p class="resource-description">
      {{ resource.description }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  resource: {
    type: Object,
    required: true
  }
})

// 🖼️ Si l'image est en base64, on la préfixe
const imageSrc = computed(() =>
  props.resource.image?.startsWith('data:image')
    ? props.resource.image
    : `data:image/png;base64,${props.resource.image}`
)

// 🔗 Ouvre le lien dans un nouvel onglet
const openInNewTab = () => {
  console.log(props.resource)
  if (props.resource.link) {
    window.open(props.resource.link, '_blank', 'noopener,noreferrer')
  }
}
</script>

<style scoped>
.resource-card {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s;
  max-width: 320px;
  margin: 0 auto;
  padding: 1rem;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  background-color: #fff;
}

.resource-card:hover {
  transform: translateY(-4px);
}

.resource-img {
  width: 100%;
  border-radius: 16px;
  object-fit: cover;
  aspect-ratio: 16 / 9;
  background-color: #f0f0f0;
}

.resource-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 0.8rem;
  color: #2e5400;
}

.resource-formats {
  font-size: 0.85rem;
  color: #46823b;
  margin-top: 0.3rem;
}

.resource-description {
  font-size: 0.85rem;
  color: #444;
  margin-top: 0.5rem;
}
</style>

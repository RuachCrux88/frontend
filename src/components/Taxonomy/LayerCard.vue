<template>
  <div class="layer-card">
    <!-- Titre -->
    <div class="layer-title">{{ layer.name }}</div>

    <!-- Description -->
    <p class="layer-description">{{ layer.description }}</p>

    <!-- Dimensions -->
    <div class="layer-title">DIMENSIONS</div>

    <div class="dimensions">
      <DimensionCard
        v-for="(dim, index) in layer.dimensions"
        :key="index"
        :dimension="dim"
        :user-dimension-state="userLayerState ? userLayerState[dim.id] : null"
        @choice-selected="onChoiceSelected"
      />
    </div>
  </div>
</template>

<script>
import DimensionCard from "./DimensionCard.vue";

export default {
  props: { layer: Object, userLayerState: Object },
  components: { DimensionCard },
  data() {
    return {
      // État local : chaque dimension a un tableau de features avec selected = 0 par défaut
      dimensionsState: {}
    };
  },
  mounted() {
    // Si userLayerState existe, on l'utilise pour initialiser dimensionsState
    if (this.userLayerState) {
      // Deep clone pour éviter les effets de bord
      this.dimensionsState = JSON.parse(JSON.stringify(this.userLayerState));
    } else {
      this.layer.dimensions.forEach(dim => {
        this.dimensionsState[dim.id] = {
          dimensionId: dim.id,
          dimensionName: dim.name,
          isSelected: 1,
          features: dim.features.map(f => ({
            id: f.id,
            name: f.name,
            selected: f.selected !== undefined ? f.selected : 0
          }))
        };
      });
    }
    this.emitFullState();
  },
  watch: {
    layer: {
      immediate: false,
      handler(newLayer) {
        // Si userLayerState existe, on l'utilise pour initialiser dimensionsState
        if (this.userLayerState) {
          this.dimensionsState = JSON.parse(JSON.stringify(this.userLayerState));
        } else {
          const newState = {};
          newLayer.dimensions.forEach(dim => {
            newState[dim.id] = {
              dimensionId: dim.id,
              dimensionName: dim.name,
              isSelected: 1,
              features: dim.features.map(f => ({
                id: f.id,
                name: f.name,
                selected: f.selected !== undefined ? f.selected : 0
              }))
            };
          });
          this.dimensionsState = newState;
        }
        this.emitFullState();
      }
    }
  },
  methods: {
    onChoiceSelected(dimensionId, payload) {
      // Si l'enfant envoie un objet { dimensionId, dimensionName, isSelected, features }
      if (payload && typeof payload === 'object' && 'features' in payload && 'isSelected' in payload) {
        this.dimensionsState[dimensionId] = {
          dimensionId,
          dimensionName: payload.dimensionName,
          ...payload
        };
      } else if (Array.isArray(payload)) {
        // Si l'enfant envoie juste un tableau de features
        if (this.dimensionsState[dimensionId]) {
          this.dimensionsState[dimensionId].features = payload;
        }
      }
      // Émettre tout le layer au parent
      this.emitFullState();
    },
    emitFullState() {
      console.log("État complet du layer", this.layer.id, this.dimensionsState);
      this.$emit("choice-selected", this.layer.id, {
        layerId: this.layer.id,
        layerName: this.layer.name,
        ...this.dimensionsState
      });
    }
  }
};
</script>

<style scoped>
.layer-card {
  width: 100%;
  max-width: 1200px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
}

/* Bande violette pour le titre */
.layer-title {
  width: 100%;
  background-color: #8e5a9f;
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  padding: 10px;
  opacity: 0.85;
  border-radius: 10px;
}

/* Description */
.layer-description {
  max-width: 900px;
  text-align: center;
  font-size: 1rem;
  color: #333;
  margin: 15px 0 30px 0;
}

/* Conteneur des dimensions */
.dimensions {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 20px;
}
</style>

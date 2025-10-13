<template>
  <div
    class="dimension-card"
    :class="{ deselected: !isSelected }"
  >
    <!-- Titre cliquable -->
    <div
      class="dimension-title"
      @click="toggleCardSelection"
    >
      <span>{{ dimension.name }}</span>
      <span class="checkmark" v-if="isSelected">✔</span>
      <span class="cross" v-else>✖</span>
    </div>

    <!-- Description -->
    <p class="dimension-description">{{ dimension.description }}</p>

    <!-- Grille des features -->
    <div class="features">
      <div
        v-for="(feat, index) in paddedFeatures"
        :key="index"
        class="feature"
        :class="{ selected: selectedFeatures.includes(feat) }"
        @click="feat && toggleFeature(feat)"
      >
        {{ feat ? feat.name : '' }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { dimension: Object, userDimensionState: Object },
  data() {
    return {
      selectedFeatures: [],
      isSelected: true // Par défaut sélectionnée
    };
  },
  watch: {
    userDimensionState: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.isSelected = newVal.isSelected === 1;
          this.selectedFeatures = this.dimension.features.filter(f =>
            newVal.features && newVal.features.some(sf => sf.id === f.id && sf.selected === 1)
          );
        } else {
          this.isSelected = true;
          this.selectedFeatures = [];
        }
      }
    }
  },
  computed: {
    paddedFeatures() {
      const features = [...this.dimension.features];
      while (features.length < 4) {
        features.push(null);
      }
      return features;
    }
  },
  methods: {
    emitSelection() {
      // Ne pas modifier directement le prop dimension
      const isSelectedValue = this.isSelected ? 1 : 0;

      // Toujours lister tous les features avec selected = 1 ou 0 et leur nom
      const featuresStatus = this.dimension.features.map(feat => ({
        id: feat.id,
        name: feat.name,
        selected: this.selectedFeatures.some(f => f.id === feat.id) ? 1 : 0
      }));

      console.log(
        "État de la dimension",
        this.dimension.id,
        "isSelected:",
        isSelectedValue,
        "features:",
        featuresStatus
      );

      // Émettre au parent
      this.$emit("choice-selected", this.dimension.id, {
        dimensionId: this.dimension.id,
        dimensionName: this.dimension.name,
        isSelected: isSelectedValue,
        features: featuresStatus
      });
    },

    toggleFeature(feat) {
      if (!this.isSelected || !feat) return;

      if (this.selectedFeatures.some(f => f.id === feat.id)) {
        this.selectedFeatures = this.selectedFeatures.filter(f => f.id !== feat.id);
      } else {
        this.selectedFeatures.push(feat);
      }

      this.emitSelection();
    },

    toggleCardSelection() {
      this.isSelected = !this.isSelected;

      if (!this.isSelected) {
        this.selectedFeatures = []; // tout repasse à 0
      }

      this.emitSelection();
    }
  }
};
</script>



<style scoped>
.dimension-card {
  background-color: rgba(109, 142, 90, 0.85); /* vert avec transparence */
  border-radius: 12px;
  padding: 15px;
  width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background-color 0.3s ease;
}

/* Fond rouge si désélectionnée */
.dimension-card.deselected {
  background-color: rgba(182, 59, 59, 0.85); /* rouge avec transparence */
}

/* Bande blanche du titre */
.dimension-title {
  background-color: white;
  border-radius: 20px;
  padding: 6px 15px;
  font-weight: bold;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #000;
  cursor: pointer;
}

.checkmark {
  color: #2e7d32;
}

.cross {
  color: red;
  font-weight: bold;
}

/* Description */
.dimension-description {
  color: #1e3d1c;
  font-size: 0.9rem;
  text-align: center;
  margin: 10px 0 15px 0;
}

/* Features (toujours 2x2) */
.features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  width: 100%;
}

.feature {
  background-color: white;
  text-align: center;
  padding: 15px 5px;
  font-size: 0.85rem;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* Coins arrondis pour chaque case */
.feature:nth-child(1) {
  border-top-left-radius: 12px;
}
.feature:nth-child(2) {
  border-top-right-radius: 12px;
}
.feature:nth-child(3) {
  border-bottom-left-radius: 12px;
}
.feature:nth-child(4) {
  border-bottom-right-radius: 12px;
}

.feature:hover {
  background-color: #f0f0f0;
}

.feature.selected {
  background-color: #d1e7d1;
  border-color: #4caf50;
}
</style>

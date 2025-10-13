<template>
  <div class="taxonomy-form">
    <h1 class="form-title">{{ form.title }}</h1>

    <div class="layer-navigation">
      <button
        class="nav-btn"
        @click="prevLayer"
        :disabled="currentLayerIndex === 0"
      >
        <span class="arrow">&#8592;</span>
        <span class="nav-text">Atrás</span>
      </button>

      <div class="layer-container" v-if="form.layers.length">
        <LayerCard
          :layer="form.layers[currentLayerIndex]"
          :user-layer-state="userChoices[form.layers[currentLayerIndex].id]"
          @choice-selected="setUserChoice"
        />
      </div>

      <button
        class="nav-btn"
        @click="currentLayerIndex != form.layers.length - 1 ? nextLayer() : showConfirmModal = true"
      >
        <span class="arrow">&#8594;</span>
        <span v-if="currentLayerIndex != form.layers.length - 1" class="nav-text">Siguiente</span>
        <span v-else >Terminar</span>
      </button>
    </div>
    <!-- Popup de confirmation -->
    <div v-if="showConfirmModal" class="modal-overlay">
      <div class="modal-content">
        <h2>TERMINAR EL FORMULARIO</h2>
        <p>Una vez enviado, no podrás modificar los datos.<br>¿Deseas continuar?</p>
        <div class="modal-actions">
          <button class="modal-btn yellow" @click="showConfirmModal = false">Regresar al formulario</button>
          <button class="modal-btn green" @click="submitForm">Enviar formulario</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import taxonomyFormService from '@/services/TaxonomyFormService';
import LayerCard from "@/components/Taxonomy/LayerCard.vue";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.vfs;
export default {
  components: { LayerCard },
  data() {
    return {
      form: { title: "", description: "", layers: [] },
      currentLayerIndex: 0,
      userChoices: {}, // Pour stocker les choix de l'utilisateur
      showConfirmModal: false // Pour afficher la popup de confirmation
    };
  },
  async mounted() {
    this.form = (await taxonomyFormService.getFormById(this.$route.params.id)).data;
    // Initialiser userChoices pour tous les layers et toutes leurs dimensions/features
    this.form.layers.forEach(layer => {
      this.userChoices[layer.id] = {};
      layer.dimensions.forEach(dim => {
        this.userChoices[layer.id][dim.id] = {
          dimensionId: dim.id,
          isSelected: 1,
          features: dim.features.map(f => ({
            id: f.id,
            selected: 0
          }))
        };
      });
    });
    console.log('Formulaire chargé:', this.form);
  },
  methods: {
    // Récupère le choix envoyé par LayerCard
    setUserChoice(layerId, choice) {
      // On ne garde que les dimensions (on enlève layerId et layerName)
      const dimensionsOnly = {};
      Object.keys(choice).forEach(key => {
        if (!['layerId', 'layerName'].includes(key)) {
          dimensionsOnly[key] = choice[key];
        }
      });
      this.userChoices[layerId] = dimensionsOnly;
      // Construction de l'objet complet avec tous les layers
      const fullObj = {
        formId: this.form.id,
        formName: this.form.title,
        layers: this.form.layers.map(layer => ({
          layerId: layer.id,
          layerName: layer.name,
          ...(this.userChoices[layer.id] || {})
        }))
      };
      // Affichage sans Proxy
      console.log('État complet du formulaire:', JSON.parse(JSON.stringify(fullObj)));
    },

    nextLayer() {
      if (this.currentLayerIndex < this.form.layers.length - 1) {
        this.currentLayerIndex++;
      } else if (this.currentLayerIndex === this.form.layers.length - 1) {
        this.showConfirmModal = true;
      }
    },
    prevLayer() {
      if (this.currentLayerIndex > 0) {
        this.currentLayerIndex--;
      }
    },
    submitForm() {
      this.showConfirmModal = false;
      // Construction d'un objet structuré pour l'API avec names completos
      const responseObj = {
        formId: this.form.id,
        formName: this.form.title,
        layers: this.form.layers.map(layer => {
          const userChoicesForLayer = this.userChoices[layer.id] || {};
          
          return {
            layerId: layer.id,
            layerName: layer.name,
            dimensions: layer.dimensions.map(dimension => {
              const userDimensionChoice = userChoicesForLayer[dimension.id] || {};
              
              return {
                dimensionId: dimension.id,
                dimensionName: dimension.name,
                isSelected: userDimensionChoice.isSelected || 0,
                features: dimension.features.map(feature => {
                  const userFeatureChoice = userDimensionChoice.features?.find(f => f.id === feature.id);
                  return {
                    id: feature.id,
                    name: feature.name,
                    selected: userFeatureChoice?.selected || 0
                  };
                })
              };
            })
          };
        })
      };
      
      taxonomyFormService.addResponseForm(
        1, // Remplace par l'id utilisateur réel si besoin
        this.form.id,
        responseObj
      ).then(() => {
        this.$router.push({ name: 'FormsList' });
      }).catch(error => {
        console.error("Erreur lors de l'envoi du formulaire:", error);
        // No redirigir si hay error, permitir generar PDF
      });
      console.log("ENREGISTREMENT DES CHOIX");
      console.log(responseObj); // uniquement les réponses
      
      //Generate PDF
      generatePDF(responseObj);
    },
  },
};


/// REPORT PDF

function generatePDF(jsonData) {
  console.log("Datos para PDF:", JSON.stringify(jsonData, null, 2));
  
  let tableBody = [
    [
      { text: "Layer", style: "tableHeader" },
      { text: "Dimension", style: "tableHeader" },
      { text: "Features", style: "tableHeader", colSpan: 4, alignment: "center" },
      {}, {}, {}
    ]
  ];

  jsonData.layers.forEach(layer => {
    const layerRowSpan = layer.dimensions.length;

    layer.dimensions.forEach((dimension, dimIndex) => {
      const row = [];

      // Layer (toujours blanc)
      if (dimIndex === 0) {
        row.push({
          text: layer.layerName,
          rowSpan: layerRowSpan,
          fillColor: "#ffffff" // toujours blanc
        });
      } else {
        row.push({});
      }

      // Dimension (vert si sélectionnée, rouge sinon)
      row.push({
        text: dimension.dimensionName || `Dimension ${dimension.dimensionId}`,
        fillColor: dimension.isSelected ? "#c8e6c9" : "#ffcdd2"
      });

      // Features (4 colonnes fixes)
      const features = (dimension.features || []);

      for (let i = 0; i < 4; i++) {
        let feature = features[i];
        let cellColor = "#ffffff"; // par défaut blanc

        if (dimension.isSelected === 0) {
          // Dimension NON sélectionnée → tous les features en rouge
          cellColor = "#ffcdd2";
        } else if (dimension.isSelected === 1) {
          // Dimension sélectionnée → vert seulement si feature.selected = 1
          if (feature && feature.selected === 1) {
            cellColor = "#c8e6c9";
          }
        }

        row.push({
          text: feature ? (feature.name || `Feature ${feature.id}`) : "",
          fillColor: cellColor
        });
      }

      tableBody.push(row);
    });
  });

  const docDefinition = {
    content: [
      { text: jsonData.formName, style: "header" },
      {
        table: {
          headerRows: 1,
          widths: ["20%", "20%", "15%", "15%", "15%", "15%"],
          body: tableBody
        }
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: "black",
        fillColor: "#eeeeee"
      }
    }
  };

const titleFile = jsonData.formName
  .toLowerCase()
  .replace(/\s+/g, "_")
  .replace(/[^\w]/g, "");

  pdfMake.createPdf(docDefinition).download(`${titleFile}.pdf`);
}



</script>

<style scoped>
.taxonomy-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f7f5f9;
  padding: 20px;
  min-height: 100vh;
}

.form-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4b2c5e;
  margin-bottom: 20px;
  text-align: center;
}

/* Navigation principale */
.layer-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
}

/* Boutons style carré arrondi */
.nav-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  gap: 5px;
}

.arrow {
  background: #ffcc00;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-text {
  font-size: 0.85rem;
  font-weight: bold;
  color: #333;
}

.nav-btn:disabled .arrow {
  background: #ddd;
  color: #888;
}

.nav-btn:disabled {
  cursor: not-allowed;
}

.nav-btn:hover:not(:disabled) .arrow {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

/* Conteneur du layer */
.layer-container {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0 10px;
}

/* Styles de la popup de confirmation */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #4b0039;
  color: #fff;
  border-radius: 32px 32px 32px 32px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18);
  padding: 40px 32px 32px 32px;
  min-width: 350px;
  max-width: 90vw;
  text-align: center;
  position: relative;
}
.modal-content h2 {
  font-size: 1.5rem;
  margin-bottom: 18px;
  font-weight: bold;
  letter-spacing: 1px;
}
.modal-content p {
  font-size: 1.1rem;
  margin-bottom: 28px;
}
.modal-actions {
  display: flex;
  gap: 24px;
  justify-content: center;
}
.modal-btn {
  border: none;
  border-radius: 24px;
  padding: 12px 28px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.modal-btn.yellow {
  background: #ffcc00;
  color: #4b0039;
}
.modal-btn.green {
  background: #2e6b1a;
  color: #fff;
}
.modal-btn:hover {
  filter: brightness(0.95);
}
</style>


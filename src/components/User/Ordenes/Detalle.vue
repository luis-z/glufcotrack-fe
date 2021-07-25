<template>
  <v-container fluid>
    <v-row class="d-flex justify-center">
      <Loader v-bind:visible="loading" />
      <v-col cols="12">
        <v-card class="mx-auto login-card">
          <v-card-text>
            <v-btn color="primary" @click="goToListar">regresar</v-btn>
            <v-row class="d-flex justify-center">
              <v-col cols="12" md="8" xs="12">
                <Trayecto
                  :destino="ordenData.coordenadas"
                  :posicionActual="currentPosition"
                />
              </v-col>

              <v-col cols="12" md="4" xs="12">
                <v-row class="d-flex justify-center  inner-form">
                  <v-col cols="10" xs="6" style="margin: 0.5rem">
                    <center>
                      <h1 style="font-weight: 300">
                        Orden N# {{ ordenData.id }}
                      </h1>
                    </center>
                  </v-col>
                  <v-col cols="12">
                    <center>
                      <h2><span v-html="notificationMsg"></span></h2>
                      <br />
                      <v-icon large style="margin: 1rem" color="orange">
                        {{ this.icon }}
                      </v-icon>
                    </center>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Loader from "@/components/Loader.vue";
import Trayecto from "@/components/Mapa/Trayecto.vue";

export default {
  name: "ObservarEntrega",
  components: {
    Loader,
    Trayecto
  },
  data() {
    return {
      loading: false,
      recorridos: [],
      coordenadas: [],
      marker: [],
      map: null,
      center: [10.496584, -66.845662],
      currentPosition: [],
      notificationMsg: "",
      icon: "",
      iconColor: "",
      ordenData: {}
    };
  },
  props: {
    // value: Boolean,
    data: Object
  },
  watch: {
    ordenData: function() {
      switch (this.ordenData.estatus) {
        case 1:
          this.notificationMsg =
            "Su orden se encuentra en revisión, en breve sera procesada.";
          this.icon = "mdi-progress-check";
          this.iconColor = "blue";
          break;
        case 2:
          this.notificationMsg =
            "Su orden se encuentra en proceso, en breve saldra hacia su destino.";
          this.icon = "mdi-clock-alert-outline";
          this.iconColor = "#7300f1";
          break;
        case 3:
          this.notificationMsg = "Su orden ha sido cancelada.";
          this.icon = "mdi-cancel";
          this.iconColor = "red";
          break;
        case 4:
          this.notificationMsg = "Su orden va en camino.";
          this.icon = "mdi-bike-fast";
          this.iconColor = "#7300f1";
          break;
        case 5:
          this.notificationMsg = "Su orden ha llegado al destino.";
          this.icon = "mdi-home-map-marker";
          this.iconColor = "#7300f1";
          break;
        case 6:
          this.notificationMsg = "Su orden se ha culminado exitosamente.";
          this.icon = "mdi-checkbox-multiple-marked-circle-outline";
          this.iconColor = "blue";
          break;

        default:
          break;
      }
      this.placeMarker(this.deliveryPosition);
    }
  },
  mounted() {
    this.loadData()
    this.getCurrentPosition();
  },
  methods: {
    async getCurrentPosition() {
      var self = this;
      setInterval(function() {
        self.loadData()
      }, 10000);
    },
    // async getCoordenates() {
    //   try {
    //     this.loading = true;

    //     const coordenates = await this.$axios.post("recorridos/index", {
    //       orden_id: this.ordenData.id
    //     });

    //     console.log(coordenates.data.data);

    //     let coords = coordenates.data.data.split(",");

    //     this.currentPosition = [
    //       coords[0],
    //       coords[1]
    //     ];

    //     this.loading = false;
    //   } catch (error) {
    //     this.loading = false;
    //     if (error.response) {
    //       this.$notify({
    //         title: "Error",
    //         text: error.response.data.data,
    //         type: "error"
    //       });
    //     } else {
    //       this.$notify({
    //         title: "Error",
    //         text: error.message,
    //         type: "error"
    //       });
    //     }
    //   }
    // },
    async onEnter() {
      await this.createUbicacion();
    },
    async loadData() {
      this.loading = true;
      try {

        const orden = await this.$axios.post("ordenes/detalle", {
          orden_id: this.data.id
        });

        this.ordenData = orden.data.data;

        const coordenates = await this.$axios.post("recorridos/index", {
          orden_id: this.ordenData.id
        });

        if (!!coordenates.data.data) {
          let coords = coordenates.data.data.split(",");
  
          this.currentPosition = [
            coords[0],
            coords[1]
          ];
        }


        this.loading = false;
      } catch (error) {
        this.loading = false;
        if (error.response) {
          this.$notify({
            title: "Error",
            text: error.response.data.data,
            type: "error"
          });
        } else {
          this.$notify({
            title: "Error",
            text: error.message,
            type: "error"
          });
        }
      }
    },
    async goToListar() {
      this.$emit("goToListar");
    }
  }
};
</script>
<style scoped>
.login-card {
  margin-top: 2rem;
}

#mapid {
  height: 450px;
}

.inner-form {
  background-color: rgba(211, 220, 236, 0.658);
}
</style>

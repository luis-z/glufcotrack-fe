<template>
  <v-container fluid>
    <v-row class="d-flex justify-center">
      <Loader v-bind:visible="loading" />
      <v-col cols="8">
        <v-card class="mx-auto login-card">
          <v-card-title class="justify-center">Mis Ubicaciones</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="2">
                <v-btn
                  color="primary"
                  @click="gotToCreate"
                >
                  Crear Ubicación
                </v-btn>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-center ma-6">
              <template>
                <v-data-table
                  :headers="headers"
                  :items="ubicaciones"
                  :items-per-page="5"
                  class="elevation-1"
                >
                  <template v-slot:[`item.map`]="{ item }">
                    <center>
                      <v-icon large color="blue" @click="showDetail(item)">
                        mdi-earth-arrow-right
                      </v-icon>
                    </center>
                  </template>
                  <template v-slot:[`item.estatus`]="{ item }">
                    <v-tooltip right color="blue">
                      <template v-slot:activator="{ on, attrs }">
                        <v-chip
                          :color="getColor(item.estatus)"
                          dark
                          outlined
                          @click="changeStatus(item)"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <div v-if="item.estatus">
                            ACTIVA
                          </div>
                          <div v-else>
                            INACTIVA
                          </div>
                        </v-chip>
                      </template>
                      <span>Cambiar Estatus</span>
                    </v-tooltip>
                  </template>
                </v-data-table>
              </template>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <DetalleUbicacion
        :visible="dialog"
        :ubicacionData="ubicacionData"
        @closeDetail="closeDetail"
      />
    </v-row>
  </v-container>
</template>
<script>
import headers from '@/services/auth-header';
import Loader from "@/components/Loader.vue";
import DetalleUbicacion from "@/components/User/Ubicacion/Detalle.vue";

export default {
  name: "ListarUbicaciones",
  components: {
    Loader,
    DetalleUbicacion
  },
  data() {
    return {
      loading: false,
      headers: [
        { text: "ID", value: "id" },
        { text: "Apodo", value: "apodo" },
        { text: "Dirección", value: "direccion" },
        { text: "Estatus", value: "estatus" },
        { text: "Ubicación en el mapa", value: "map" }
      ],
      ubicaciones: [],
      dialog: false,
      ubicacionData: {},
      selected: []
    };
  },
  mounted() {
    this.loadUbicaciones()
  },
  methods: {
    getColor (estatus) {
      switch (estatus) {
        case true:
          return 'blue'
          break;
      
        default:
          return 'red'
          break;
      }
    },
    async changeStatus(item) {
      this.selected = Object.assign({}, item)
      
      this.selected.status = !this.selected.status
      try {
        this.loading = true
        const updated = await this.$axios.post('/ubicaciones/updatestatus', this.selected)

        this.$notify({
          title: "Exito",
            text: create.data.data,
            type: "success",
          });

        await this.loadUbicaciones()
      } catch (error) {
        this.loading = false;
        if (error.response) {
          this.$notify({
            title: "Error",
            text: error.response.data.data,
            type: "error",
          });
        } else {
          this.$notify({
            title: "Error",
            text: error.message,
            type: "error",
          });
        }
      }
    },
    async showDetail (value) {
      this.ubicacionData = Object.assign({}, value)
      this.dialog = true
    },
    async closeDetail () {
      this.dialog = false
    },
    async loadUbicaciones() {
      try {
        headers()
        this.loading = true
        const ubicaciones = await this.$axios.post('/ubicaciones/index', {
          cliente_id: this.$store.state.auth.user.cliente.id
        })
        this.ubicaciones = ubicaciones.data.data
        this.loading = false
      } catch (error) {
        this.loading = false;
        if (error.response) {
          this.$notify({
            title: "Error",
            text: error.response.data.data,
            type: "error",
          });
        } else {
          this.$notify({
            title: "Error",
            text: error.message,
            type: "error",
          });
        }
      }
    },
    async deleteOrden(name) {
      console.log("delete orden", name);
      this.$swal
        .fire({
          title: "Estas seguro que desea eliminar " + name,
          text: "Esta accion es irrevertible.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si, eliminar",
          cancelButtonText: "no"
        })
        .then(result => {
          if (result.isConfirmed) {
            this.$swal.fire(
              "Eliminado!",
              "la orden se a eliminado correctamente",
              "success"
            );
          }
        });
    },
    async editOrden() {
      console.log("edit orden");
    },
    async gotToCreate () {
      this.$emit('goToCreate')
    }
  }
};
</script>
<style scoped>
.login-card {
  margin-top: 2rem;
}
</style>

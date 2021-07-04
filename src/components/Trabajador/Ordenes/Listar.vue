<template>
  <v-row class="d-flex justify-center">
    <Loader v-bind:visible="loading" />
    <v-col cols="12">
      <v-card class="mx-auto login-card">
        <v-card-title class="justify-center">Listado de Ordenes</v-card-title>
        <v-card-text>
          <v-row class="d-flex justify-center ma-6">
            <v-col cols="12">
              <v-data-table
                :headers="headers"
                :items="ordenes"
                :items-per-page="5"
                class="elevation-1"
              >
                <template v-slot:[`item.estatus`]="{ item }">
                  <v-chip
                    :color="getColor(item.estatus)"
                    dark
                    outlined
                  >
                    {{item.estatus}}
                  </v-chip>
                </template>
                <template v-slot:[`item.acciones`]="{ item }">
                  <v-btn
                    dense
                    style="margin-right: 1rem"
                    color="blue"
                    dark
                    @click="ProcesarOrden(item)"
                  >
                    <v-icon dense>
                      mdi-check-box-outline
                    </v-icon>
                  </v-btn>
                  <v-btn
                    dense
                    color="red"
                    dark
                    @click="CancelarOrden(item)"
                  >
                    <v-icon dense>
                      mdi-cancel
                    </v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import Loader from "@/components/Loader.vue";

export default {
  name: "ListarOrdenesTrabajador",
  components: {
    Loader,
  },
  data() {
    return {
      loading: false,
      headers: [
        { text: "ID", value: "id" },
        { text: "Destino", value: "apodo_ubicacion" },
        { text: "Cantidad de DTC", value: "cantidad_dtc", align: 'center' },
        { text: "Cantidad de Tarjetas", value: "cantidad_tarjeta", align: 'center'  },
        { text: "Comprobante de Pago", value: "comprobante_pago", align: 'center'  },
        { text: "Estatus", value: "estatus", align: 'center'  },
        { text: "Acciones", value: "acciones", align: 'center'  },
      ],
      ordenes: [],
      selected: {}
    };
  },
  mounted() {
    this.loadOrdenes();
  },
  methods: {
    getColor (estatus) {
      switch (estatus) {
        case 'EN REVISIÓN':
          return 'yellow'
          break;

        case 'EN PROCESO':
          return 'blue'
          break;
        
        case 'CANCELADA':
          return 'red'
          break;
      
        default:
          return 'red'
          break;
      }
    },
    goToCreate() {
      this.$emit("goToCreate");
    },
    async ProcesarOrden (value) {

      this.selected = Object.assign({}, value)

      const confirmed = await this.createSwalAlert('¿Esta seguro de procesar esta orden?')

      if (!confirmed) {
        return
      }

      try {

       this.loading = true
        const update = await this.$axios.post("/ordenes/update", {
          orden_id: this.selected.id,
          estatus: 2 // en proceso
        });

        this.$notify({
          title: "Exito",
          text: update.data.data,
          type: "success",
        });

        this.loading = false;
        await this.loadOrdenes()

      } catch (error) {

        this.loading = false;

        console.log(error.response);
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
    async CancelarOrden (value) {
      this.selected = Object.assign({}, value)

      const confirmed = await this.createSwalAlert('¿Esta seguro de cancelar esta orden?')

      if (!confirmed) {
        return
      }

      try {

       this.loading = true
        const update = await this.$axios.post("/ordenes/update", {
          orden_id: this.selected.id,
          estatus: 3 // cancelado
        });

        console.log('no');
        this.$notify({
          title: "Exito",
          text: update.data.data,
          type: "success",
        });

        this.loading = false;
        await this.loadOrdenes()

      } catch (error) {
        
        console.log(error.response);
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
    async loadOrdenes() {
      try {
        this.loading = true;
        const ordenes = await this.$axios.post("/ordenes/index", {
          cliente_id: this.$store.state.auth.user.cliente.id,
        });
        this.ordenes = ordenes.data.data;
        this.loading = false;
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
    async createSwalAlert (msg) {
      try {
        let result = await this.$swal.fire({
          title: msg,
          text: '',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok',
          cancelButtonText: 'Cancelar'
        })

          if (result.isConfirmed) {
            return true
          }

      } catch (error) {
        return false
      }

    },
    async editOrden() {
      console.log("edit orden");
    },
  },
};
</script>
<style scoped>
.login-card {
  margin-top: 2rem;
}
</style>

<template>
  <v-row class="d-flex justify-center">
    <Loader v-bind:visible="loading" />
    <v-col cols="12">
      <v-card class="mx-auto login-card">
        <v-card-title class="justify-center">Listado de Ordenes</v-card-title>
        <v-card-text>
          <v-row>
            <v-col md="2" cols="12">
              <a :href="`${this.$backend}ordenesexport`">
                <v-btn color="primary">
                  Imprimir Reporte
                </v-btn>
              </a>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-center ">
            <v-col cols="12">
              <v-data-table
                :headers="headers"
                :items="ordenes"
                :items-per-page="5"
                class="elevation-1"
              >
                <template v-slot:[`item.estatus`]="{ item }">
                  <v-chip :color="getColor(item.estatus)" dark outlined>
                    {{ item.estatus }}
                  </v-chip>
                </template>
                <template v-slot:[`item.acciones`]="{ item }">
                  <v-tooltip
                    left
                    v-if="item.estatus_int === 2 || item.estatus_int > 3"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        dense
                        style="margin-right: 1rem"
                        :color="disabled(item.estatus_int)"
                        dark
                        @click="
                          if (item.estatus !== 'CANCELADA') EntregarOrden(item);
                        "
                      >
                        <v-icon v-bind="attrs" v-on="on">
                          mdi-bike-fast
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Realizar Entrega</span>
                  </v-tooltip>
                  <v-tooltip left v-else>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        dense
                        style="margin-right: 1rem"
                        :color="disabled(item.estatus_int)"
                        dark
                        @click="
                          if (item.estatus !== 'CANCELADA') ProcesarOrden(item);
                        "
                      >
                        <v-icon v-bind="attrs" v-on="on">
                          mdi-check-box-outline
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Verificar</span>
                  </v-tooltip>
                  <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        dense
                        :color="
                          item.estatus === 'CANCELADA'
                            ? 'lightgray'
                            : item.estatus === 'COMPLETADO'
                            ? 'lightgray'
                            : 'red'
                        "
                        dark
                        @click="
                          if (item.estatus !== 'CANCELADA') CancelarOrden(item);
                        "
                      >
                        <v-icon v-bind="attrs" v-on="on">
                          mdi-cancel
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Cancelar</span>
                  </v-tooltip>
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
    Loader
  },
  data() {
    return {
      loading: false,
      headers: [
        { text: "ID", value: "id" },
        { text: "Nombre del Cliente", value: "cliente_name" },
        { text: "Documento de Identficación del Cliente", value: "client_document" },
        { text: "Destino", value: "apodo_ubicacion" },
        { text: "Cantidad de DTC", value: "cantidad_dtc", align: "center" },
        {
          text: "Cantidad de Tarjetas",
          value: "cantidad_tarjeta",
          align: "center"
        },
        {
          text: "Comprobante de Pago",
          value: "comprobante_pago",
          align: "center"
        },
        { text: "Estatus", value: "estatus", align: "center" },
        { text: "Acciones", value: "acciones", align: "center" }
      ],
      ordenes: [],
      selected: {}
    };
  },
  mounted() {
    this.loadOrdenes();
  },
  methods: {
    getColor(estatus) {
      switch (estatus) {
        case "EN REVISIÓN":
          return "#7300f1";
          break;

        case "EN PROCESO":
          return "blue";
          break;

        case "CANCELADA":
          return "red";
          break;

        default:
          return "blue";
          break;
      }
    },
    disabled(estatus) {
      switch (estatus) {
        case 3:
        case 6:
          return "lightgray";
          break;

        default:
          return "blue";
          break;
      }
    },
    goToCreate() {
      this.$emit("goToCreate");
    },
    async EntregarOrden(value) {
      if (value.estatus_int === 3 || value.estatus_int === 6) {
        return;
      }
      this.selected = Object.assign({}, value);
      // logica de remitir a recorrido
      this.$emit("goToDetalle", this.selected);
    },
    async ProcesarOrden(value) {
      if (value.estatus_int === 3 || value.estatus_int === 6) {
        return;
      }

      if (value.estatus === "EN PROCESO") {
        this.$notify({
          title: "Error",
          text: "Esta orden ya se encuentra en proceso.",
          type: "error"
        });
        return;
      }

      this.selected = Object.assign({}, value);

      const confirmed = await this.createSwalAlert(
        "¿Esta seguro de procesar esta orden?"
      );

      if (!confirmed) {
        return;
      }

      try {
        this.loading = true;
        const update = await this.$axios.post("/ordenes/update", {
          orden_id: this.selected.id,
          trabajador_id: this.$store.state.auth.user.trabajador.id,
          estatus: 2 // en proceso
        });

        this.$notify({
          title: "Exito",
          text: update.data.data,
          type: "success"
        });

        this.loading = false;
        await this.loadOrdenes();
      } catch (error) {
        this.loading = false;

        console.log(error.response);
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
    async CancelarOrden(value) {
      if (value.estatus_int === 3 || value.estatus_int === 6) {
        return;
      }
      this.selected = Object.assign({}, value);

      const confirmed = await this.createSwalAlert(
        "¿Esta seguro de cancelar esta orden?"
      );

      if (!confirmed) {
        return;
      }

      try {
        this.loading = true;
        const update = await this.$axios.post("/ordenes/update", {
          orden_id: this.selected.id,
          estatus: 3 // cancelado
        });

        console.log("no");
        this.$notify({
          title: "Exito",
          text: update.data.data,
          type: "success"
        });

        this.loading = false;
        await this.loadOrdenes();
      } catch (error) {
        console.log(error.response);
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
    async loadOrdenes() {
      try {
        this.loading = true;
        const ordenes = await this.$axios.post("/ordenes/index", {
          // cliente_id: this.$store.state.auth.user.cliente.id
        });
        this.ordenes = ordenes.data.data;
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
    async createSwalAlert(msg) {
      try {
        const result = await this.$swal.fire({
          title: msg,
          text: "",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ok",
          cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
          return true;
        }
      } catch (error) {
        return false;
      }
    },
    async editOrden() {
      console.log("edit orden");
    }
  }
};
</script>
<style scoped>
.login-card {
  margin-top: 2rem;
}
</style>

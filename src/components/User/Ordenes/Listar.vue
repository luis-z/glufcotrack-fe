<template>
  <v-row class="d-flex justify-center">
    <Loader v-bind:visible="loading" />
    <v-col cols="8">
      <v-card class="mx-auto login-card">
        <v-card-title class="justify-center">>Listado de Ordenes</v-card-title>
        <v-card-text>
          <v-btn color="primary" @click="goToCreate">Crear orden</v-btn>
          <v-row class="d-flex justify-center ma-6">
            <template>
              <v-data-table
                :headers="headers"
                :items="ordenes"
                :items-per-page="5"
                class="elevation-1"
                @click:row="handleRow"
              >
                <template v-slot:[`item.actions`]="{ item }">
                  <v-icon small class="mr-2" @click="editOrden(item.name)">
                    mdi-pencil
                  </v-icon>
                  <v-icon small @click="deleteOrden(item.name)">
                    mdi-delete
                  </v-icon>
                </template>
                <template v-slot:[`item.estatus`]="{ item }">
                  <v-tooltip right color="blue">
                    <template v-slot:activator="{ on, attrs }">
                      <v-chip
                        :color="getColor(item.estatus)"
                        dark
                        outlined
                        v-bind="attrs"
                        v-on="on"
                      >
                        {{item.estatus}}
                      </v-chip>
                    </template>
                    <span>Ver en tiempo real</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </template>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import Loader from "@/components/Loader.vue";

export default {
  name: "ListarOrdenes",
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
        { text: "Estatus", value: "estatus", align: 'center'  },
      ],
      ordenes: [],
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
    handleRow (value) {
      console.log(value);
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
          cancelButtonText: "no",
        })
        .then((result) => {
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
  },
};
</script>
<style scoped>
.login-card {
  margin-top: 2rem;
}
</style>

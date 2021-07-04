<template>
  <v-container fluid>
    <Loader v-bind:visible="loading" />
    <component
      :is="component"
      @userData="userData"
      @goToCreate="goToCreate()"
      @goToListar="goToListar()"
      @goToDetalle="goToDetalle()"
    />
  </v-container>
</template>
<script>
import Loader from "@/components/Loader.vue";
import ListarOrdenes from "@/components/Trabajador/Ordenes/Listar.vue";

export default {
  name: "Home",
  components: {
    Loader,
    ListarOrdenes
  },
  data() {
    return {
      component: null,
      loading: false,
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  mounted() {
    // this.userData()
    this.component = ListarOrdenes
  },
  methods: {
    goToCreate () {
      this.component = CrearOrden
    },
    goToListar () {
      this.component = ListarOrdenes
    },
    goToDetalle () {
      this.component = DetalleOrden
    },
    async userData () {
    }
  }
};
</script>
<style scoped>
.login-card {
  margin-top: 2rem;
}
</style>

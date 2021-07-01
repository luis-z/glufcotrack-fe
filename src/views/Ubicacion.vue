<template>
  <v-container fluid>
    <Loader v-bind:visible="loading" />
    <component 
      :is="component"
      @goToCreate="goToCreate()"
      @goToListarUbicaciones="goToListarUbicaciones()"
    />
  </v-container>
</template>
<script>
import Loader from "@/components/Loader.vue";
import ListarUbicaciones from "@/components/User/Ubicacion/ListarUbicaciones.vue";
import CrearUbicacion from "@/components/User/Ubicacion/CrearUbicacion.vue";

export default {
  name: "Ubicacion",
  components: {
    Loader,
    ListarUbicaciones,
    CrearUbicacion
  },
  data() {
    return {
      component: null,
      loading: true,
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData () {
      try {

        this.loading = false
        this.component = ListarUbicaciones
    
      } catch (error) {
        this.$notify({
          title: "Error",
          text: error.message,
          type: "error",
        });
        this.$router.push("/");
      }
    },
    goToCreate () {
      this.component = CrearUbicacion
    },
    goToListarUbicaciones () {
      this.component = ListarUbicaciones
    }
  }
};
</script>
<style scoped>
.login-card {
  margin-top: 2rem;
}
</style>

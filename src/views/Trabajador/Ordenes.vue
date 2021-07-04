<template>
  <v-container fluid>
    <Loader v-bind:visible="loading" />
    <component
      :is="component"
      :data="data"
      @userData="userData"
      @goToCreate="goToCreate()"
      @goToListar="goToListar()"
      @goToDetalle="goToDetalle($event)"
    />
  </v-container>
</template>
<script>
import Loader from '@/components/Loader.vue'
import ListarOrdenes from '@/components/Trabajador/Ordenes/Listar.vue'
import Detalle from '@/components/Trabajador/Ordenes/Detalle.vue'

export default {
  name: 'Home',
  components: {
    Loader,
    ListarOrdenes,
    Detalle
  },
  data () {
    return {
      component: null,
      loading: false,
      data: []
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.auth.user
    }
  },
  mounted () {
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
    goToDetalle (e) {
      this.data = e
      this.component = Detalle
    },
    async userData () {
    }
  }
}
</script>
<style scoped>
.login-card {
  margin-top: 2rem;
}
</style>

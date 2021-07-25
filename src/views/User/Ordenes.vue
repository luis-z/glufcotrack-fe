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
import EmailVerification from '@/components/User/Verification/EmailVerification.vue'
import PhoneVerification from '@/components/User/Verification/PhoneVerification.vue'
import ListarOrdenes from '@/components/User/Ordenes/Listar.vue'
import CrearOrden from '@/components/User/Ordenes/Crear.vue'
import DetalleOrden from '@/components/User/Ordenes/Detalle.vue'

export default {
  name: 'Home',
  components: {
    Loader,
    EmailVerification,
    PhoneVerification,
    ListarOrdenes,
    CrearOrden,
    DetalleOrden
  },
  data () {
    return {
      component: null,
      loading: true,
      data: []
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.auth.user
    }
  },
  mounted () {
    this.userData()
  },
  methods: {
    goToCreate () {
      this.component = CrearOrden
    },
    goToListar () {
      this.component = ListarOrdenes
    },
    goToDetalle (data) {
      this.data = data
      this.component = DetalleOrden
    },
    async userData () {
      try {
        await this.$store.dispatch('auth/userData')
        this.loading = false

        if (!this.currentUser) {
          this.$router.push('/')
          return
        }

        if (this.currentUser.rol === 1) {
          this.component = ListarOrdenes
          return
        }

        if (!this.currentUser.email_verificado) {
          console.log('CORREO SIN VERIFICAR')
          this.component = EmailVerification
          return
        }

        if (!this.currentUser.celular.verificado) {
          console.log('CELULAR SIN VERIFICAR')
          this.component = PhoneVerification
          return
        }

        if (this.currentUser) {
          this.component = ListarOrdenes
        }
      } catch (error) {
        this.$notify({
          title: 'Error',
          text: error.message,
          type: 'error'
        })
        this.$router.push('/')
      }
    }
  }
}
</script>
<style scoped>
.login-card {
  margin-top: 2rem;
}
</style>

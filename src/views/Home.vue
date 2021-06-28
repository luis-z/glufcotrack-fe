<template>
  <v-container fluid>
    <Loader v-bind:visible="loading" />
    <component :is="component" @userData="userData"/>
  </v-container>
</template>
<script>
import Loader from "@/components/Loader.vue";
import EmailVerification from "@/components/User/Verification/EmailVerification.vue";
import PhoneVerification from "@/components/User/Verification/PhoneVerification.vue";
import UserDashboard from "@/components/User/UserDashboard.vue";

export default {
  name: "Home",
  components: {
    Loader,
    EmailVerification,
    PhoneVerification,
    UserDashboard
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
    this.userData()
  },
  methods: {
    async userData () {
      await this.$store.dispatch("auth/userData");
      this.loading = false

      if (!this.currentUser) {
        this.$router.push("/");
        return
      }

      if (!this.currentUser.email_verificado) {
        console.log('CORREO SIN VERIFICAR');
        this.component = EmailVerification
        return
      }

      if (!this.currentUser.celular.verificado) {
        console.log('CELULAR SIN VERIFICAR');
        this.component = PhoneVerification
        return
      }

      this.component = UserDashboard
    }
  }
};
</script>
<style scoped>
.login-card {
  margin-top: 2rem;
}
</style>

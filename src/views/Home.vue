<template>
  <v-row class="d-flex justify-center">
    <v-col cols="4">
      <v-card class="mx-auto login-card">
        <v-card-title class="justify-center"
          >ESTE ES EL HOME SESION</v-card-title
        >
        <v-btn @click="getUser()"> Consultar </v-btn>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import UserService from "../services/user.service";

export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/");
    }
  },
  methods: {
    async getUser() {
      UserService.getUserBoard().then(
        (response) => {
          this.content = response.data;
        },
        (error) => {
          this.content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
  },
};
</script>
<style scoped>
.login-card {
  margin-top: 2rem;
}
</style>

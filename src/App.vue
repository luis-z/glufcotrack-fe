<template>
  <v-app>
    <notifications position="top center" width="600px" />
    <v-app-bar
      app
      style="background: linear-gradient(90deg, #141b32, #3b466c 48%, #141b32)"
      dark
      :flat="currentRouteName == 'Register' || currentRouteName == 'Login'"
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="150"
          src="../src/assets/bg-header.png"
          width="150"
          style="cursor: pointer"
          @click="goHome()"
        />
      </div>

      <v-spacer></v-spacer>

      <div v-if="!currentUser">
        <v-btn
          v-if="currentRouteName == 'Home'"
          text
          v-show="currentRouteName !== 'Home'"
          @click="goRegister()"
        >
          <span class="mr-2">Cerrar sesion</span>
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
        <v-btn
          else
          text
          v-show="currentRouteName !== 'Register'"
          @click="goRegister()"
        >
          <span class="mr-2">Registro</span>
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
      </div>
      <div v-if="currentUser">
        <router-link to="/ordenes">
          <v-btn text>
            <span class="mr-2">Mis Ordenes</span>
          </v-btn>
        </router-link>
        <router-link to="/ubicacion">
          <v-btn text>
            <span class="mr-2">Mis Direcciones</span>
          </v-btn>
        </router-link>
        <v-btn text @click.prevent="logOut">
          <span class="mr-2">Cerrar Sesión</span>
        </v-btn>
      </div>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({}),
  computed: {
    currentRouteName () {
      return this.$route.name
    },
    currentUser () {
      return this.$store.state.auth.user
    },
    showAdminBoard () {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes('ROLE_ADMIN')
      }

      return false
    },
    showModeratorBoard () {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes('ROLE_MODERATOR')
      }

      return false
    }
  },
  methods: {
    goHome () {
      this.$router.push('/')
    },
    logOut () {
      this.$store.dispatch('auth/logout')
      this.$router.push('/')
    },
    goRegister () {
      this.$router.push('/registro')
    }
  }
}
</script>
<style lang="scss">
@import "~sweetalert2/src/variables";

$swal2-background: #990000;

@import "~sweetalert2/src/sweetalert2";
.v-main {
  background: linear-gradient(90deg, #141b32, #3b466c 48%, #141b32);
}

.vue-notification {
  font-size: 16px;
}

@font-face {
  font-family: "Ubuntu";
  src: local("Ubuntu"),
   url(./assets/fonts/Ubuntu-Light.ttf) format("truetype");
}

.swal2-title, .swal2-deny, .swal2-confirm, .swal2-cancel {
  font-family: Ubuntu!important;
}

.v-application {
  font-family: Ubuntu!important;
}

</style>

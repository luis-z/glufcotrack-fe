<template>
  <v-app>
    <notifications position="top center" width="600px"/>
    <v-app-bar
      app
      style="background: linear-gradient(90deg,#141b32,#3b466c 48%,#141b32);"
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
          style="cursor:pointer"
          @click="goHome()"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        text
        v-show="currentRouteName !== 'Register'"
        @click="goRegister()"
      >
        <span class="mr-2" >Registro</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({

  }),
  computed: {
    currentRouteName() {
      return this.$route.name;
    }
  },
  methods: {
    goHome () {
      this.$router.push('/')
    },
    goRegister() {
      this.$router.push('/registro')
    }
  }
}
</script>
<style>
.v-main {
  background: linear-gradient(90deg,#141b32,#3b466c 48%,#141b32);
}

.vue-notification {
  font-size: 16px;
}
</style>

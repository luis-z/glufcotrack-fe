<template>
  <v-app>
    <v-app-bar
      app
      style="background: linear-gradient(90deg,#141b32,#3b466c 48%,#141b32);"
      dark
    >
      <div class="d-flex align-center">

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="150"
          src="../src/assets/bg-header.png"
          width="150"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Registro</span>
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
    //
    logoPath: path.join(__dirname, 'src', 'assets', 'resources', 'assets', 'logo.png')
  })
}
</script>

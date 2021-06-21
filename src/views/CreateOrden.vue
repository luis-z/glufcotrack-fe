<template>
  <v-row class="d-flex justify-center">
    <v-col cols="8">
      <v-card class="mx-auto login-card">
        <v-card-title class="justify-center">Crear orden</v-card-title>
        <v-card-text>
          <v-btn color="primary">Volver</v-btn>
          <v-row class="d-flex justify-center ma-6">
            <v-row class="d-flex justify-center ma-6">
              <v-col cols="10">
                <v-text-field
                  :disabled="sended"
                  v-model="email"
                  :loading="loading"
                  v-on:keyup.enter="onEnter"
                  :autofocus="true"
                  label="Fruta"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="10">
                <v-text-field
                  :disabled="sended"
                  v-model="password"
                  :loading="loading"
                  v-on:keyup.enter="onEnter"
                  label="Proteina"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-row>
          <v-row class="justify-center">
            <v-col cols="3">
              <v-btn @click="login()" color="primary">Crear nueva orden</v-btn>
            </v-col>
            <br /> </v-row></v-card-text></v-card></v-col
  ></v-row>
</template>
<script>
export default {};
</script>
<style scoped>
.login-card {
  margin-top: 2rem;
}
</style>

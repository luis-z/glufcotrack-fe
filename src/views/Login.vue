<template>
  <v-card
    class="mx-auto"
  >
    <v-card-title class="d-flex justify-center">Inicio de sesión</v-card-title>
    <v-card-text>
      <v-row class="d-flex justify-center ma-6">
        <v-col cols="10">
          <v-text-field
            :disabled="sended"
            v-model="username"
            :rules="usernameRules"
            :loading="loading"
            v-on:keyup.enter="onEnter"
            :autofocus="true"
            label="Usuario"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="10">
          <v-text-field
            :disabled="sended"
            v-model="password"
            :rules="passwordRules"
            :loading="loading"
            v-on:keyup.enter="onEnter"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            label="Contraseña"
            required
            @click:append="show1 = !show1"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>

  </v-card>
</template>
<script>
export default {
  name: 'Login',
  components: {

  },
  data: () => ({
    username: '',
    password: '',
    error: '',
    loading: false,
    message: '',
    sended: false,
    show1: false,
    usernameRules: [
      v => !!v || 'El nombre de usuario es requerido',
      v => (v && v.length <= 10) || 'Máximo 10 carácteres'
    ],
    passwordRules: [
      v => !!v || 'La contraseña es requerida',
      v => (v && v.length >= 8) || 'Mínimo 8 carácteres'
    ]
  })
}
</script>

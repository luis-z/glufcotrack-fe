<template>
  <v-row class="d-flex justify-center">
    <v-col cols="4">
      <v-card
        class=  "mx-auto login-card"
      >
        <v-card-title class="justify-center">Inicio de sesión</v-card-title>
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
          <v-row class="justify-center">
            <v-col cols="4">
              <v-btn @click="login()">Iniciar Sesión</v-btn>
            </v-col>
            <br>
          </v-row>
        </v-card-text>

      </v-card>

    </v-col>
  </v-row>
</template>
<script>
import cookies from 'js-cookie'
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
  }),
  methods: {
    async onEnter () {
      await this.login()
    },
    async login () {
      try {

        await this.validations()

        this.loading = true

        // validaciones 
        const login = await this.$axios.post('login', {
          'username': this.username,
          'password': this.password
        })
        cookies.set('userToken', login.data.access_token)
        this.$router.push({ name: 'Home' })


        this.loading = false

        this.$notify({
          title: 'Exito',
          text: login.data.data,
          type: 'success'
        })

        // this.$router.push('/dashboard')
      } catch (error) {
        this.loading = false
        if (error.response) {
          this.$notify({
            title: 'Error',
            text: error.response.data.data,
            type: 'error'
          })
        } else {
          this.$notify({
            title: 'Error',
            text: error.message,
            type: 'error'
          })
        }
      }
    },
    async validations () {
      if (this.username === '' || this.username.length <= 0) {
        throw new Error('El nombre de usuario es requerido')
      }

      if (this.password === '' || this.password.length <= 0) {
        throw new Error('La contraseña es requerida')
      }

      if (this.password.length < 8) {
        throw new Error('La contraseña debe tener mas de 8 carácteres')
      }

      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%/*?&])[A-Za-z\d@$!%/*?&]{8,}$/.test(this.password)) {
        throw new Error('La contraseña debe tener mínimo ocho caracteres, al menos una letra mayúscula, una letra minúscula, un número y un carácter especial')
      }
     
      return true
    },
  }
}
</script>
<style scoped>
.login-card {
  margin-top: 2rem;
}
</style>

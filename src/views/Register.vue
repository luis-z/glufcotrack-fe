<template>
  <v-row id="register-layout" class="d-flex justify-center">
    <Loader v-bind:visible="loading" />
    <v-col cols="4">
      <v-card
        class="mx-auto register-card"
      >
        <v-card-title class="justify-center">Registro de usuario</v-card-title>
        <v-card-text>
          <v-row class="d-flex justify-center ma-2">
            <v-col cols="10">
              <v-text-field
                :disabled="sended"
                v-model="username"
                :rules="usernameRules"
                :loading="loading"
                v-on:keyup.enter="onEnter"
                :autofocus="true"
                label="Nombre de Usuario"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="10">
              <v-text-field
                v-model="email"
                label="Correo"
                :rules="emailRules"
                v-on:keyup.enter="onEnter"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-select 
                :items="operatorsList" 
                label="Operadora"
                v-model="operator"
                item-text="name" 
                item-value="id"   
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-text-field 
                label="Número de teléfono" 
                v-model="phoneNumber"
                @keypress="isNumber($event)"
                maxlength="7"
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
            <v-col cols="10">
              <v-text-field
                :disabled="sended"
                label="Confirmar la Contraseña"
                v-model="passwordConfirm"
                :rules="passwordRules"
                :loading="loading"
                v-on:keyup.enter="onEnter"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                required
                @click:append="show1 = !show1"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="justify-center">
            <v-col cols="4">
              <v-btn @click="registerUser()">Registrar Usuario</v-btn>
            </v-col>
            <br>
          </v-row>
        </v-card-text>

      </v-card>

    </v-col>
  </v-row>
</template>
<script>
import Loader from '../components/Loader.vue'
export default {
  name: 'Login',
  components: {
    Loader
  },
  data: () => ({
    username: '',
    password: '',
    passwordConfirm: '',
    email: '',
    error: '',
    loading: false,
    message: '',
    sended: false,
    show1: false,
    phoneNumber: '',
    operator:'',
    operatorsList:[
      {
        id: '414',
        name: '0414'
      },
      {
        id: '424',
        name: '0424'
      },
      {
        id: '412',
        name: '0412'
      },
      {
        id: '416',
        name: '0416'
      },
      {
        id: '426',
        name: '0426'
      },
    ],
    usernameRules: [
      v => !!v || 'El nombre de usuario es requerido',
      v => (v && v.length <= 10) || 'Máximo 10 carácteres'
    ],
    passwordRules: [
      v => !!v || 'La contraseña es requerida',
      v => (v && v.length >= 8) || 'Mínimo 8 carácteres'
    ],
    emailRules: [
      v => !!v || 'El correo es requerido',
      v => /.+@.+\..+/.test(v) || 'El correo debe ser válido'
    ],
  }),
  methods: {
    async onEnter () {
      await this.registerUser()
    },
    async registerUser () {
      try {

        await this.validations()

        this.loading = true

        // validaciones 
        const register = await this.$axios.post('register', {
          'name': this.username,
          'email': this.email,
          'phonenumber': this.operator + this.phoneNumber,
          'password': this.password
        })

        this.loading = false

        this.$notify({
          title: 'Exito',
          text: register.data.data,
          type: 'success'
        })

        this.$router.push('/')

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

      if (this.email === '' || this.email.length <= 0) {
        throw new Error('El correo es requerido')
      }

      if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.email)) {
        throw new Error('El correo es inválido')
      }

      if (!/.+@.+\..+/.test(this.email)) {
        throw new Error('El correo es inválido')
      }

      if (this.operator === '' || this.operator.length <= 0) {
        throw new Error('La operadora es requerida')
      }

      if (this.phoneNumber === '' || this.phoneNumber.length <= 0) {
        throw new Error('El número de teléfono es requerido')
      }

      if (this.phoneNumber.length !== 7){
        throw new Error('El número de teléfono debe tener 7 dígitos')
      }
      
      if (isNaN(this.phoneNumber.length)){
        throw new Error('El número de teléfono debe tener solo dígitos')
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

      if (this.passwordConfirm === '' || this.passwordConfirm.length <= 0) {
        throw new Error('La confirmación de la contraseña es requerida')
      }

      if (this.passwordConfirm !== this.password) {
        throw new Error('Las contraseñas no coinciden')
      }
     
      return true
    },
    isNumber: function(evt) {
      evt = evt ? evt : window.event
      var charCode = evt.which ? evt.which : evt.keyCode
      if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 9) {
        evt.preventDefault()
      } else {
        return true
      }
      ;`enter code here`
    }
  }
}
</script>
<style scoped>

.register-card {
  margin-top: 1rem;
}
</style>

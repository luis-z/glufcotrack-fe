<template>
  <v-row class="d-flex justify-center">
    <v-col md="4" cols="12" sm="8">
      <v-card class="mx-auto login-card">
        <v-card-title class="justify-center">Inicio de sesión</v-card-title>
        <v-card-text>
          <v-row class="d-flex justify-center">
            <v-col md="10" cols="12">
              <v-text-field
                :disabled="sended"
                v-model="email"
                :rules="emailRules"
                :loading="loading"
                v-on:keyup.enter="onEnter"
                :autofocus="true"
                label="Email"
                required
              ></v-text-field>
            </v-col>
            <v-col md="10" cols="12">
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
          <v-row class="d-flex justify-center">
            <v-col cols="10">
              <center>
                Si no recuerda sus credenciales o se equivoco en el registro por favor comuniquese al correo del administrador: 
                  <span style="color:blue">lazm.dev@gmail.com</span>
              </center>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex justify-center">
              <v-btn @click="login()" :loading="loading">Iniciar Sesión</v-btn>
            </v-col>
            <br />
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: "Login",
  components: {},
  data: () => ({
    email: "",
    password: "",
    error: "",
    loading: false,
    message: "",
    sended: false,
    show1: false,
    emailRules: [
      v => !!v || "El email es requerido",
      v => /.+@.+\..+/.test(v) || "El correo debe ser válido"
    ],
    passwordRules: [
      v => !!v || "La contraseña es requerida",
      v => (v && v.length >= 8) || "Mínimo 8 carácteres"
    ]
  }),
  methods: {
    async onEnter() {
      await this.login();
    },
    async login() {
      try {
        await this.validations();
        this.loading = true;

        const user = {
          email: this.email.toLowerCase(),
          password: this.password
        };

        await this.$store.dispatch("auth/login", user);

        await this.$store.dispatch("auth/userData");

        switch (this.$store.state.auth.user.rol) {
          case 2:
          case 1:
            // TRABAJADOR
            this.$router.push("/trabajador/ordenes");
            break;
        
          case 3:
            // CLIENT
            this.$router.push("/ordenes");
            break;
        }

        this.loading = false;

        this.$notify({
          title: "Login Exitoso",
          text: "",
          type: "success"
        });
      } catch (error) {
        this.loading = false;
        if (error.response) {
          this.$notify({
            title: "Error",
            text: error.response.data.data,
            type: "error"
          });
        } else {
          this.$notify({
            title: "Error",
            text: error.message,
            type: "error"
          });
        }
      }
    },
    async validations() {
      if (this.email === "" || this.email.length <= 0) {
        throw new Error("El nombre de usuario es requerido");
      }

      if (this.password === "" || this.password.length <= 0) {
        throw new Error("La contraseña es requerida");
      }

      if (this.password.length < 8) {
        throw new Error("La contraseña debe tener mas de 8 carácteres");
      }

      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%/*?&])[A-Za-z\d@$!%/*?&]{8,}$/.test(
          this.password
        )
      ) {
        throw new Error(
          "La contraseña debe tener mínimo ocho caracteres, al menos una letra mayúscula, una letra minúscula, un número y un carácter especial"
        );
      }

      return true;
    }
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  created() {
    if (this.loggedIn) {
      this.$router.push("/ordenes");
    }
  }
};
</script>
<style scoped>
.login-card {
  margin-top: 2rem;
}
</style>

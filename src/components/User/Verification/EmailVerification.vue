<template>
  <v-row justify="center">
    <Loader v-bind:visible="loading" />
    <v-col cols="12" md="6">
      <v-card style="padding:2rem 1rem">
        <v-row justify="center">
          <v-col cols="12" md="8" justify="center">
            <p style="text-align:center">
              Debe verificar su correo electrónico para realizar cualquier
              acción dentro del sistema.
            </p>
          </v-col>
        </v-row>
        <v-row justify="center" align="center">
          <v-col cols="12" md="6" style="display:flex; justify-content: center">
            <v-text-field
              v-model="token"
              label="Código de verificación"
              placeholder="12345"
              outlined
              @keypress="isNumber($event)"
              maxlength="5"
              v-on:keyup.enter="onEnter"
              :autofocus="true"
              :loading="loading"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6" style="display:flex; justify-content: center">
            <v-btn
              style="margin-bottom:1rem;"
              color="primary"
              @click="confirmToken"
              :loading="loading"
            >
              Verificar
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            md="12"
            style="display:flex; justify-content: center"
          >
            <a @click="resend"><p>Reenviar correo de verificación</p></a>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import Loader from "@/components/Loader.vue";

export default {
  name: "EmailVerification",
  components: {
    Loader
  },
  props: {
    visible: Boolean
  },
  data: () => ({
    token: "",
    loading: false
  }),
  methods: {
    async resend() {
      console.log("resend");
      this.loading = true;
      try {
        const sended = await this.$axios.post("reenviarcorreoverificacion");
        console.log(sended);
        this.loading = false;
        this.$notify({
          title: "Reenvio Exitoso",
          text: "",
          type: "success"
        });
      } catch (error) {
        console.log(error.response.data);
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
    async onEnter() {
      await this.confirmToken();
    },
    async confirmToken() {
      console.log("confirm token");

      if (this.token == "" || this.token.length <= 0) {
        this.$notify({
          title: "Error",
          text: "El código es requerido.",
          type: "error"
        });

        return;
      }

      if (this.token.length !== 5) {
        this.$notify({
          title: "Error",
          text: "El código debe tener 5 dígitos.",
          type: "error"
        });
        return;
      }

      this.loading = true;
      try {
        const body = {
          token: this.token
        };
        const sended = await this.$axios.post("verificarcorreo", body);
        console.log(sended);
        this.$emit("userData");
        // this.loading = false
        this.$notify({
          title: "Confimación Exitosa",
          text: "",
          type: "success"
        });
      } catch (error) {
        console.log(error.response.data);
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
    }
  }
};
</script>

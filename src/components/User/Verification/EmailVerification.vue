<template>
  <v-row justify="center">
    <Loader v-bind:visible="loading" />
    <v-col cols="6">
      <v-card style="padding:2rem">
        <v-row justify="center">
          <v-col cols="8" justify="center">
            <p>Debe verificar su correo electrónico para realizar cualquier acción dentro del sistema.</p>
          </v-col>
        </v-row>
        <v-row justify="center" align="center">
          <v-col cols="6">
            <v-text-field
              v-model="token"
              label="Código de verificación"
              placeholder="12345"
              outlined
              @keypress="isNumber($event)"
              maxlength="5"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-btn
              style="margin-bottom:2rem;"
              color="primary"
              @click="confirmToken"
            >
              Verificar
            </v-btn>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="6">
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
  name: 'EmailVerification',
  components: {
    Loader
  },
  props: {
    visible: Boolean
  },
  data: () => ({
    token: '',
    loading: false,
  }),
  methods: {
    async resend () {
      console.log('resend');
    },
    async confirmToken() {
      console.log('confirm token');
    }
  }
}
</script>

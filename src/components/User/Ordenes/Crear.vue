<template>
  <v-row class="d-flex justify-center">
    <Loader v-bind:visible="loading" />
    <v-col cols="12">
      <v-card class="login-card" v-show="!loading">
        <v-card-text>
          <v-btn color="primary" @click="goToListar">regresar</v-btn>
          <v-row class="d-flex justify-center ma-6">
            <v-col cols="8" class="inner-form" v-if="ubicaciones.length > 0">
              <v-row class="d-flex justify-center ma-6">
                <v-col cols="10" style="margin: 0.5rem">
                  <h1 style="font-weight: 300">Generar Orden</h1>
                </v-col>
                <v-col cols="10">
                  <h3 style="font-weight: 400">1- Seleccione el destino de su pedido:</h3>
                </v-col>
                <v-col cols="8">
                  <v-select
                    v-model="selectedUbicacion"
                    :items="ubicaciones"
                    item-text="apodo"
                    item-value="id"
                    label="Mis Destinos"
                    :loading="loading"
                  ></v-select>
                </v-col>
                <v-col cols="10">
                  <h3 style="font-weight: 400">2- Seleccione la cantidad de productos que desea:</h3>
                </v-col>
                <v-col cols="8" style="background: ">
                  <center>
                    <h2>Cantidad de DTC = {{cantidadDtc}}</h2>
                  </center>
                  <v-slider
                    v-model="cantidadDtc"
                    class="align-center"
                    :max="20"
                    :min="0"
                    hide-details
                    @change="updatePayment"
                  >
                    <template v-slot:prepend>
                      <v-icon
                        color="red"
                        @click="decrement(1)"
                        style="cursor:pointer"
                      >
                        mdi-minus
                      </v-icon>
                    </template>

                    <template v-slot:append>
                      <v-icon
                        color="blue"
                        @click="increment(1)"
                        style="cursor:pointer"
                      >
                        mdi-plus
                      </v-icon>
                    </template>
                  </v-slider>
                </v-col>
                <v-col cols="8" style="background:  ">
                  <center>
                    <h2>Cantidad de Tarjetas = {{cantidadTarjeta}}</h2>
                  </center>
                  <v-slider
                    v-model="cantidadTarjeta"
                    class="align-center"
                    :max="20"
                    :min="0"
                    hide-details
                    @change="updatePayment"
                  >
                    <template v-slot:prepend>
                      <v-icon
                        color="red"
                        @click="decrement(2)"
                        style="cursor:pointer"
                      >
                        mdi-minus
                      </v-icon>
                    </template>

                    <template v-slot:append>
                      <v-icon
                        color="blue"
                        @click="increment(2)"
                        style="cursor:pointer"
                      >
                        mdi-plus
                      </v-icon>
                    </template>
                  </v-slider>
                </v-col>
              </v-row>
              <v-row class="d-flex justify-center ma-6">
                <v-col cols="10">
                  <h3 style="font-weight: 400">3- Verifique el monto, realice el pago y coloque el comprobante del pago:</h3>
                </v-col>
              </v-row>
              <v-row class="d-flex justify-center ma-6">
                <v-col cols="3">
                  <v-text-field
                    outlined
                    label="Total a Pagar"
                    v-model="totalPago"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="5">
                  <v-text-field
                    v-model="comprobantePago"
                    :loading="loading"
                    v-on:keyup.enter="onEnter"
                    label="Comprobante de Pago"
                    required
                    hint="TXID de Pago"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="d-flex justify-center ma-6">
                <v-col cols="2">
                  <v-btn @click="createOrden" :loading="loading">
                    enviar
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="8" v-else>
              <h3 style="font-weight: 400">Debe registrar una dirección para poder generar una orden, puede hacerlo dando click en el siguiente enlace:</h3>
              <br>
              <center>
                <v-btn color="primary" link to="/ubicacion" text>Registrar Dirección</v-btn>
              </center>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import Loader from '@/components/Loader.vue'

export default {
  name: 'CrearOrden',
  components: {
    Loader
  },
  data () {
    return {
      loading: false,
      cantidadDtc: '',
      cantidadTarjeta: '',
      ubicacion: '',
      comprobantePago: '',
      ubicaciones: [],
      selectedUbicacion: '',
      totalPago: '0.00 GLF'
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    decrement (product) {
      switch (product) {
        case 1:

          if (this.cantidadDtc <= 0) {
            return
          }
          this.cantidadDtc--
          break

        default:
          if (this.cantidadTarjeta <= 0) {
            return
          }
          this.cantidadTarjeta--
          break
      }

      this.updatePayment()
    },
    increment (product) {
      switch (product) {
        case 1:
          this.cantidadDtc++
          break

        default:
          if (this.cantidadTarjeta >= 20) {
            return
          }
          this.cantidadTarjeta++
          break
      }
      this.updatePayment()
    },
    async onEnter () {
      await this.createOrden()
    },
    async createOrden () {
      try {
        if (this.selectedUbicacion.length <= 0) {
          this.$notify({
            title: 'Error',
            text: 'La Ubicación es requerida.',
            type: 'error'
          })

          return
        }

        if (this.comprobantePago == '' || this.comprobantePago.length <= 0) {
          this.$notify({
            title: 'Error',
            text: 'El Comprobante de Pago es requerido.',
            type: 'error'
          })

          return
        }

        const totalFormateado = parseFloat(this.totalPago)

        if (totalFormateado <= 0) {
          this.$notify({
            title: 'Error',
            text: 'Debe seleccionar al menos un producto un producto.',
            type: 'error'
          })

          return
        }

        this.loading = true

        const body = {
          cliente_id: this.$store.state.auth.user.cliente.id,
          ubicacion_id: this.selectedUbicacion,
          cantidad_dtc: this.cantidadDtc,
          cantidad_tarjeta: this.cantidadTarjeta,
          comprobante_pago: this.comprobantePago
        }

        // console.log(body);

        // return

        // validaciones
        const create = await this.$axios.post('ordenes/create', body)

        this.loading = false

        this.$notify({
          title: 'Exito',
          text: create.data.data,
          type: 'success'
        })

        this.goToListar()
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
    async loadData () {
      try {
        this.loading = true
        const ubicaciones = await this.$axios.post('/ubicaciones/index', {
          cliente_id: this.$store.state.auth.user.cliente.id
        })
        this.ubicaciones = ubicaciones.data.data
        this.loading = false
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
    async updatePayment () {
      const totalDtc = parseFloat(this.cantidadDtc) * 20
      console.log(totalDtc)
      const totalTarjetas = parseFloat(this.cantidadTarjeta) * 1
      console.log(totalTarjetas)
      this.totalPago = totalDtc + totalTarjetas
      console.log(this.totalPago)
      this.totalPago = this.totalPago.toFixed(2) + ' GLF'
    },
    async goToListar () {
      this.$emit('goToListar')
    }
  }
}
</script>
<style scoped>
.login-card {
  margin-top: 2rem;
}

#mapid { height: 450px; }

.inner-form {
  background-color: rgba(211, 220, 236, 0.658);
}
</style>

<template>
  <v-container fluid>
    <v-row class="d-flex justify-center">
      <Loader v-bind:visible="loading" />
      <v-col cols="12">
        <v-card class="mx-auto login-card">
          <v-card-text>
            <v-btn color="primary" @click="goToListar">regresar</v-btn>
            <v-row class="d-flex justify-center ma-6">

              <v-col cols="12" md="6" xs="12">
                <Trayecto
                  :destino="[10.418725432317451,-66.87351107597352]"
                  :posicionActual="currentPosition"
                />
              </v-col>

              <v-col cols="4" md="6" xs="12">
                <v-row class="d-flex justify-center ma-6 inner-form">
                  <v-col cols="10" xs="6" style="margin: 0.5rem">
                    <h1 style="font-weight: 300">Orden N# {{data.id}}</h1>
                  </v-col>
                  <v-col cols="12">
                    <v-btn @click="createUbicacion">
                      <v-icon style="margin: 1rem">
                        mdi-bell-ring-outline
                      </v-icon>
                      Notificar al cliente <br> la llegada de su orden
                    </v-btn>
                  </v-col>
                  <v-col cols="12">
                    <v-btn @click="createUbicacion">
                      <v-icon style="margin: 1rem">
                        mdi-bell-ring-outline
                      </v-icon>
                      Notificar al cliente <br> la salida de su orden
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Loader from '@/components/Loader.vue'
import Trayecto from '@/components/Mapa/Trayecto.vue'

export default {
  name: 'RealizarEntrega',
  components: {
    Loader,
    Trayecto
  },
  data () {
    return {
      loading: false,
      recorridos: [],
      coordenadas: [],
      marker: [],
      map: null,
      center: [10.496584, -66.845662],
      currentPosition: [],
      e1: 1,
    }
  },
  props: {
    // value: Boolean,
    data: Object
  },
  mounted () {
    this.loadData()
  },
  methods: {
    async getCurrentPosition() {
      var self = this
      setInterval(function() {
        navigator.geolocation.getCurrentPosition(function(position) {
          console.log(position.coords.latitude, position.coords.longitude);

          self.currentPosition = [position.coords.latitude, position.coords.longitude]

          // self.placeMarker([position.coords.latitude, position.coords.longitude])
          // await self.saveCurrentPosition()

        });
      }, 5000);
    },
    async placeMarker (coordenadas)
    {
      if (this.marker) {
        this.map.removeLayer(this.marker)
      }

      this.currentPosition = coordenadas
      await this.saveCurrentPosition()

      var GlufcoIcon = L.icon({
        iconUrl: '../img/GLUFCOIN.svg',
        iconSize: [60, 61], // size of the icon
        iconAnchor: [26, 60], // point of the icon which will correspond to marker's location
        popupAnchor: [3, -60] // point from which the popup should open relative to the iconAnchor
      })

      this.marker = L.marker(coordenadas, { icon: GlufcoIcon }).addTo(this.map)
    },
    async saveCurrentPosition() {
      try {
        this.loading = true

        await this.$axios.post('recorridos/create',{
          orden_id: this.data.id,
          coordenadas: this.currentPosition.toString()
        })

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
    async onEnter () {
      await this.createUbicacion()
    },
    async loadData () {
      this.loading = true
      try {
        const recorridos = await this.$axios.post('recorridos/index',{
          orden_id: this.data.id
        })

        this.recorridos = recorridos.data.data

        // await this.setupLeafletMap()
        await this.getCurrentPosition()
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
    async createUbicacion () {
      try {
        if (this.apodo == '' || this.apodo.length <= 0) {
          this.$notify({
            title: 'Error',
            text: 'El apodo es requerido.',
            type: 'error'
          })

          return
        }

        if (this.direccion == '' || this.direccion.length <= 0) {
          this.$notify({
            title: 'Error',
            text: 'La dirección es requerida.',
            type: 'error'
          })

          return
        }

        if (this.coordenadas.length <= 0) {
          this.$notify({
            title: 'Error',
            text: 'Debe seleccionar una ubicación en el mapa.',
            type: 'error'
          })

          return
        }

        this.loading = true

        const body = {
          cliente_id: this.$store.state.auth.user.cliente.id,
          apodo: this.apodo,
          direccion: this.direccion,
          coordenadas: this.coordenadas.toString()
        }

        console.log(body)

        // validaciones
        const create = await this.$axios.post('ubicaciones/create', body)

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
    setupLeafletMap () {
      this.map = L.map('mapid').setView(this.center, 13)
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoibGF6bSIsImEiOiJjazBvNG1mbWcwNnd4M21vYnR2NGJpZHR1In0.lxUwxubMbmT4-vSzJRwJIQ'
      }).addTo(this.map)

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

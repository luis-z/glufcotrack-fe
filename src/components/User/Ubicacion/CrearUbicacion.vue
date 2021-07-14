<template>
  <v-row class="d-flex justify-center">
    <Loader v-bind:visible="loading" />
    <v-col cols="12">
      <v-card class="mx-auto login-card">
        <v-card-text>
          <v-btn color="primary" @click="goToListar">regresar</v-btn>
          <v-row class="d-flex justify-center ma-6">
            <v-col cols="8">
              <div id="mapid"></div>
            </v-col>
            <v-col cols="4">
              <v-row class="d-flex justify-center ma-6 inner-form">
                <v-col cols="10" style="margin: 0.5rem">
                  <h1 style="font-weight: 300">Registrar Dirección</h1>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    outlined
                    v-model="apodo"
                    :loading="loading"
                    v-on:keyup.enter="onEnter"
                    :autofocus="true"
                    label="Apodo"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="8">
                  <v-textarea
                    outlined
                    v-model="direccion"
                    :loading="loading"
                    v-on:keyup.enter="onEnter"
                    label="Dirección"
                    required
                  ></v-textarea>
                </v-col>
                <v-col cols="6">
                  <v-btn @click="createUbicacion">
                    enviar
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Loader from '@/components/Loader.vue'

export default {
  name: 'CrearUbicacion',
  components: {
    Loader
  },
  data () {
    return {
      loading: false,
      apodo: '',
      direccion: '',
      coordenadas: [],
      center: [10.496584, -66.845662]
    }
  },
  mounted () {
    this.setupLeafletMap()
  },
  methods: {
    async onEnter () {
      await this.createUbicacion()
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
      var mymap = L.map('mapid').setView(this.center, 13)
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoibGF6bSIsImEiOiJjazBvNG1mbWcwNnd4M21vYnR2NGJpZHR1In0.lxUwxubMbmT4-vSzJRwJIQ'
      }).addTo(mymap)

      var marker
      self = this

      mymap.on('click', function (e) {
        const lat = e.latlng.lat
        const lng = e.latlng.lng
        /*
          para evitar tener multiples markers en el mapa
        */
        if (marker) {
          mymap.removeLayer(marker)
        }

        var GlufcoIcon = L.icon({
          iconUrl: '../img/home.png',
          iconSize: [60, 61], // size of the icon
          iconAnchor: [26, 60], // point of the icon which will correspond to marker's location
          popupAnchor: [3, -60] // point from which the popup should open relative to the iconAnchor
        })

        self.coordenadas = [lat, lng]

        marker = L.marker(self.coordenadas, { icon: GlufcoIcon }).addTo(mymap)
      })
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

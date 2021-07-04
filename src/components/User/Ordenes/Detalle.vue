<template>
  <div>
    <v-card>
      <v-toolbar
        style="background:linear-gradient(90deg, rgb(20, 27, 50), rgb(59, 70, 108) 48%, rgb(20, 27, 50));"
        dark
      >
        <strong>"{{ordenData.apodo}}"</strong>
      </v-toolbar>
      <v-card-text>
        <v-col cols="12">
          <h3>Dirección:</h3>
          <p>{{ordenData.direccion}}</p>
        </v-col>
        <v-col cols="12">
          <div id="ubicacionDetail"></div>
        </v-col>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn
          text
          @click="goToListar"
        >Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
export default {
  name: 'DetalleOrden',
  components: {
  },
  props: {
    visible: Boolean,
    ordenData: Object
  },
  data () {
    return {
      map: [],
      marker: []
    }
  },
  watch: {
    ordenData: function () {
      this.loadData()
    }
  },
  computed: {
    dialog () {
      return this.visible
    }
  },
  methods: {
    goToListar () {
      this.map.removeLayer(this.marker)
      this.$emit('goToListar')
    },
    async loadData () {
      try {
        // PENDIENTE
        await this.$axios.post('recorridos/consultar', {
          orden_id: this.ordenData.id
        })

        self = this
        setTimeout(function () {
          const coordenadas = self.ordenData.coordenadas.split(',')
          console.log('coordenadas')
          console.log(coordenadas)
          self.marker = null
          if (self.map.length <= 0) {
            self.setupLeafletMap(coordenadas)
          }
          self.changeMarker(coordenadas)
        }, 500)
      } catch (error) {

      }
    },
    setupLeafletMap (coordenadas) {
      this.map = L.map('ubicacionDetail').setView(coordenadas, 13)
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoibGF6bSIsImEiOiJjazBvNG1mbWcwNnd4M21vYnR2NGJpZHR1In0.lxUwxubMbmT4-vSzJRwJIQ'
      }).addTo(this.map)
    },
    changeMarker (coordenadas) {
      var GlufcoIcon = L.icon({
        iconUrl: '../img/GLUFCOIN.svg',
        iconSize: [60, 61], // size of the icon
        iconAnchor: [26, 60], // point of the icon which will correspond to marker's location
        popupAnchor: [3, -60] // point from which the popup should open relative to the iconAnchor
      })

      this.map.setView(coordenadas, 13)

      this.marker = L.marker(coordenadas, { icon: GlufcoIcon }).addTo(this.map)
    }
  }
}
</script>
<style>
#ubicacionDetail { height: 250px; }
</style>

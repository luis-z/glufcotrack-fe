<template>
  <div>
    <v-dialog
      transition="dialog-bottom-transition"
      max-width="800"
      v-model="dialog"
      @click:outside="closeDetail"
    >
      <template>
        <v-card>
          <v-toolbar
            color="primary"
            dark
          >Ubicación en el mapa</v-toolbar>
          <v-card-text>
            <v-col cols="12">
              <div id="ubicacionDetail"></div>
            </v-col>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              text
              @click="closeDetail"
            >Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>
<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
export default {
  name: 'DetalleUbicacion',
  components: {
  },
  props: {
    visible: Boolean,
    ubicacionData: Object
  },
  data() {
    return {
      map: [],
      marker: []
    };
  },
  watch: {
    ubicacionData: function () {
      self = this
      setTimeout(function(){ 
        let coordenadas = self.ubicacionData.coordenadas.split(',')
        console.log('coordenadas');
        console.log(coordenadas);
        self.marker = null
        if (self.map.length <= 0) {
          self.setupLeafletMap(coordenadas)
        }
        self.changeMarker(coordenadas)
      }, 500);
    },
  },
  computed: {
    dialog () {
      return this.visible
    }
  },
  methods: {
    closeDetail() {
      this.map.removeLayer(this.marker);
      this.$emit('closeDetail')
    },
    setupLeafletMap (coordenadas) {
      this.map = L.map('ubicacionDetail').setView(coordenadas, 13);
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoibGF6bSIsImEiOiJjazBvNG1mbWcwNnd4M21vYnR2NGJpZHR1In0.lxUwxubMbmT4-vSzJRwJIQ'
      }).addTo(this.map);

    },
    changeMarker(coordenadas) {

      var GlufcoIcon = L.icon({
        iconUrl: '../img/GLUFCOIN.svg',
        iconSize: [60, 61], // size of the icon
        iconAnchor: [26, 60], // point of the icon which will correspond to marker's location
        popupAnchor: [3, -60] // point from which the popup should open relative to the iconAnchor
      })

      this.map.setView(coordenadas, 13)

      this.marker = L.marker(coordenadas, { icon: GlufcoIcon }).addTo(this.map);
    }
  }
}
</script>
<style>
#ubicacionDetail { height: 450px; }
</style>

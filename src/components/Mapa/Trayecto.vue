<template>
  <div id="mapid"></div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

export default {
  name: 'Trayecto',
  components: {
  },
  data () {
    return {
      marker: [],
      destinyMarker: [],
      map: null,
      center: [10.496584, -66.845662]
    }
  },
  props: {
    // value: Boolean,
    destino: Array,
    posicionActual: Array
  },
  computed: {
    deliveryPosition () {
      return this.posicionActual
    },
    destiny () {
      return this.destino
    }
  },
  watch: {
    deliveryPosition: function () {
      this.placeMarker(this.deliveryPosition)
    },
    destiny: function () {
      this.placeDestiny(this.deliveryPosition)
    }
  },
  mounted () {
    this.setupLeafletMap()
  },
  methods: {
    async placeMarker (coordenadas)
    {
      if (this.marker) {
        this.map.removeLayer(this.marker)
      }

      var GlufcoIcon = L.icon({
        iconUrl: '../img/GLUFCOIN.svg',
        iconSize: [60, 61], // size of the icon
        iconAnchor: [26, 60], // point of the icon which will correspond to marker's location
        popupAnchor: [3, -60] // point from which the popup should open relative to the iconAnchor
      })

      this.marker = L.marker(coordenadas, { icon: GlufcoIcon }).addTo(this.map)
      this.map.setView(coordenadas, 16)
    },
    async placeDestiny () {
      var GlufcoIcon = L.icon({
        iconUrl: '../img/home.png',
        iconSize: [60, 61], // size of the icon
        iconAnchor: [26, 60], // point of the icon which will correspond to marker's location
        popupAnchor: [3, -60] // point from which the popup should open relative to the iconAnchor
      })
      this.destinyMarker = L.marker(this.destiny, { icon: GlufcoIcon }).addTo(this.map)
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
    }
  }
}
</script>
<style scoped>
.login-card {
  margin-top: 2rem;
}

/* #mapid { height: 450px; } */

.inner-form {
  background-color: rgba(211, 220, 236, 0.658);
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  #mapid { height: 300px!important; }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  #mapid { height: 300px!important; }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  #mapid { height: 400px!important; }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  #mapid { height: 450px!important; }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  #mapid { height: 450px!important; }
}

</style>

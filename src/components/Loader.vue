<template>
  <loading
    :active.sync="visible"
    :can-cancel="false"
    loader="spinner"
    :height=100
    :width=100
    :opacity=0.3
    background-color="white"
    color="blue"
  >
  </loading>
</template>
<script>
// Import component
import Loading from 'vue-loading-overlay'
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css'

export default {
  name: 'Loader',
  components: {
    Loading
  },
  props: {
    visible: Boolean
  }
}
</script>

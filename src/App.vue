<template>
  <div id="app">
    <Menu></Menu>
    <Map></Map>
  </div>
</template>

<script>
  import Menu from './components/Menu'
  import Map from './components/Map'
  import {mapGetters, mapActions} from 'vuex'
  export default {
    name: 'App',
    data() {
      return {
      }
    },
    computed: {
      ...mapGetters({
        capabilities: 'capabilities',
        layers: 'layers'
      })
    },
    methods: {
      ...mapActions(['getLayers'])
    },
    mounted() {
      this.getLayers()
    },
    components: {
      Menu,
      Map
    }
  }
</script>

<style lang="sass" scoped>
  #app
    height: 100vh
    display: flex
    flex-direction: row
</style>

<template>
  <div v-if="!loading" id="app">
    <Menu></Menu>
    <Map></Map>
  </div>
  <Loader v-else></Loader>
</template>

<script>
  import Loader from './components/Loader'
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
        layers: 'layer/list'
      }),
      loading: function () {
        return !this.layers.length
      }
    },
    methods: {
      ...mapActions('layer', ['getLayers'])
    },
    mounted() {
      this.getLayers()
    },
    components: {
      Loader,

      Menu,
      Map
    }
  }
</script>

<style lang="sass">
    body
        height: 100vh
        margin: 0
    #app
        height: 100%
        display: flex
        flex-direction: row
</style>

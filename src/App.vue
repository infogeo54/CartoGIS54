<template>
  <div v-if="!loading" id="app">
    <Menu></Menu>
    <Map></Map>
    <Form v-if="formVisible"></Form>
  </div>
  <Loader v-else></Loader>
</template>

<script>
  import Loader from './components/Loader'
  import Menu from './components/Menu'
  import Map from './components/Map'
  import Form from './components/Form'
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
        layers: 'layer/list',
        feature: 'feature/selected'
      }),
      loading: function () {
        return !this.layers.length
      },
      formVisible: function () {
        if (this.feature) {
          return !!this.feature.properties.geometry.coordinates
        }
        return false
      }
    },
    methods: {
      ...mapActions('layer', ['getLayers', 'getDescriptions']),
    },
    mounted() {
      this.getLayers()
      this.getDescriptions()
    },
    components: {
      Loader,
      Menu,
      Map,
      Form
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

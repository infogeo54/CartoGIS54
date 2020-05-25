<template>
  <Loader v-if="loading" />
  <div v-else id="app">
    <Menu />
    <Map />
    <Form v-if="formVisible" />
  </div>
</template>

<script>
import Loader from './components/Loader'
import Menu from './components/Menu'
import Map from './components/Map'
import Form from './components/Form'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapGetters({
      layers: 'layer/list',
      feature: 'feature/selected',
    }),
    loading: function () {
      return !this.layers.length
    },
    formVisible: function () {
      if (this.feature) return !!this.feature.representation
      return false
    }
  },
  methods: {
    ...mapActions('layer', ['getLayers']),
  },
  mounted() {
    this.getLayers()
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

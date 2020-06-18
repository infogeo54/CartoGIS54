<template>
  <div id="app" :is="layout">
    <Loader v-if="loading" />
    <main v-else>
      <Menu />
      <Map />
      <Form v-if="formVisible" />
    </main>
  </div>
</template>

<script>
import Loader from '@/components/Loader'
import Menu from '@/components/Menu'
import Map from '@/components/Map'
import Form from '@/components/Form'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'App',
  components: {
    Loader,
    Menu,
    Map,
    Form
  },
  computed: {
    ...mapGetters({
        layers: 'layer/list',
        feature: 'feature/selected',
    }),
    layout: function () {
      return 'default-layout'
    },
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
  }
}
</script>

<style lang="sass">
  main
    display: flex
</style>

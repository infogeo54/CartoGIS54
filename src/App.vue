<template>
  <div id="app" :is="layout">
    <Loader v-if="isLoading" />
    <main v-else>
      <Menu />
      <Map />
      <Form v-if="isFormVisible" />
    </main>
  </div>
</template>

<script>
import Loader from '@/components/Loader'
import Menu from '@/components/Menu'
import Map from '@/components/Map'
import Form from '@/components/Form'
import { mapGetters, mapActions } from 'vuex'

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
    layout () {
      return 'default-layout'
    },
    isLoading () {
      return !this.layers.length
    },
    isFormVisible () {
      if (this.feature) return !!this.feature.representation
      return false
    }
  },
  mounted () {
      this['layer/getLayers']()
  },
  methods: {
    ...mapActions([
        'layer/getLayers'
    ]),
  }
}
</script>

<style lang="sass">
  #app
    background-color: #2A353B
  main
    display: flex
</style>

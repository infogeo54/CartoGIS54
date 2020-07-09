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
import Loader from '@/components/UX/Loader'
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
    isEditing () {
        return !!this.feature
    },
    isFormVisible () {
      if (this.feature) return !!this.feature.representation
      return false
    }
  },
  created () {
      document.addEventListener('keyup', e => {
          if (this.isEditing && e.key === 'Escape') {
              this['feature/cancel']()
              this.reset()
          }
      })
  },
  mounted () {
      this['layer/getLayers']()
  },
  methods: {
    ...mapActions([
        'reset',
        'layer/getLayers',
        'feature/cancel'
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

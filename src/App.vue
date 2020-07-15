<template>
  <div id="app" :is="layout">
    <Header
      class="header"
      :buttons="buttons"
      @button-clicked="toggleModal"
    />
    <Loader v-if="isLoading" />
    <main v-else>
      <Menu />
      <Map />
      <Form v-if="isFormVisible" />
    </main>
    <Modal
      v-for="modal in modals"
      :key="modal.name"
      :modal="modal"
    />
  </div>
</template>

<script>
import Loader from '@/components/UX/Loader'
import Modal from '@/components/UX/Modal'
import Header from '@/components/Header'
import Menu from '@/components/Menu'
import Map from '@/components/Map'
import Form from '@/components/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    Loader,
    Header,
    Menu,
    Map,
    Form,
    Modal
  },
  data () {
    return {
      modals: [
        { name: 'help', title: 'Help', icon: 'fas fa-question-circle', visible: false }
      ]
    }
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
    },
    buttons () {
      return this.modals.map(m => {
        const { name, icon } = m
        return { name, icon }
      })
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
    toggleModal (button) {
      const modal = this.modals.find(m => m.name === button.name)
      modal.visible = true
    }
  }
}
</script>

<style lang="sass">
  #app
    height: 100%
    overflow-y: hidden
    background-color: #2A353B
    font-family: Arial, 'sans-serif'
  .header
    height: 10%
    min-height: 80px
  main
    height: 90%
    display: flex
</style>

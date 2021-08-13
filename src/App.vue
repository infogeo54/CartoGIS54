<template>
  <div id="app" :is="layout" :style="cssVarHasHeader"> 
    <Header v-if="hasHeader"
      class="header"
    />
    <router-view />
  </div>
</template>

<script>
import Loader from '@/components/UX/Loader'
import Modal from '@/components/UX/Modal'
import Header from '@/components/Header'
import { mapGetters, mapActions } from 'vuex'
import { header } from '@/app.config.json'

export default {
  name: 'App',
  components: {
    Loader,
    Header,
    Modal,
  },
  data () {
    return {
      modals: header.modals,
      hasHeader: header.hasHeader,
    }
  },
  computed: {
    ...mapGetters({
      feature: 'feature/selected',
    }),
    layout () {
      return 'default-layout'
    },
    isEditing () {
      return !!this.feature
    },
    // Adjust the size  of some elements if there si a header or not
    cssVarHasHeader () {
      return {
        '--header-size': (this.hasHeader) ? '10vh' : '0vh'
      }
    },
    buttons () {
      return this.modals.map(m => {
        const { name, icon } = m
        return { name, icon }
      })
    }
  },
  methods: {
    ...mapActions([
        'reset',
        'feature/cancel',
    ]),
    toggleModal (button) {
      const modal = this.modals.find(m => m.name === button.name)
      modal.visible = true
    },
  },
  created () {
    // Possibility to cancel the selection with the esc key
    document.addEventListener('keyup', e => {
        if (this.isEditing && e.key === 'Escape') {
            this['feature/cancel']()
            this.reset()
        }
    })
  },
}
</script>

<style>
@import "./assets/style/custom.css";
  #app {
    display: flex;
    flex-direction: column;
    background-color: white;
    color: #0e0e0e;
    font-family: Arial, 'sans-serif';
    box-sizing: border-box;
    height: 100vh;
  }

  .header { height: var(--header-size) }
</style>

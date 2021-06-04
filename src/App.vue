<template>
  <div id="app" :is="layout">
    <template v-if="img!=null">
      <img :src="img">
    </template>
    <Header
      class="header"
    />
    <Loader v-if="isLoading" />
    <main v-else>
      <Menu />
      <MapContainer 
        :buttons="buttons"
        @button-clicked="toggleModal"
      />
      <Form v-if="formVisible" />
    </main>
    <!-- <Modal
      v-for="modal in modals"
      :key="modal.name"
      :modal="modal"
    /> -->
  </div>
</template>

<script>
import Loader from '@/components/UX/Loader'
import Modal from '@/components/UX/Modal'
import Header from '@/components/Header'
import Menu from '@/components/Menu'
import MapContainer from '@/components/Map'
import Form from '@/components/Form'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { header } from '@/app.config.json'

export default {
  name: 'App',
  components: {
    Loader,
    Header,
    Menu,
    MapContainer,
    Form,
    Modal,
  },
  data () {

    return {
      modals: header.modals,
      img: null,
    }
  },
  computed: {
    ...mapGetters({
      layers: 'layer/list',
      feature: 'feature/selected',
      formVisible: 'form/formVisible',
      map: 'map',
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
      if (this.feature && this.formVisible) return !!this.feature.representation
      return false
    },
    buttons () {
      return this.modals.map(m => {
        const { name, icon } = m
        return { name, icon }
      })
    }
  },
  mounted () {
    this['layer/getLayers']()
  },
  methods: {

    ...mapMutations(['form/setVisibility']),
    ...mapActions([
        'reset',
        'layer/getLayers',
        'feature/cancel',
    ]),
    toggleModal (button) {
      const modal = this.modals.find(m => m.name === button.name)
      modal.visible = true
    },
  },
  created () {
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
html{
  height: auto !important
}
body{
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
#app {
  display: flex;
  flex-direction: column;
  background-color: white;
  color: #0e0e0e;
  font-family: Arial, 'sans-serif';
  box-sizing: border-box;
}
.header {
  height: 10vh;
  min-height: 80px;
  box-sizing: border-box;
}
main {
  height: 90vh;
  max-height: calc(100vh - 80px);
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
}

@media screen and (min-width: 768px){
  main{
    display: flex;
    flex-direction: row;
    max-height: calc(100vh - 80px);
    height: 90vh;

  } 
}

</style>

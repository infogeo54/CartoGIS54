<template>
  <div id="app" :is="layout" :style="cssVarHasHeader"> 
    <template v-if="img!=null">
      <img :src="img">
    </template>
    <Header v-if="hasHeader"
      class="header"
    />
    <Loader v-if="isLoading" />
    <main v-else>
      <Menu  class="menu" />
      <MapContainer
       class="mapContainer" 
        :buttons="buttons"
        @button-clicked="toggleModal"
      />
      <Form class="form" v-if="formVisible" />
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
import { mapGetters, mapActions } from 'vuex'
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
      hasHeader: header.hasHeader,
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
        'pingApi',
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
  async mounted () {
    this['layer/getLayers']()
    await this['pingApi']()
    // setInterval(async () => {
    //   await this['pingApi']()
    // }, 6000);
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

  main {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    box-sizing: border-box;
    row-gap: 0;
    height: 100%;
  }

  main>.mapContainer {
    grid-row: 2/3;
    grid-column: 1;
  } 

  main>.menu {
    grid-row: 1/2;
    grid-column: 1/2;
  }

  @media screen and (min-width: 768px){
    main {
      height: calc(100vh - var(--header-size));
      grid-template-rows: 1fr;
      grid-template-columns: auto 1fr auto;
    }

    main>.menu {
      height: calc(100vh - var(--header-size));
      grid-column: 1/2;
      grid-row: 1;
    }

    main>.mapContainer {
      grid-column: 2/3;
      grid-row: 1;
    }

    main>.form {
      height: calc(100vh - var(--header-size));
      grid-column: 3/4;
      grid-row: 1;
    } 
  }

</style>

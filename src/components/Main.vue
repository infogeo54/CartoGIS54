<template>
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
</template>
<script>
import Loader from '@/components/UX/Loader'
import Menu from '@/components/Menu'
import MapContainer from '@/components/Map'
import Form from '@/components/Form'
import { mapGetters, mapActions } from 'vuex'
import { header } from '@/app.config.json'

export default {
  name: 'Main',
  components: {
    Loader,
    Menu,
    MapContainer,
    Form,
  },
  data () {
    return {
      modals: header.modals,
    }
  },
  computed: {
    ...mapGetters({
      layers: 'layer/list',
      feature: 'feature/selected',
      formVisible: 'form/formVisible',
    }),
    layout () {
      return 'default-layout'
    },
    isLoading () {
      return !this.layers.length
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
  methods: {

    ...mapActions([
        'pingApi',
        'layer/getLayers',
    ]),
    toggleModal (button) {
      const modal = this.modals.find(m => m.name === button.name)
      modal.visible = true
    },
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
      max-height: calc(100vh - var(--header-size));
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

<template>
  <div id="menu">
    <Layers
      :layers="layers"
      :selected-layer="selectedLayer"
      @layerItemClicked="layerItemClicked"
    />
    <button v-if="selectedFeature" @click="cancel" id="btn-cancel">Annuler</button>
    <Legend
      v-if="legendVisibility"
      :layer="selectedLayer"
      @legendItemClicked="legendItemClicked"
      @legendCloseClicked="legendCloseClicked"
    />
  </div>
</template>

<script>
import Layers from './Layers'
import Legend from './Legend'
import Feature from '@/models/Feature'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
    name: "Menu",
    components: { Layers, Legend },
    computed: {
        ...mapGetters({
            layers: 'layer/list',
            selectedLayer: 'layer/selected',
            selectedFeature: 'feature/selected',
            map: 'map',
        }),
        legendVisibility () {
            return this.selectedLayer && !this.selectedFeature
        }
    },
    methods: {
        ...mapMutations([
            'layer/setSelected',
            'feature/setSelected',
            'form/setVisibility',
            'feature/toggleEdit',
            'feature/setEditable',
        ]),
        ...mapActions([
            'feature/cancel'
        ]),
        layerItemClicked (layerName) {
            const layer = this.layers.find(l => l.properties.name === layerName)
            this['layer/setSelected'](layer)
        },
        legendItemClicked (featureType) {
            const options = {
                properties: { type: featureType },
                parent: this.selectedLayer
            }
            this['feature/setSelected'](new Feature(options))
        },
        legendCloseClicked () {
            this['layer/setSelected'](null)
        },
        cancel () {
            this['feature/cancel']()
            this['feature/setSelected'](null)
            this['form/setVisibility'](false)
            this['feature/setEditable'](false)
            this['feature/toggleEdit'](this.map)

            if (this.selectedLayer) {
                const layer = this.layers.find(l => l.properties.name === this.selectedLayer.properties.name)
                this.layerItemClicked(this.selectedLayer.properties.name)
                this['layer/setSelected'](layer)
            }
        }
    },
}
</script>

<style lang="sass" scoped>
#menu
    position: relative
    grid-row: 1/2
    grid-column: 1/2
    z-index: 500
    text-align: center
    background-color: #fafafa

    & > #btn-cancel
        // background-color: #EE2525
        background-color: #f4f4f4
        color: #0e0e0e
        position: absolute
        bottom: -4.5rem
        right: .5rem
   
    @media screen and (min-width: 768px)
        &
            display: flex
            padding-top: 4rem

            & > #btn-cancel
                top: .5rem
                left: calc( 100% + 6rem )
                z-index: 1500

</style>

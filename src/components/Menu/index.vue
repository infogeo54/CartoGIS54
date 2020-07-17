<template>
  <div id="menu">
    <Layers
      :layers="layers"
      :selected-layer="selectedLayer"
      @layerItemClicked="layerItemClicked"
    />
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
import { mapGetters, mapMutations } from 'vuex'

export default {
    name: "Menu",
    components: { Layers, Legend },
    computed: {
        ...mapGetters({
            layers: 'layer/list',
            selectedLayer: 'layer/selected',
            selectedFeature: 'feature/selected'
        }),
        legendVisibility () {
            return this.selectedLayer && this.selectedLayer.shape === 'Point' && !this.selectedFeature
        }
    },
    methods: {
        ...mapMutations([
            'layer/setSelected',
            'feature/setSelected'
        ]),
        layerItemClicked (layerName) {
            const layer = this.layers.find(l => l.properties.name === layerName)
            this['layer/setSelected'](layer)
            if (layer.shape === 'Polygon') {
                const options = { parent: layer }
                this['feature/setSelected'](new Feature(options))
            }
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
        }
    },
}
</script>

<style lang="sass" scoped>
#menu
  text-align: center
  display: flex
  background-color: #2A353B
  border-right: solid 1px #2A353B
  & > *
    min-width: 200px

</style>

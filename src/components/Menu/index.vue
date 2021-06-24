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
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { bus } from '@/main.js'


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
        
    },
    mounted() {
        
        bus.$on('layerItemClicked', () => { this.layerItemClicked(this.selectedLayer.properties.name) });

    }
}
</script>

<style lang="sass" scoped>
#menu
    position: relative
    z-index: 500
    text-align: center
    background-color: #fafafa
  
    @media screen and (min-width: 768px)
        &
            display: flex
            padding-top: 4rem

</style>

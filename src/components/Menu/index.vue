<template>
  <div id="menu">
    <div class="step-1-header">
        <h2>1</h2>
        <h3>Je choisis</h3>
    </div>
    <div>
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
    
    .step-1-header
        h2
            margin: .5rem auto
            font-size: 2.7rem
            font-weight: bold
  
    @media screen and (min-width: 768px)
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5), 0 0 0 rgba(0, 0, 0, 0.1)
        
        & 
            padding-top: 4rem
        & > div:last-child
            display: flex

</style>

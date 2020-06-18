<template>
    <div id="menu">
        <Layers :layers="layers"
                @layerItemClicked="layerItemClicked"
        />
        <Legend v-if="legendVisibility"
                :layer="layer"
                @legendItemClicked="legendItemClicked"
        />
    </div>
</template>

<script>
import Layers from './Layers'
import Legend from './Legend'
import Feature from '@/models/Feature'
import {mapGetters, mapMutations} from 'vuex'

export default {
    name: "Menu",
    components: {
        Layers,
        Legend
    },
    computed: {
        ...mapGetters({
            layers: 'layer/list',
            layer: 'layer/selected',
            feature: 'feature/selected'
        }),
        legendVisibility: function () {
            return this.layer && this.layer.shape === 'Point' && !this.feature
        }
    },
    methods: {
        ...mapMutations([
            'layer/setSelected',
            'feature/setSelected'
        ]),
        layerItemClicked: function (name) {
            const layer = this.layers.find(l => l.properties.name === name)
            this['layer/setSelected'](layer)
            if (layer.shape === 'Polygon') {
                const options = { parent: layer }
                this['feature/setSelected'](new Feature(options))
            }
        },
        legendItemClicked: function (featureType) {
            const options = {
                properties: { type: featureType },
                parent: this.layer
            }
            this['feature/setSelected'](new Feature(options))
        }
    },
}
</script>

<style lang="sass" scoped>
  #menu
    text-align: center
    display: flex
    background-color: #D3D3D3
    border-right: solid 1px black
  #menu > *
    min-width: 200px

</style>

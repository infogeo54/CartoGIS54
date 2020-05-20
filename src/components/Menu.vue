<template>
    <div id="menu" :class="selectedLayer ? 'open' : ''">
        <Layers :layers="layers"
                @layerItemClicked="layerItemClicked">
        </Layers>
        <Legend v-if="selectedLayer"
                :layer="selectedLayer"
                @legendItemClicked="legendItemClicked">
        </Legend>
    </div>
</template>

<script>
    import Layers from './MenuComponents/Layers'
    import Legend from './MenuComponents/Legend'
    import {mapGetters, mapMutations} from 'vuex'
    import Feature from '../models/Feature'

    export default {
        name: "Menu",
        computed: {
            ...mapGetters({
                layers: 'layer/list',
                selectedLayer: 'layer/selected'
            })
        },
        methods: {
            ...mapMutations([
                'layer/setSelected',
                'feature/setSelected'
            ]),
            layerItemClicked: function (name) {
                const layer = this.layers.find(l => l.properties.name === name)
                this['layer/setSelected'](layer)
            },
            legendItemClicked: function (featureType) {
                const options = {
                    properties: { type: featureType },
                    parent: this.selectedLayer
                }
                this['feature/setSelected'](new Feature(options))
            }
        },
        components: {
            Layers,
            Legend
        },
    }
</script>

<style lang="sass" scoped>
    #menu
        text-align: center
        display: flex
        flex-direction: row
        ul
            padding: 0
            li
                list-style: none
                &:hover
                    text-decoration: underline
                    cursor: pointer

</style>

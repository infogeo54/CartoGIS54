<template>
  <div id="menu">
    <Layers :layers="layers"
            @layerItemClicked="layerItemClicked"
    />
    <Legend v-if="legendVisibility"
            :layer="layer"
            @legendItemClicked="legendItemClicked"
            @legendCloseClicked="legendCloseClicked"
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
            resetLayerItems: function () {
                document.querySelectorAll('p.layer-item').forEach(element => {
                    element.setAttribute('class', 'layer-item')
                })
            },
            activeLayerItem: function (item) {
                const isActive = item.getAttribute('class').includes('active')
                this.resetLayerItems()
                if (!isActive) item.setAttribute('class', 'layer-item active')

            },
            layerItemClicked: function ({ item, name }) {
                this.activeLayerItem(item)
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
            },
            legendCloseClicked: function () {
                this.resetLayerItems()
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

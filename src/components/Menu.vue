<template>
    <div id="menu" :class="selectedLayer ? 'open' : ''">
        <Layers :layers="layers" @layerItemClicked="layerItemClicked"></Layers>
        <Legend v-if="selectedLayer" :layer="selectedLayer"></Legend>
    </div>
</template>

<script>
    import Layers from './MenuComponents/Layers'
    import Legend from './MenuComponents/Legend'
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        name: "Menu",
        computed: {
            ...mapGetters({
                layers: 'layer/list',
                selectedLayer: 'layer/selected'
            })
        },
        methods: {
            ...mapMutations('layer', ['setSelected']),
            layerItemClicked: function (name) {
                const selectedLayer = this.layers.find(l => l.properties.name === name)
                this.setSelected(selectedLayer)
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

<template>
    <div id="layers">
        <h3>Couches</h3>
        <LayersItem v-for="(layer, index) in layers"
                    :key="index"
                    :layer="layer"
                    @itemClicked="itemClicked">
        </LayersItem>
    </div>
</template>

<script>
    import LayersItem from './LayersItem'

    export default {
        name: "Categories",
        props: ['layers'],
        methods: {
            itemClicked: function (layerName) {
                this.$emit('layerItemClicked', layerName)
            }
        },
        components: {
            LayersItem
        }
    }
</script>

<style scoped>

</style>
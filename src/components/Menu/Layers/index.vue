<template>
  <div id="layers">
    <h3>Couches</h3>
    <Item v-for="(layer, index) in layers"
          :key="index"
          :layer="layer"
          @itemClicked="itemClicked"
    />
  </div>
</template>

<script>
    import Item from './Item'

    export default {
        name: "Categories",
        components: {
            Item
        },
        props: {
            layers: {
                type: Array,
                default: () => []
            }
        },
        methods: {
            itemClicked: function (args) {
                this.$emit('layerItemClicked', args)
            }
        }
    }
</script>

<style lang="sass" scoped>
  #layers
    padding-top: 60px
    color: #EFEFEF
</style>
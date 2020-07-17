<template>
  <div id="layers">
    <h3>Layers</h3>
    <Item
      v-for="(layer, index) in layers"
      :key="index"
      :layer="layer"
      :class="layer === selectedLayer ? 'active' : ''"
      @itemClicked="itemClicked"
    />
  </div>
</template>

<script>
import Item from './Item'

export default {
    components: { Item },
    props: ['layers', 'selectedLayer'],
    methods: {
        itemClicked (layerName) {
            this.$emit('layerItemClicked', layerName)
        }
    }
}
</script>

<style lang="sass" scoped>
  #layers
    color: #EFEFEF
</style>
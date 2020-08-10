<template>
  <div id="legend">
    <div class="legend-header">
      <div @click="close">
        <i class="fas fa-times-circle"></i>
      </div>
      <h3>{{ title }}</h3>
    </div>
    <div class="legend-body">
      <Item
        v-for="(style, index) in styles"
        :key="index"
        :feature-style="style"
        @itemClicked="itemClicked"
      />
    </div>
  </div>
</template>

<script>
import Item from './Item'

export default {
    name: "Legend",
    components: { Item },
    props: {
        layer: {
            type: Object,
            default: null
        }
    },
    computed: {
        title () {
            return this.layer.properties.title
        },
        styles () {
            return this.layer.styles
        }
    },
    methods: {
        itemClicked (featureType) {
            this.$emit('legendItemClicked', featureType)
        },
        close () {
            this.$emit('legendCloseClicked')
        }
    }
}
</script>

<style lang="sass" scoped>
#legend
  color: #EFEFEF
  border-left: solid 1px #EFEFEF
  .legend-header
    height: 10%
    h3
      margin-top: 0
    div
      height: 19px
      width: fit-content
      margin: 5px 5px auto auto
      color: #EFEFEF
      &:hover
        color: #565656
        cursor: pointer
  .legend-body
    height: 90%
    overflow-y: scroll

</style>

<template>
  <div id="legend">
    <input type="button" value="X" @click="close">
    <h3>{{ title }}</h3>
    <Item v-for="(style, index) in styles"
          :key="index"
          :feature-style="style"
          @itemClicked="itemClicked"
    />
  </div>
</template>

<script>
    import Item from './Item'

    export default {
        name: "Legend",
        components: {
            Item
        },
        props: {
            layer: {
                type: Object,
                default: null
            }
        },
        computed: {
            title: function () {
                return this.layer.properties.title
            },
            styles: function () {
                return this.layer.styles
            }
        },
        methods: {
            itemClicked: function (featureType) {
                this.$emit('legendItemClicked', featureType)
            },
            close: function () {
                this.$emit('legendCloseClicked')
            }
        }
    }
</script>

<style lang="sass" scoped>
  #legend
    color: #EFEFEF
    border-left: solid 1px #EFEFEF
    overflow-y: scroll
    input
      color: #EFEFEF
      background-color: #00000000
      font-weight: bold
      display: flex
      margin: 5px 5px 0 auto
      border: none
      &:hover
        cursor: pointer
</style>

<template>
  <p class="layer-item" @click="clicked">{{ title }}</p>
</template>

<script>
export default {
    props: ['layer'],
    computed: {
        name () {
            return this.layer.properties.name
        },
        title () {
            return this.layer.properties.title
        }
    },
    methods: {
        clicked () {
            this.$emit('itemClicked', this.name)
        }
    }
}
</script>

<style lang="sass" scoped>
  .layer-item
    width: fit-content
    margin: 10px auto
    &:hover
      text-decoration: underline
      cursor: pointer
    &.active
      text-decoration: underline
</style>
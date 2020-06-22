<template>
  <p class="layer-item" @click="clicked">{{ title }}</p>
</template>

<script>
    export default {
        name: "CategoriesItem",
        props: ['layer'],
        computed: {
            name: function () {
                return this.layer.properties.name
            },
            title: function () {
                return this.layer.properties.title
            }
        },
        methods: {
            clicked: function (e) {
                this.$emit('itemClicked', { item: e.target, name: this.name })
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
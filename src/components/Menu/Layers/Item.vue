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
                const clickedItem = e.target
                const isActive = clickedItem.getAttribute('class').includes('active')
                document.querySelectorAll('p.layer-item').forEach(item => {
                    item.setAttribute('class', 'layer-item')
                })
                if (!isActive) clickedItem.setAttribute('class', 'layer-item active')
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
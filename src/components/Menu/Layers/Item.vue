<template>
<div @click="clicked" class="slide">
  <div>{{ title }}</div>
</div>
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

  .slide
    height: 3.6rem
    color: black
    width: 100%
    background-color: #efefef
    margin: .5rem
    margin-bottom: 1rem
    display: flex
    align-items: center
    justify-content: center
    &>div  
      font-size: 1.2rem
    &:hover
      cursor: pointer
      &>div 
      text-decoration: underline
    &.active
      text-decoration: underline
</style>
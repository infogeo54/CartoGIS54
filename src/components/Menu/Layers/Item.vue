<template>
<div @click="clicked" class="slide" :style="cursor">
  <div >{{ title }}</div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'


export default {
    props: ['layer'],
    computed: {
        name () { return this.layer.properties.name },
        title () { return this.layer.properties.title },
        ...mapGetters({
          isFormVisible: "form/formVisible",
          isDrawing: "isDrawing",
      }),
      cursor(){ return (this.isFormVisible || this.isDrawing)? 'cursor: not-allowed': 'cursor: pointer' }
    },
    methods: {
        clicked () { this.$emit('itemClicked', this.name) }
    }
}
</script>

<style lang="sass" scoped>

  .slide
    height: 3.6rem
    color: black
    width: 90%
    background-color: var(--color-grey)
    margin: .5rem 5% 1rem 5%
    // margin-bottom: 1rem
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
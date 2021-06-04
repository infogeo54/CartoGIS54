<template>
  <div class="header">
    <img v-if="brand" :src="brand">
    <h1>{{ title }}</h1>
    <div class="button">
        <i :class="'far fa-user-circle'"></i>
    </div>
    
  </div>
</template>

<script>
import { header as config } from '@/app.config.json';

export default {
    name: 'Header',
    data () {

      return {
        brand: config.brand,
        title: config.title,
      }
    },

}
</script>

<style lang="sass" scoped>
.header
  display: flex
  justify-content: space-between
  align-items: center
  background-color: #0e0e0e
  border-bottom: solid 1px #2A353B
  z-index: 2000
  a
    height: 100%
    max-width: 150px
  img
    min-height: 100px
    max-height: 10.5rem
    align-self: flex-start

  h1
    color: white
    font-size: 1.7rem
    margin-left: 1rem
      
.button
  display: flex
  svg
    max-height: 3rem
    min-height: 1.5rem
    height: auto
    width: auto !important
    margin: 1rem
    color: white
    &:hover
      cursor: pointer
      color: #e0e0e0

@media screen and (min-width: 768px)
  .header
    h1
      font-size: 2.3rem
      text-align: center

  
</style>
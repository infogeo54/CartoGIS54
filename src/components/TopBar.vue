<template>
  <div class="top-bar">
    <img src="@/assets/design/meurthe-et-moselle.png" alt="Meurthe et Moselle">
    <i class="fas fa-user-circle"></i>
  </div>
</template>

<script>
    export default {
        name: 'Header'
    }
</script>

<style lang="sass" scoped>
  .top-bar
    display: flex
    justify-content: space-between
    align-items: center
    background-color: grey
    border-bottom: solid 1px black
  img
    height: 190%
    max-height: 204px
    z-index: 800
    transform: translate(-5%, 23%)
  svg
    top: 50%
    height: 32px
    width: auto !important
    padding: 15px
    color: lightgrey
</style>
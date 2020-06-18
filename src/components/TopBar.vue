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
    background-color: lightgrey
    display: flex
    justify-content: space-between
    align-items: center
  img
    height: 100%
    max-height: 204px
  svg
    height: 32px
    width: auto !important
    padding: 15px
</style>
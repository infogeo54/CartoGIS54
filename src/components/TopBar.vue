<template>
  <div class="top-bar">
    <a href="http://meurthe-et-moselle.fr">
      <img src="@/assets/design/meurthe-et-moselle_blue.png" alt="Meurthe et Moselle">
    </a>
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
    background-color: #0BB4F5
    border-bottom: solid 1px #2A353B
    a, img
      height: 100%
    a
      max-width: 150px
    svg
      top: 50%
      height: 32px
      width: auto !important
      margin: 15px
      color: #2A353B
      &:hover
        cursor: pointer
        color: #565656
</style>
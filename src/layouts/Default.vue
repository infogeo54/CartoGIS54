<template>
  <div class="default-layout">
    <TopBar />
    <slot />
  </div>
</template>

<script>
    import TopBar from '@/components/TopBar'

    export default {
        name: 'default-layout',
        components: {
            TopBar
        }
    }
</script>

<style lang="sass">
  html
    height: 100vh
    body
      margin: 0
      height: 100%
    .default-layout
      height: 100%
      display: grid
      grid-template-rows: repeat(10, 10%)
      font-family: Arial, 'sans-serif'
    .top-bar
      grid-row: 1 / 2
    main
      grid-row: 2 / 11
</style>
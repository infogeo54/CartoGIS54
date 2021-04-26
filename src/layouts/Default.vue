<template>
  <div class="default-layout">
    <slot />
  </div>
</template>

<script>
export default {
    name: 'default-layout',
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
</style>
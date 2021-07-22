<template>
  <button @click="clicked">
    <i :class="button.icon"></i>
    Aide
  </button>
</template>

<script>
export default {
  props: {
      button: { type: Object, default: () => {} }
  },
  methods: {
      clicked () { this.$emit('clicked', this.button) }
  }
}
</script>

<style lang="sass" scoped>
svg
  color: white
  width: 40% !important
  height: auto
  margin: .5rem auto


  &:hover
   cursor: pointer
</style>
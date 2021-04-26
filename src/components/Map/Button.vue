<template>
  <div @click="clicked">
    <i :class="button.icon"></i>
  </div>
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
  height: 2.5rem
  width: 2.5rem !important
  color: #0e0e0e


  &:hover
   cursor: pointer
   color: #333333
</style>
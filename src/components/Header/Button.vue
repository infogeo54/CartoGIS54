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
  top: 50%
  height: 32px
  width: auto !important
  margin: 15px
  color: #2A353B
  &:hover
   cursor: pointer
   color: #565656
</style>
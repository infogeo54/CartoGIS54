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
  max-height: 3rem
  min-height: 1.5rem
  height: auto
  width: auto !important
  margin: 1rem
  color: #efefef
  &:hover
   cursor: pointer
   color: #ffffff
</style>
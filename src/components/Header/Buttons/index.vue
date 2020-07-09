<template>
  <ul>
    <li v-for="button in buttons" :key="button.name">
      <Button
          :button="button"
          @clicked="buttonClicked"
      />
    </li>
  </ul>
</template>

<script>
import Button from './Button'

export default {
  components: { Button },
  props: {
    buttons: { type: Array, default: () => [] }
  },
  methods: {
      buttonClicked (button) {
          this.$emit('buttonClicked', button)
      }
  }
}
</script>

<style lang="sass" scoped>
ul
  padding: 0
  display: flex
  li
    list-style: none
</style>
<template>
  <div class="header">
    <img v-if="brand" :src="brand">
    <div class="buttons">
      <Button
        v-for="button in buttons"
        :key="button.name"
        :button="button"
        @clicked="buttonClicked"
      />
    </div>
  </div>
</template>

<script>
import { header as config } from '@/app.config.json'
import Button from './Button'

export default {
    name: 'Header',
    components: { Button },
    props: {
      buttons: { type: Array, default: () => [] }
    },
    data () {
      return {
        brand: null
      }
    },
    methods: {
      buttonClicked (button) {
        this.$emit('button-clicked', button)
      }
    },
    mounted () {
      const brand = require(`${config.header}`)
      if (brand) {
        this.brand = brand
      }
    }
}
</script>

<style lang="sass" scoped>
.header
  display: flex
  justify-content: space-between
  align-items: center
  background-color: #0BB4F5
  border-bottom: solid 1px #2A353B
  a, img
    height: 100%
  a
    max-width: 150px

.buttons
  display: flex
</style>
<template>
  <div class="header">
    <a href="http://meurthe-et-moselle.fr">
      <img src="@/assets/design/meurthe-et-moselle_blue.png" alt="Meurthe et Moselle">
    </a>
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
import Button from './Button'

export default {
    name: 'Header',
    components: { Button },
    props: {
      buttons: { type: Array, default: () => [] }
    },
    methods: {
      buttonClicked (button) {
        this.$emit('button-clicked', button)
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
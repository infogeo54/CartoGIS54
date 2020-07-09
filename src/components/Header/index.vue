<template>
  <div class="header">
    <a href="http://meurthe-et-moselle.fr">
      <img src="@/assets/design/meurthe-et-moselle_blue.png" alt="Meurthe et Moselle">
    </a>
    <Buttons :buttons="buttons" />
  </div>
</template>

<script>
import Buttons from './Buttons'

export default {
    name: 'Header',
    components: { Buttons },
    data () {
        return {
            buttons: [
                {
                    name: 'help',
                    icon: 'fas fa-question-circle'
                },
                {
                    name: 'user',
                    icon: 'fas fa-user-circle'
                }
            ]
        }
    },
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
</style>